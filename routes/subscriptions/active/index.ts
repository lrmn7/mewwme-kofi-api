import { FastifyInstance } from 'fastify'
import { subMonths } from 'date-fns';
import { AuthenticationTokenQuery } from '../../../types.js';

export default async function (fastify: FastifyInstance) {
  fastify.route<{
    Querystring: AuthenticationTokenQuery;
  }>({
    method: 'GET',
    url: '/',
    preHandler: fastify.authenticateToken,
    handler: async (request, reply) => {
      const now = new Date();
      const oneMonthAgo = subMonths(now, 1);
      return fastify.db.webhookPayloads
        .chain()
        .find({ type: 'Subscription' })
        .where(data => data.is_subscription_payment && new Date(data.timestamp) >= oneMonthAgo)
        .simplesort('timestamp')
        .data()
        .map(({ meta, $loki, ...rest }) => rest);
    }
  })
}
