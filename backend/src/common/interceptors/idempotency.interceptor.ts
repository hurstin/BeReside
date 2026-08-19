import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { IdempotencyKey } from '../entities/idempotency-key.entity';

@Injectable()
export class IdempotencyInterceptor implements NestInterceptor {
  constructor(
    @InjectRepository(IdempotencyKey)
    private idempotencyKeyRepository: Repository<IdempotencyKey>,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const idempotencyKey = request.headers['idempotency-key'];

    if (!idempotencyKey) {
      return next.handle();
    }

    let record = await this.idempotencyKeyRepository.findOne({
      where: { key: idempotencyKey },
    });

    if (record) {
      if (record.status === 'completed') {
        // Return cached response
        const response = context.switchToHttp().getResponse();
        if (record.responseStatusCode) {
          response.status(record.responseStatusCode);
        }
        return of(record.responseBody);
      }

      if (record.status === 'processing') {
        throw new ConflictException(
          'Request is already being processed. Please wait.',
        );
      }
    } else {
      // Create a new processing record
      record = this.idempotencyKeyRepository.create({
        key: idempotencyKey,
        status: 'processing',
      });
      await this.idempotencyKeyRepository.save(record);
    }

    return next.handle().pipe(
      tap(async (responseBody) => {
        // Save the successful response
        const response = context.switchToHttp().getResponse();
        await this.idempotencyKeyRepository.update(idempotencyKey, {
          status: 'completed',
          responseBody,
          responseStatusCode: response.statusCode,
        });
      }),
    );
  }
}
