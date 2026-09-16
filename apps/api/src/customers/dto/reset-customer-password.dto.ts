
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ResetCustomerPasswordDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  newPassword!: string;
}