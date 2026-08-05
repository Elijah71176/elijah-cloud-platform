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
  ) {}

  async create(createRequestDto: CreateRequestDto) {
    const request = this.requestRepository.create(createRequestDto);
    const savedRequest = await this.requestRepository.save(request);

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

  async updateStatus(
  id: string,
  status: 'pending' | 'converted' | 'temporarily_closed' | 'closed',
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
}