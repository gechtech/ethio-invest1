#!/bin/bash

# Deployment Script for Ethio Invest Network

echo "🚀 Starting deployment process..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    echo "Download from: https://nodejs.org/"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"

# Build the project
echo "🔨 Building the project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

echo "✅ Build completed successfully"

# Check if dist directory exists
if [ ! -d "dist" ]; then
    echo "❌ Build directory 'dist' not found"
    exit 1
fi

echo "✅ Build directory created"

echo ""
echo "🎉 Build completed successfully!"
echo ""
echo "Next steps:"
echo "1. Deploy your backend to Railway/Render/Heroku"
echo "2. Update the backend URL in netlify.toml"
echo "3. Deploy to Netlify using one of these methods:"
echo "   - Netlify CLI: netlify deploy --prod --dir=dist"
echo "   - Netlify Dashboard: Upload the dist folder"
echo ""
echo "Don't forget to set environment variables in Netlify!" 