# 🚀 Deployment Checklist

## ✅ Completed Steps

- [x] Updated SecurityConfig.java with CORS configuration
- [x] Built Spring Boot backend with Maven
- [x] Created Docker image version 2.0.2
- [x] Pushed Docker image to Docker Hub
- [x] Committed frontend changes
- [x] Pushed frontend to GitHub

## 📋 Manual Steps Required

### Step 1: Configure Backend on Render ⏳

1. [ ] Go to [Render Dashboard](https://render.com/dashboard)
2. [ ] Click your `somdelie-pos` service
3. [ ] Navigate to **Environment** tab
4. [ ] Add environment variable:
   - **Key**: `ALLOWED_ORIGINS`
   - **Value**: `http://localhost:5173,http://localhost:3000,https://somdelie-posv1.vercel.app,https://somdelie-posv1-hgpco1oyv-somdelies-projects.vercel.app`
5. [ ] Click **Save Changes**
6. [ ] Click **Manual Deploy** → **Deploy latest commit**
7. [ ] Wait 5-10 minutes for deployment to complete
8. [ ] Copy your backend URL (e.g., `https://somdelie-pos.onrender.com`)

---

### Step 2: Configure Frontend on Vercel ⏳

1. [ ] Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. [ ] Click your `somdelie-posv1` project
3. [ ] Navigate to **Settings** → **Environment Variables**
4. [ ] Add environment variable:
   - **Name**: `NEXT_PUBLIC_API_URL`
   - **Value**: `https://your-backend.onrender.com` (use the URL from Step 1.8)
   - **Environments**: Check all three ✓ Production ✓ Preview ✓ Development
5. [ ] Click **Save**
6. [ ] Go to **Deployments** tab
7. [ ] Click the **⋯** menu on latest deployment
8. [ ] Click **Redeploy**
9. [ ] Wait for deployment to complete

---

### Step 3: Test the Application ⏳

1. [ ] Ensure both Render and Vercel deployments are complete
2. [ ] Open your Vercel deployment URL
3. [ ] Open browser DevTools (F12)
4. [ ] Navigate to **Console** tab
5. [ ] Type: `console.log(process.env.NEXT_PUBLIC_API_URL)`
   - Should show your Render backend URL (NOT localhost)
6. [ ] Navigate to **Network** tab
7. [ ] Try to login with test credentials
8. [ ] Verify:
   - [ ] No CORS errors in console
   - [ ] Request goes to correct backend URL
   - [ ] Login succeeds
   - [ ] JWT token is stored in localStorage
   - [ ] User is redirected to dashboard

---

## 🔍 Troubleshooting

### If CORS errors persist:

- [ ] Check that `ALLOWED_ORIGINS` is set correctly on Render
- [ ] Verify backend redeployed successfully
- [ ] Check backend logs on Render for CORS errors
- [ ] Ensure Vercel domain is in the allowed origins list

### If still connecting to localhost:

- [ ] Verify `NEXT_PUBLIC_API_URL` is set on Vercel
- [ ] Check all three environments are selected
- [ ] Clear Vercel build cache and redeploy
- [ ] Check browser console for the actual API URL being called

### If login still fails:

- [ ] Check backend logs on Render
- [ ] Verify database connection is working
- [ ] Test backend directly with curl:
  ```bash
  curl -X POST https://your-backend.onrender.com/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"somdeliedev@gmail.com","password":"yourpassword"}'
  ```

---

## 📊 Current Status

- **Backend Version**: 2.0.2
- **Docker Image**: `somdelie/somdelie-pos:2.0.2`, `somdelie/somdelie-pos:latest`
- **Image Digest**: `sha256:a7c71e4825af8fccd9213367b51717f75ada22ceec072cf6a865379ade525d9b`
- **Frontend Commit**: `76cae05`
- **Changes**: CORS configuration + Environment variable support

---

## ✨ Expected Result

After completing all manual steps:

✅ Frontend connects to deployed backend (not localhost)  
✅ No CORS policy errors  
✅ Login works in production  
✅ All authentication endpoints functional  
✅ JWT authentication working  
✅ User sessions persist correctly

---

**Last Updated**: October 5, 2025  
**Deployment Date**: October 5, 2025, 23:36 UTC+2
