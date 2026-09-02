import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class CreateProjectMessageDto {
  @IsUUID()
  projectId!: string;

  @IsString()
  @IsNotEmpty()
  message!: string;
}