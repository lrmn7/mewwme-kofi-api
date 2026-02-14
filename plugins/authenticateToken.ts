import fp from 'fastify-plugin';
import { FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest } from 'fastify';
import { verifyToken } from '../util/verifyToken.js';

interface TokenQuery {
  token: string;
}

declare module 'fastify' {
  interface FastifyInstance {
    authenticateToken: (
      request: FastifyRequest<{ Querystring: TokenQuery }>,
      reply: FastifyReply,
      done: (err?: Error) => void
    ) => void
  }
}

export default fp(async function (fastify: FastifyInstance, opts: FastifyPluginOptions) {
  if (fastify.hasDecorator('authenticateToken')) return
  fastify.decorate(
    'authenticateToken',
    (
      request: FastifyRequest<{ Querystring: TokenQuery }>,
      reply: FastifyReply,
      done
    ) => {
      const { token } = request.query
      const expectedToken = process.env.API_TOKEN || ''
      if (!token || !verifyToken(token, expectedToken)) {
        throw fastify.httpErrors.forbidden('Invalid or missing token')
      }
      done()
    }
  )
})
