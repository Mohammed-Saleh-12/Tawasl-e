import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/tawasl',
});

async function testConnection() {
  try {
    const res = await pool.query('SELECT NOW()');
    console.log('Database connection successful:', res.rows[0]);

    // Print row counts for key tables
    const tables = ['articles', 'test_questions', 'faqs'];
    for (const table of tables) {
      const countRes = await pool.query(`SELECT COUNT(*) FROM ${table}`);
      console.log(`${table} count:`, countRes.rows[0].count);
    }
    process.exit(0);
  } catch (err) {
    console.error('Database connection failed:', err);
    process.exit(1);
  }
}

testConnection(); 