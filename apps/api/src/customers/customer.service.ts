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

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepo: Repository<Customer>,
  ) {}

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

  create(dto: CreateCustomerDto) {
    const customer = this.customerRepo.create(dto);
    return this.customerRepo.save(customer);
  }

  async update(id: string, dto: UpdateCustomerDto) {
    const customer = await this.findOne(id);

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

    await this.customerRepo.remove(customer);

    return { deleted: true };
  }
}