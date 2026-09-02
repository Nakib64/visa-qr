import { NextRequest, NextResponse } from 'next/server';
import {
  getAdminByEmail,
  seedDefaultAdmin,
  checkIpRateLimit,
  recordFailedLogin,
  resetFailedLogins,
} from '@/lib/db';
import {
  comparePassword,
  generateAccessToken,
  generateRefreshToken,
  setAuthCookies,
  getClientIp,
} from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);

    // 1. Check IP rate limit and temporary block status (5 failures in 5 min -> block 5 min)
    const rateLimit = await checkIpRateLimit(ip);
    if (rateLimit.isBlocked) {
      const minutes = Math.ceil((rateLimit.retryAfterSeconds || 300) / 60);
      return NextResponse.json(
        {
          success: false,
          error: `Security Alert: Too many failed password attempts. Your IP address (${ip}) has been blocked for ${minutes} minute(s).`,
          isBlocked: true,
          retryAfterSeconds: rateLimit.retryAfterSeconds,
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required.' },
        { status: 400 }
      );
    }

    // 2. Ensure initial default admin exists in the system
    await seedDefaultAdmin();

    // 3. Find admin user
    const admin = await getAdminByEmail(email);
    if (!admin || !admin.passwordHash) {
      // Record failed attempt for invalid email as well to prevent brute force
      const failStatus = await recordFailedLogin(ip);
      if (failStatus.isBlocked) {
        return NextResponse.json(
          {
            success: false,
            error: `Security Alert: Too many failed attempts. Your IP has been temporarily blocked for 5 minutes.`,
            isBlocked: true,
            retryAfterSeconds: failStatus.retryAfterSeconds,
          },
          { status: 429 }
        );
      }

      return NextResponse.json(
        {
          success: false,
          error: 'Invalid email or password.',
          attemptsLeft: failStatus.attemptsLeft,
        },
        { status: 401 }
      );
    }

    // 4. Validate password with bcrypt
    const isValid = await comparePassword(password, admin.passwordHash);
    if (!isValid) {
      const failStatus = await recordFailedLogin(ip);
      if (failStatus.isBlocked) {
        return NextResponse.json(
          {
            success: false,
            error: `Security Alert: 5 consecutive incorrect passwords detected. Your IP (${ip}) has been blocked for 5 minutes.`,
            isBlocked: true,
            retryAfterSeconds: failStatus.retryAfterSeconds,
          },
          { status: 429 }
        );
      }

      return NextResponse.json(
        {
          success: false,
          error: `Invalid email or password. ${failStatus.attemptsLeft} attempt(s) remaining before a 5-minute IP lock.`,
          attemptsLeft: failStatus.attemptsLeft,
        },
        { status: 401 }
      );
    }

    // 5. Successful login: Reset failed attempts for this IP
    await resetFailedLogins(ip);

    // 6. Generate JWT tokens
    const payload = {
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
    };

    const [accessToken, refreshToken] = await Promise.all([
      generateAccessToken(payload),
      generateRefreshToken(payload),
    ]);

    // 7. Prepare response with HttpOnly cookies
    const response = NextResponse.json({
      success: true,
      message: 'Authentication successful',
      data: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    });

    setAuthCookies(response, accessToken, refreshToken);

    return response;
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal authentication server error' },
      { status: 500 }
    );
  }
}
