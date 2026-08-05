import { IsIn } from 'class-validator';

export class UpdateRequestStatusDto {
  @IsIn(['pending', 'converted', 'temporarily_closed', 'closed'])
  status!: 'pending' | 'converted' | 'temporarily_closed' | 'closed'

  
}