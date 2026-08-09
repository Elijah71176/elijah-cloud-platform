import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from '../customers/customers.entity';
import { Project } from '../projects/project.entity';
import { ServiceRequest } from '../request/request.entity';

@Injectable()
export class DashboardService {
    constructor(
        @InjectRepository(Customer)
        private readonly customerRepo: Repository<Customer>,

        @InjectRepository(Project)
        private readonly projectRepo: Repository<Project>,

        @InjectRepository(ServiceRequest)
        private readonly requestRepo: Repository<ServiceRequest>,
    ) { }

    async getStats() {
        const [
            customers,
            projects,
            pendingRequests,
            convertedRequests,
            recentRequests,
            recentCustomers,
        ] = await Promise.all([
            this.customerRepo.count(),
            this.projectRepo.count(),

            this.requestRepo.count({
                where: { status: 'pending' },
            }),

            this.requestRepo.count({
                where: { converted: true },
            }),

            this.requestRepo.find({
                order: { createdAt: 'DESC' },
                take: 5,
            }),

            this.customerRepo.find({
                order: { id: 'DESC' },
                take: 5,
            }),
        ]);

        return {
            customers,
            projects,
            pendingRequests,
            convertedRequests,
            recentRequests,
            recentCustomers,
        };
    }
}