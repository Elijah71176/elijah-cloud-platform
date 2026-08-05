import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('service_requests')
export class ServiceRequest {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column()
  email!: string;

  @Column()
  service!: string;

  @Column({ nullable: true })
  telephone?: string;

  @Column('text')
  message!: string;

  @Column({ default: 'pending' })
  status!: 'pending' | 'converted' | 'temporarily_closed' | 'closed';

  @CreateDateColumn()
  createdAt!: Date;
}