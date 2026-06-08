import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { AppService } from './app.service';
import { Public } from './common/decorators/public.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Public()
  @Get('booking/success')
  getBookingSuccess(@Res() res: Response) {
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
          <p>Your room reservation has been successfully booked and confirmed. You can now return to the app or check your bookings history.</p>
          <a class="btn" href="/bookings/my-reservations">View My Reservations</a>
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
          <a class="btn" href="/">Go Back Home</a>
        </div>
      </body>
      </html>
    `);
  }
}
