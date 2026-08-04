import { IsIn } from 'class-validator';

export class UpdateRequestStatusDto {
  @IsIn(['pending', 'converted', 'closed'])
  status!: 'pending' | 'converted' | 'closed';
}