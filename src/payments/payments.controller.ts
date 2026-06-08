/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unused-vars */
import {
  Controller,
  Post,
  Req,
  Res,
  Headers,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { Request, Response } from 'express';
import Stripe from 'stripe';
import { BookingsService } from '../bookings/bookings.service';
import { Public } from '../common/decorators/public.decorator';

@Controller('payments')
export class PaymentsController {
  constructor(
    @Inject('STRIPE_CLIENT') private readonly stripe: any,
    private readonly bookingsService: BookingsService,
  ) {}

  @Public()
  @Post('webhook')
  async handleWebhook(
    @Req() req: Request & { rawBody: Buffer },
    @Res() res: Response,
    @Headers('stripe-signature') signature: string,
  ) {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || 'whsec_mock';
    let event: any;

    try {
      if (!req.rawBody) {
        throw new Error(
          'Raw body is missing. Is rawBody: true configured in NestFactory.create?',
        );
      }
      event = this.stripe.webhooks.constructEvent(
        req.rawBody,
        signature,
        webhookSecret,
      );
    } catch (err) {
      console.error(`⚠️  Webhook signature verification failed:`, err.message);
      throw new BadRequestException(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const bookingId = session.metadata?.bookingId;
      if (bookingId) {
        console.log(`✅ Payment successful for booking ${bookingId}`);
        await this.bookingsService.updateBookingPaymentStatus(
          bookingId,
          'paid',
          'confirmed',
        );
      }
    }

    res.status(200).send();
  }
}
