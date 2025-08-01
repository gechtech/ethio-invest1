@echo off
echo ========================================
echo Backend Deployment Guide
echo ========================================
echo.

echo 🚀 Deploy Backend to Railway:
echo.
echo 1. Go to https://railway.app/
echo 2. Sign up with GitHub
echo 3. Click "New Project"
echo 4. Choose "Deploy from GitHub repo"
echo 5. Select your repository
echo 6. Set root directory to: server
echo 7. Add environment variables:
echo    - MONGODB_URI: mongodb://localhost:27017/ethio-invest
echo    - JWT_SECRET: mysecret123
echo    - PORT: 5000
echo.

echo 📋 What you'll get:
echo - Backend API URL (e.g., https://your-app.railway.app)
echo - Database connection
echo - Authentication system
echo - Investment management
echo.

echo Press any key to open Railway...
pause
start https://railway.app/ 