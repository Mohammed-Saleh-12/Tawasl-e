import { config } from 'dotenv';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('Current working directory:', process.cwd());
console.log('Script directory:', __dirname);

// Try different paths for .env
const envPaths = [
  resolve(process.cwd(), '.env'),
  resolve(__dirname, '.env'),
  resolve(__dirname, '..', '.env'),
  '.env'
];

console.log('Looking for .env in these paths:');
envPaths.forEach(path => {
  console.log('  -', path);
});

// Load environment variables
config({ path: resolve(process.cwd(), '.env') });

console.log('\nEnvironment variables:');
console.log('DATABASE_URL:', process.env.DATABASE_URL);
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('SESSION_SECRET:', process.env.SESSION_SECRET);
console.log('PORT:', process.env.PORT); 