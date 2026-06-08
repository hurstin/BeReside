/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Module, Global } from '@nestjs/common';
import Stripe from 'stripe';

@Global()
@Module({
  providers: [
    {
      provide: 'STRIPE_CLIENT',
      useFactory: () => {
        return new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock', {
          apiVersion: '2024-06-20' as any,
        });
      },
    },
  ],
  exports: ['STRIPE_CLIENT'],
})
export class StripeModule {}
