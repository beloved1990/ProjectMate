
import {
  Injectable,
  ConflictException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { hash, compare } from 'bcryptjs';
import { db } from '../prisma/db.js';
import { RegisterDto } from './register.dto.js';

@Injectable()
export class UsersService {
  constructor(private readonly jwtService: JwtService) {}

  async register(data: RegisterDto) {
    const email = data.email?.trim().toLowerCase();
    const password = data.password;

    if (!email || !password) {
      throw new BadRequestException(
        'Email and password are required.',
      );
    }

    if (password.length < 8) {
      throw new BadRequestException(
        'Password must be at least 8 characters.',
      );
    }

    const existingUsers = await db.orm.public.User
      .where({ email })
      .select('id')
      .limit(1)
      .all();

    if (existingUsers.length > 0) {
      throw new ConflictException(
        'An account with this email already exists.',
      );
    }

    const hashedPassword = await hash(password, 12);

    const user = await db.orm.public.User.create({
      email,
      password: hashedPassword,
      username: data.username?.trim() || null,
      name: data.name?.trim() || null,
    });

    return {
      message: 'Registration successful.',
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        name: user.name,
      },
    };
  }

  async login(data: { email: string; password: string }) {
    const email = data.email?.trim().toLowerCase();
    const password = data.password;

    if (!email || !password) {
      throw new UnauthorizedException(
        'Invalid email or password.',
      );
    }

    const users = await db.orm.public.User
      .where({ email })
      .limit(1)
      .all();

    const user = users[0];

    if (!user) {
      throw new UnauthorizedException(
        'Invalid email or password.',
      );
    }

    const passwordMatches = await compare(
      password,
      user.password,
    );

    if (!passwordMatches) {
      throw new UnauthorizedException(
        'Invalid email or password.',
      );
    }

    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
    });

    return {
      message: 'Login successful.',
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        name: user.name,
      },
    };
  }
    async findAll() {
    const users = await db.orm.public.User
      .select('id', 'name', 'username', 'email')
      .all();

    return users.map((user) => ({
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
    }));
  }
}