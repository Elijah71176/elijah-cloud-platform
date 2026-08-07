import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { RequestService } from './request.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestStatusDto } from './dto/update-request-status.dto';

@Controller('request')
export class RequestController {
  constructor(private readonly requestService: RequestService) {}

  @Post()
  create(@Body() createRequestDto: CreateRequestDto) {
    return this.requestService.create(createRequestDto);
  }

  @Get()
  findAll() {
    return this.requestService.findAll();
  }
@Patch(':id/status')
updateStatus(
  @Param('id') id: string,
  @Body() dto: UpdateRequestStatusDto,
) {
  return this.requestService.updateStatus(id, dto.status);
}
@Patch(':id/convert')
markConverted(@Param('id') id: string) {
  return this.requestService.markConverted(id);
}
}