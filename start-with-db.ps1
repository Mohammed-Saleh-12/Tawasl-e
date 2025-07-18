# Set environment variables for database connection
$env:DATABASE_URL = "postgresql://tawasl_user:tawasl_password@localhost:5433/tawasl"
$env:NODE_ENV = "development"
$env:SESSION_SECRET = "tawasl-dev-secret-key-2024"
$env:PORT = "5000"
$env:GEMINI_API_KEY = "AIzaSyAl-Uiw5S73IQzfjsZQpHordKbjA3T-2Do"

Write-Host "🚀 Starting server with database connection..." -ForegroundColor Green
Write-Host "Database URL: $env:DATABASE_URL" -ForegroundColor Yellow

# Start the server
npm run dev 