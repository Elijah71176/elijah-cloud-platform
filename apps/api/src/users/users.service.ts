
import {
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './user.entity';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) { }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { email },
    });
  }

  async findById(id: number): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { id },
    });
  }
  async updateCustomerEmail(
    oldEmail: string,
    newEmail: string,
  ): Promise<void> {
    const user = await this.findByEmail(oldEmail);

    if (!user || user.role !== UserRole.CUSTOMER) {
      throw new Error('Customer user account not found');
    }

    user.email = newEmail;

    await this.usersRepository.save(user);
  }
  async deactivateCustomerUser(email: string): Promise<void> {
    const user = await this.findByEmail(email);

    if (!user || user.role !== UserRole.CUSTOMER) {
      throw new Error('Customer user account not found');
    }

    user.isActive = false;

    await this.usersRepository.save(user);
  }
  async createCustomerUser(email: string, password: string): Promise<User> {
    const existingUser = await this.findByEmail(email);

    if (existingUser) {
      throw new ConflictException(
        'A customer with this email already exists',
      );
    }
    const passwordHash = await bcrypt.hash(password, 12);

    const user = this.usersRepository.create({
      email,
      passwordHash,
      role: UserRole.CUSTOMER,
      isActive: true,
    });

    return this.usersRepository.save(user);
  }
  async resetCustomerPassword(
    email: string,
    newPassword: string,
  ): Promise<void> {
    const user = await this.findByEmail(email);

    if (!user || user.role !== UserRole.CUSTOMER) {
      throw new Error('Customer user account not found');
    }

    user.passwordHash = await bcrypt.hash(newPassword, 12);

    await this.usersRepository.save(user);
  }

  async findAdmins(): Promise<User[]> {
    return this.usersRepository.find({
      where: {
        role: UserRole.ADMIN,
        isActive: true,
      },
    });
  }
}
