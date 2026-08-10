
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './project.entity';
import { Customer } from '../customers/customers.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepo: Repository<Project>,
    @InjectRepository(Customer)
    private readonly customerRepo: Repository<Customer>,
  ) { }

  async findOne(id: string) { // Find a project by ID
    const project = await this.projectRepo.findOne({ where: { id } });
    if (!project) {
      throw new NotFoundException(`Project ${id} not found`);
    }
    return project;
  }


  findAll() {
    return this.projectRepo.find();
  }

  async create(dto: CreateProjectDto) {
    const customer = await this.customerRepo.findOne({ where: { id: dto.customerId } });
    if (!customer) throw new NotFoundException(`Customer ${dto.customerId} not found`);

    const project = this.projectRepo.create({
      title: dto.title,
      status: dto.status,
      customerId: dto.customerId,
      description: dto.description,
      startDate: dto.startDate,
      dueDate: dto.dueDate,
    });

    return this.projectRepo.save(project);
  }
  findByCustomer(customerId: string) {
    return this.projectRepo.find({ where: { customerId } });
  }

  async update(id: string, dto: UpdateProjectDto) {
    const project = await this.projectRepo.findOne({ where: { id } });
    if (!project) throw new NotFoundException(`Project ${id} not found`);

    Object.assign(project, dto);
    return this.projectRepo.save(project);
  }

  async remove(id: string) {
    const project = await this.projectRepo.findOne({ where: { id } });
    if (!project) throw new NotFoundException(`Project ${id} not found`);

    await this.projectRepo.remove(project);
    return { deleted: true };
  }
}
