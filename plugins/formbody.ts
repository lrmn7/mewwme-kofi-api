import fp from 'fastify-plugin'
import fastifyFormbody from '@fastify/formbody'
import { FastifyInstance, FastifyPluginOptions } from 'fastify'

export default fp(async function (fastify: FastifyInstance, opts: FastifyPluginOptions) {
  fastify.register(fastifyFormbody)
})
