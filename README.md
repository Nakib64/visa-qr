# 🇲🇳 Mongolia Electronic Visa Verification & Administration Portal

An enterprise-grade, high-fidelity **Electronic Visa Verification, Document Generation & Administrative Management System** built with **Next.js 16 (App Router)**, **React 19**, **Tailwind CSS v4**, **PostgreSQL**, and **Sharp**.

Modeled after the official standards of the **Immigration Agency of Mongolia (Иргэний Харьяалал, Шилжилт Хөдөлгөөний Ерөнхий Газар)**.

---

## ✨ Features

- 🔍 **Public eVisa Verification Portal**: Instant online clearance lookup by Electronic Visa Number, Applicant ID, or Passport Number.
- 📄 **Pixel-Perfect A4 Document Generator**: Exact millimeter-based A4 layout (`210mm × 297mm`) with an edge-to-edge official header banner, biometric photo, and dynamic scannable QR verification code.
- 🖨️ **Single-Page Print Engine**: Built-in `@page { size: A4 portrait; margin: 0; }` stylesheet preventing page splits and header cutoff.
- 🔐 **Secure Administrative Suite**:
  - **Email & Password Authentication**: Salted `bcrypt` password hashing.
  - **Dual JWT Token System**: Short-lived Access Token (15m) + Long-lived Refresh Token (7d) in `HttpOnly`, `SameSite=Lax` cookies.
  - **IP Rate Limiting & 5-Minute Lockout**: 5 failed password attempts within 5 minutes automatically blocks the client IP for 5 minutes (`429 Too Many Requests`) with live countdown timer.
  - **Middleware Authorization**: Protects `/admin/*` routes and sensitive API mutations.
- 🖼️ **Backend Image Compression**:
  - Auto-rotates mobile photos using EXIF orientation.
  - Proportional resizing to passport photo dimensions (`600 × 750px max`).
  - Converts images to `.webp` at `82%` quality with `sharp` (~95% bandwidth reduction).
  - Physical file storage in `public/uploads/` with public URLs stored in PostgreSQL.
- 🗄️ **Modular Database Layer**: PostgreSQL client pool with smart SSL detection (disables SSL for VPS localhost, enables SSL for cloud DBs) + automatic schema creation and local store fallback.

---

## 🛠️ Tech Stack

| Component | Technology |
|---|---|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router, Turbopack) |
| **Frontend** | [React 19](https://react.dev/), [Tailwind CSS v4](https://tailwindcss.com/), [Lucide React](https://lucide.dev/) |
| **Database** | [PostgreSQL](https://www.postgresql.org/) (`pg` connection pool) |
| **Authentication** | [Bcrypt.js](https://github.com/dcodeIO/bcrypt.js), [Jose](https://github.com/panva/jose) (JWT) |
| **Image Processing** | [Sharp](https://sharp.pixelplumbing.com/) (high-speed image compression & WebP conversion) |
| **QR Code Engine** | [QRCode](https://github.com/soldair/node-qrcode) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) |

---

## 📁 Project Structure

```text
├── app/
│   ├── admin/
│   │   ├── login/page.tsx      # Staff Login interface with rate-limiting countdown
│   │   └── page.tsx            # Admin records management dashboard
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/route.ts   # Authenticates & sets HttpOnly cookies
│   │   │   ├── logout/route.ts  # Clears authentication cookies
│   │   │   ├── me/route.ts      # Returns current authenticated admin session
│   │   │   └── refresh/route.ts # Rotates access & refresh tokens
│   │   ├── upload/route.ts      # Backend image compression & storage with Sharp
│   │   └── visas/
│   │       ├── route.ts         # GET (all visas) & POST (create visa)
│   │       └── [id]/route.ts    # GET, PUT, DELETE individual visa
│   ├── visa/
│   │   └── [id]/page.tsx        # Public document view & printable page
│   ├── globals.css              # Global styles & A4 print CSS engine
│   └── page.tsx                 # Public verification portal homepage
├── components/
│   ├── AdminForm.tsx            # Visa creator/editor with live A4 preview & image upload
│   ├── ResponsiveVisaViewer.tsx # Fluid zoom/scale preview for mobile & desktop
│   ├── VisaDocument.tsx         # Official Mongolian eVisa A4 document layout
│   └── VisaSearchForm.tsx       # Public search & verification form
├── lib/
│   ├── auth.ts                  # JWT signing/verification, bcrypt hashing & cookie helpers
│   ├── db.ts                    # Database barrel entry point
│   ├── db/
│   │   ├── connection.ts        # PostgreSQL pool & table auto-initialization
│   │   ├── visas.ts             # Visa CRUD database operations
│   │   ├── admins.ts            # Admin user queries & default seeding
│   │   └── rate-limit.ts        # IP rate limiting & temporary lockouts
│   ├── qr.ts                    # QR code generator utility
│   └── types.ts                 # TypeScript interfaces and default schemas
├── middleware.ts                # Next.js Edge middleware route protection
├── public/
│   ├── mongolia-header-banner.png # Official government banner
│   └── uploads/                 # Storage directory for compressed applicant photos
├── .env.example                 # Production environment configuration template
└── HOSTINGER_VPS_DEPLOYMENT.md  # Step-by-step VPS deployment guide
```

---

## 🚀 Getting Started (Local Development)

### 1. Clone the repository
```bash
git clone https://github.com/Nakib64/visa-qr.git
cd visa-qr
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Copy the `.env.example` file:
```bash
cp .env.example .env
```

Set your values in `.env`:
```env
# Optional: If you have a local or cloud PostgreSQL database
DATABASE_URL=postgresql://postgres:password@localhost:5432/visa_db

# JWT Secret for session authentication
JWT_SECRET=your-super-secure-random-jwt-secret-key-2026

# Default Admin Credentials
ADMIN_EMAIL=admin@immigration.gov.mn
ADMIN_PASSWORD=Admin@123456

NODE_ENV=development
```
*(Note: If `DATABASE_URL` is omitted, the app automatically falls back to local JSON storage in `data/`).*

### 4. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the portal.

---

## 🔐 Default Administrator Access

- **Login URL**: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
- **Email**: `admin@immigration.gov.mn`
- **Password**: `Admin@123456`

*(Automatically seeded into the database on first run. Can be customized via `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `.env`).*

---

## 🛡️ Security & Protection Matrix

| Feature | Mechanism |
|---|---|
| **Password Storage** | 10-round salted `bcrypt` hashing |
| **Session Storage** | `HttpOnly`, `SameSite=Lax`, `Secure` cookies (immune to XSS token theft) |
| **Token Expiry** | 15-minute Access Token + 7-day Refresh Token with automatic rotation |
| **Brute-Force Defense** | 5 consecutive failed password attempts within 5 minutes locks IP for 5 minutes |
| **API Authorization** | Next.js Edge Middleware guarding all write endpoints and data bulk export |
| **File Upload Safety** | MIME-type validation, 2MB size cap, and re-encoding via `sharp` |

---

## 🌐 Production VPS Deployment (Hostinger KVM 1)

For detailed, step-by-step instructions on deploying to **Hostinger KVM 1 VPS** (Ubuntu, PostgreSQL, Node.js 20, PM2 auto-restart, Nginx reverse proxy, and free Let's Encrypt SSL), please see the **[HOSTINGER_VPS_DEPLOYMENT.md](file:///e:/Web%20Dev/Freelance/shawonvaia/HOSTINGER_VPS_DEPLOYMENT.md)** guide.

---

## 📜 License

Private & Commercial License for Freelance Client. All rights reserved.
