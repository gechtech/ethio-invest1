@echo off
echo ========================================
echo Fixing npm and installing dependencies
echo ========================================
echo.

echo Setting npm registry to default...
call "C:\Program Files\nodejs\npm.cmd" config set registry https://registry.npmjs.org/

echo.
echo Installing dependencies...
call "C:\Program Files\nodejs\npm.cmd" install --no-optional

if %errorlevel% neq 0 (
    echo.
    echo ❌ Installation failed. Trying alternative approach...
    echo.
    echo Clearing npm cache...
    call "C:\Program Files\nodejs\npm.cmd" cache clean --force
    
    echo.
    echo Retrying installation...
    call "C:\Program Files\nodejs\npm.cmd" install --no-optional --legacy-peer-deps
)

if %errorlevel% equ 0 (
    echo.
    echo ✅ Dependencies installed successfully!
    echo.
    echo Building project...
    call "C:\Program Files\nodejs\npm.cmd" run build
    
    if %errorlevel% equ 0 (
        echo.
        echo ✅ Build completed successfully!
        echo.
        echo 🎉 Your project is ready for deployment!
        echo.
        echo Next steps:
        echo 1. Deploy backend to Railway/Render/Heroku
        echo 2. Deploy frontend to Netlify
        echo 3. Set environment variables
    ) else (
        echo.
        echo ❌ Build failed. Check the errors above.
    )
) else (
    echo.
    echo ❌ Installation failed. Please check your internet connection.
    echo.
    echo Alternative solutions:
    echo 1. Try using a different network
    echo 2. Use a VPN if you're behind a firewall
    echo 3. Try running as administrator
)

echo.
pause 