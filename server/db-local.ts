import 'dotenv/config';
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";

const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL || "postgresql://tawasl_user:tawasl_password@localhost:5432/tawasl",
  ssl: false // Disable SSL for local development
});

export const db = drizzle(pool, { schema });
export { pool }; 
