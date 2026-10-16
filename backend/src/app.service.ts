
import { Injectable } from '@nestjs/common';
import { db } from './prisma/db.js';

@Injectable()
export class AppService {
  async getHello(): Promise<string> {
    const users = await db.orm.public.User
      .select('id', 'email')
      .limit(5)
      .all();

    return `ProjectMate database connected. Users found: ${users.length}`;
  }
}