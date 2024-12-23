import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
    dialect: 'postgresql',
    out: './drizzle',
    schema: './lib/db/schemas.ts',
    dbCredentials: {
        url: process.env.DATABASE_URL!,
    },
});
