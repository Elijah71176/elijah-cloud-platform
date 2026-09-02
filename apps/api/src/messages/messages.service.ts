import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { ProjectMessage } from "./project-message.entity";
import { CreateProjectMessageDto } from "./dto/create-project-message.dto";
import { NotificationsService } from "../notifications/notifications.service";

import { ProjectsService } from "../projects/projects.service";
import { UsersService } from "../users/users.service";

@Injectable()
export class MessagesService {
    constructor(
        @InjectRepository(ProjectMessage)
        private readonly messageRepo: Repository<ProjectMessage>,
        private readonly notificationsService: NotificationsService,
        private readonly projectsService: ProjectsService,
        private readonly usersService: UsersService,
    ) { }

    async createMessage(
        dto: CreateProjectMessageDto,
        senderEmail: string,
        senderRole: "ADMIN" | "CUSTOMER",
    ) {
        const message = this.messageRepo.create({
            projectId: dto.projectId,
            message: dto.message,
            senderEmail,
            senderRole,
        });

        const savedMessage = await this.messageRepo.save(message);

        const project = await this.projectsService.findOne(dto.projectId);

        if (senderRole === "CUSTOMER") {
            const admins = await this.usersService.findAdmins();

            for (const admin of admins) {
                await this.notificationsService.createNotification({
                    recipientEmail: admin.email,
                    recipientRole: "ADMIN",
                    type: "PROJECT_MESSAGE",
                    title: "New Project Message",
                    message: `New message from ${senderEmail}`,
                    projectId: dto.projectId,
                });
            }
        }

        if (senderRole === "ADMIN") {
            const customer = await this.projectsService.findProjectCustomer(
                project.customerId,
            );

            if (customer) {
                await this.notificationsService.createNotification({
                    recipientEmail: customer.email,
                    recipientRole: "CUSTOMER",
                    type: "PROJECT_MESSAGE",
                    title: "New Project Message",
                    message: "You have a new message from Admin",
                    projectId: dto.projectId,
                });
            }
        }

        return savedMessage;
    }
    async findProjectMessages(projectId: string) {
        return this.messageRepo.find({
            where: {
                projectId,
            },
            order: {
                createdAt: "ASC",
            },
        });
    }
}