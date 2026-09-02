import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';

// Local fallback store directory
export const DATA_DIR = process.env.VERCEL
  ? path.join('/tmp')
  : path.join(process.cwd(), 'data');

export const DATA_FILE = path.join(DATA_DIR, 'visas.json');
export const ADMINS_FILE = path.join(DATA_DIR, 'admins.json');
export const ATTEMPTS_FILE = path.join(DATA_DIR, 'login_attempts.json');

export function ensureDataDir(): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  } catch (err) {
    console.warn('Could not initialize local data directory:', err);
  }
}

// PostgreSQL Client Pool Singleton
let pgPool: Pool | null = null;
let isTableInitialized = false;

export function getPgPool(): Pool | null {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) return null;

  if (!pgPool) {
    pgPool = new Pool({
      connectionString,
      ssl: {
        rejectUnauthorized: false,
      },
      max: 10,
      idleTimeoutMillis: 30000,
    });
  }
  return pgPool;
}

export async function initPgTables(): Promise<boolean> {
  if (isTableInitialized) return true;
  const pool = getPgPool();
  if (!pool) return false;

  try {
    // 1. Visas table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS visas (
        id VARCHAR(255) PRIMARY KEY,
        photo TEXT,
        id_number VARCHAR(255) NOT NULL,
        surname VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        date_of_birth VARCHAR(255) NOT NULL,
        gender VARCHAR(100) NOT NULL,
        nationality VARCHAR(255) NOT NULL,
        passport_number VARCHAR(255) NOT NULL,
        passport_type VARCHAR(255) NOT NULL,
        date_of_expiry VARCHAR(255) NOT NULL,
        electronic_visa_number VARCHAR(255) NOT NULL,
        inviter VARCHAR(255) NOT NULL,
        classification_of_visa VARCHAR(255) NOT NULL,
        entries VARCHAR(255) NOT NULL,
        type_of_visa VARCHAR(255) NOT NULL,
        date_of_issue VARCHAR(255) NOT NULL,
        enter_before VARCHAR(255) NOT NULL,
        duration_of_stay VARCHAR(255) NOT NULL,
        inviter_phone VARCHAR(255) NOT NULL,
        show_stamps BOOLEAN DEFAULT false,
        notary_number VARCHAR(255) DEFAULT '7798',
        notary_date VARCHAR(255) DEFAULT '2026-08-24',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 2. Admins table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS admins (
        id VARCHAR(255) PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(100) DEFAULT 'ADMIN',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 3. Login attempts rate-limit table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS login_attempts (
        ip VARCHAR(100) PRIMARY KEY,
        attempts INT NOT NULL DEFAULT 1,
        last_attempt_at BIGINT NOT NULL,
        blocked_until BIGINT DEFAULT 0
      );
    `);

    isTableInitialized = true;
    return true;
  } catch (err) {
    console.error('PostgreSQL table init error:', err);
    return false;
  }
}
