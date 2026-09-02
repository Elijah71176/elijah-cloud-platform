import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Req,
    UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ProjectsService } from "../projects/projects.service";
import { MessagesService } from "./messages.service";
import { CreateProjectMessageDto } from "./dto/create-project-message.dto";

@Controller("messages")
export class MessagesController {
    constructor(
        private readonly messagesService: MessagesService,
        private readonly projectsService: ProjectsService,
    ) { }
    @Post()
    @UseGuards(AuthGuard("jwt"))
    async createMessage(
        @Body() dto: CreateProjectMessageDto,
        @Req() req: any,
    ) {
        if (req.user.role === "CUSTOMER") {
            await this.projectsService.verifyCustomerOwnsProject(
                dto.projectId,
                req.user.email,
            );
        }

        return this.messagesService.createMessage(
            dto,
            req.user.email,
            req.user.role,
        );
    }

    @Get(":projectId")
    @UseGuards(AuthGuard("jwt"))
    async findProjectMessages(
        @Param("projectId") projectId: string,
        @Req() req: any,
    ) {
        if (req.user.role === "CUSTOMER") {
            await this.projectsService.verifyCustomerOwnsProject(
                projectId,
                req.user.email,
            );
        }

        return this.messagesService.findProjectMessages(projectId);
    }
}