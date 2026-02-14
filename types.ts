import { Type, type Static } from '@fastify/type-provider-typebox'
import { Collection } from 'lokijs'

export type KoFiWebhookPayload = Static<typeof koFiWebhookPayloadSchema>
export const koFiWebhookPayloadSchema = Type.Object({
  verification_token: Type.String({ format: 'uuid' }),
  message_id: Type.String({ format: 'uuid' }),
  timestamp: Type.String({ format: 'date-time' }),
  type: Type.Union([
    Type.Literal('Donation'),
    Type.Literal('Subscription'),
    Type.Literal('Commission'), // not yet supported
    Type.Literal('Shop Order') // not yet supported
  ]),
  is_public: Type.Boolean(),
  from_name: Type.Union([Type.String(), Type.Null()]),
  message: Type.Union([Type.String(), Type.Null()]),
  amount: Type.String(),
  url: Type.Union([Type.String({ format: 'uri' }), Type.Null()]),
  email: Type.String({ format: 'email' }),
  currency: Type.String(),
  is_subscription_payment: Type.Boolean(),
  is_first_subscription_payment: Type.Boolean(),
  kofi_transaction_id: Type.String({ format: 'uuid' }),
  shop_items: Type.Union([Type.Any(), Type.Null()]), // not yet supported
  tier_name: Type.String(),
  shipping: Type.Union([Type.Any(), Type.Null()]) // not yet supported
})

export interface StoreData {
  webhookPayloads: Collection<KoFiWebhookPayload>
}

export interface AuthenticationTokenQuery {
  token: string;
}
