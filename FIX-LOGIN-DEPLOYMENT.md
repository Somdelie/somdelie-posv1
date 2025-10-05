# 🔧 Fix Login Issue on Deployed Next.js App

## Problem

- **Login works locally** ✅
- **Login fails on deployed version** ❌ "Invalid credentials!"

## Root Cause

The `api.ts` was hardcoded to `http://localhost:5000`, which doesn't work in production.

## Solution Applied

### 1. Updated `utils/api.ts`

Changed from:

```typescript
baseURL: "http://localhost:5000";
```

To:

```typescript
baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
```

### 2. Configuration Files Created

- `.env.local` - For local development
- `.env.example` - Template for reference

## Deployment Steps

### Step 1: Get Your Backend URL

Your Spring Boot backend is deployed on Render. Find the URL:

1. Go to [render.com/dashboard](https://render.com/dashboard)
2. Click on your `somdelie-pos` service
3. Copy the URL (should look like: `https://somdelie-pos.onrender.com`)

### Step 2: Set Environment Variable on Vercel/Netlify

#### If deployed on **Vercel**:

1. Go to your project dashboard
2. Click **Settings** → **Environment Variables**
3. Add new variable:
   - **Name**: `NEXT_PUBLIC_API_URL`
   - **Value**: `https://your-backend.onrender.com` (your actual Render URL)
   - **Environment**: Production, Preview, Development
4. Click **Save**
5. **Redeploy** your app (Settings → Deployments → click ⋯ → Redeploy)

#### If deployed on **Netlify**:

1. Go to **Site settings** → **Environment variables**
2. Add new variable:
   - **Key**: `NEXT_PUBLIC_API_URL`
   - **Value**: `https://your-backend.onrender.com`
3. Click **Save**
4. Trigger a new deploy

#### If deployed on **Render**:

1. Go to your Next.js service on Render
2. Click **Environment** tab
3. Add new environment variable:
   - **Key**: `NEXT_PUBLIC_API_URL`
   - **Value**: `https://your-backend.onrender.com`
4. Click **Save Changes** (will auto-redeploy)

### Step 3: Commit and Push Changes

```bash
git add utils/api.ts .env.local .env.example
git commit -m "fix: Use environment variable for API URL"
git push origin main
```

### Step 4: Verify the Fix

After redeployment:

1. Open your deployed app
2. Try logging in
3. Check browser console (F12) for any errors
4. Verify the request is going to the correct backend URL

## Testing Locally

The app will continue to work locally because `.env.local` has:

```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## Important Notes

### ⚠️ NEXT*PUBLIC* Prefix

Environment variables in Next.js that need to be **exposed to the browser** MUST start with `NEXT_PUBLIC_`. Without this prefix, the variable won't be available in client-side code.

### 🔒 CORS Configuration

Make sure your Spring Boot backend allows requests from your deployed frontend URL. Check your CORS configuration in the backend.

### 🌐 HTTPS in Production

Your backend URL should use **HTTPS** in production (Render provides this automatically).

## Troubleshooting

### If login still fails after deployment:

1. **Check browser console** (F12 → Console tab)

   - Look for network errors
   - Verify the API URL being called

2. **Check Network tab** (F12 → Network tab)

   - Find the login request
   - Check if it's going to the correct URL
   - Look at the response status and body

3. **Verify environment variable**

   - On your deployment platform, double-check `NEXT_PUBLIC_API_URL` is set correctly
   - Make sure there are no trailing slashes

4. **Check backend logs on Render**

   - See if the request is reaching your backend
   - Check for any CORS errors

5. **CORS Issues**
   - If you see CORS errors, update your Spring Boot backend to allow your frontend domain

## Example Environment Variables

### Local Development (.env.local)

```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### Production (Vercel/Netlify/Render)

```
NEXT_PUBLIC_API_URL=https://somdelie-pos.onrender.com
```

## Summary

✅ Updated `api.ts` to use environment variables  
✅ Created `.env.local` for local development  
✅ Created `.env.example` as template  
🔄 Next: Set `NEXT_PUBLIC_API_URL` on your deployment platform  
🔄 Redeploy and test login

---

**Created**: October 5, 2025  
**Issue**: Login failed on deployed app  
**Fix**: Use environment-based API URL configuration
