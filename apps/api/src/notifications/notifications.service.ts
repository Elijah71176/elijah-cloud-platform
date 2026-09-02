import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Notification } from './notification.entity';

@Injectable()
export class NotificationsService {
    constructor(
        @InjectRepository(Notification)
        private readonly notificationRepo: Repository<Notification>,
    ) { }

    async createNotification(data: {
        recipientEmail: string;
        recipientRole: 'ADMIN' | 'CUSTOMER';
        type: string;
        title: string;
        message: string;
        projectId?: string;
    }) {
        const notification = this.notificationRepo.create(data);

        return this.notificationRepo.save(notification);
    }

    async findMyNotifications(
        email: string,
        role: "ADMIN" | "CUSTOMER"
    ) {
        return this.notificationRepo.find({
            where: {
                recipientEmail: email,
                recipientRole: role,
            },
            order: {
                createdAt: "DESC",
            },
        });

    }
    async markAsRead(
        id: string,
        email: string,
        role: "ADMIN" | "CUSTOMER"
    ) {
        const notification = await this.notificationRepo.findOne({
            where: {
                id,
                recipientEmail: email,
                recipientRole: role,
            },
        });

        if (!notification) {
            return null;
        }

        notification.isRead = true;
        return this.notificationRepo.save(notification);
    }
}