import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { Booking } from '../bookings/booking.entity';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;
  private readonly defaultFrom: string;
  private readonly logger = new Logger(MailService.name);

  constructor() {
    this.defaultFrom =
      process.env.EMAIL_FROM_ADDRESS ||
      '"BeReside Booking" <noreply@bereside.com>';
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || '2525', 10),
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  private getEmailTemplate(title: string, content: string): string {
    return `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f0e6; padding: 40px 20px; color: #2d3720;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #f9f6ed; border: 1px solid #e8e4db; border-radius: 4px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
          <div style="background-color: #2d3720; padding: 30px 40px; text-align: center;">
            <h1 style="color: #1a2212; margin: 0; font-size: 24px; letter-spacing: 2px;">BERESIDE</h1>
            <p style="color: #d4af37; margin: 5px 0 0; font-size: 12px; letter-spacing: 3px; text-transform: uppercase;">Since 2026</p>
          </div>
          <div style="padding: 40px;">
            <h2 style="color: #2d3720; margin-top: 0; margin-bottom: 25px; font-size: 24px; font-weight: normal;">${title}</h2>
            <div style="color: #8a8174; line-height: 1.6; font-size: 15px;">
              ${content}
            </div>
          </div>
          <div style="background-color: #f4f0e6; border-top: 1px solid #e8e4db; padding: 20px; text-align: center; color: #8a8174; font-size: 12px;">
            <p style="margin: 0;">&copy; ${new Date().getFullYear()} BeReside Booking. All rights reserved.</p>
          </div>
        </div>
      </div>
    `;
  }

  async sendPasswordResetEmail(to: string, token: string): Promise<void> {
    const resetUrl = `http://localhost:3001/admin/reset-password?token=${token}`;

    const mailOptions = {
      from: this.defaultFrom,
      to,
      subject: 'Password Reset Request',
      html: this.getEmailTemplate(
        'Password Reset',
        `
        <p style="margin-bottom: 20px;">You requested a password reset. Please click the button below to set a new password:</p>
        <p style="text-align: center; margin: 30px 0;"><a href="${resetUrl}" style="background-color: #c79635; color: #ffffff; text-decoration: none; padding: 12px 30px; border-radius: 30px; font-weight: bold; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; display: inline-block;">Reset Password</a></p>
        <p style="margin-top: 20px;">If you did not request this, please ignore this email.</p>
        <p style="font-size: 13px; color: #8a8174; margin-top: 30px;">This link is valid for 15 minutes.</p>
        `,
      ),
    };

    try {
      await this.transporter.sendMail(mailOptions);
      this.logger.log(`Password reset email sent to ${to}`);
    } catch (error) {
      this.logger.error(`Failed to send password reset email to ${to}`, error);
    }
  }

  async sendPaymentReceipt(to: string, booking: Booking): Promise<void> {
    const start = new Date(booking.checkInDate).toLocaleDateString('en-US');
    const end = new Date(booking.checkOutDate).toLocaleDateString('en-US');
    const roomType = booking.room?.type || 'Standard';
    const roomNumber = booking.room?.roomNumber || 'TBD';
    const referenceId = booking.id.split('-')[0];

    const pinSection = booking.checkInPin
      ? `
      <div style="background-color: #f4f0e6; border: 1px solid #c79635; border-radius: 4px; padding: 15px; margin: 20px 0; text-align: center;">
        <h4 style="color: #2d3720; margin-top: 0; margin-bottom: 10px; font-size: 14px; text-transform: uppercase;">Your Secure Check-In PIN</h4>
        <p style="font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #c79635; margin: 0;">${booking.checkInPin}</p>
        <p style="margin-top: 10px; font-size: 13px; color: #8a8174;">Please provide this PIN along with your Reference ID to our staff upon arrival. <strong>Note:</strong> This PIN will only become active 1 hour prior to the standard 3:00 PM check-in time.</p>
      </div>
    `
      : '';

    const mailOptions = {
      from: this.defaultFrom,
      to,
      subject: 'Your Booking Receipt & Check-In Details - BeReside',
      html: this.getEmailTemplate(
        'Booking Confirmed!',
        `
        <p style="margin-bottom: 20px;">Thank you for booking with BeReside. Your payment was successful and your reservation is confirmed.</p>
        ${pinSection}
        <div style="background-color: #f4f0e6; border: 1px solid #e8e4db; border-radius: 4px; padding: 20px; margin: 25px 0;">
          <h3 style="color: #2d3720; margin-top: 0; margin-bottom: 15px; font-size: 16px; text-transform: uppercase; letter-spacing: 1px;">Booking Details</h3>
          <ul style="list-style: none; padding: 0; margin: 0;">
            <li style="margin-bottom: 10px;"><strong>Reference ID:</strong> ${referenceId}</li>
            <li style="margin-bottom: 10px;"><strong>Room:</strong> ${roomType} Room (No. ${roomNumber})</li>
            <li style="margin-bottom: 10px;"><strong>Check-in:</strong> ${start}</li>
            <li style="margin-bottom: 10px;"><strong>Check-out:</strong> ${end}</li>
            <li style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #e8e4db; font-size: 18px; color: #2d3720;"><strong>Total Amount Paid:</strong> $${booking.totalPrice}</li>
          </ul>
        </div>
        <p style="margin-top: 20px;">We look forward to hosting you and ensuring your stay is perfectly matched to your needs.</p>
        `,
      ),
    };

    try {
      await this.transporter.sendMail(mailOptions);
      this.logger.log(`Payment receipt email sent to ${to}`);
    } catch (error) {
      this.logger.error(`Failed to send payment receipt to ${to}`, error);
    }
  }

  async sendCancellationNotice(to: string, booking: Booking): Promise<void> {
    const start = new Date(booking.checkInDate).toLocaleDateString('en-US');
    const end = new Date(booking.checkOutDate).toLocaleDateString('en-US');
    const roomType = booking.room?.type || 'Standard';
    const roomNumber = booking.room?.roomNumber || 'TBD';

    let refundSummary = '';
    if (
      booking.paymentStatus === 'refunded' ||
      booking.paymentStatus === 'partially_refunded'
    ) {
      const penalty =
        Number(booking.totalPrice) - Number(booking.refundedAmount);
      refundSummary = `
        <h3 style="color: #2d3720; margin-top: 25px; margin-bottom: 15px; font-size: 16px; text-transform: uppercase; letter-spacing: 1px;">Refund Summary</h3>
        <ul style="list-style: none; padding: 0; margin: 0;">
          <li style="margin-bottom: 10px;"><strong>Total Original Price:</strong> $${booking.totalPrice}</li>
          <li style="margin-bottom: 10px;"><strong>Cancellation Penalty:</strong> $${penalty.toFixed(2)}</li>
          <li style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #e8e4db; font-size: 18px; color: #2d3720;"><strong>Total Refunded Amount:</strong> $${booking.refundedAmount}</li>
        </ul>
        <p style="margin-top: 15px; font-size: 13px; color: #8a8174;">Please allow 5-10 business days for the refund to appear on your original payment method.</p>
      `;
    }

    const mailOptions = {
      from: this.defaultFrom,
      to,
      subject: 'Booking Cancellation & Refund Receipt - BeReside',
      html: this.getEmailTemplate(
        'Cancellation & Refund Receipt',
        `
        <p style="margin-bottom: 20px;">We are writing to confirm that your booking with BeReside has been successfully cancelled.</p>
        <div style="background-color: #f4f0e6; border: 1px solid #e8e4db; border-radius: 4px; padding: 20px; margin: 25px 0;">
          <h3 style="color: #2d3720; margin-top: 0; margin-bottom: 15px; font-size: 16px; text-transform: uppercase; letter-spacing: 1px;">Cancelled Booking Details</h3>
          <ul style="list-style: none; padding: 0; margin: 0;">
            <li style="margin-bottom: 10px;"><strong>Reference ID:</strong> ${booking.id.split('-')[0]}</li>
            <li style="margin-bottom: 10px;"><strong>Room:</strong> ${roomType} Room (No. ${roomNumber})</li>
            <li style="margin-bottom: 10px;"><strong>Check-in:</strong> ${start}</li>
            <li style="margin-bottom: 10px;"><strong>Check-out:</strong> ${end}</li>
          </ul>
          ${refundSummary}
        </div>
        <p style="margin-top: 20px;">If you have any questions or require further assistance, please don't hesitate to contact our support team.</p>
        `,
      ),
    };

    try {
      await this.transporter.sendMail(mailOptions);
      this.logger.log(`Cancellation email sent to ${to}`);
    } catch (error) {
      this.logger.error(`Failed to send cancellation email to ${to}`, error);
    }
  }

  async sendCheckOutReceipt(to: string, booking: Booking): Promise<void> {
    const roomType = booking.room?.type || 'Standard';
    const roomNumber = booking.room?.roomNumber || 'TBD';
    const referenceId = booking.id.split('-')[0];

    // Format actual times or fall back to booked dates
    const actualCheckIn = booking.actualCheckInTime
      ? new Date(booking.actualCheckInTime).toLocaleString('en-US')
      : new Date(booking.checkInDate).toLocaleDateString('en-US');
    const actualCheckOut = booking.actualCheckOutTime
      ? new Date(booking.actualCheckOutTime).toLocaleString('en-US')
      : new Date(booking.checkOutDate).toLocaleDateString('en-US');

    const mailOptions = {
      from: this.defaultFrom,
      to,
      subject: 'Your Check-Out Summary & Receipt - BeReside',
      html: this.getEmailTemplate(
        'Thank You For Staying With Us!',
        `
        <p style="margin-bottom: 20px;">We hope you had a wonderful stay at BeReside. You have successfully checked out of your room.</p>
        <div style="background-color: #f4f0e6; border: 1px solid #e8e4db; border-radius: 4px; padding: 20px; margin: 25px 0;">
          <h3 style="color: #2d3720; margin-top: 0; margin-bottom: 15px; font-size: 16px; text-transform: uppercase; letter-spacing: 1px;">Stay Details & Receipt</h3>
          <ul style="list-style: none; padding: 0; margin: 0;">
            <li style="margin-bottom: 10px;"><strong>Reference ID:</strong> ${referenceId}</li>
            <li style="margin-bottom: 10px;"><strong>Room:</strong> ${roomType} Room (No. ${roomNumber})</li>
            <li style="margin-bottom: 10px;"><strong>Actual Check-In:</strong> ${actualCheckIn}</li>
            <li style="margin-bottom: 10px;"><strong>Actual Check-Out:</strong> ${actualCheckOut}</li>
            <li style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #e8e4db; font-size: 18px; color: #2d3720;"><strong>Total Amount Paid:</strong> $${booking.totalPrice}</li>
          </ul>
        </div>
        <p style="margin-top: 20px;">Safe travels, and we hope to welcome you back again soon!</p>
        `,
      ),
    };

    try {
      await this.transporter.sendMail(mailOptions);
      this.logger.log(`Check-out receipt email sent to ${to}`);
    } catch (error) {
      this.logger.error(`Failed to send check-out receipt to ${to}`, error);
    }
  }

  async sendMagicLink(to: string, token: string): Promise<void> {
    const magicLinkUrl = `http://localhost:3001/manage-booking?token=${token}`;

    const mailOptions = {
      from: this.defaultFrom,
      to,
      subject: 'Manage Your Booking - BeReside',
      html: this.getEmailTemplate(
        'Manage Your Booking',
        `
        <p style="margin-bottom: 20px;">You requested a secure link to manage your reservations at BeReside.</p>
        <p style="text-align: center; margin: 30px 0;"><a href="${magicLinkUrl}" style="background-color: #c79635; color: #ffffff; text-decoration: none; padding: 12px 30px; border-radius: 30px; font-weight: bold; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; display: inline-block;">Manage My Reservations</a></p>
        <p style="margin-top: 20px;">If you did not request this, please ignore this email.</p>
        <p style="font-size: 13px; color: #8a8174; margin-top: 30px;">This link is secure and will expire in 15 minutes.</p>
        `,
      ),
    };

    try {
      await this.transporter.sendMail(mailOptions);
      this.logger.log(`Magic link email sent to ${to}`);
    } catch (error) {
      this.logger.error(`Failed to send magic link email to ${to}`, error);
    }
  }
}
