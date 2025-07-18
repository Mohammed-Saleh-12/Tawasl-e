// Export the database instance based on environment
import { db as dbNeon } from './db-neon.js';
import { db as dbLocal } from './db-local.js';

const db = process.env.NODE_ENV === 'production' ? dbNeon : dbLocal;

export { db };