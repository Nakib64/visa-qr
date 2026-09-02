import { AdminUser } from '../types';
import { getPgPool, initPgTables, ADMINS_FILE, ensureDataDir } from './connection';
import fs from 'fs';
import bcrypt from 'bcryptjs';

const DEFAULT_ADMIN_EMAIL = (process.env.ADMIN_EMAIL || 'admin@immigration.gov.mn').toLowerCase().trim();
const DEFAULT_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin@123456';
const DEFAULT_ADMIN_NAME = 'Chief Visa Officer';

function readLocalAdmins(): AdminUser[] {
  try {
    ensureDataDir();
    if (fs.existsSync(ADMINS_FILE)) {
      const content = fs.readFileSync(ADMINS_FILE, 'utf-8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.warn('Could not read local admins:', err);
  }
  return [];
}

function writeLocalAdmins(admins: AdminUser[]): void {
  try {
    ensureDataDir();
    fs.writeFileSync(ADMINS_FILE, JSON.stringify(admins, null, 2));
  } catch (err) {
    console.warn('Could not write local admins:', err);
  }
}

/**
 * Ensures at least one admin exists (creates default admin if none found)
 */
export async function seedDefaultAdmin(): Promise<AdminUser> {
  const existing = await getAdminByEmail(DEFAULT_ADMIN_EMAIL);
  if (existing) {
    return existing;
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(DEFAULT_ADMIN_PASSWORD, salt);
  const now = new Date().toISOString();

  const newAdmin: AdminUser = {
    id: `admin_${Date.now()}`,
    email: DEFAULT_ADMIN_EMAIL,
    name: DEFAULT_ADMIN_NAME,
    role: 'SUPER_ADMIN',
    passwordHash,
    createdAt: now,
    updatedAt: now,
  };

  const pool = getPgPool();
  if (pool) {
    try {
      await initPgTables();
      await pool.query(
        `INSERT INTO admins (id, email, password_hash, name, role, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (email) DO NOTHING`,
        [newAdmin.id, newAdmin.email, newAdmin.passwordHash, newAdmin.name, newAdmin.role, now, now]
      );
    } catch (e) {
      console.error('Failed to seed default admin in PG:', e);
    }
  }

  const localAdmins = readLocalAdmins();
  if (!localAdmins.some((a) => a.email.toLowerCase() === DEFAULT_ADMIN_EMAIL)) {
    localAdmins.push(newAdmin);
    writeLocalAdmins(localAdmins);
  }

  return newAdmin;
}

export async function getAdminByEmail(email: string): Promise<AdminUser | null> {
  const normalizedEmail = email.toLowerCase().trim();
  const pool = getPgPool();
  if (pool) {
    try {
      await initPgTables();
      const res = await pool.query(`SELECT * FROM admins WHERE LOWER(email) = LOWER($1) LIMIT 1`, [
        normalizedEmail,
      ]);
      if (res.rows.length > 0) {
        const row = res.rows[0];
        return {
          id: row.id,
          email: row.email,
          name: row.name,
          role: row.role,
          passwordHash: row.password_hash,
          createdAt: row.created_at ? new Date(row.created_at).toISOString() : undefined,
          updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : undefined,
        };
      }
    } catch (e) {
      console.warn('PG getAdminByEmail error, checking local store:', e);
    }
  }

  const localAdmins = readLocalAdmins();
  const found = localAdmins.find((a) => a.email.toLowerCase() === normalizedEmail);
  return found || null;
}

export async function getAdminById(id: string): Promise<AdminUser | null> {
  const pool = getPgPool();
  if (pool) {
    try {
      await initPgTables();
      const res = await pool.query(`SELECT * FROM admins WHERE id = $1 LIMIT 1`, [id]);
      if (res.rows.length > 0) {
        const row = res.rows[0];
        return {
          id: row.id,
          email: row.email,
          name: row.name,
          role: row.role,
          passwordHash: row.password_hash,
          createdAt: row.created_at ? new Date(row.created_at).toISOString() : undefined,
          updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : undefined,
        };
      }
    } catch (e) {
      console.warn('PG getAdminById error, checking local store:', e);
    }
  }

  const localAdmins = readLocalAdmins();
  return localAdmins.find((a) => a.id === id) || null;
}
