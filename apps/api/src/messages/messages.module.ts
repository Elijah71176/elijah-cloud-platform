import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ProjectMessage } from "./project-message.entity";
import { MessagesService } from "./messages.service";
import { MessagesController } from "./messages.controller";
import { ProjectsModule } from "../projects/projects.module";
import { NotificationsModule } from "../notifications/notifications.module";
import { UsersModule } from "../users/users.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([ProjectMessage]),
        ProjectsModule,
        NotificationsModule,
        UsersModule,

    ], controllers: [MessagesController],
    providers: [MessagesService],
    exports: [MessagesService],
})
export class MessagesModule { }