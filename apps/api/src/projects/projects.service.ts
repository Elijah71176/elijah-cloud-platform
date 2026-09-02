import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { NotificationsService } from '../notifications/notifications.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ProjectUpdate } from './project-update.entity';
import { CreateProjectUpdateDto } from './dto/create-project-update.dto';

import { Project } from './project.entity';
import { ProjectAttachment } from './project-attachment.entity';
import { Customer } from '../customers/customers.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

import { unlink } from 'fs/promises';
import { join } from 'path';

@Injectable()
export class ProjectsService {
  private readonly MAX_FILES_PER_PROJECT = 5;
  private readonly MAX_FILE_SIZE = 5 * 1024 * 1024;

  private readonly ALLOWED_MIME_TYPES = [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'text/plain',
  ];

  constructor(
    @InjectRepository(ProjectUpdate)
    private readonly updateRepo: Repository<ProjectUpdate>,

    @InjectRepository(Project)
    private readonly projectRepo: Repository<Project>,

    @InjectRepository(Customer)
    private readonly customerRepo: Repository<Customer>,

    @InjectRepository(ProjectAttachment)
    private readonly attachmentRepo: Repository<ProjectAttachment>,

    private readonly notificationsService: NotificationsService,
  ) { }


  async findOne(id: string) {
    const project = await this.projectRepo.findOne({
      where: { id },
    });

    if (!project) {
      throw new NotFoundException(`Project ${id} not found`);
    }

    return project;

  }
  async findProjectCustomer(customerId: string) {
    return this.customerRepo.findOne({
      where: { id: customerId },
    });
  }

  findAll() {
    return this.projectRepo.find();
  }


  async create(dto: CreateProjectDto) {
    const customer = await this.customerRepo.findOne({
      where: { id: dto.customerId },
    });

    if (!customer) {
      throw new NotFoundException(
        `Customer ${dto.customerId} not found`,
      );
    }

    const project = this.projectRepo.create({
      title: dto.title,
      status: dto.status,
      customerId: dto.customerId,
      description: dto.description,
      startDate: dto.startDate,
      dueDate: dto.dueDate,
    });

    return this.projectRepo.save(project);
  }

  findByCustomer(customerId: string) {
    return this.projectRepo.find({
      where: { customerId },
    });
  }

  async findMyProjects(email: string) {
    const customer = await this.customerRepo.findOne({
      where: { email },
    });

    if (!customer) {
      throw new NotFoundException(
        `Customer account for ${email} not found`,
      );
    }

    return this.projectRepo.find({
      where: {
        customerId: customer.id,
      },
    });
  }

  async verifyCustomerOwnsProject(
    projectId: string,
    email: string,
  ) {
    const customer = await this.customerRepo.findOne({
      where: { email },
    });

    if (!customer) {
      throw new NotFoundException(
        `Customer account for ${email} not found`,
      );
    }

    const project = await this.projectRepo.findOne({
      where: { id: projectId },
    });

    if (!project) {
      throw new NotFoundException(
        `Project ${projectId} not found`,
      );
    }

    if (project.customerId !== customer.id) {
      throw new ForbiddenException(
        'You cannot access attachments for this project',
      );
    }

    return project;
  }

  async validateAttachment(
    projectId: string,
    file: {
      size: number;
      mimetype: string;
    },
  ) {
    if (file.size > this.MAX_FILE_SIZE) {
      throw new BadRequestException(
        'File is too large. Maximum size is 5 MB.',
      );
    }

    if (!this.ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      throw new BadRequestException(
        'File type not allowed. Use PDF, JPG, PNG, or TXT.',
      );
    }

    const attachmentCount = await this.attachmentRepo.count({
      where: {
        projectId,
      },
    });

    if (attachmentCount >= this.MAX_FILES_PER_PROJECT) {
      throw new BadRequestException(
        'Maximum of 5 files allowed per project.',
      );
    }
  }

  async saveAttachmentMetadata(data: {
    projectId: string;
    originalName: string;
    storageKey: string;
    mimeType: string;
    size: number;
  }) {
    const attachment = this.attachmentRepo.create({
      projectId: data.projectId,
      originalName: data.originalName,
      storageKey: data.storageKey,
      mimeType: data.mimeType,
      size: data.size,
    });

    return this.attachmentRepo.save(attachment);
  }

  async findProjectAttachments(
    projectId: string,
  ) {
    return this.attachmentRepo.find({
      where: {
        projectId,
      },
      order: {
        uploadedAt: 'DESC',
      },
    });


  }

  async findAttachmentById(
    projectId: string,
    attachmentId: string,
  ) {
    const attachment = await this.attachmentRepo.findOne({
      where: {
        id: attachmentId,
        projectId,
      },
    });

    if (!attachment) {
      throw new NotFoundException(
        'Attachment not found',
      );
    }

    return attachment;
  }

  async deleteAttachment(
    projectId: string,
    attachmentId: string,
  ) {
    const attachment = await this.findAttachmentById(
      projectId,
      attachmentId,
    );

    const filePath = join(
      process.cwd(),
      'uploads',
      'projects',
      attachment.storageKey,
    );

    try {
      await unlink(filePath);
    } catch (error: any) {
      if (error?.code !== 'ENOENT') {
        throw error;
      }
    }

    await this.attachmentRepo.remove(attachment);

    return attachment;
  }
  async update(id: string, dto: UpdateProjectDto) {
    const project = await this.projectRepo.findOne({
      where: { id },

    });

    if (!project) {
      throw new NotFoundException(
        `Project ${id} not found`,
      );
    }


    Object.assign(project, dto);

    return this.projectRepo.save(project);
  }

  async remove(id: string) {
    const project = await this.projectRepo.findOne({
      where: { id },
    });

    if (!project) {
      throw new NotFoundException(
        `Project ${id} not found`,
      );
    }

    await this.projectRepo.remove(project);

    return { deleted: true };
  }
  async createProjectUpdate(dto: CreateProjectUpdateDto) {
    const project = await this.projectRepo.findOne({
      where: { id: dto.projectId },
    });

    if (!project) {
      throw new NotFoundException(
        `Project ${dto.projectId} not found`,
      );
    }

    const projectUpdate = this.updateRepo.create({
      projectId: dto.projectId,
      message: dto.message,
    });

    const savedUpdate = await this.updateRepo.save(projectUpdate);

    const customer = await this.customerRepo.findOne({
      where: { id: project.customerId },
    });

    if (customer) {
      await this.notificationsService.createNotification({
        recipientEmail: customer.email,
        recipientRole: 'CUSTOMER',
        type: 'PROJECT_UPDATE',
        title: 'Project Update',
        message: dto.message,
        projectId: project.id,
      });
    }

    return savedUpdate;
  }

  async findProjectUpdates(projectId: string) {
    return this.updateRepo.find({
      where: { projectId },
      order: {
        createdAt: 'DESC',
      },
    });
  }
}