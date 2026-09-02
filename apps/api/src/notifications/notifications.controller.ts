


import {
    Controller,
    Get,
    Param,
    Patch,
    Req,
    UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
    constructor(
        private readonly notificationsService: NotificationsService,
    ) { }

    @Get('my')
    @UseGuards(AuthGuard('jwt'))
    findMyNotifications(@Req() req: any) {
        return this.notificationsService.findMyNotifications(
            req.user.email,
            req.user.role
        );
    }
    @Patch(':id/read')
    @UseGuards(AuthGuard('jwt'))
    markAsRead(
        @Param('id') id: string,
        @Req() req: any,
    ) {
        return this.notificationsService.markAsRead(
            id,
            req.user.email,
            req.user.role

        );
    }
}