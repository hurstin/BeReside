/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unused-vars */
import { Controller, Get, Res, Query, Inject } from '@nestjs/common';
import { Response } from 'express';
import { AppService } from './app.service';
import { Public } from './common/decorators/public.decorator';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject('STRIPE_CLIENT') private readonly stripe: any,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Public()
  @Get('booking/success')
  async getBookingSuccess(
    @Query('session_id') sessionId: string,
    @Res() res: Response,
  ) {
    if (!sessionId) {
      return res.send(`
        <!DOCTYPE html>
        <html>
        <head><title>Invalid Session</title></head>
        <body style="font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; background: #f9fafb; margin: 0; color: #1f2937;">
          <div style="background: white; padding: 2.5rem; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); text-align: center; max-width: 400px;">
            <h1 style="color: #ef4444; margin-bottom: 1rem;">Invalid Session</h1>
            <p style="margin-bottom: 1.5rem;">No payment session provided.</p>
            <a style="display: inline-block; background: #3b82f6; color: white; padding: 0.75rem 1.5rem; border-radius: 6px; text-decoration: none; font-weight: bold;" href="http://localhost:3001/">Go Back Home</a>
          </div>
        </body>
        </html>
      `);
    }

    try {
      const session = await this.stripe.checkout.sessions.retrieve(sessionId);

      if (session.payment_status !== 'paid') {
        return res.send(`
          <!DOCTYPE html>
          <html>
          <head><title>Payment Not Completed</title></head>
          <body style="font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; background: #f9fafb; margin: 0; color: #1f2937;">
            <div style="background: white; padding: 2.5rem; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); text-align: center; max-width: 400px;">
              <h1 style="color: #f59e0b; margin-bottom: 1rem;">Payment Not Completed</h1>
              <p style="margin-bottom: 1.5rem;">Your payment has not been successfully processed yet. Please try again or contact support.</p>
              <a style="display: inline-block; background: #3b82f6; color: white; padding: 0.75rem 1.5rem; border-radius: 6px; text-decoration: none; font-weight: bold;" href="http://localhost:3001/">Return to Home</a>
            </div>
          </body>
          </html>
        `);
      }
    } catch (err) {
      return res.send(`
        <!DOCTYPE html>
        <html>
        <head><title>Error Verifying Payment</title></head>
        <body style="font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; background: #f9fafb; margin: 0; color: #1f2937;">
          <div style="background: white; padding: 2.5rem; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); text-align: center; max-width: 400px;">
            <h1 style="color: #ef4444; margin-bottom: 1rem;">Error Verifying Payment</h1>
            <p style="margin-bottom: 1.5rem;">There was an issue verifying your payment with our provider.</p>
            <a style="display: inline-block; background: #3b82f6; color: white; padding: 0.75rem 1.5rem; border-radius: 6px; text-decoration: none; font-weight: bold;" href="http://localhost:3001/">Go Back Home</a>
          </div>
        </body>
        </html>
      `);
    }

    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Payment Successful</title>
        <style>
          body { font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; background: #f9fafb; margin: 0; color: #1f2937; }
          .card { background: white; padding: 2.5rem; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); text-align: center; max-width: 400px; }
          h1 { color: #10b981; margin-bottom: 1rem; }
          p { margin-bottom: 1.5rem; line-height: 1.5; }
          .btn { display: inline-block; background: #3b82f6; color: white; padding: 0.75rem 1.5rem; border-radius: 6px; text-decoration: none; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="card">
          <h1>Payment Successful!</h1>
          <p>Your room reservation has been successfully booked and confirmed. We have sent your booking details to your email address.</p>
          <a class="btn" href="http://localhost:3001/">Return to Home</a>
        </div>
      </body>
      </html>
    `);
  }

  @Public()
  @Get('booking/cancel')
  getBookingCancel(@Res() res: Response) {
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Payment Cancelled</title>
        <style>
          body { font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; background: #f9fafb; margin: 0; color: #1f2937; }
          .card { background: white; padding: 2.5rem; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); text-align: center; max-width: 400px; }
          h1 { color: #ef4444; margin-bottom: 1rem; }
          p { margin-bottom: 1.5rem; line-height: 1.5; }
          .btn { display: inline-block; background: #3b82f6; color: white; padding: 0.75rem 1.5rem; border-radius: 6px; text-decoration: none; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="card">
          <h1>Payment Cancelled</h1>
          <p>The checkout process was cancelled. No charges were made to your account. Feel free to try booking again when you are ready.</p>
          <a class="btn" href="http://localhost:3001/">Go Back Home</a>
        </div>
      </body>
      </html>
    `);
  }
}
