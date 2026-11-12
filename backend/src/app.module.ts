import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthModule } from './health/health.module';
import { UsersModule } from './users/users.module';
import { RoomsModule } from './rooms/rooms.module';
import { BookingsModule } from './bookings/bookings.module';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { StripeModule } from './stripe/stripe.module';
import { PaymentsModule } from './payments/payments.module';
import { AdminModule } from './admin/admin.module';
import { MailModule } from './mail/mail.module';

function getDatabaseConfig() {
  const databaseUrl = process.env.DATABASE_URL;
  if (databaseUrl) {
    const isLocalUrl =
      databaseUrl.includes('@localhost') ||
      databaseUrl.includes('@127.0.0.1') ||
      databaseUrl.includes('@postgres');
    const useSsl =
      process.env.DB_SSL === 'true' ||
      (!isLocalUrl && process.env.DB_SSL !== 'false');

    if (useSsl) {
      // Convert sslmode to no-verify so pg-connection-string does not enforce
      // strict CA validation for cloud providers with self-signed CA certificates.
      const url = databaseUrl.includes('sslmode=')
        ? databaseUrl.replace(
            /([?&])sslmode=(require|prefer|verify-ca)/,
            '$1sslmode=no-verify',
          )
        : databaseUrl.includes('?')
          ? `${databaseUrl}&sslmode=no-verify`
          : `${databaseUrl}?sslmode=no-verify`;

      return {
        url,
        ssl: { rejectUnauthorized: false },
        extra: {
          ssl: { rejectUnauthorized: false },
        },
      };
    }

    return {
      url: databaseUrl,
      ssl: false,
    };
  }

  const isRemote =
    !!process.env.DB_HOST &&
    !['localhost', '127.0.0.1', 'postgres'].includes(process.env.DB_HOST);
  const useSsl =
    process.env.DB_SSL === 'true' ||
    (isRemote && process.env.DB_SSL !== 'false');

  return {
    host: process.env.DB_HOST ?? 'localhost',
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
    username: process.env.DB_USER ?? 'bereside_admin',
    password: process.env.DB_PASSWORD ?? 'password',
    database: process.env.DB_NAME ?? 'bereside_booking_db',
    ssl: useSsl ? { rejectUnauthorized: false } : false,
    extra: useSsl ? { ssl: { rejectUnauthorized: false } } : {},
  };
}

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      ...getDatabaseConfig(),
      autoLoadEntities: true,
      synchronize: true, // auto-sync DB schema (safe for development)
    }),
    HealthModule,
    UsersModule,
    RoomsModule,
    BookingsModule,
    AuthModule,
    StripeModule,
    PaymentsModule,
    AdminModule,
    MailModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
