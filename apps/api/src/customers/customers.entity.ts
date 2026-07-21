

import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Project } from '../projects/project.entity';

@Entity()
export class Customer {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;
  
  @Column() //nullable: false
  email!: string;

  @OneToMany(() => Project, (project) => project.customer)
  projects!: Project[];
}
