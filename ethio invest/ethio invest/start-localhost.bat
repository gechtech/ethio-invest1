@echo off
echo ========================================
echo Starting Ethio Invest Network on Localhost
echo ========================================
echo.

echo 🚀 Starting Backend Server (Port 5000)...
start "Backend Server" cmd /k "cd server && node server.js"

echo.
echo ⏳ Waiting 3 seconds for backend to start...
timeout /t 3 /nobreak >nul

echo.
echo 🚀 Starting Frontend Server (Port 5173)...
start "Frontend Server" cmd /k "npm run dev"

echo.
echo ⏳ Waiting 5 seconds for frontend to start...
timeout /t 5 /nobreak >nul

echo.
echo 🌐 Opening your website...
start http://localhost:5173

echo.
echo ✅ Your website is now running!
echo.
echo 📋 URLs:
echo - Frontend: http://localhost:5173
echo - Backend API: http://localhost:5000
echo.
echo 📞 To stop servers:
echo - Close the command prompt windows
echo - Or press Ctrl+C in each window
echo.
pause 