import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCustomerDto {
  @IsNotEmpty()
  name!: string;

  @IsEmail()
  email!: string;

  @IsOptional()
  @IsString ()
  phone!: string;
 
  @IsOptional()
  @IsString()
  description!: string;
}
