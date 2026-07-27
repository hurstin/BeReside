import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { BookingsModule } from '../bookings/bookings.module';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [BookingsModule, MailModule],
  controllers: [PaymentsController],
})
export class PaymentsModule {}
