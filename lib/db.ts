import { VisaData, DEFAULT_VISA } from './types';
import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';

// Local fallback store file path (/tmp for serverless environments like Vercel)
const DATA_FILE = process.env.VERCEL
  ? path.join('/tmp', 'visas.json')
  : path.join(process.cwd(), 'data', 'visas.json');

function ensureDataFile() {
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2));
    }
  } catch (err) {
    console.warn('Could not initialize local data file (read-only system):', err);
  }
}

function readLocalVisas(): VisaData[] {
  try {
    ensureDataFile();
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, 'utf-8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.warn('Could not read local visas:', err);
  }
  return [];
}

function writeLocalVisas(visas: VisaData[]): void {
  try {
    ensureDataFile();
    fs.writeFileSync(DATA_FILE, JSON.stringify(visas, null, 2));
  } catch (err) {
    console.warn('Could not write local visas (read-only system):', err);
  }
}

// PostgreSQL Client Pool
let pgPool: Pool | null = null;
let isTableInitialized = false;

function getPgPool(): Pool | null {
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

async function initPgTable(): Promise<boolean> {
  if (isTableInitialized) return true;
  const pool = getPgPool();
  if (!pool) return false;

  try {
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

    isTableInitialized = true;
    return true;
  } catch (err) {
    console.error('PostgreSQL table init error:', err);
    return false;
  }
}

function mapRowToVisa(row: any): VisaData {
  return {
    id: row.id,
    photo: row.photo || '',
    idNumber: row.id_number,
    surname: row.surname,
    name: row.name,
    dateOfBirth: row.date_of_birth,
    gender: row.gender,
    nationality: row.nationality,
    passportNumber: row.passport_number,
    passportType: row.passport_type,
    dateOfExpiry: row.date_of_expiry,
    electronicVisaNumber: row.electronic_visa_number,
    inviter: row.inviter,
    classificationOfVisa: row.classification_of_visa,
    entries: row.entries,
    typeOfVisa: row.type_of_visa,
    dateOfIssue: row.date_of_issue,
    enterBefore: row.enter_before,
    durationOfStay: row.duration_of_stay,
    inviterPhone: row.inviter_phone,
    showStamps: row.show_stamps ?? false,
    notaryNumber: row.notary_number || '7798',
    notaryDate: row.notary_date || '2026-08-24',
    createdAt: row.created_at ? new Date(row.created_at).toISOString() : undefined,
    updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : undefined,
  };
}

export async function getAllVisas(): Promise<VisaData[]> {
  const pool = getPgPool();
  if (pool) {
    try {
      await initPgTable();
      const res = await pool.query(`SELECT * FROM visas ORDER BY created_at DESC`);
      return res.rows.map(mapRowToVisa);
    } catch (e) {
      console.warn('Postgres query error, using local fallback:', e);
    }
  }
  return readLocalVisas();
}

export async function getVisaById(id: string): Promise<VisaData | null> {
  const pool = getPgPool();
  if (pool) {
    try {
      await initPgTable();
      const res = await pool.query(
        `SELECT * FROM visas WHERE LOWER(id) = LOWER($1) OR LOWER(id_number) = LOWER($1) OR LOWER(electronic_visa_number) = LOWER($1) LIMIT 1`,
        [id]
      );
      if (res.rows.length > 0) {
        return mapRowToVisa(res.rows[0]);
      }
    } catch (e) {
      console.warn('Postgres query error, using local fallback:', e);
    }
  }

  const visas = readLocalVisas();
  const search = id.toLowerCase();
  return (
    visas.find(
      (v) =>
        v.id?.toLowerCase() === search ||
        v.idNumber?.toLowerCase() === search ||
        v.electronicVisaNumber?.toLowerCase() === search
    ) || null
  );
}

export async function createVisa(data: Omit<VisaData, 'id'> & { id?: string }): Promise<VisaData> {
  const id = data.id || data.idNumber || `V${Date.now()}`;
  const now = new Date().toISOString();

  const newVisa: VisaData = {
    ...data,
    id,
    createdAt: now,
    updatedAt: now,
  };

  const pool = getPgPool();
  if (pool) {
    try {
      await initPgTable();
      await pool.query(
        `INSERT INTO visas (
          id, photo, id_number, surname, name, date_of_birth, gender, nationality,
          passport_number, passport_type, date_of_expiry, electronic_visa_number,
          inviter, classification_of_visa, entries, type_of_visa, date_of_issue,
          enter_before, duration_of_stay, inviter_phone, show_stamps, notary_number,
          notary_date, created_at, updated_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8,
          $9, $10, $11, $12, $13, $14, $15, $16,
          $17, $18, $19, $20, $21, $22, $23, $24, $25
        )
        ON CONFLICT (id) DO UPDATE SET
          photo = EXCLUDED.photo,
          id_number = EXCLUDED.id_number,
          surname = EXCLUDED.surname,
          name = EXCLUDED.name,
          date_of_birth = EXCLUDED.date_of_birth,
          gender = EXCLUDED.gender,
          nationality = EXCLUDED.nationality,
          passport_number = EXCLUDED.passport_number,
          passport_type = EXCLUDED.passport_type,
          date_of_expiry = EXCLUDED.date_of_expiry,
          electronic_visa_number = EXCLUDED.electronic_visa_number,
          inviter = EXCLUDED.inviter,
          classification_of_visa = EXCLUDED.classification_of_visa,
          entries = EXCLUDED.entries,
          type_of_visa = EXCLUDED.type_of_visa,
          date_of_issue = EXCLUDED.date_of_issue,
          enter_before = EXCLUDED.enter_before,
          duration_of_stay = EXCLUDED.duration_of_stay,
          inviter_phone = EXCLUDED.inviter_phone,
          show_stamps = EXCLUDED.show_stamps,
          notary_number = EXCLUDED.notary_number,
          notary_date = EXCLUDED.notary_date,
          updated_at = EXCLUDED.updated_at
        `,
        [
          newVisa.id,
          newVisa.photo || '',
          newVisa.idNumber,
          newVisa.surname,
          newVisa.name,
          newVisa.dateOfBirth,
          newVisa.gender,
          newVisa.nationality,
          newVisa.passportNumber,
          newVisa.passportType,
          newVisa.dateOfExpiry,
          newVisa.electronicVisaNumber,
          newVisa.inviter,
          newVisa.classificationOfVisa,
          newVisa.entries,
          newVisa.typeOfVisa,
          newVisa.dateOfIssue,
          newVisa.enterBefore,
          newVisa.durationOfStay,
          newVisa.inviterPhone,
          newVisa.showStamps ?? false,
          newVisa.notaryNumber || '7798',
          newVisa.notaryDate || '2026-08-24',
          now,
          now,
        ]
      );

      // If postgres query was successful, return immediately
      try {
        const local = readLocalVisas();
        writeLocalVisas([newVisa, ...local.filter((v) => v.id !== id)]);
      } catch {}
      return newVisa;
    } catch (e) {
      console.error('Postgres insert error:', e);
    }
  }

  const visas = readLocalVisas();
  const existingIndex = visas.findIndex((v) => v.id === id);
  if (existingIndex >= 0) {
    visas[existingIndex] = newVisa;
  } else {
    visas.unshift(newVisa);
  }
  writeLocalVisas(visas);
  return newVisa;
}

export async function updateVisa(id: string, data: Partial<VisaData>): Promise<VisaData | null> {
  const now = new Date().toISOString();
  const existing = await getVisaById(id);
  if (!existing) return null;

  const updated: VisaData = {
    ...existing,
    ...data,
    updatedAt: now,
  };

  const pool = getPgPool();
  if (pool) {
    try {
      await initPgTable();
      await pool.query(
        `UPDATE visas SET
          photo = $1, id_number = $2, surname = $3, name = $4,
          date_of_birth = $5, gender = $6, nationality = $7,
          passport_number = $8, passport_type = $9, date_of_expiry = $10,
          electronic_visa_number = $11, inviter = $12, classification_of_visa = $13,
          entries = $14, type_of_visa = $15, date_of_issue = $16,
          enter_before = $17, duration_of_stay = $18, inviter_phone = $19,
          show_stamps = $20, notary_number = $21, notary_date = $22,
          updated_at = $23
        WHERE id = $24`,
        [
          updated.photo || '',
          updated.idNumber,
          updated.surname,
          updated.name,
          updated.dateOfBirth,
          updated.gender,
          updated.nationality,
          updated.passportNumber,
          updated.passportType,
          updated.dateOfExpiry,
          updated.electronicVisaNumber,
          updated.inviter,
          updated.classificationOfVisa,
          updated.entries,
          updated.typeOfVisa,
          updated.dateOfIssue,
          updated.enterBefore,
          updated.durationOfStay,
          updated.inviterPhone,
          updated.showStamps ?? false,
          updated.notaryNumber || '7798',
          updated.notaryDate || '2026-08-24',
          now,
          id,
        ]
      );
      try {
        const local = readLocalVisas();
        const idx = local.findIndex((v) => v.id === id);
        if (idx >= 0) {
          local[idx] = updated;
          writeLocalVisas(local);
        }
      } catch {}
      return updated;
    } catch (e) {
      console.error('Postgres update error:', e);
    }
  }

  const local = readLocalVisas();
  const idx = local.findIndex((v) => v.id === id);
  if (idx >= 0) {
    local[idx] = updated;
    writeLocalVisas(local);
  }

  return updated;
}

export async function deleteVisa(id: string): Promise<boolean> {
  const pool = getPgPool();
  if (pool) {
    try {
      await initPgTable();
      await pool.query(`DELETE FROM visas WHERE id = $1`, [id]);
      try {
        const local = readLocalVisas();
        const filtered = local.filter((v) => v.id !== id);
        writeLocalVisas(filtered);
      } catch {}
      return true;
    } catch (e) {
      console.error('Postgres delete error:', e);
    }
  }

  const visas = readLocalVisas();
  const filtered = visas.filter((v) => v.id !== id);
  writeLocalVisas(filtered);
  return true;
}
