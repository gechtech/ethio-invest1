@echo off
echo ========================================
echo Ethio Invest Network - Quick Setup
echo ========================================
echo.

echo Checking if Node.js is installed...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo ❌ Node.js is not installed!
    echo.
    echo Please install Node.js first:
    echo 1. Go to https://nodejs.org/
    echo 2. Download the LTS version (18.x or higher)
    echo 3. Run the installer
    echo 4. Restart this script
    echo.
    echo After installing Node.js, run this script again.
    pause
    exit /b 1
)

echo ✅ Node.js is installed!
echo.

echo Checking npm...
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not available!
    echo Please reinstall Node.js properly.
    pause
    exit /b 1
)

echo ✅ npm is available!
echo.

echo Installing dependencies...
npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies!
    pause
    exit /b 1
)

echo ✅ Dependencies installed successfully!
echo.

echo Building the project...
npm run build
if %errorlevel% neq 0 (
    echo ❌ Build failed!
    pause
    exit /b 1
)

echo ✅ Build completed successfully!
echo.

echo ========================================
echo 🎉 Project is ready for deployment!
echo ========================================
echo.
echo Next steps:
echo 1. Deploy backend to Railway/Render/Heroku
echo 2. Deploy frontend to Netlify
echo 3. Set environment variables
echo.
echo See DEPLOYMENT.md for detailed instructions.
echo.
pause 