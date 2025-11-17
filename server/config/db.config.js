import pg from 'pg';
import { env } from './env.config.js';

export const pool = new pg.Pool({
  host: env.db.host,
  user: env.db.username,
  password: env.db.password,
  database: env.db.database,
  port: env.db.port,
});
