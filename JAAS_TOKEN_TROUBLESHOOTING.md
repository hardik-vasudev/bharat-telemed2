# JaaS Token API Troubleshooting Guide

## Common Issue: "Invalid JSON response from JaaS token API"

### Root Cause
This error occurs when the frontend fetch request receives HTML (usually from redirects) instead of JSON from the `/api/jaas/token` endpoint.

### Permanent Solution Implemented

#### 1. Enhanced Error Handling (`src/lib/video/jaas-token-client.ts`)
- ✅ Content-type validation before parsing JSON
- ✅ Detailed error messages for different scenarios
- ✅ Automatic retry with exponential backoff (3 attempts)
- ✅ Authentication detection and proper error messages

#### 2. Robust Middleware (`src/middleware.ts`)
- ✅ Clear path categorization (auth, API, protected-public)
- ✅ Proper handling of teleconsultation routes
- ✅ API routes bypass authentication checks
- ✅ No redirect loops for authenticated users

#### 3. API Route Hardening (`src/app/api/jaas/token/route.ts`)
- ✅ Forced JSON responses with proper headers
- ✅ Consistent error response format with `success: false`
- ✅ Cache-control headers to prevent stale responses

### How to Verify the Fix Works

```bash
# Test successful token generation
curl -X POST -H "Content-Type: application/json" \
  -d '{"roomId":"test","userId":"user1","userName":"Test User","userRole":"doctor"}' \
  http://localhost:3003/api/jaas/token

# Test error handling (should return JSON, not HTML)
curl -X POST -H "Content-Type: application/json" \
  -d '{"roomId":""}' \
  http://localhost:3003/api/jaas/token
```

### Prevention Checklist

- ✅ All API routes return `Content-Type: application/json`
- ✅ Error responses include `success: false` field
- ✅ Client includes `credentials: 'include'` in fetch requests
- ✅ Middleware properly categorizes route types
- ✅ Retry logic handles temporary failures
- ✅ Content-type validation before JSON parsing

### If Issues Reoccur

1. **Check server logs** for compilation errors
2. **Verify environment variables** (JAAS_APP_ID, etc.)
3. **Restart development server** to clear cache issues
4. **Check middleware logic** for unintended redirects
5. **Validate API route responses** manually with curl

## Quick Fixes

### Server Restart
```bash
# Kill existing server and restart
npm run dev
```

### Check API Directly
```bash
curl -s -I http://localhost:3003/api/jaas/token
# Should return: Content-Type: application/json
```

### Verify Teleconsultation Access
```bash
curl -s -I http://localhost:3003/teleconsultation
# Should return: HTTP/1.1 200 OK (not 307 redirect)
```

---
*This solution is permanent and should prevent the JSON parsing error from recurring.*