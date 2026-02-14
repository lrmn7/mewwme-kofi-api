import { FastifyInstance } from 'fastify'
import { AuthenticationTokenQuery } from '../../types.js';

export default async function (fastify: FastifyInstance) {
  fastify.route<{
    Querystring: AuthenticationTokenQuery;
  }>({
    method: 'GET',
    url: '/',
    preHandler: fastify.authenticateToken,
    handler: async (request, reply) => {
      return fastify.db.webhookPayloads
        .chain()
        .find({ type: 'Donation' })
        .simplesort('timestamp')
        .data()
        .map(({ meta, $loki, ...rest }) => rest);
    }
  })
}
