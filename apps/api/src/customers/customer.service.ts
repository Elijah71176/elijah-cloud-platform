import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { Customer } from './customers.entity';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { UsersService } from '../users/users.service';
import { User, UserRole } from '../users/user.entity';
import * as bcrypt from 'bcrypt';


@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepo: Repository<Customer>,
    private readonly usersService: UsersService,
    private readonly dataSource: DataSource,
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

    return this.dataSource.transaction(async (manager) => {
      const userRepo = manager.getRepository(User);
      const customerRepo = manager.getRepository(Customer);

      const existingUser = await userRepo.findOne({
        where: { email: dto.email },
      });

      if (existingUser) {
        throw new ConflictException(
          'A customer with this email already exists',
        );
      }

      const passwordHash = await bcrypt.hash(password, 12);

      const user = userRepo.create({
        email: dto.email,
        passwordHash,
        role: UserRole.CUSTOMER,
        isActive: true,
      });

      await userRepo.save(user);

      const customer = customerRepo.create(customerData);

      return customerRepo.save(customer);
    });

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