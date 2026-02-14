import fp from 'fastify-plugin'
import { FastifyInstance } from 'fastify'
import Loki from 'lokijs'
import { KoFiWebhookPayload, StoreData } from '../types.js'
import path from 'node:path'

declare module 'fastify' {
  interface FastifyInstance {
    db: StoreData & {
      loki: Loki
    }
  }
}

const AUTOSAVE_MILLIS = 30 * 1000

export default fp(async function (fastify: FastifyInstance) {
  if (fastify.hasDecorator('db')) return
  const adapter = new Loki.LokiFsAdapter()
  const loki = new Loki(path.join('data', 'kofi_data.json'), {
    adapter,
    autoload: true,
    autosave: true,
    autosaveInterval: AUTOSAVE_MILLIS,
    autoloadCallback: () => {
      let webhookPayloads = loki.getCollection<KoFiWebhookPayload>('webhookPayloads')
      if (!webhookPayloads) {
        webhookPayloads = loki.addCollection<KoFiWebhookPayload>('webhookPayloads', {
          unique: ['message_id'],
          indices: ['type']
        })
      }
      fastify.decorate('db', {
        loki,
        webhookPayloads
      })
    }
  })
  await new Promise<void>(resolve => {
    loki.on('loaded', () => resolve())
  })
})
