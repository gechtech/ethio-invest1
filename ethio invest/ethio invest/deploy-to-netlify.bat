@echo off
echo ========================================
echo Deploy to Netlify - Step by Step
echo ========================================
echo.

echo ✅ Your project is ready for deployment!
echo.
echo 📁 Your dist folder contains:
dir dist /B
echo.

echo 🚀 Next Steps:
echo.
echo 1. Go to https://app.netlify.com/
echo 2. Click "Add new site"
echo 3. Choose "Deploy manually"
echo 4. Drag and drop the 'dist' folder
echo 5. Wait for deployment (1-2 minutes)
echo 6. Your site will be live!
echo.

echo 📋 What you'll get:
echo - A live website (e.g., https://your-app.netlify.app)
echo - Automatic HTTPS
echo - Global CDN
echo - Custom domain support
echo.

echo 🔧 Environment Variables to add later:
echo - VITE_API_URL = your backend URL
echo.

echo 📞 Need help?
echo - Check Netlify documentation
echo - Look at DEPLOY_NOW.md for detailed steps
echo.

echo Press any key to open Netlify...
pause
start https://app.netlify.com/ 