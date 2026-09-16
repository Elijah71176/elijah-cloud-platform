import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Customer } from './customers.entity';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepo: Repository<Customer>,
    private readonly usersService: UsersService,
  ) { }

  findAll() {
    return this.customerRepo.find({
      relations: { projects: true },
    });
  }

  async findOne(id: string) {
    const customer = await this.customerRepo.findOne({
      where: { id },
      relations: { projects: true },
    });

    if (!customer) {
      throw new NotFoundException(`Customer ${id} not found`);
    }

    return customer;
  }

  async findByEmail(email: string) {
    const customer = await this.customerRepo.findOne({
      where: { email },
      relations: { projects: true },
    });

    if (!customer) {
      throw new NotFoundException(
        `Customer account for ${email} not found`,
      );
    }

    return customer;
  }

  async create(dto: CreateCustomerDto) {
    const { password, ...customerData } = dto;

    await this.usersService.createCustomerUser(
      dto.email,
      password,
    );

    const customer = this.customerRepo.create(customerData);

    return this.customerRepo.save(customer);
  }
  async resetPassword(id: string, newPassword: string) {
    const customer = await this.findOne(id);

    await this.usersService.resetCustomerPassword(
      customer.email,
      newPassword,
    );

    return {
      message: 'Customer password reset successfully',
    };
  }
  async update(id: string, dto: UpdateCustomerDto) {
    const customer = await this.findOne(id);
    const oldEmail = customer.email;

    if (dto.email && dto.email !== oldEmail) {
      await this.usersService.updateCustomerEmail(
        oldEmail,
        dto.email,
      );
    }
    Object.assign(customer, dto);
    return this.customerRepo.save(customer);
  }
  async remove(id: string) {
    const customer = await this.findOne(id);

    if (customer.projects && customer.projects.length > 0) {
      throw new ConflictException(
        'Customer cannot be deleted because they still have projects',
      );
    }

    await this.usersService.deactivateCustomerUser(
      customer.email,
    );

    await this.customerRepo.remove(customer);

    return { deleted: true };
  }
}