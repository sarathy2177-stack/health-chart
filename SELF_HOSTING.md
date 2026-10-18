# 🚀 Self-Hosting Guide for BEN Healthcare Web Application

This guide explains how to self-host and deploy this application on your local network (LAN / Wi-Fi) or a private server so other users and devices can access and use it.

---

## 📋 Architecture Overview

- **Frontend & API**: Next.js 16 (App Router)
- **Authentication**: Better Auth (Email & Password, Session Cookies)
- **Database**: PostgreSQL (with Drizzle ORM)
- **Port**: `3000` (Web) & `5432` (PostgreSQL)

---

## ⚡ Option 1: Quick Self-Hosting on Windows (Direct Node.js)

Your machine's current Wi-Fi IP address is: **`10.200.190.20`**

### Step 1: Install Dependencies
Open PowerShell in this project folder and run:
```powershell
npm install
```

### Step 2: Set Up Database & Environment Variables
Create a file named `.env` in the project root (you can copy `.env.example`):
```env
# Database connection:
# You can use a local PostgreSQL instance or a free cloud PostgreSQL (e.g. Neon.tech / Supabase)
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/ben_health"

# Set this to your local network IP so devices on the same Wi-Fi can log in:
BETTER_AUTH_URL="http://10.200.190.20:3000"

# Any random string for signing auth tokens:
BETTER_AUTH_SECRET="ben_random_auth_secret_key_2026_xyz123"

# Allow access from both localhost and your network IP:
TRUSTED_ORIGINS="http://localhost:3000,http://10.200.190.20:3000"
```

> **💡 Quick Free Database (0 installation needed)**: If you don't have PostgreSQL installed locally, create a free database at [neon.tech](https://neon.tech) in 30 seconds and paste the connection string into `DATABASE_URL`.

### Step 3: Initialize Database Tables
Run the migration script to create all required tables (`user`, `session`, `account`, `verification`, `profile`):
```powershell
npm run db:init
```

### Step 4: Allow Port 3000 in Windows Firewall
To allow other devices (smartphones, laptops on your Wi-Fi) to connect:
Open PowerShell as **Administrator** and run:
```powershell
New-NetFirewallRule -DisplayName "BEN Healthcare App (Port 3000)" -Direction Inbound -LocalPort 3000 -Protocol TCP -Action Allow
```

### Step 5: Start the Application for the Network
For production mode (recommended):
```powershell
npm run build
npm run host
```
Or for development mode:
```powershell
npm run dev:host
```

### 📱 How to Access:
- **On this computer**: `http://localhost:3000`
- **On any phone, tablet, or PC on your Wi-Fi**: `http://10.200.190.20:3000`

---

## 🐳 Option 2: 1-Click Containerized Self-Hosting (Docker)

If you have or install Docker Desktop on Windows, or deploy to a Linux server/VPS:

1. Edit `docker-compose.yml` if you need to update `BETTER_AUTH_URL` with your server IP or domain.
2. Run:
```bash
docker compose up -d
```
Docker will automatically:
- Start PostgreSQL with persistent storage in `pgdata`.
- Automatically initialize all database tables via `scripts/init-db.sql`.
- Build and run the Next.js production standalone server on port 3000.
- Restart automatically if the server reboots.

To stop:
```bash
docker compose down
```

---

## 🔄 Option 3: Run 24/7 in the Background on Windows (PM2)

To keep the application running continuously in the background without keeping a PowerShell window open:

1. Install PM2 globally:
```powershell
npm install -g pm2
```
2. Start the app in the background:
```powershell
pm2 start npm --name "ben-health" -- run host
```
3. Useful PM2 commands:
- Check status: `pm2 status`
- View live logs: `pm2 logs ben-health`
- Restart app: `pm2 restart ben-health`
- Stop app: `pm2 stop ben-health`

---

## 🌐 Option 4: Free Public HTTPS Access (Cloudflare Tunnel)

To let users access the app from anywhere outside your local Wi-Fi without doing router port-forwarding or paying for a static IP:

1. Download [cloudflared for Windows](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/downloads/).
2. Run a free instant HTTPS tunnel to your local app:
```powershell
cloudflared tunnel --url http://localhost:3000
```
3. Cloudflare will give you a public URL (e.g. `https://random-words.trycloudflare.com`).
4. Update `BETTER_AUTH_URL` in your `.env` to that URL so logins work across the internet!
