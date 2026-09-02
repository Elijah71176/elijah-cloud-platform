

import { UsersService } from '../users/users.service';
import { NotificationsService } from '../notifications/notifications.service';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRequestDto } from './dto/create-request.dto';
import { ServiceRequest } from './request.entity';

@Injectable()
export class RequestService {
  constructor(
    @InjectRepository(ServiceRequest)
    private readonly requestRepository: Repository<ServiceRequest>,

    private readonly usersService: UsersService,
    private readonly notificationsService: NotificationsService,
  ) { }

  async create(createRequestDto: CreateRequestDto) {
    const request = this.requestRepository.create(createRequestDto);
    const savedRequest = await this.requestRepository.save(request);

    const admins = await this.usersService.findAdmins();

    for (const admin of admins) {
      await this.notificationsService.createNotification({
        recipientEmail: admin.email,
        recipientRole: 'ADMIN',
        type: 'SERVICE_REQUEST',
        title: 'New Service Request',
        message: `New service request from ${savedRequest.email}`,
      });
    }

    return {
      success: true,
      message: 'Service request saved successfully',
      data: savedRequest,
    };
  }

  async findAll() {
    return this.requestRepository.find({
      order: { createdAt: 'DESC' },
    });

  }

  async findMyRequests(email: string) {
    return this.requestRepository.find({
      where: { email },
      order: { createdAt: 'DESC' },
    });
  }

  async updateStatus(
    id: string,
    status: 'pending' | 'temporarily_closed' | 'closed',
  ) {
    const request = await this.requestRepository.findOne({
      where: { id },
    });

    if (!request) {
      throw new Error('Service request not found');
    }

    request.status = status;

    return this.requestRepository.save(request);
  }
  async markConverted(id: string) {
    const request = await this.requestRepository.findOne({
      where: { id },
    });

    if (!request) {
      throw new Error('Service request not found');
    }

    request.converted = true;

    return this.requestRepository.save(request);
  }

}