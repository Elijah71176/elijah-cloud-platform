import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { RolesGuard } from './roles.guard';

import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    UsersModule,

    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
  ],

  providers: [
    AuthService,
    JwtStrategy,
    RolesGuard,
  ],

  controllers: [AuthController],

  exports: [
    RolesGuard,
  ],
})
export class AuthModule {}