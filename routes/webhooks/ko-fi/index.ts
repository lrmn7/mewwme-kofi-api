import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { KoFiWebhookPayload, koFiWebhookPayloadSchema } from '../../../types.js'
import { Type } from '@sinclair/typebox'
import { TypeCompiler } from '@sinclair/typebox/compiler'
import { verifyToken } from '../../../util/verifyToken.js'

const WEBHOOK_OK = 200
const WEBHOOK_NO_RETRY = WEBHOOK_OK
const KO_FI_EXAMPLE_TRANSACTION_ID = "00000000-1111-2222-3333-444444444444"

const koFiWebhookBodySchema = Type.Object({
  data: Type.String()
})
const validateKoFiWebhookBody = TypeCompiler.Compile(koFiWebhookBodySchema)

export default async function (fastify: FastifyInstance) {
  fastify.post('/', {
    preValidation: (request, reply, done) => {
      const body = request.body as unknown
      if (!validateKoFiWebhookBody.Check(body)) {
        throw fastify.httpErrors.badRequest(
          `Failed to validate webhook body: ${JSON.stringify([
            ...validateKoFiWebhookBody.Errors(body)
          ])}`)
      }
      try {
        request.body.data = JSON.parse(body.data)
      } catch (err) {
        throw fastify.httpErrors.badRequest(`Failed to parse webhook JSON data: ${err}`)
      }
      done();
    },
    schema: {
      body: Type.Object({
        data: koFiWebhookPayloadSchema
      })
    },
    handler: async (
      request: FastifyRequest<{ Body: { data: KoFiWebhookPayload } }>,
      reply: FastifyReply
    ) => {
      const data = request.body.data
      const verificationToken = data.verification_token
      const expectedToken = process.env.KO_FI_VERIFICATION_TOKEN || ''
      if (!verifyToken(verificationToken, expectedToken)) {
        fastify.log.error(`Received an invalid verification token: "${verificationToken}"`)
        return reply.code(WEBHOOK_NO_RETRY).send()
      }
      if (process.env.TEST_WEBHOOKS === '1') {
        fastify.log.warn(`Accepting test webhook with message ID ${data.message_id}`)
      } else if (data.kofi_transaction_id === KO_FI_EXAMPLE_TRANSACTION_ID) {
        fastify.log.info({ data }, "Ignored test payload from Ko-Fi dashboard")
        return reply.code(WEBHOOK_NO_RETRY).send()
      }
      if (fastify.db.webhookPayloads.findOne({ message_id: data.message_id })) {
        fastify.log.warn(`Ignored message with ID ${data.message_id} because it already exists`)
        return reply.code(WEBHOOK_NO_RETRY).send()
      }
      try {
        fastify.db.webhookPayloads.insert(data)
        fastify.db.loki.save()
      }
      catch (err) {
        throw fastify.httpErrors.internalServerError(`Failed to store webhook payload: ${err}`)
      }
      fastify.log.info(`Stored webook with message ID ${data.message_id}`)
      return reply.code(WEBHOOK_OK).send()
    }
  })
}
