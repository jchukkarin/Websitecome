import { defineConfig, env } from 'prisma/config';
import { config } from 'dotenv'; // Import dotenv

// Load .env file before defining the config
config();

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: env('DATABASE_URL'), // Use the env helper to ensure it's present
  },
});
