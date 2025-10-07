# JWT Cookie Authentication Fix

## Problem

The middleware was unable to enforce security rules because:

- JWT tokens were only stored in `localStorage` (client-side only)
- Next.js middleware runs on the **server-side** and cannot access `localStorage`
- Users created via Postman with ROLE_STORE_ADMIN but no storeId could access protected pages

## Solution

Updated authentication to store JWT in **both localStorage AND cookies**:

- **localStorage**: For client-side JavaScript access
- **Cookies**: For server-side middleware access

## Changes Made

### 1. Updated Login/Signup (`redux-toolkit/fetures/auth/authThunk.ts`)

```typescript
// Now stores JWT in both places
localStorage.setItem("jwt", response.data.jwt);
document.cookie = `jwt=${response.data.jwt}; path=/; max-age=604800; SameSite=Strict`;
```

### 2. Updated Logout Functions

- `redux-toolkit/fetures/user/userThunk.ts`
- `redux-toolkit/fetures/auth/authSlice.ts`
- `components/common/DashboardNavbar.tsx`

All now clear both localStorage AND cookies:

```typescript
localStorage.removeItem("jwt");
document.cookie = "jwt=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
```

### 3. Created JWT Utilities (`lib/auth/jwt-utils.ts`)

Helper functions for managing JWT tokens:

- `setJWT(jwt)` - Store in both localStorage and cookies
- `getJWT()` - Get from localStorage
- `clearJWT()` - Clear from both places
- `parseJWTPayload(jwt)` - Decode payload (client-side only)
- `needsOnboarding(user)` - Check if user needs onboarding

### 4. Created Test Page (`app/test-jwt/page.tsx`)

A utility page for manually setting JWT tokens from Postman.

## How It Works Now

### Normal Flow (After Fix)

1. User logs in via frontend → JWT stored in **localStorage + cookies**
2. Middleware reads JWT from **cookies** on every request
3. Middleware checks if user has required `storeId`/`branchId`
4. If missing, redirects to `/onboarding`
5. If unauthorized, redirects to `/not-found` (404)

### For Existing Postman Users

Since you created users via Postman (not through the frontend), you need to manually set the JWT cookie:

1. **Get JWT from Postman**:

   - Login via Postman: `POST http://localhost:5000/auth/login`
   - Copy the JWT token from the response

2. **Set JWT in Browser**:

   - Navigate to: http://localhost:3000/test-jwt
   - Paste your JWT token
   - Click "Set JWT Token"
   - You'll see decoded payload showing your role and assignments

3. **Test Middleware**:
   - Try accessing: http://localhost:3000/store/admin
   - **Expected behavior**:
     - If you have `storeId`: Access granted ✅
     - If you DON'T have `storeId`: Redirected to `/onboarding` ⚠️

## Testing Scenarios

### Scenario 1: Store Admin WITHOUT Store

```json
{
  "sub": "admin@example.com",
  "role": "ROLE_STORE_ADMIN",
  "storeId": null // ← No store assigned
}
```

**Result**: Redirected to `/onboarding` to create store

### Scenario 2: Store Admin WITH Store

```json
{
  "sub": "admin@example.com",
  "role": "ROLE_STORE_ADMIN",
  "storeId": "123e4567-e89b-12d3-a456-426614174000"
}
```

**Result**: Access to `/store/admin` granted ✅

### Scenario 3: Cashier WITHOUT Branch

```json
{
  "sub": "cashier@example.com",
  "role": "ROLE_BRANCH_CASHIER",
  "branchId": null // ← No branch assigned
}
```

**Result**: Redirected to `/onboarding`

### Scenario 4: Unauthorized Route Access

- ROLE_BRANCH_CASHIER tries to access `/admin/dashboard`
  **Result**: Redirected to `/not-found` (404) 🚫

## Backend Integration Needed

For the onboarding flow to work completely, your Spring Boot backend needs:

1. **Update User Entity** (`User.java`):

```java
@Entity
public class User {
    @Id
    private UUID id;
    private String email;
    private String role;

    // ADD THESE FIELDS:
    private UUID storeId;  // ← For store admins/managers
    private UUID branchId; // ← For branch staff

    // ... rest of fields
}
```

2. **Update JWT Generation** (include storeId/branchId in token):

```java
// When generating JWT
Map<String, Object> claims = new HashMap<>();
claims.put("role", user.getRole());
claims.put("storeId", user.getStoreId());  // ← Add this
claims.put("branchId", user.getBranchId()); // ← Add this
```

3. **Create Store Endpoint**:

```java
@PostMapping("/api/stores/create")
public ResponseEntity<?> createStore(@RequestBody StoreDTO storeDTO, @AuthenticationPrincipal User user) {
    // Create store
    // Update user.storeId
    // Return new JWT with storeId
}
```

## Quick Commands

### Clear all JWT data (reset authentication)

Run in browser console:

```javascript
localStorage.removeItem("jwt");
document.cookie = "jwt=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
location.reload();
```

### Check current JWT in browser

Run in browser console:

```javascript
console.log("localStorage:", localStorage.getItem("jwt"));
console.log("Cookie:", document.cookie);
```

## Files Modified

1. ✅ `redux-toolkit/fetures/auth/authThunk.ts` - Login/signup now set cookies
2. ✅ `redux-toolkit/fetures/user/userThunk.ts` - Logout clears cookies
3. ✅ `redux-toolkit/fetures/auth/authSlice.ts` - Logout clears cookies
4. ✅ `components/common/DashboardNavbar.tsx` - Logout clears cookies
5. ✅ `middleware.ts` - Added `/test-jwt` to public routes

## Files Created

1. ✅ `lib/auth/jwt-utils.ts` - JWT management utilities
2. ✅ `app/test-jwt/page.tsx` - JWT testing page

## Next Steps

1. **For Immediate Testing**:

   - Go to http://localhost:3000/test-jwt
   - Paste your Postman JWT token
   - Try accessing protected pages

2. **For Backend Integration**:

   - Add `storeId` and `branchId` to User model
   - Update JWT generation to include these fields
   - Create `/api/stores/create` endpoint
   - Update your Postman user with a `storeId`

3. **For Production**:
   - Set secure cookie flags: `Secure; HttpOnly; SameSite=Strict`
   - Verify JWT signature in middleware (currently only decoding)
   - Use environment variables for JWT secret

## Security Notes

⚠️ Current implementation decodes JWT without signature verification in middleware (for speed)
✅ Backend should still verify signatures on API endpoints
✅ Use HTTPS in production for cookie security
✅ Consider setting `HttpOnly` flag for cookies (prevents XSS access)
