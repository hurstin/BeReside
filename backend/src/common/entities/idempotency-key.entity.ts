import { Entity, Column, PrimaryColumn, CreateDateColumn } from 'typeorm';

@Entity('idempotency_keys')
export class IdempotencyKey {
  @PrimaryColumn('uuid')
  key: string;

  @Column({ default: 'processing' })
  status: 'processing' | 'completed' | 'failed';

  @Column({ type: 'jsonb', nullable: true })
  responseBody: any;

  @Column({ nullable: true })
  responseStatusCode: number;

  @CreateDateColumn()
  createdAt: Date;
}
