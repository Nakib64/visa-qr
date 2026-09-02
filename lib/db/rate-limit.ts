import { LoginAttemptRecord } from '../types';
import { getPgPool, initPgTables, ATTEMPTS_FILE, ensureDataDir } from './connection';
import fs from 'fs';

const MAX_FAILED_ATTEMPTS = 5;
const ATTEMPT_WINDOW_MS = 5 * 60 * 1000; // 5 minutes
const BLOCK_DURATION_MS = 5 * 60 * 1000; // 5 minutes

export interface RateLimitStatus {
  isBlocked: boolean;
  retryAfterSeconds?: number;
  attemptsLeft: number;
}

function readLocalAttempts(): Record<string, LoginAttemptRecord> {
  try {
    ensureDataDir();
    if (fs.existsSync(ATTEMPTS_FILE)) {
      const content = fs.readFileSync(ATTEMPTS_FILE, 'utf-8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.warn('Could not read local attempts:', err);
  }
  return {};
}

function writeLocalAttempts(attempts: Record<string, LoginAttemptRecord>): void {
  try {
    ensureDataDir();
    fs.writeFileSync(ATTEMPTS_FILE, JSON.stringify(attempts, null, 2));
  } catch (err) {
    console.warn('Could not write local attempts:', err);
  }
}

/**
 * Check if the given client IP is currently blocked
 */
export async function checkIpRateLimit(ip: string): Promise<RateLimitStatus> {
  const now = Date.now();
  const pool = getPgPool();

  if (pool) {
    try {
      await initPgTables();
      const res = await pool.query(`SELECT * FROM login_attempts WHERE ip = $1 LIMIT 1`, [ip]);
      if (res.rows.length > 0) {
        const row = res.rows[0];
        const blockedUntil = Number(row.blocked_until || 0);
        const attempts = Number(row.attempts || 0);
        const lastAttempt = Number(row.last_attempt_at || 0);

        // Check if currently blocked
        if (blockedUntil > now) {
          const retryAfterSeconds = Math.ceil((blockedUntil - now) / 1000);
          return { isBlocked: true, retryAfterSeconds, attemptsLeft: 0 };
        }

        // Check if attempts have expired
        if (now - lastAttempt > ATTEMPT_WINDOW_MS) {
          return { isBlocked: false, attemptsLeft: MAX_FAILED_ATTEMPTS };
        }

        return {
          isBlocked: false,
          attemptsLeft: Math.max(0, MAX_FAILED_ATTEMPTS - attempts),
        };
      }
    } catch (e) {
      console.warn('PG checkIpRateLimit error, checking local store:', e);
    }
  }

  // Local store fallback
  const attemptsMap = readLocalAttempts();
  const record = attemptsMap[ip];
  if (!record) {
    return { isBlocked: false, attemptsLeft: MAX_FAILED_ATTEMPTS };
  }

  if (record.blockedUntil && record.blockedUntil > now) {
    const retryAfterSeconds = Math.ceil((record.blockedUntil - now) / 1000);
    return { isBlocked: true, retryAfterSeconds, attemptsLeft: 0 };
  }

  if (now - record.lastAttemptAt > ATTEMPT_WINDOW_MS) {
    return { isBlocked: false, attemptsLeft: MAX_FAILED_ATTEMPTS };
  }

  return {
    isBlocked: false,
    attemptsLeft: Math.max(0, MAX_FAILED_ATTEMPTS - record.attempts),
  };
}

/**
 * Record a failed login attempt for the client IP.
 * Triggers 5-min block if 5 failures occur within 5 minutes.
 */
export async function recordFailedLogin(ip: string): Promise<RateLimitStatus> {
  const now = Date.now();
  const pool = getPgPool();

  if (pool) {
    try {
      await initPgTables();
      const res = await pool.query(`SELECT * FROM login_attempts WHERE ip = $1 LIMIT 1`, [ip]);

      let newAttempts = 1;
      let blockedUntil = 0;

      if (res.rows.length > 0) {
        const row = res.rows[0];
        const lastAttempt = Number(row.last_attempt_at || 0);
        const existingBlocked = Number(row.blocked_until || 0);

        if (existingBlocked > now) {
          const retryAfterSeconds = Math.ceil((existingBlocked - now) / 1000);
          return { isBlocked: true, retryAfterSeconds, attemptsLeft: 0 };
        }

        if (now - lastAttempt <= ATTEMPT_WINDOW_MS) {
          newAttempts = Number(row.attempts || 0) + 1;
        } else {
          newAttempts = 1;
        }
      }

      if (newAttempts >= MAX_FAILED_ATTEMPTS) {
        blockedUntil = now + BLOCK_DURATION_MS;
      }

      await pool.query(
        `INSERT INTO login_attempts (ip, attempts, last_attempt_at, blocked_until)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (ip) DO UPDATE SET
           attempts = EXCLUDED.attempts,
           last_attempt_at = EXCLUDED.last_attempt_at,
           blocked_until = EXCLUDED.blocked_until`,
        [ip, newAttempts, now, blockedUntil]
      );

      if (blockedUntil > now) {
        return {
          isBlocked: true,
          retryAfterSeconds: Math.ceil(BLOCK_DURATION_MS / 1000),
          attemptsLeft: 0,
        };
      }

      return {
        isBlocked: false,
        attemptsLeft: Math.max(0, MAX_FAILED_ATTEMPTS - newAttempts),
      };
    } catch (e) {
      console.warn('PG recordFailedLogin error, saving to local store:', e);
    }
  }

  // Local fallback
  const attemptsMap = readLocalAttempts();
  const existing = attemptsMap[ip];
  let newAttempts = 1;
  let blockedUntil = 0;

  if (existing) {
    if (existing.blockedUntil && existing.blockedUntil > now) {
      const retryAfterSeconds = Math.ceil((existing.blockedUntil - now) / 1000);
      return { isBlocked: true, retryAfterSeconds, attemptsLeft: 0 };
    }

    if (now - existing.lastAttemptAt <= ATTEMPT_WINDOW_MS) {
      newAttempts = existing.attempts + 1;
    }
  }

  if (newAttempts >= MAX_FAILED_ATTEMPTS) {
    blockedUntil = now + BLOCK_DURATION_MS;
  }

  attemptsMap[ip] = {
    ip,
    attempts: newAttempts,
    lastAttemptAt: now,
    blockedUntil,
  };
  writeLocalAttempts(attemptsMap);

  if (blockedUntil > now) {
    return {
      isBlocked: true,
      retryAfterSeconds: Math.ceil(BLOCK_DURATION_MS / 1000),
      attemptsLeft: 0,
    };
  }

  return {
    isBlocked: false,
    attemptsLeft: Math.max(0, MAX_FAILED_ATTEMPTS - newAttempts),
  };
}

/**
 * Reset failed attempts on successful login
 */
export async function resetFailedLogins(ip: string): Promise<void> {
  const pool = getPgPool();
  if (pool) {
    try {
      await initPgTables();
      await pool.query(`DELETE FROM login_attempts WHERE ip = $1`, [ip]);
    } catch (e) {
      console.warn('PG resetFailedLogins error:', e);
    }
  }

  const attemptsMap = readLocalAttempts();
  if (attemptsMap[ip]) {
    delete attemptsMap[ip];
    writeLocalAttempts(attemptsMap);
  }
}
