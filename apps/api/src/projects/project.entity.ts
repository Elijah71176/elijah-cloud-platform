

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Customer } from '../customers/customers.entity';
export enum ProjectStatus {
  PLANNED = 'planned',
  ACTIVE = 'active',
  ON_HOLD = 'on_hold',
  DONE = 'done',
}


@Entity()
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  title!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'date', nullable: true })
  startDate?: string;

  @Column({ type: 'date', nullable: true })
  dueDate?: string;

  @Column({
    type: 'varchar',
    enum: ProjectStatus,
    default: ProjectStatus.PLANNED,
  })
  status!: ProjectStatus;

  @ManyToOne(() => Customer, (customer) => customer.projects, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'customerId' })
  customer!: Customer;

  @Column()
  customerId!: string;
}
