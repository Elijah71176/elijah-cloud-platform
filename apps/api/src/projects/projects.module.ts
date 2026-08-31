import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProjectUpdate } from './project-update.entity';

import { Project } from './project.entity';
import { ProjectAttachment } from './project-attachment.entity';
import { Customer } from '../customers/customers.entity';

import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Project,
      ProjectAttachment,
      ProjectUpdate,
      Customer,
    ]),
  ],

  controllers: [ProjectsController],
  providers: [ProjectsService],
})
export class ProjectsModule {}