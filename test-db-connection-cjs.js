const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Load .env.local manually
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf8');
    envConfig.split('\n').forEach(line => {
        const match = line.match(/^([^=]+)=(.*)$/);
        if (match) {
            // Simple parsing, ignoring comments and complex quotes for now
            if (line.trim().startsWith('#')) return;
            const key = match[1].trim();
            let value = match[2].trim();
            if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
                value = value.slice(1, -1);
            }
            process.env[key] = value;
        }
    });
}

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

console.log("Connecting to:", process.env.DATABASE_URL ? process.env.DATABASE_URL.replace(/:[^:]+@/, ':****@') : "UNDEFINED");

pool.query('SELECT 1')
    .then(() => {
        console.log("✅ Connection successful");
        pool.end();
    })
    .catch(err => {
        console.error("❌ Connection failed:", err);
        pool.end();
    });
