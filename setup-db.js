import { Pool } from 'pg';

async function setupDatabase() {
  console.log('🔧 Setting up database...');
  
  // First, try to connect to the default postgres database
  const pool = new Pool({
    connectionString: 'postgresql://postgres@localhost:5432/postgres',
    ssl: false
  });

  try {
    // Test connection
    await pool.query('SELECT NOW()');
    console.log('✅ Connected to PostgreSQL successfully');
    
    // Create database if it doesn't exist
    try {
      await pool.query('CREATE DATABASE tawasl');
      console.log('✅ Database "tawasl" created successfully');
    } catch (error) {
      if (error.code === '42P04') {
        console.log('ℹ️ Database "tawasl" already exists');
      } else {
        throw error;
      }
    }
    
    console.log('🎉 Database setup completed!');
    console.log('You can now run: npm run dev');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    console.error('');
    console.error('🔧 Manual setup instructions:');
    console.error('1. Open pgAdmin (GUI tool) or use psql command line');
    console.error('2. Connect to your PostgreSQL server');
    console.error('3. Run: CREATE DATABASE tawasl;');
    console.error('4. Then run: npm run dev');
    console.error('');
    console.error('Alternative: Use a cloud database service like:');
    console.error('- Neon (neon.tech) - Free tier available');
    console.error('- Supabase (supabase.com) - Free tier available');
    console.error('- Railway (railway.app) - Free tier available');
  } finally {
    await pool.end();
  }
}

setupDatabase(); 