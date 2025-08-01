# Deployment Guide for Ethio Invest Network

## Prerequisites

1. **Install Node.js and npm**
   - Download and install Node.js from https://nodejs.org/ (version 18 or higher)
   - Verify installation: `node --version` and `npm --version`

2. **Install Dependencies**
   ```bash
   npm install
   ```

## Fixing Common Errors

### 1. Async/Await Error (Fixed)
The server.js file had an `await` statement outside an async function. This has been fixed by wrapping the database initialization in an async IIFE.

### 2. API Configuration
The frontend needs to be configured to work with your backend URL in production. Update the following:

#### Environment Variables
Create a `.env` file in the root directory:
```env
VITE_API_URL=https://your-backend-url.com
```

#### Update API Calls
All API calls in the frontend should use the configured base URL. The `src/config/api.ts` file has been created to handle this.

### 3. Backend Deployment
You'll need to deploy your backend separately. Options include:
- **Railway**: Easy deployment for Node.js apps
- **Render**: Free tier available
- **Heroku**: Paid service
- **Vercel**: Good for serverless functions

## Netlify Deployment Steps

### 1. Prepare for Deployment
```bash
# Install dependencies
npm install

# Build the project
npm run build
```

### 2. Deploy to Netlify

#### Option A: Netlify CLI
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy
netlify deploy --prod --dir=dist
```

#### Option B: Netlify Dashboard
1. Go to https://app.netlify.com/
2. Click "New site from Git"
3. Connect your GitHub repository
4. Set build command: `npm run build`
5. Set publish directory: `dist`
6. Add environment variables:
   - `VITE_API_URL`: Your backend URL

### 3. Environment Variables
In Netlify dashboard, go to Site settings > Environment variables and add:
- `VITE_API_URL`: Your backend URL (e.g., https://your-backend.railway.app)

### 4. Update netlify.toml
Replace `https://your-backend-url.com` in `netlify.toml` with your actual backend URL.

## Backend Deployment (Railway Example)

1. **Create Railway Account**
   - Go to https://railway.app/
   - Sign up with GitHub

2. **Deploy Backend**
   - Create new project
   - Connect your GitHub repository
   - Set root directory to `server`
   - Add environment variables:
     - `MONGODB_URI`: Your MongoDB connection string
     - `JWT_SECRET`: Your JWT secret
     - `PORT`: 5000

3. **Get Backend URL**
   - Railway will provide a URL like `https://your-app.railway.app`
   - Use this URL in your frontend environment variables

## Troubleshooting

### Build Errors
- Ensure all dependencies are installed: `npm install`
- Check for TypeScript errors: `npm run lint`
- Verify environment variables are set correctly

### API Connection Issues
- Verify backend URL is correct in environment variables
- Check CORS settings in backend
- Ensure backend is running and accessible

### Netlify Redirects
The `netlify.toml` file includes redirects for:
- API calls to your backend
- SPA routing (all routes to index.html)

## Final Steps

1. **Update Backend URL**: Replace placeholder URLs with your actual backend URL
2. **Test Deployment**: Verify all features work in production
3. **Monitor Logs**: Check Netlify and backend logs for any issues

## Support
If you encounter issues:
1. Check the browser console for frontend errors
2. Check backend logs for server errors
3. Verify all environment variables are set correctly
4. Ensure CORS is properly configured on the backend 