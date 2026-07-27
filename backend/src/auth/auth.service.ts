import {
  Injectable,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { User } from '../users/user.entity';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  async validateUser(
    email: string,
    pass: string,
  ): Promise<Partial<User> | null> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(pass, user.passwordHash))) {
      const result = { ...user };
      delete (result as Partial<User>).passwordHash;
      return result;
    }
    return null;
  }

  login(user: { email: string; id: string; role: string }) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(createUserDto: CreateUserDto): Promise<User> {
    if (createUserDto.password !== createUserDto.passwordConfirm) {
      throw new BadRequestException('Passwords do not match');
    }

    const existingUser = await this.usersService.findByEmail(
      createUserDto.email,
    );
    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    const { password, role, ...rest } = createUserDto;
    Reflect.deleteProperty(rest, 'passwordConfirm');
    const passwordHash = await bcrypt.hash(password, 10);

    return this.usersService.create({
      ...rest,
      role: role || 'staff', // Register as staff by default
      passwordHash,
    });
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const user = await this.usersService.findByEmail(forgotPasswordDto.email);
    if (!user) {
      // Do not reveal if email exists or not to prevent user enumeration
      return {
        message:
          'If an account exists with that email, a reset link has been sent.',
      };
    }

    const payload = { sub: user.id, purpose: 'reset-password' };
    const resetToken = this.jwtService.sign(payload, { expiresIn: '15m' });

    await this.mailService.sendPasswordResetEmail(user.email, resetToken);

    return {
      message:
        'If an account exists with that email, a reset link has been sent.',
    };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    try {
      const decoded = this.jwtService.verify(resetPasswordDto.token) as unknown;
      const payload = decoded as { purpose: string; sub: string };
      if (payload.purpose !== 'reset-password') {
        throw new BadRequestException('Invalid token purpose');
      }

      const newHash = await bcrypt.hash(resetPasswordDto.newPassword, 10);
      await this.usersService.update(payload.sub, { passwordHash: newHash });

      return { message: 'Password has been successfully reset' };
    } catch {
      throw new BadRequestException('Invalid or expired reset token');
    }
  }
}
