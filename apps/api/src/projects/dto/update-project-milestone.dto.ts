import {
    IsDateString,
    IsEnum,
    IsOptional,
    IsString,
    IsNotEmpty,
} from 'class-validator';

import { MilestoneStatus } from '../project-milestone.entity';

export class UpdateProjectMilestoneDto {
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    title?: string;

    @IsOptional()
    @IsEnum(MilestoneStatus)
    status?: MilestoneStatus;

    @IsOptional()
    @IsDateString()
    targetDate?: string;

    @IsOptional()
    @IsDateString()
    completedDate?: string;
}