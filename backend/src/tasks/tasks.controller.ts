
import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';

@Controller('projects/:projectId/tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(
    private readonly tasksService: TasksService,
  ) {}
  @Post()
  create(
    @Request() req: any,
    @Param('projectId', ParseIntPipe) projectId: number,
    @Body()
    data: {
      title: string;
      description?: string;
      deadline?: string;
    },
  ) {
   
return this.tasksService.create(
  Number(req.user.sub),
  projectId,
  data,
);

  }

  @Get()
  findAll(
    @Request() req: any,
    @Param('projectId', ParseIntPipe) projectId: number,
  ) {
    return this.tasksService.findAll(
      Number(req.user.sub),
      projectId,
    );
  }
  
  @Post(':taskId/status')
  updateStatus(
    @Request() req: any,
    @Param('projectId', ParseIntPipe) projectId: number,
    @Param('taskId', ParseIntPipe) taskId: number,
    @Body() data: { status: string },
  ) {
    return this.tasksService.updateStatus(
      Number(req.user.sub),
      projectId,
      taskId,
      data.status,
    );
  }
  
  @Post(':taskId/assign')
  assign(
    @Request() req: any,
    @Param('projectId', ParseIntPipe) projectId: number,
    @Param('taskId', ParseIntPipe) taskId: number,
    @Body() data: { assignedUserId: number },
  ) {
    return this.tasksService.assign(
      Number(req.user.sub),
      projectId,
      taskId,
      Number(data.assignedUserId),
    );
  }
  
  @Post(':taskId/corrections')
  addCorrection(
    @Request() req: any,
    @Param('projectId', ParseIntPipe) projectId: number,
    @Param('taskId', ParseIntPipe) taskId: number,
    @Body() data: { comment: string },
  ) {
    return this.tasksService.addCorrection(
      Number(req.user.sub),
      projectId,
      taskId,
      data.comment,
    );
  }
}