
import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
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
}