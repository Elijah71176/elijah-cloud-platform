import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';

import { RequestService } from './request.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestStatusDto } from './dto/update-request-status.dto';

import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@Controller('request')
export class RequestController {
  constructor(
    private readonly requestService: RequestService,
  ) {}

  // Public: visitors can submit service requests
  @Post()
  create(
    @Body() createRequestDto: CreateRequestDto,
  ) {
    return this.requestService.create(createRequestDto);
  }

  // Admin only
  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  findAll() {
    return this.requestService.findAll();
  }

  // Admin only
  @Patch(':id/status')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateRequestStatusDto,
  ) {
    return this.requestService.updateStatus(id, dto.status);
  }

  // Admin only
  @Patch(':id/convert')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  markConverted(
    @Param('id') id: string,
  ) {
    return this.requestService.markConverted(id);
  }
}