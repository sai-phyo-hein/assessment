# Vercel Deployment Guide

## Fixed Issues for Vercel Deployment

### 1. **Backend Handler Configuration**
- Fixed the Vercel handler to use `mangum` for proper ASGI to AWS Lambda conversion
- Updated `backend/main.py` with correct handler: `handler = Mangum(app)`

### 2. **File Path Issues**
- Fixed absolute path resolution for data files in Vercel's serverless environment
- Added `BASE_DIR` and `DATA_DIR` variables for proper file access
- Created `get_data_path()` helper function

### 3. **Vercel.json Configuration**
- Simplified routing to handle API calls through `/api/*` prefix
- Configured frontend static build properly
- Removed complex routing rules that could cause conflicts

### 4. **Requirements.txt Optimization**
- Simplified to essential dependencies for Vercel's Python runtime
- Added `mangum` for serverless compatibility
- Removed version constraints for better compatibility

### 5. **Frontend Environment Variables**
- Fixed hardcoded API URL in `propertypage.tsx`
- All components now use `VITE_API_BASE_URL` with `/api` fallback
- Production environment configured in `.env.production`

## Deployment Steps for Vercel

### 1. **Connect Repository**
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository

### 2. **Configure Project Settings**
- **Framework Preset**: Other
- **Root Directory**: Leave empty (monorepo setup)
- **Build Command**: Auto-detected from vercel.json
- **Output Directory**: Auto-configured

### 3. **Environment Variables**
Add in Vercel dashboard:
```
VITE_API_BASE_URL=/api
```

### 4. **Deploy**
- Click "Deploy"
- Vercel will build both frontend and backend automatically

## File Structure Changes

```
/
├── backend/
│   ├── main.py          # ✅ Updated with proper handler
│   ├── requirements.txt # ✅ Simplified for Vercel
│   └── data/           # ✅ Accessed with absolute paths
├── frontend/
│   ├── .env.production # ✅ API URL configuration
│   └── src/           # ✅ All API calls use /api prefix
├── vercel.json         # ✅ Optimized routing
├── .vercelignore      # ✅ Exclude unnecessary files
└── DEPLOYMENT.md      # 📝 This guide
```

## API Endpoints After Deployment

All backend endpoints will be accessible via:
```
https://your-app.vercel.app/api/[endpoint]
```

Examples:
- `https://your-app.vercel.app/api/health`
- `https://your-app.vercel.app/api/properties`
- `https://your-app.vercel.app/api/reviews`

## Testing After Deployment

1. **Health Check**: `GET /api/health`
2. **Properties**: `GET /api/properties`
3. **Reviews**: `GET /api/reviews`
4. **Images**: `GET /api/images/{folder_id}`

## Common Issues & Solutions

### Issue: 500 Error on API Calls
- **Cause**: File path issues or missing dependencies
- **Solution**: Check Vercel function logs in dashboard

### Issue: CORS Errors
- **Solution**: Already configured with `allow_origins=["*"]`

### Issue: Static Files Not Loading
- **Solution**: Check vercel.json routing configuration

### Issue: Environment Variables Not Working
- **Solution**: Ensure `VITE_API_BASE_URL=/api` is set in Vercel dashboard

## Monitoring

- Check Vercel dashboard for:
  - Function logs
  - Build logs
  - Performance metrics
  - Error tracking
