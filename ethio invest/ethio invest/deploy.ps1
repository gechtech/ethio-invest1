# Deployment Script for Ethio Invest Network (PowerShell)

Write-Host "🚀 Starting deployment process..." -ForegroundColor Green

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js is installed: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js is not installed. Please install Node.js first." -ForegroundColor Red
    Write-Host "Download from: https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# Check if npm is installed
try {
    $npmVersion = npm --version
    Write-Host "✅ npm is installed: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ npm is not installed. Please install npm first." -ForegroundColor Red
    exit 1
}

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Dependencies installed successfully" -ForegroundColor Green

# Build the project
Write-Host "🔨 Building the project..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Build completed successfully" -ForegroundColor Green

# Check if dist directory exists
if (-not (Test-Path "dist")) {
    Write-Host "❌ Build directory 'dist' not found" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Build directory created" -ForegroundColor Green

Write-Host ""
Write-Host "🎉 Build completed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Deploy your backend to Railway/Render/Heroku" -ForegroundColor White
Write-Host "2. Update the backend URL in netlify.toml" -ForegroundColor White
Write-Host "3. Deploy to Netlify using one of these methods:" -ForegroundColor White
Write-Host "   - Netlify CLI: netlify deploy --prod --dir=dist" -ForegroundColor White
Write-Host "   - Netlify Dashboard: Upload the dist folder" -ForegroundColor White
Write-Host ""
Write-Host "Don't forget to set environment variables in Netlify!" -ForegroundColor Yellow 