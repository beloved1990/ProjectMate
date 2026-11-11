
import {
  Injectable,
  ConflictException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';

import { createHash, randomBytes } from 'node:crypto';
import { JwtService } from '@nestjs/jwt';
import { hash, compare } from 'bcryptjs';

import { db, pool } from '../prisma/db.js';
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
    const loginStarted = Date.now();

    const email = data.email?.trim().toLowerCase();
    const password = data.password;

    if (!email || !password) {
      throw new UnauthorizedException(
        'Invalid email or password.',
      );
    }

    // 1. Measure database lookup
    const databaseStarted = Date.now();

    const users = await db.orm.public.User
      .where({ email })
      .limit(1)
      .all();

    const databaseDuration = Date.now() - databaseStarted;
    const user = users[0];

    if (!user || !user.password) {
      console.log('ProjectMate login performance:', {
        databaseDurationMs: databaseDuration,
        totalDurationMs: Date.now() - loginStarted,
      });

      throw new UnauthorizedException(
        'Invalid email or password.',
      );
    }

    // 2. Measure password verification
    const passwordStarted = Date.now();

    const passwordMatches = await compare(
      password,
      user.password,
    );

    const passwordDuration = Date.now() - passwordStarted;

    if (!passwordMatches) {
      console.log('ProjectMate login performance:', {
        databaseDurationMs: databaseDuration,
        passwordDurationMs: passwordDuration,
        totalDurationMs: Date.now() - loginStarted,
      });

      throw new UnauthorizedException(
        'Invalid email or password.',
      );
    }

    // 3. Measure JWT generation
    const jwtStarted = Date.now();

    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
    });

    const jwtDuration = Date.now() - jwtStarted;

    // 4. Log performance without exposing credentials
    console.log('ProjectMate login performance:', {
      databaseDurationMs: databaseDuration,
      passwordDurationMs: passwordDuration,
      jwtDurationMs: jwtDuration,
      totalDurationMs: Date.now() - loginStarted,
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

  async forgotPassword(data: { email: string }) {
    const email = data.email?.trim().toLowerCase();

    if (!email) {
      throw new BadRequestException('Email is required.');
    }

    const users = await db.orm.public.User
      .where({ email })
      .select('id')
      .limit(1)
      .all();

    const user = users[0];

    const message =
      'If an account with that email exists, a password reset link has been sent.';

    if (!user) {
      return { message };
    }

    const resetToken = randomBytes(32).toString('hex');

    const tokenHash = createHash('sha256')
      .update(resetToken)
      .digest('hex');

    const expiresAt = new Date(
      Date.now() + 15 * 60 * 1000,
    );

    await pool.query(
      `INSERT INTO "PasswordResetToken"
        ("tokenHash", "userId", "expiresAt", "createdAt")
       VALUES ($1, $2, $3, NOW())
       ON CONFLICT ("userId")
       DO UPDATE SET
         "tokenHash" = EXCLUDED."tokenHash",
         "expiresAt" = EXCLUDED."expiresAt",
         "createdAt" = NOW()`,
      [tokenHash, user.id, expiresAt],
    );

    const apiKey = process.env['RESEND_API_KEY'];

    if (!apiKey) {
      console.error('Resend API key is missing.');

      await pool.query(
        `DELETE FROM "PasswordResetToken"
         WHERE "userId" = $1`,
        [user.id],
      );

      return { message };
    }

    const frontendUrl = (
      process.env['FRONTEND_URL'] || 'http://localhost:3000'
    ).replace(/\/+$/, '');

    const resetLink =
      `${frontendUrl}/reset-password?token=${resetToken}`;

    try {
      const response = await fetch(
        'https://api.resend.com/emails',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'ProjectMate <onboarding@resend.dev>',
            to: [email],
            subject: 'Reset your ProjectMate password',
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 25px; color: #333;">
                <h2 style="color: #2563eb;">ProjectMate Password Reset</h2>

                <p>Hello,</p>

                <p>We received a request to reset your ProjectMate account password.</p>

                <p>Click the button below to create a new password:</p>

                <p style="margin: 30px 0;">
                  <a
                    href="${resetLink}"
                    style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;"
                  >
                    Reset My Password
                  </a>
                </p>

                <p>This link will expire in 15 minutes.</p>

                <p>If you did not request a password reset, you can safely ignore this email.</p>

                <p>Regards,<br />ProjectMate Team</p>
              </div>
            `,
            text: `Reset your ProjectMate password using this link: ${resetLink}. This link expires in 15 minutes.`,
          }),
        },
      );

      if (!response.ok) {
        const errorDetails = await response.text();

        console.error(
          'Resend email delivery failed:',
          response.status,
          errorDetails,
        );

        await pool.query(
          `DELETE FROM "PasswordResetToken"
           WHERE "userId" = $1`,
          [user.id],
        );

        return { message };
      }

      console.log('Password reset email accepted by Resend.');
    } catch (error) {
      console.error('Password reset email error:', error);

      await pool.query(
        `DELETE FROM "PasswordResetToken"
         WHERE "userId" = $1`,
        [user.id],
      );
    }

    return { message };
  }

  async resetPassword(data: {
    token: string;
    newPassword: string;
  }) {
    const token = data.token?.trim();
    const newPassword = data.newPassword;

    if (!token || !newPassword) {
      throw new BadRequestException(
        'Reset token and new password are required.',
      );
    }

    if (newPassword.length < 8) {
      throw new BadRequestException(
        'Password must be at least 8 characters.',
      );
    }

    const tokenHash = createHash('sha256')
      .update(token)
      .digest('hex');

    const hashedPassword = await hash(newPassword, 12);

    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      const result = await client.query<{ userId: number }>(
        `SELECT "userId"
         FROM "PasswordResetToken"
         WHERE "tokenHash" = $1
           AND "expiresAt" > NOW()
         FOR UPDATE`,
        [tokenHash],
      );

      const resetRecord = result.rows[0];

      if (!resetRecord) {
        throw new BadRequestException(
          'This password reset link is invalid or has expired.',
        );
      }

      await client.query(
        `UPDATE "User"
         SET "password" = $1
         WHERE "id" = $2`,
        [hashedPassword, resetRecord.userId],
      );

      await client.query(
        `DELETE FROM "PasswordResetToken"
         WHERE "userId" = $1`,
        [resetRecord.userId],
      );

      await client.query('COMMIT');

      return {
        message:
          'Password reset successful. You can now log in.',
      };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
}
