
import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module.js';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { UsersModule } from './users/users.module.js';
import { ProjectsModule } from './projects/projects.module.js';
import { AiModule } from './ai/ai.module.js';

@Module({
  imports: [UsersModule, ProjectsModule, TasksModule, AiModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}