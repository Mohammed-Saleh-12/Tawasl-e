@echo off
echo 🚀 Starting Educational Network Platform...
echo.
echo 📡 Starting Backend Server...
start "Backend Server" cmd /k "npm run dev"
timeout /t 3 /nobreak >nul
echo.
echo 🎨 Starting Frontend Server...
start "Frontend Server" cmd /k "cd client && npm run dev"
echo.
echo ⏳ Waiting for servers to start...
timeout /t 5 /nobreak >nul
echo.
echo 🎉 Platform startup complete!
echo 📱 Frontend: http://localhost:5173
echo 🔧 Backend: http://localhost:5000
echo 📊 Database: localhost:5433
echo.
echo Press any key to exit...
pause >nul 