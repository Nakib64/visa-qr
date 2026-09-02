# Hostinger KVM 1 VPS Deployment Guide

This guide walks you through deploying the **Mongolia Electronic Visa Verification & Administration Portal** on a **Hostinger KVM 1 VPS** running Ubuntu 22.04 / 24.04 LTS with PostgreSQL, Node.js 20, PM2, Nginx, and free SSL (Certbot / Let's Encrypt).

---

## 1. Initial VPS Setup & Node.js Installation

SSH into your Hostinger KVM VPS:
```bash
ssh root@YOUR_SERVER_IP
```

Update system packages:
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl git ufw nginx
```

Install **Node.js 20 LTS** and **PM2**:
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
sudo npm install -g pm2
```

Verify installations:
```bash
node -v   # v20.x.x
npm -v    # 10.x.x
pm2 -v
```

---

## 2. Install and Configure PostgreSQL on VPS

Install PostgreSQL server:
```bash
sudo apt install -y postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

Create the application database and user:
```bash
sudo -u postgres psql
```

Inside the PostgreSQL prompt:
```sql
CREATE DATABASE visa_db;
CREATE USER visa_user WITH ENCRYPTED PASSWORD 'YourStrongDbPassword';
GRANT ALL PRIVILEGES ON DATABASE visa_db TO visa_user;
ALTER DATABASE visa_db OWNER TO visa_user;
\q
```

---

## 3. Clone and Build the Application

Clone your GitHub repository:
```bash
cd /var/www
git clone https://github.com/Nakib64/visa-qr.git visa-app
cd visa-app
```

Create and configure your `.env` file:
```bash
cp .env.example .env
nano .env
```

Set your production variables in `.env`:
```env
DATABASE_URL="postgresql://visa_user:YourStrongDbPassword@localhost:5432/visa_db"
JWT_SECRET="generate-a-strong-random-64-character-secret-key"
ADMIN_EMAIL="admin@immigration.gov.mn"
ADMIN_PASSWORD="YourStrongAdminPassword123!"
NODE_ENV="production"
PORT=3000
```

Save with `Ctrl+O`, `Enter`, and exit with `Ctrl+X`.

Install dependencies and build the Next.js project:
```bash
npm install
npm run build
```

---

## 4. Start the Application with PM2 (Auto-Restart on Reboot)

Start Next.js using PM2:
```bash
pm2 start npm --name "visa-app" -- start
pm2 save
pm2 startup
```
*(Copy and run the `pm2 startup` command output if prompted).*

---

## 5. Configure Nginx Reverse Proxy

Create an Nginx server block:
```bash
sudo nano /etc/nginx/sites-available/visa
```

Paste the following configuration (replace `yourdomain.com` with your domain or VPS IP):
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    client_max_body_size 10M;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable the configuration and restart Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/visa /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## 6. Install Free SSL Certificate (HTTPS)

Install Certbot for Let's Encrypt:
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

---

## 7. Firewall (UFW) Configuration

Allow SSH, HTTP, and HTTPS:
```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

---

## 8. Updating / Redeploying in the Future

Whenever you push new changes to GitHub, update your VPS with:
```bash
cd /var/www/visa-app
git pull origin main
npm install
npm run build
pm2 restart visa-app
```
