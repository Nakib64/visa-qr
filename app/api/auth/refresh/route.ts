import { NextRequest, NextResponse } from 'next/server';
import {
  REFRESH_COOKIE_NAME,
  verifyToken,
  generateAccessToken,
  generateRefreshToken,
  setAuthCookies,
  clearAuthCookies,
} from '@/lib/auth';
import { getAdminById } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const refreshToken = request.cookies.get(REFRESH_COOKIE_NAME)?.value;

    if (!refreshToken) {
      const response = NextResponse.json(
        { success: false, error: 'No refresh token provided.' },
        { status: 401 }
      );
      clearAuthCookies(response);
      return response;
    }

    // Verify the refresh token
    const payload = await verifyToken(refreshToken, 'refresh');
    if (!payload) {
      const response = NextResponse.json(
        { success: false, error: 'Invalid or expired refresh token.' },
        { status: 401 }
      );
      clearAuthCookies(response);
      return response;
    }

    // Check if user still exists
    const admin = await getAdminById(payload.id);
    if (!admin) {
      const response = NextResponse.json(
        { success: false, error: 'User not found.' },
        { status: 401 }
      );
      clearAuthCookies(response);
      return response;
    }

    const newPayload = {
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
    };

    const [newAccessToken, newRefreshToken] = await Promise.all([
      generateAccessToken(newPayload),
      generateRefreshToken(newPayload),
    ]);

    const response = NextResponse.json({
      success: true,
      message: 'Tokens refreshed successfully',
      data: newPayload,
    });

    setAuthCookies(response, newAccessToken, newRefreshToken);
    return response;
  } catch (error: any) {
    console.error('Token refresh error:', error);
    return NextResponse.json(
      { success: false, error: 'Error refreshing token' },
      { status: 500 }
    );
  }
}
