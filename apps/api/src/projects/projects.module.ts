import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProjectUpdate } from './project-update.entity';

import { Project } from './project.entity';
import { ProjectAttachment } from './project-attachment.entity';
import { Customer } from '../customers/customers.entity';

import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { NotificationsModule } from '../notifications/notifications.module';
import { ProjectMilestone } from './project-milestone.entity';
import { AttachmentStorageService } from './attachment-storage.service';
import { S3AttachmentStorageService } from './s3-attachment-storage.service';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      Project,
      ProjectAttachment,
      ProjectUpdate,
      ProjectMilestone,
      Customer,
    ]),
    NotificationsModule,
  ],

  controllers: [ProjectsController],
  providers: [
    ProjectsService,
    {
      provide: AttachmentStorageService,
      useFactory: () => {
        const mode = process.env.ATTACHMENT_STORAGE ?? 'local';

        if (mode === 'local') {
          return new AttachmentStorageService();
        }

        if (mode === 's3') {
          return new S3AttachmentStorageService();
        }

        throw new Error(`Unsupported attachment storage mode: ${mode}`);
      },
    },
  ],
  exports: [ProjectsService],
})
export class ProjectsModule { }