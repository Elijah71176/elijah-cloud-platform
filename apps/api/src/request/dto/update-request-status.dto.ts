import { IsIn } from 'class-validator';

export class UpdateRequestStatusDto {
  @IsIn(['pending', 'temporarily_closed', 'closed'])
  status!: 'pending' | 'temporarily_closed' | 'closed';


}