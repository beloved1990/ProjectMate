import 'dotenv/config';
import { Pool } from 'pg';
import postgres from '@prisma/orm-postgres/runtime';
import type { Contract } from './contract.d.ts';
import contractJson from './contract.json' with { type: 'json' };

export const pool = new Pool({
  connectionString: process.env['DATABASE_URL'],
});

export const db = postgres<Contract>({
  contractJson,
  pg: pool,
});