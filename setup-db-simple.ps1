# Simple database setup script
Write-Host "Setting up database..." -ForegroundColor Green

# Create user and database
docker exec tawasl-postgres psql -U postgres -c "CREATE USER tawasl_user WITH PASSWORD 'tawasl_password';" 2>$null
docker exec tawasl-postgres psql -U postgres -c "CREATE DATABASE tawasl OWNER tawasl_user;" 2>$null
docker exec tawasl-postgres psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE tawasl TO tawasl_user;" 2>$null

Write-Host "Database setup complete!" -ForegroundColor Green 