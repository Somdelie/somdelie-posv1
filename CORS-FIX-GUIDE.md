# 🔧 CORS & Environment Variable Fix Guide

## Issues Identified

### 1. ❌ Environment Variable Not Set on Vercel

**Error**: App is still trying to connect to `http://localhost:5000`  
**Cause**: `NEXT_PUBLIC_API_URL` environment variable not configured on Vercel

### 2. ❌ CORS Policy Blocking Requests

**Error**: `Access to XMLHttpRequest at 'http://localhost:5000/auth/login' from origin 'https://somdelie-posv1-hgpco1oyv-somdelies-projects.vercel.app' has been blocked by CORS policy`  
**Cause**: Spring Boot backend only allows `localhost:3000` and `localhost:5173`, but Vercel deployment domain is not in the allowed origins

## Solutions

### Part 1: Fix Backend CORS Configuration

#### Step 1: Update SecurityConfig.java

**File**: `src/main/java/com/somdelie_pos/somdelie_pos/configuration/SecurityConfig.java`

**Current CORS configuration (lines 68-72)**:

```java
cfg.setAllowedOrigins(Arrays.asList(
    "http://localhost:5173",
    "http://localhost:3000"
));
```

**Change to**:

```java
cfg.setAllowedOrigins(Arrays.asList(
    "http://localhost:5173",
    "http://localhost:3000",
    "https://somdelie-posv1.vercel.app",                           // Production domain
    "https://somdelie-posv1-hgpco1oyv-somdelies-projects.vercel.app",  // Preview deployment
    "https://*.vercel.app"                                          // All Vercel preview deployments
));
```

**Or use environment variable (Better approach)**:

```java
// Get allowed origins from environment variable, fallback to localhost
String allowedOriginsEnv = System.getenv("ALLOWED_ORIGINS");
List<String> allowedOrigins;

if (allowedOriginsEnv != null && !allowedOriginsEnv.isEmpty()) {
    allowedOrigins = Arrays.asList(allowedOriginsEnv.split(","));
} else {
    // Default for local development
    allowedOrigins = Arrays.asList(
        "http://localhost:5173",
        "http://localhost:3000"
    );
}

cfg.setAllowedOrigins(allowedOrigins);
```

#### Step 2: Add Environment Variable on Render (Backend)

1. Go to [render.com/dashboard](https://render.com/dashboard)
2. Click on your `somdelie-pos` service
3. Go to **Environment** tab
4. Add new environment variable:
   - **Key**: `ALLOWED_ORIGINS`
   - **Value**: `http://localhost:5173,http://localhost:3000,https://somdelie-posv1.vercel.app,https://somdelie-posv1-hgpco1oyv-somdelies-projects.vercel.app`
5. Click **Save Changes**

#### Step 3: Rebuild and Push Backend

```bash
cd C:\Users\dell\Desktop\java-builds\somdelie-pos

# Build the project
mvn clean package -DskipTests

# Build Docker image with new version
docker build -t somdelie/somdelie-pos:2.0.2 .
docker tag somdelie/somdelie-pos:2.0.2 somdelie/somdelie-pos:latest

# Push to Docker Hub
docker push somdelie/somdelie-pos:2.0.2
docker push somdelie/somdelie-pos:latest
```

#### Step 4: Deploy Backend on Render

1. Go to Render dashboard
2. Click on `somdelie-pos` service
3. Click **Manual Deploy** → **Deploy latest commit**
4. Wait for deployment to complete

---

### Part 2: Fix Frontend Environment Variable

#### Step 1: Set Environment Variable on Vercel

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click on your `somdelie-posv1` project
3. Go to **Settings** → **Environment Variables**
4. Add new environment variable:
   - **Name**: `NEXT_PUBLIC_API_URL`
   - **Value**: `https://your-backend-service.onrender.com` (Get this from Render dashboard)
   - **Environments**: Check all three: Production, Preview, Development
5. Click **Save**

**Important**: Get your actual Render backend URL from the Render dashboard. It should look like:

- `https://somdelie-pos.onrender.com` or
- `https://somdelie-pos-xyz.onrender.com`

#### Step 2: Redeploy Frontend on Vercel

**Option A: Trigger Redeploy from Vercel Dashboard**

1. Go to **Deployments** tab
2. Click the **⋯** menu on the latest deployment
3. Click **Redeploy**

**Option B: Push New Commit**

```bash
cd C:\Users\dell\Desktop\java-builds\somdelie-posv1

git add .
git commit -m "fix: Update CORS and environment configuration"
git push origin main
```

Vercel will automatically redeploy.

---

## Quick Fix Option (Temporary)

If you need a quick fix for testing, you can use wildcard CORS (NOT recommended for production):

**In SecurityConfig.java**:

```java
cfg.setAllowedOriginPatterns(Collections.singletonList("*"));
// Comment out setAllowedOrigins
// cfg.setAllowedOrigins(Arrays.asList(...));
```

**⚠️ WARNING**: This allows ALL origins. Only use for testing, then implement proper origin whitelisting.

---

## Verification Steps

### After Both Fixes Are Deployed:

1. **Check Frontend Environment**:

   - Open your Vercel deployment
   - Open browser console (F12)
   - Type: `console.log(process.env.NEXT_PUBLIC_API_URL)`
   - Should show your Render backend URL (NOT localhost)

2. **Check Network Requests**:

   - Open Network tab (F12 → Network)
   - Try to login
   - Check the request URL - should point to your Render backend
   - Check response headers - should include `Access-Control-Allow-Origin`

3. **Test Login**:
   - Try logging in with valid credentials
   - Should work without CORS errors
   - Should see success message

---

## Troubleshooting

### If you still see CORS errors:

1. **Clear Vercel deployment cache**:

   - Settings → General → Clear Build Cache & Redeploy

2. **Check backend logs on Render**:

   - See if requests are reaching the backend
   - Check for any CORS-related errors

3. **Verify environment variables**:

   - Vercel: Settings → Environment Variables
   - Render: Environment tab
   - Make sure they're saved and deployment was triggered after adding them

4. **Check CORS headers in response**:
   - Use browser Network tab
   - Look at the response headers for the OPTIONS preflight request
   - Should see: `Access-Control-Allow-Origin: https://somdelie-posv1.vercel.app`

### If environment variable isn't working:

1. **Check the exact variable name**: `NEXT_PUBLIC_API_URL` (case-sensitive)
2. **Make sure there's no trailing slash** in the URL
3. **Verify it's set for all environments** (Production, Preview, Development)
4. **Redeploy** after setting the variable

---

## Summary Checklist

Backend (Spring Boot on Render):

- [ ] Update `SecurityConfig.java` with allowed Vercel origins
- [ ] Add `ALLOWED_ORIGINS` environment variable on Render (optional)
- [ ] Build and push new Docker image (v2.0.2)
- [ ] Deploy on Render

Frontend (Next.js on Vercel):

- [ ] Set `NEXT_PUBLIC_API_URL` environment variable on Vercel
- [ ] Get correct Render backend URL
- [ ] Set for all environments (Production, Preview, Development)
- [ ] Trigger redeploy on Vercel
- [ ] Test login functionality

Expected Result:
✅ No more CORS errors  
✅ Frontend connects to deployed backend  
✅ Login works in production

---

**Created**: October 5, 2025  
**Issues**: CORS blocking + localhost hardcoded in production  
**Root Causes**: Missing environment variables + CORS not allowing Vercel domain
