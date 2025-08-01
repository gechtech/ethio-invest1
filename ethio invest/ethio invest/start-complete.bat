@echo off
echo ========================================
echo Ethio Invest Network - Complete Setup
echo ========================================
echo.

echo 🔧 Checking Node.js version...
node --version
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ from https://nodejs.org/
    pause
    exit /b 1
)

echo.
echo 🧹 Cleaning up old files...
if exist node_modules rmdir /s /q node_modules
if exist package-lock.json del package-lock.json
if exist .env del .env

echo.
echo 📦 Installing dependencies...
npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo 🔧 Creating environment file...
(
echo # Server Configuration
echo PORT=5000
echo NODE_ENV=development
echo.
echo # Database Configuration
echo MONGODB_URI=mongodb://localhost:27017/ethio-invest
echo.
echo # JWT Configuration
echo JWT_SECRET=local-dev-secret-key-change-in-production
echo.
echo # File Upload Configuration
echo UPLOAD_PATH=./server/uploads
echo MAX_FILE_SIZE=5242880
echo.
echo # Cloudinary Configuration ^(optional for local development^)
echo CLOUDINARY_CLOUD_NAME=your-cloud-name
echo CLOUDINARY_API_KEY=your-api-key
echo CLOUDINARY_API_SECRET=your-api-secret
) > .env

echo ✅ Environment file created successfully!
echo.

echo 🚀 Starting Backend Server (Port 5000)...
start "Backend Server" cmd /k "npm run server"

echo.
echo ⏳ Waiting 8 seconds for backend to start...
timeout /t 8 /nobreak >nul

echo.
echo 🚀 Starting Frontend Server (Port 5173)...
start "Frontend Server" cmd /k "npm run client"

echo.
echo ⏳ Waiting 5 seconds for frontend to start...
timeout /t 5 /nobreak >nul

echo.
echo 🌐 Opening your website...
start http://localhost:5173

echo.
echo ✅ Ethio Invest Network is now running!
echo.
echo 📋 URLs:
echo - Frontend: http://localhost:5173
echo - Backend API: http://localhost:5000
echo.
echo 🔑 Default Admin Login:
echo - Email: admin@ethioinvest.com
echo - Password: admin123
echo.
echo 📞 To stop servers:
echo - Close the command prompt windows
echo - Or press Ctrl+C in each window
echo.
echo 🔧 Note: Make sure MongoDB is running locally or update MONGODB_URI in .env
echo.
echo 🎉 Setup complete! Your website should be accessible at http://localhost:5173
echo.
pause 