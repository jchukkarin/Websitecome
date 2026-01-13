// Test database connection
import dotenv from "dotenv";
import { Pool } from "pg";

// Explicitly load .env file
dotenv.config();

const connectionString = process.env.DATABASE_URL;

console.log("Testing DATABASE_URL from .env file...");
console.log("Connection string:", connectionString?.replace(/:[^:@]+@/, ":****@")); // Hide password

const pool = new Pool({ connectionString });

pool.query("SELECT 1 as test")
    .then(() => {
        console.log("✅ Database connection successful!");
        process.exit(0);
    })
    .catch((err) => {
        console.error("❌ Database connection failed:");
        console.error(err.message);
        process.exit(1);
    })
    .finally(() => {
        pool.end();
    });
