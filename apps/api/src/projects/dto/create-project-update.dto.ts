

import {
  IsNotEmpty,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateProjectUpdateDto {
  @IsUUID()
  projectId!: string;

  @IsString()
  @IsNotEmpty()
  message!: string;
}