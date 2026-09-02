import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequestController } from './request.controller';
import { RequestService } from './request.service';
import { ServiceRequest } from './request.entity';
import { UsersModule } from '../users/users.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ServiceRequest]),
    UsersModule,
    NotificationsModule,
  ],
  controllers: [RequestController],
  providers: [RequestService],
})
export class RequestModule { }