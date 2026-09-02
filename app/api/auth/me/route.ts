import { NextRequest, NextResponse } from 'next/server';
import { ACCESS_COOKIE_NAME, REFRESH_COOKIE_NAME, verifyToken } from '@/lib/auth';
import { getAdminById } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    let accessToken = request.cookies.get(ACCESS_COOKIE_NAME)?.value;
    let payload = accessToken ? await verifyToken(accessToken, 'access') : null;

    // Fallback to refresh token if access token just expired
    if (!payload) {
      const refreshToken = request.cookies.get(REFRESH_COOKIE_NAME)?.value;
      if (refreshToken) {
        payload = await verifyToken(refreshToken, 'refresh');
      }
    }

    if (!payload) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const admin = await getAdminById(payload.id);
    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Admin account not found' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
