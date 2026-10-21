import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { ProjectsService } from './projects.service.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';

@Controller('projects')
@UseGuards(JwtAuthGuard)
export class ProjectsController {
  constructor(
    private readonly projectsService: ProjectsService,
  ) {}

  @Post()
  create(
    @Request() req: any,
    @Body() data: { name: string; description?: string },
  ) {
    return this.projectsService.create(
      Number(req.user.sub),
      data,
    );
  }

  @Get()
  findAll(@Request() req: any) {
    return this.projectsService.findAll(
      Number(req.user.sub),
    );
  }

  @Post(':projectId/research-coach-reports')
  saveResearchCoachReport(
    @Request() req: any,
    @Param('projectId', ParseIntPipe) projectId: number,
    @Body() data: { title: string; content: string },
  ) {
    return this.projectsService.saveResearchCoachReport(
      Number(req.user.sub),
      projectId,
      data,
    );
  }

  @Get(':projectId/research-coach-reports')
  findResearchCoachReports(
    @Request() req: any,
    @Param('projectId', ParseIntPipe) projectId: number,
  ) {
    return this.projectsService.findResearchCoachReports(
      Number(req.user.sub),
      projectId,
    );
  }
}