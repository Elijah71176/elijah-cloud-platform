import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from './customers.entity';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { UsersModule } from '../users/users.module';


@Module({
  imports: [
    TypeOrmModule.forFeature([Customer]),
    UsersModule,
  ], controllers: [CustomerController],
  providers: [CustomerService],
})
export class CustomerModule { }
