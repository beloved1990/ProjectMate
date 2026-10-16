
import {
  Injectable,
  BadRequestException,
} from '@nestjs/common';
import { db } from '../prisma/db.js';

@Injectable()
export class ProjectsService {
  async create(userId: number, data: { name: string; description?: string }) {
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

    return {
      projects,
    };
  }
}