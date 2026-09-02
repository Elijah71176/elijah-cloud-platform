import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Project } from "../projects/project.entity";

@Entity("project_messages")
export class ProjectMessage {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  projectId!: string;

  @Column()
  senderEmail!: string;

  @Column()
  senderRole!: "ADMIN" | "CUSTOMER";

  @Column({ type: "text" })
  message!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @ManyToOne(() => Project, { onDelete: "CASCADE" })
  @JoinColumn({ name: "projectId" })
  project!: Project;
}