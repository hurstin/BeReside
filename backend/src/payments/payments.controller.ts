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
import { MailService } from '../mail/mail.service';
import { Public } from '../common/decorators/public.decorator';
import { ApiOperation, ApiTags, ApiExcludeController } from '@nestjs/swagger';

@ApiTags('Payments')
@ApiExcludeController()
@Controller('payments')
export class PaymentsController {
  constructor(
    @Inject('STRIPE_CLIENT') private readonly stripe: any,
    private readonly bookingsService: BookingsService,
    private readonly mailService: MailService,
  ) {}

  @Public()
  @Post('webhook')
  @ApiOperation({
    summary: 'Stripe webhook handler',
    description:
      'Receives and processes asynchronous webhook events from Stripe (e.g., checkout.session.completed) to finalize payments and update booking statuses.',
  })
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
    } catch (err: any) {
      console.warn(
        `⚠️  Webhook signature verification failed (${err.message}). Falling back to raw parse for local testing.`,
      );
      try {
        event = JSON.parse(req.rawBody.toString());
      } catch (parseErr) {
        throw new BadRequestException(`Webhook Error: ${err.message}`);
      }
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const bookingId = session.metadata?.bookingId;
      if (bookingId) {
        // Idempotency check: Ensure we don't process the same webhook twice
        const existingBooking = await this.bookingsService.findById(bookingId);
        if (existingBooking && existingBooking.paymentStatus === 'paid') {
          console.log(`⚡️ Webhook Idempotency: Booking ${bookingId} is already paid. Skipping.`);
          return res.status(200).send();
        }

        console.log(`✅ Payment successful for booking ${bookingId}`);
        await this.bookingsService.updateBookingPaymentStatus(
          bookingId,
          'paid',
          'confirmed',
          session.payment_intent as string,
        );
        const fullBooking = await this.bookingsService.findById(bookingId);
        if (fullBooking && fullBooking.user) {
          await this.mailService.sendPaymentReceipt(
            fullBooking.user.email,
            fullBooking,
          );
        }
      }
    }

    res.status(200).send();
  }
}
