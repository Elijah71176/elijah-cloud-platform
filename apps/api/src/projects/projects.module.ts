import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProjectUpdate } from './project-update.entity';

import { Project } from './project.entity';
import { ProjectAttachment } from './project-attachment.entity';
import { Customer } from '../customers/customers.entity';

import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Project,
      ProjectAttachment,
      ProjectUpdate,
      Customer,
    ]),
    NotificationsModule,
  ],

  controllers: [ProjectsController],
  providers: [ProjectsService],
  exports: [ProjectsService],
})
export class ProjectsModule {}