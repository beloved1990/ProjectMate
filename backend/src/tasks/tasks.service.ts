
import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { db } from '../prisma/db.js';

@Injectable()
export class TasksService {
  async create(
    userId: number,
    projectId: number,
    data: {
      title: string;
      description?: string;
      deadline?: string;
    },
  ) {
    const title = data.title?.trim();

    if (!title) {
      throw new BadRequestException('Task title is required.');
    }

    const projects = await db.orm.public.Project
      .where({ id: projectId, ownerId: userId })
      .select('id')
      .limit(1)
      .all();

    if (projects.length === 0) {
      throw new NotFoundException('Project not found.');
    }

    let deadline: string | null = null;

    if (data.deadline) {
      if (Number.isNaN(Date.parse(data.deadline))) {
        throw new BadRequestException('Invalid deadline.');
      }

      deadline = new Date(data.deadline).toISOString();
    }

    const task = await db.orm.public.Task.create({
      title,
      description: data.description?.trim() || null,
      status: 'TODO',
      deadline,
      projectId,
    });

    return {
      message: 'Task created successfully.',
      task,
    };
  }

  async findAll(userId: number, projectId: number) {
    const projects = await db.orm.public.Project
      .where({ id: projectId, ownerId: userId })
      .select('id')
      .limit(1)
      .all();

    if (projects.length === 0) {
      throw new NotFoundException('Project not found.');
    }

    const tasks = await db.orm.public.Task
      .where({ projectId })
      .all();

    return { tasks };
  }
  
  async updateStatus(
    userId: number,
    projectId: number,
    taskId: number,
    status: string,
  ) {
    const allowedStatuses = [
      'TODO',
      'IN_PROGRESS',
      'COMPLETED',
    ];

    if (!allowedStatuses.includes(status)) {
      throw new BadRequestException(
        'Status must be TODO, IN_PROGRESS, or COMPLETED.',
      );
    }

    const projects = await db.orm.public.Project
      .where({ id: projectId, ownerId: userId })
      .select('id')
      .limit(1)
      .all();

    if (projects.length === 0) {
      throw new NotFoundException('Project not found.');
    }

    const tasks = await db.orm.public.Task
      .where({ id: taskId, projectId })
      .select('id')
      .limit(1)
      .all();

    if (tasks.length === 0) {
      throw new NotFoundException('Task not found.');
    }

    const updatedTask = await db.orm.public.Task
      .where({ id: taskId, projectId })
      .update({ status });

    return {
      message: 'Task status updated successfully.',
      task: updatedTask,
    };
  }
  
  async assign(
    userId: number,
    projectId: number,
    taskId: number,
    assignedUserId: number,
  ) {
    if (!Number.isInteger(assignedUserId) || assignedUserId <= 0) {
      throw new BadRequestException('A valid user ID is required.');
    }

    const projects = await db.orm.public.Project
      .where({ id: projectId, ownerId: userId })
      .select('id')
      .limit(1)
      .all();

    if (projects.length === 0) {
      throw new NotFoundException('Project not found.');
    }

    const tasks = await db.orm.public.Task
      .where({ id: taskId, projectId })
      .select('id')
      .limit(1)
      .all();

    if (tasks.length === 0) {
      throw new NotFoundException('Task not found.');
    }

    const users = await db.orm.public.User
      .where({ id: assignedUserId })
      .select('id')
      .limit(1)
      .all();

    if (users.length === 0) {
      throw new NotFoundException('User to assign was not found.');
    }

    const existing = await db.orm.public.TaskAssignment
      .where({ taskId, userId: assignedUserId })
      .select('id')
      .limit(1)
      .all();

    if (existing.length > 0) {
      throw new BadRequestException(
        'This task is already assigned to that user.',
      );
    }

    const assignment = await db.orm.public.TaskAssignment.create({
      taskId,
      userId: assignedUserId,
    });

    return {
      message: 'Task assigned successfully.',
      assignment,
    };
  }
  
  async addCorrection(
    userId: number,
    projectId: number,
    taskId: number,
    comment: string,
  ) {
    const cleanComment = comment?.trim();

    if (!cleanComment) {
      throw new BadRequestException(
        'Correction comment is required.',
      );
    }

    const projects = await db.orm.public.Project
      .where({ id: projectId, ownerId: userId })
      .select('id')
      .limit(1)
      .all();

    if (projects.length === 0) {
      throw new NotFoundException('Project not found.');
    }

    const tasks = await db.orm.public.Task
      .where({ id: taskId, projectId })
      .select('id')
      .limit(1)
      .all();

    if (tasks.length === 0) {
      throw new NotFoundException('Task not found.');
    }

    const correction = await db.orm.public.TaskCorrection.create({
      taskId,
      userId,
      comment: cleanComment,
      status: 'PENDING',
    });

    return {
      message: 'Correction submitted successfully.',
      correction,
    };
  }
}