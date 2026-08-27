import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { Res } from '@nestjs/common';
import type { Response } from 'express';

import { createReadStream } from 'fs';


import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

import { mkdir, writeFile } from 'fs/promises';
import { extname, join } from 'path';
import { randomUUID } from 'crypto';

import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@Controller('projects')
export class ProjectsController {
  constructor(
    private readonly projects: ProjectsService,
  ) { }

  // CUSTOMER: only their own projects
  @Get('my')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('CUSTOMER')
  findMyProjects(@Req() req: any) {
    return this.projects.findMyProjects(req.user.email);
  }


  // CUSTOMER: list attachments for own project
  @Get(':id/attachments')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'CUSTOMER')
  async findProjectAttachments(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Req() req: any,
  ) {
    if (req.user.role === 'CUSTOMER') {
      await this.projects.verifyCustomerOwnsProject(
        id,
        req.user.email,
      );
    }

    return this.projects.findProjectAttachments(id);
  }

  @Get(':projectId/attachments/:attachmentId/download')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'CUSTOMER')
  async downloadAttachment(
    @Param('projectId', new ParseUUIDPipe()) projectId: string,
    @Param('attachmentId', new ParseUUIDPipe()) attachmentId: string,
    @Req() req: any,
    @Res() res: Response,
  ) {
    if (req.user.role === 'CUSTOMER') {
      await this.projects.verifyCustomerOwnsProject(
        projectId,
        req.user.email,
      );
    }

    const attachment =
      await this.projects.findAttachmentById(
        projectId,
        attachmentId,
      );

    const filePath = join(
      process.cwd(),
      'uploads',
      'projects',
      attachment.storageKey,
    );

    res.setHeader(
      'Content-Type',
      attachment.mimeType,
    );

    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${attachment.originalName}"`,
    );

    const fileStream = createReadStream(filePath);

    fileStream.pipe(res);
  }

  @Delete(':projectId/attachments/:attachmentId')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'CUSTOMER')
  async deleteAttachment(
    @Param('projectId', new ParseUUIDPipe()) projectId: string,
    @Param('attachmentId', new ParseUUIDPipe()) attachmentId: string,
    @Req() req: any,
  ) {
    if (req.user.role === 'CUSTOMER') {
      await this.projects.verifyCustomerOwnsProject(
        projectId,
        req.user.email,
      );
    }

    const attachment =
      await this.projects.deleteAttachment(
        projectId,
        attachmentId,
      );

    return {
      deleted: true,
      attachmentId: attachment.id,
    };
  }

  // CUSTOMER: upload attachment to own project
  @Post(':id/attachments')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('CUSTOMER')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
    }),
  )
  async uploadAttachment(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Req() req: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException(
        'Please select a file to upload.',
      );
    }

    // Make sure this project belongs to the logged-in customer
    await this.projects.verifyCustomerOwnsProject(
      id,
      req.user.email,
    );

    // Check size, type and max 5 files
    await this.projects.validateAttachment(id, {
      size: file.size,
      mimetype: file.mimetype,
    });

    const uploadDirectory = join(
      process.cwd(),
      'uploads',
      'projects',
    );

    await mkdir(uploadDirectory, {
      recursive: true,
    });

    const extension = extname(file.originalname);

    const storedFilename =
      `${randomUUID()}${extension}`;

    const fullPath = join(
      uploadDirectory,
      storedFilename,
    );

    await writeFile(
      fullPath,
      file.buffer,
    );

    return this.projects.saveAttachmentMetadata({
      projectId: id,
      originalName: file.originalname,
      storageKey: storedFilename,
      mimeType: file.mimetype,
      size: file.size,
    });
  }

  // ADMIN only
  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  findAll() {
    return this.projects.findAll();
  }

  // ADMIN only
  @Get('by-customer/:customerId')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  findByCustomer(
    @Param(
      'customerId',
      new ParseUUIDPipe(),
    )
    customerId: string,
  ) {
    return this.projects.findByCustomer(customerId);
  }

  // ADMIN only
  @Get(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    return this.projects.findOne(id);
  }

  // ADMIN only
  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  create(
    @Body() dto: CreateProjectDto,
  ) {
    return this.projects.create(dto);
  }

  // ADMIN only
  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateProjectDto,
  ) {
    return this.projects.update(id, dto);
  }

  // ADMIN only
  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @HttpCode(204)
  async remove(
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    await this.projects.remove(id);
  }
}