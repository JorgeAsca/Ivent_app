import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { NatsModule } from '@app/common';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    NatsModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'super-secret-key-iventapp',
    }),
  ],
  controllers: [AuthController],
})
export class AuthModule {}
