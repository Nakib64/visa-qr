import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'mongolia-evisa-admin-secret-key-super-secure-2026';
const secretKey = new TextEncoder().encode(JWT_SECRET);

const ACCESS_COOKIE_NAME = 'admin_access_token';
const REFRESH_COOKIE_NAME = 'admin_refresh_token';

async function verifyJwt(token?: string, expectedType: 'access' | 'refresh' = 'access') {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secretKey);
    if (payload.tokenType !== expectedType) return null;
    return payload;
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const method = request.method;

  const accessToken = request.cookies.get(ACCESS_COOKIE_NAME)?.value;
  const refreshToken = request.cookies.get(REFRESH_COOKIE_NAME)?.value;

  // Verify access token first, fallback to refresh token if access token expired
  let isAuthenticated = false;
  const accessPayload = await verifyJwt(accessToken, 'access');
  if (accessPayload) {
    isAuthenticated = true;
  } else {
    const refreshPayload = await verifyJwt(refreshToken, 'refresh');
    if (refreshPayload) {
      isAuthenticated = true;
    }
  }

  // 1. Handle Admin UI Pages (/admin, /admin/*)
  if (pathname.startsWith('/admin')) {
    // If user is accessing the login page
    if (pathname === '/admin/login') {
      if (isAuthenticated) {
        // Already logged in -> redirect to admin dashboard
        return NextResponse.redirect(new URL('/admin', request.url));
      }
      return NextResponse.next();
    }

    // Any other /admin route requires authentication
    if (!isAuthenticated) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  }

  // 2. Handle Protected Administrative API Routes
  // Protect:
  // - GET /api/visas (bulk list of all visas)
  // - POST /api/visas (create visa)
  // - PUT /api/visas/:id (update visa)
  // - DELETE /api/visas/:id (delete visa)
  const isBulkVisasGet = pathname === '/api/visas' && method === 'GET';
  const isVisaMutation = pathname.startsWith('/api/visas') && ['POST', 'PUT', 'DELETE'].includes(method);

  if (isBulkVisasGet || isVisaMutation) {
    if (!isAuthenticated) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized: Valid administrative session token required.',
        },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public assets (images, svg, etc.)
     */
    '/admin/:path*',
    '/api/visas/:path*',
    '/api/visas',
  ],
};
