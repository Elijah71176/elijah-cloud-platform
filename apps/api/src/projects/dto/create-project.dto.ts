

import { ProjectStatus } from '../project.entity';
import {
  IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID, Max, Min, IsInt,



} from 'class-validator';



export class CreateProjectDto {
  @IsNotEmpty()
  title!: string;

  @IsUUID()
  customerId!: string;

  @IsOptional()
  @IsEnum(ProjectStatus)
  status?: ProjectStatus;

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
