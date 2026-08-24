import {
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
  UseGuards,
} from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';

import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@Controller('projects')
export class ProjectsController {
  constructor(
    private readonly projects: ProjectsService,
  ) {}

  // CUSTOMER: only their own projects
  @Get('my')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('CUSTOMER')
  findMyProjects(@Req() req: any) {
    return this.projects.findMyProjects(req.user.email);
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
    @Param('customerId', new ParseUUIDPipe()) customerId: string,
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