

import { IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID, Max, Min, IsInt, } from 'class-validator';
import { ProjectStatus } from '../project.entity';

export class UpdateProjectDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsEnum(ProjectStatus)
  status?: ProjectStatus;

  @IsOptional()
  @IsUUID()
  customerId?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @IsOptional()
@IsInt()
@Min(0)
@Max(100)
progress?: number;
}
