import { Injectable, OnApplicationBootstrap, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersSeederService implements OnApplicationBootstrap {
  private readonly logger = new Logger(UsersSeederService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async onApplicationBootstrap() {
    this.logger.log('Starting User database seeding process...');

    const adminEmail = process.env.ADMIN_EMAIL || 'okechukwuhurstin@gmail.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'password123';

    const existingAdmin = await this.userRepository.findOneBy({
      email: adminEmail,
    });

    if (!existingAdmin) {
      const passwordHash = await bcrypt.hash(adminPassword, 10);
      const newAdmin = this.userRepository.create({
        email: adminEmail,
        passwordHash,
        firstName: 'System',
        lastName: 'Admin',
        role: 'admin',
      });
      await this.userRepository.save(newAdmin);
      this.logger.log(`Created default Admin User: ${adminEmail}`);
    } else {
      this.logger.log(`Admin user ${adminEmail} already exists, skipping...`);
    }

    this.logger.log('User database seeding process completed successfully.');
  }
}
