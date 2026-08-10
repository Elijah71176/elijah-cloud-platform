import { IsEnum, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { ProjectStatus } from '../project.entity';

export class CreateProjectDto {
  @IsNotEmpty()
  title!: string;

  @IsUUID()
  customerId!: string;

  @IsOptional()
  @IsEnum(ProjectStatus)
  status?: ProjectStatus;
}
