import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  recipientEmail!: string;

  @Column()
  recipientRole!: 'ADMIN' | 'CUSTOMER';

  @Column()
  type!: string;

  @Column()
  title!: string;

  @Column({ type: 'text' })
  message!: string;

  @Column({ nullable: true })
  projectId?: string;

  @Column({ default: false })
  isRead!: boolean;

  @CreateDateColumn()
  createdAt!: Date;
}