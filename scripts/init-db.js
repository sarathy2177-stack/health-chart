const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

// Basic .env parser if dotenv is not installed
function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env');
  const envLocalPath = path.join(__dirname, '..', '.env.local');

  for (const file of [envLocalPath, envPath]) {
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file, 'utf-8');
      for (const line of content.split('\n')) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#')) {
          const eqIdx = trimmed.indexOf('=');
          if (eqIdx !== -1) {
            const key = trimmed.slice(0, eqIdx).trim();
            let val = trimmed.slice(eqIdx + 1).trim();
            if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
              val = val.slice(1, -1);
            }
            if (!process.env[key]) {
              process.env[key] = val;
            }
          }
        }
      }
    }
  }
}

loadEnv();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('\x1b[31m%s\x1b[0m', 'Error: DATABASE_URL is not defined in your environment or .env file.');
  console.error('Please configure DATABASE_URL in .env before running db:init.');
  process.exit(1);
}

const pool = new Pool({
  connectionString,
  ssl:
    connectionString.includes('sslmode=require') ||
    connectionString.includes('neon.tech') ||
    connectionString.includes('supabase.co') ||
    connectionString.includes('render.com') ||
    connectionString.includes('railway.app')
      ? { rejectUnauthorized: false }
      : undefined,
});

async function main() {
  console.log('Connecting to database...');
  const client = await pool.connect();
  try {
    const sqlFile = path.join(__dirname, 'init-db.sql');
    const sql = fs.readFileSync(sqlFile, 'utf-8');
    console.log('Applying database schema...');
    await client.query(sql);
    console.log('\x1b[32m%s\x1b[0m', '✓ Database tables (user, session, account, verification, profile) initialized successfully!');
  } catch (err) {
    console.error('\x1b[31m%s\x1b[0m', 'Database initialization failed:');
    console.error(err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

main();
