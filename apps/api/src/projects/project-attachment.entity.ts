import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Project } from './project.entity';

@Entity('project_attachments')
export class ProjectAttachment {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  projectId!: string;

  @Column()
  originalName!: string;

  @Column()
  storageKey!: string;

  @Column()
  mimeType!: string;

  @Column()
  size!: number;

  @Column({
    type: 'varchar',
    default: 'attachment',
  })
  category!: 'attachment' | 'deliverable';

  @CreateDateColumn()
  uploadedAt!: Date;

  @ManyToOne(() => Project, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'projectId' })
  project!: Project;
}