import fp from 'fastify-plugin'
import fastifySensible from '@fastify/sensible'
import { FastifyInstance, FastifyPluginOptions } from 'fastify'

export default fp(async function (fastify: FastifyInstance, opts: FastifyPluginOptions) {
  fastify.register(fastifySensible)
})
