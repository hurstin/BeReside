import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { UsersService } from './src/users/users.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const usersService = app.get(UsersService);
  const users = await usersService.findAll(undefined, true);
  console.log("USERS:", users.map(u => ({ id: u.id, email: u.email, deletedAt: u.deletedAt })));
  await app.close();
}
bootstrap();
