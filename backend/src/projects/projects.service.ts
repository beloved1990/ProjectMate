
import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { db } from '../prisma/db.js';

@Injectable()
export class ProjectsService {
  async create(
    userId: number,
    data: { name: string; description?: string },
  ) {
    const name = data.name?.trim();

    if (!name) {
      throw new BadRequestException('Project name is required.');
    }

    const project = await db.orm.public.Project.create({
      name,
      description: data.description?.trim() || null,
      ownerId: userId,
    });

    return {
      message: 'Project created successfully.',
      project,
    };
  }

  async findAll(userId: number) {
    const projects = await db.orm.public.Project
      .where({ ownerId: userId })
      .all();

    return { projects };
  }

  async saveResearchCoachReport(
    userId: number,
    projectId: number,
    data: { title: string; content: string },
  ) {
    const title = data.title?.trim();
    const content = data.content?.trim();

    if (!title || !content) {
      throw new BadRequestException(
        'Report title and content are required.',
      );
    }

    const projects = await db.orm.public.Project
      .where({ id: projectId, ownerId: userId })
      .all();

    if (projects.length === 0) {
      throw new NotFoundException(
        'Project not found or you do not have access to it.',
      );
    }

    const report = await db.orm.public.ResearchCoachReport.create({
      projectId,
      title,
      content,
    });

    return {
      message: 'Research Coach report saved successfully.',
      report,
    };
  }

  async findResearchCoachReports(
    userId: number,
    projectId: number,
  ) {
    const projects = await db.orm.public.Project
      .where({ id: projectId, ownerId: userId })
      .all();

    if (projects.length === 0) {
      throw new NotFoundException(
        'Project not found or you do not have access to it.',
      );
    }

    const reports = await db.orm.public.ResearchCoachReport
      .where({ projectId })
      .all();

    return { reports };
  }
}
