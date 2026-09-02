import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import { NextRequest, NextResponse } from 'next/server';
import { AdminJwtPayload } from './types';

const JWT_SECRET = process.env.JWT_SECRET || 'mongolia-evisa-admin-secret-key-super-secure-2026';
const secretKey = new TextEncoder().encode(JWT_SECRET);

export const ACCESS_COOKIE_NAME = 'admin_access_token';
export const REFRESH_COOKIE_NAME = 'admin_refresh_token';

// 15 minutes for access token, 7 days for refresh token
export const ACCESS_TOKEN_MAX_AGE = 15 * 60; // 15 minutes in seconds
export const REFRESH_TOKEN_MAX_AGE = 7 * 24 * 60 * 60; // 7 days in seconds

/**
 * Hash plain password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

/**
 * Compare plain password against bcrypt hash
 */
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  try {
    return await bcrypt.compare(password, hash);
  } catch {
    return false;
  }
}

/**
 * Generate a short-lived Access Token (15 minutes)
 */
export async function generateAccessToken(payload: AdminJwtPayload): Promise<string> {
  return new SignJWT({ ...payload, tokenType: 'access' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('15m')
    .sign(secretKey);
}

/**
 * Generate a long-lived Refresh Token (7 days)
 */
export async function generateRefreshToken(payload: AdminJwtPayload): Promise<string> {
  return new SignJWT({ ...payload, tokenType: 'refresh' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secretKey);
}

/**
 * Verify JWT token and extract payload
 */
export async function verifyToken(
  token: string,
  expectedType: 'access' | 'refresh' = 'access'
): Promise<AdminJwtPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey);
    if (payload.tokenType !== expectedType) {
      return null;
    }
    return {
      id: payload.id as string,
      email: payload.email as string,
      name: payload.name as string,
      role: payload.role as string,
    };
  } catch {
    return null;
  }
}

/**
 * Set authentication cookies in the response
 */
export function setAuthCookies(
  response: NextResponse,
  accessToken: string,
  refreshToken: string
): void {
  const isProd = process.env.NODE_ENV === 'production';

  response.cookies.set(ACCESS_COOKIE_NAME, accessToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    path: '/',
    maxAge: ACCESS_TOKEN_MAX_AGE,
  });

  response.cookies.set(REFRESH_COOKIE_NAME, refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    path: '/',
    maxAge: REFRESH_TOKEN_MAX_AGE,
  });
}

/**
 * Clear authentication cookies (Logout)
 */
export function clearAuthCookies(response: NextResponse): void {
  const isProd = process.env.NODE_ENV === 'production';

  response.cookies.set(ACCESS_COOKIE_NAME, '', {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });

  response.cookies.set(REFRESH_COOKIE_NAME, '', {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
}

/**
 * Extract client IP address from NextRequest
 */
export function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    const ips = forwardedFor.split(',').map((ip) => ip.trim());
    if (ips.length > 0 && ips[0]) {
      return ips[0];
    }
  }

  const realIp = request.headers.get('x-real-ip');
  if (realIp) return realIp.trim();

  const cfConnectingIp = request.headers.get('cf-connecting-ip');
  if (cfConnectingIp) return cfConnectingIp.trim();

  return '127.0.0.1';
}
