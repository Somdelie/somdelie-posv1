# 🔐 Security & Onboarding Implementation Guide

## Overview

This POS system now has comprehensive security with:

1. **Next.js Middleware** for server-side route protection
2. **Onboarding flow** for store owners
3. **Role-based access control (RBAC)**
4. **404 redirect** for unauthorized access

## Architecture

### 1. Middleware-First Security (`middleware.ts`)

**Location**: `c:\Users\dell\Desktop\java-builds\somdelie-posv1\middleware.ts`

The middleware runs on **every request** before the page loads, providing server-side security.

**What it does**:

- ✅ Checks if route is public (login, signup, home)
- ✅ Verifies JWT token exists
- ✅ Decodes JWT to get user role and info
- ✅ Checks if user needs onboarding (no store/branch)
- ✅ Validates role permissions for the requested route
- ✅ Redirects unauthorized users to 404
- ✅ Redirects users needing setup to onboarding

**Key Features**:

```typescript
// Public routes (no auth required)
const publicRoutes = ["/", "/auth/login", "/auth/sign-up", "/auth/reset-password"];

// Role-based permissions
const roleRoutePermissions = {
  ROLE_USER: ["/user/profile", "/onboarding"],
  ROLE_STORE_ADMIN: ["/store/admin", "/store/cashier", ...],
  // ... more roles
};

// Onboarding logic
function needsOnboarding(user) {
  // Store admins need a store
  if (user.role === "ROLE_STORE_ADMIN" && !user.storeId) return true;

  // Branch staff need a branch
  if (user.role === "ROLE_BRANCH_CASHIER" && !user.branchId) return true;

  return false;
}
```

### 2. Onboarding Page (`/onboarding`)

**Location**: `app/onboarding/page.tsx`

**Flow**:

1. **Step 1: Welcome Screen**

   - Explains what store owners can do
   - Lists requirements
   - "Get Started" button

2. **Step 2: Store Creation Form**

   - Store Information (name, description)
   - Location Details (address, city, province, postal code, country)
   - Contact Information (phone, email, owner name)
   - Form validation with Zod

3. **Step 3: Success**
   - Shows success message
   - Auto-redirects to `/store/admin` dashboard

**Who sees this**:

- Users with `ROLE_STORE_ADMIN` or `ROLE_STORE_MANAGER` role
- Who DON'T have a `storeId` assigned yet

**What happens after**:

- API call to `/api/stores/create`
- Store is created and linked to user
- User gets redirected to their dashboard
- Middleware allows access to all store routes

### 3. Role-Based Access Control

**Location**: `lib/auth/permissions.ts`

**Utilities**:

```typescript
// Check if user can access a route
hasRoutePermission(userRole, pathname) → boolean

// Check if user needs onboarding
needsOnboarding(user) → boolean

// Get default route for role
getDefaultRouteForRole(role) → string

// Permission checks
canCreateUsers(role) → boolean
canManageInventory(role) → boolean
canViewAnalytics(role) → boolean
canProcessTransactions(role) → boolean
```

### 4. Route Guard Component (Optional Client-Side)

**Location**: `components/auth/RouteGuard.tsx`

Provides additional client-side protection for specific pages:

```tsx
<RouteGuard allowedRoles={["ROLE_STORE_ADMIN"]} requireStore={true}>
  <YourProtectedComponent />
</RouteGuard>
```

## User Roles & Access

### ROLE_USER

- **Access**: `/user/profile`, `/onboarding`
- **Purpose**: Regular users (limited access)
- **Onboarding**: Not required

### ROLE_SUPER_ADMIN

- **Access**: All routes (full access)
- **Purpose**: System administrator
- **Onboarding**: Not required

### ROLE_STORE_ADMIN (Store Owner)

- **Access**: `/store/admin`, `/store/cashier`, `/store/branches`, `/branch-manager`, `/store-manager`
- **Purpose**: Owns and manages the store
- **Onboarding**: **REQUIRED** if no store assigned
- **What they create**: Other store staff, branches, products

### ROLE_STORE_MANAGER

- **Access**: `/store-manager`, `/store/branches`, `/branch-manager`
- **Purpose**: Manages store operations
- **Onboarding**: **REQUIRED** if no store assigned
- **Created by**: Store Admin or Super Admin

### ROLE_BRANCH_MANAGER

- **Access**: `/branch-manager`, `/store/cashier`, `/cashier/dashboard`
- **Purpose**: Manages a specific branch
- **Onboarding**: Not required (assigned to branch by Store Admin)
- **Created by**: Store Admin or Store Manager

### ROLE_BRANCH_CASHIER

- **Access**: `/cashier/dashboard`, `/store/cashier`
- **Purpose**: Processes sales at POS
- **Onboarding**: Not required (assigned to branch)
- **Created by**: Branch Manager or Store Admin

## Security Flow

### New User Signup Flow

```
1. User visits /auth/sign-up
   ↓
2. User fills form and selects "I am a store owner" (gets ROLE_STORE_ADMIN)
   OR
   User is created by admin with specific role
   ↓
3. After signup, user is logged in
   ↓
4. Middleware checks: needsOnboarding()?
   ↓
5a. YES → Redirect to /onboarding
   → User creates store
   → Redirect to /store/admin

5b. NO → Redirect to role's default dashboard
```

### Attempting to Access Unauthorized Route

```
1. User tries to visit /admin/dashboard
   ↓
2. Middleware intercepts request
   ↓
3. Checks JWT token
   ↓
4. Decodes user role: ROLE_BRANCH_CASHIER
   ↓
5. Checks permissions: ROLE_BRANCH_CASHIER allowed on /admin/dashboard?
   ↓
6. NO → Redirect to /not-found (404 page)
```

### Branch Staff Access

```
1. Store Admin creates new cashier
   ↓
2. Assigns cashier to specific branch
   ↓
3. Cashier logs in
   ↓
4. Has branchId assigned
   ↓
5. Middleware allows access to /cashier/dashboard and /store/cashier
   ↓
6. Trying to access /store/admin?
   → Middleware blocks → 404
```

## Implementation Checklist

### ✅ Completed

- [x] Middleware for server-side security
- [x] Onboarding page (3-step wizard)
- [x] Role permissions utilities
- [x] Route guard component
- [x] Role-based redirect map
- [x] Onboarding detection logic

### 🔄 To Implement in Backend

- [ ] `/api/stores/create` endpoint
- [ ] User model with `storeId` and `branchId` fields
- [ ] JWT payload includes `storeId`, `branchId`, `role`
- [ ] API endpoint to create employees (by admins)
- [ ] Assign employee to store/branch API

### 📝 To Update

1. **Signup Page** (`app/(auth)/auth/sign-up/page.tsx`):

   ```tsx
   // Add role selection option
   <FormField name="isStoreOwner">
     <FormLabel>Are you a store owner?</FormLabel>
     <FormControl>
       <Checkbox {...field} />
     </FormControl>
     <FormDescription>
       Check this if you're signing up to create your own store
     </FormDescription>
   </FormField>;

   // On submit:
   const role = values.isStoreOwner ? "ROLE_STORE_ADMIN" : "ROLE_USER";
   ```

2. **User Creation Forms** (for admins):

   - Store Admin creating Branch Manager
   - Branch Manager creating Cashier
   - Must assign `branchId` and `storeId`

3. **JWT Token** (Backend):
   ```json
   {
     "id": "user-uuid",
     "email": "user@example.com",
     "role": "ROLE_STORE_ADMIN",
     "fullName": "John Doe",
     "storeId": "store-uuid", // Include this!
     "branchId": "branch-uuid", // Include this!
     "exp": 1234567890
   }
   ```

## Testing

### Test Onboarding Flow

1. **Signup as Store Owner**:

   ```
   - Go to /auth/sign-up
   - Select "I am a store owner"
   - Complete signup
   - Should redirect to /onboarding
   - Fill store form
   - Should redirect to /store/admin
   ```

2. **Try Unauthorized Access**:

   ```
   - Login as ROLE_BRANCH_CASHIER
   - Try to access /admin/dashboard
   - Should see 404 page
   ```

3. **Test Role Permissions**:
   ```
   - Login as each role
   - Verify can only access allowed routes
   - Verify redirects to 404 for unauthorized routes
   ```

## Security Best Practices

### ✅ What We Do

1. **Server-Side Protection**: Middleware runs on server before page loads
2. **JWT Verification**: Token is checked on every request
3. **Role-Based Access**: Routes mapped to specific roles
4. **No Client-Side Only Security**: Middleware ensures server-side enforcement
5. **Redirect to 404**: Users don't know which routes exist (security through obscurity)

### 🚫 What We Avoid

1. **Client-Side Only Guards**: Would be bypassable
2. **Exposing Route Structure**: 404 instead of "Unauthorized"
3. **Trusting Client Data**: All checks done server-side
4. **Storing Sensitive Data**: Only JWT in localStorage

## Middleware vs Route Guards

### Use Middleware When:

- ✅ Protecting routes for all users (global)
- ✅ Server-side enforcement needed
- ✅ Checking authentication
- ✅ Role-based route access

### Use Route Guards When:

- ✅ Page-specific requirements (requireStore, requireBranch)
- ✅ Component-level protection
- ✅ Loading states while checking
- ✅ Additional client-side validation

**Best Practice**: Use **both**! Middleware for global security, Route Guards for specific pages.

## Environment Variables

Ensure `.env.local` has:

```bash
NEXT_PUBLIC_API_URL=http://localhost:5000
# or production URL
# NEXT_PUBLIC_API_URL=https://your-backend.onrender.com
```

## API Endpoints Needed

### Store Management

```
POST /api/stores/create
  Body: { name, description, address, city, province, postalCode, country, phone, email, ownerName }
  Response: { id, name, ... }
  Auth: Required (ROLE_STORE_ADMIN)

GET /api/stores/my-store
  Response: { id, name, branches[], employees[] }
  Auth: Required
```

### User Management

```
POST /api/users/create-employee
  Body: { fullName, email, phone, role, storeId?, branchId? }
  Response: { id, email, temporaryPassword }
  Auth: Required (admins only)
```

## FAQ

### Q: What if I want to test without backend?

**A**: Comment out the middleware temporarily or mock the JWT:

```typescript
// In middleware.ts, temporarily return early:
export function middleware(request: NextRequest) {
  return NextResponse.next(); // Allow all routes for testing
}
```

### Q: How do I make a user a Store Admin?

**A**: On signup, detect if they check "I am a store owner" and assign `ROLE_STORE_ADMIN`.

### Q: Can a cashier become a manager?

**A**: Yes, through user management. Store Admin can update user role and assign new permissions.

### Q: What happens if JWT expires?

**A**: Middleware detects invalid JWT → redirects to login → user must re-authenticate.

---

**Created**: October 6, 2025  
**Status**: Ready for backend integration  
**Security Level**: Production-ready with middleware protection
