# somdelie-posv1 · AI agent working notes

Purpose: Equip AI coding agents to be productive immediately in this Next.js 15 App Router POS frontend that talks to a Spring Boot API.

## Big picture

- Stack: Next.js 15 (App Router, Turbopack), React 19, TypeScript, Tailwind v4, shadcn/ui. API via Spring Boot on Render.
- Auth: JWT stored in both cookie (`jwt`) and localStorage. Server middleware enforces RBAC. A secondary cookie `user_data` may hold user profile. A temporary `storeCtx` cookie can appear during store creation.
- App structure: Server components by default. Public pages under `app/(public-pages)`, dashboards under `app/(dashboard)/**`. Root providers in `app/layout.tsx` wrap a `ThemeProvider` and `utils/Providers` (which injects `AuthProvider` and Toasts). Dashboard chrome is in `app/(dashboard)/layout.tsx` using `components/ui/sidebar` and `components/common/*`.

## Core auth/RBAC flow you must respect

- Server middleware (`middleware.ts`) reads `jwt` cookie, decodes payload, and checks route access via `roleRoutePermissions` + a public route allowlist. It redirects on failure.
- Client helpers: `contexts/AuthContext.tsx` exposes `{user, loading, refreshUser}` backed by server action `getCurrentUser()` which merges JWT payload with `user_data` cookie.
- RBAC definitions live in `lib/auth/permissions.ts` (ROLE_PERMISSIONS, getDefaultRouteForRole, helpers). Note: permissions are duplicated between `middleware.ts` and `lib/auth/permissions.ts`. If you add/change roles or route prefixes, update both.
- JWT utilities in `lib/auth/jwt-utils.ts` manage dual storage (cookie + localStorage). Always use `setJWT`/`clearJWT` to keep them in sync. Debug via `app/test-jwt/page.tsx`.

## API calls pattern (critical)

- Prefer server actions under `lib/actions/**` with "use server", fetch the backend with a Bearer token from cookies using `getJWT()` (server variant in `lib/actions/auth.ts`). Example: `lib/actions/store.ts`.
- Avoid calling axios from server actions. The axios client in `utils/api.ts` is for client-side usage and reads `NEXT_PUBLIC_API_URL`.
- Backend base URL must come from `process.env.NEXT_PUBLIC_API_URL` (see `utils/api.ts`, deployment guides). Do not hardcode localhost.

## Adding features/pages (follow these conventions)

- New protected page: place under `app/(dashboard)/{area}/.../page.tsx`.
  - In a Server Component, read the user via `getCurrentUser()` and `redirect` if needed; or wrap Client Components with `components/auth/RouteGuard` for extra client-side checks.
  - If you introduce a new route prefix, update: 1) `middleware.ts` roleRoutePermissions/publicRoutes, 2) `lib/auth/permissions.ts` ROLE_PERMISSIONS, 3) menus in `components/common/DashboardSidebar.tsx` and `DashboardNavbar.tsx`.
- New API domain: create a server action file in `lib/actions/{domain}.ts`. Use `getJWT()` (server) to read cookies and send `Authorization: Bearer <jwt>` with `fetch`.
- UI: Use shadcn/ui in `components/ui/*` and the `cn()` utility from `lib/utils.ts`. Keep styles Tailwind-first.

## Build, run, debug

- Scripts (see `package.json`): `pnpm dev` (turbopack), `pnpm build` (turbopack), `pnpm start`, `pnpm lint`.
- Required env: `NEXT_PUBLIC_API_URL` for all environments. Production requires backend CORS to allow the Vercel URL. See `CORS-FIX-GUIDE.md` and `FIX-LOGIN-DEPLOYMENT.md`.
- Middleware is always on; for local debugging you can temporarily early-return in `middleware.ts` (documented in `SECURITY-ONBOARDING-GUIDE.md`).
- Test JWT locally at `/test-jwt` to set cookies/localStorage for middleware testing.

## Notable files to consult first

- Auth & RBAC: `middleware.ts`, `contexts/AuthContext.tsx`, `lib/actions/auth.ts`, `lib/auth/{permissions.ts,jwt-utils.ts}`.
- Server actions: `lib/actions/{store.ts,employees.ts,...}` pattern.
- Layout & chrome: `app/(dashboard)/layout.tsx`, `components/common/{DashboardSidebar.tsx,DashboardNavbar.tsx}`.
- UI primitives: `components/ui/*` (custom sidebar included).
- Public routes live under `app/(public-pages)/**` and login at `app/(auth)/auth/login/page.tsx`.

## Gotchas specific to this repo

- JWT may lack `storeId` temporarily; middleware contains a provisional allowance for `ROLE_STORE_ADMIN`. Don’t rely on `storeCtx` for authorization—backend should include `storeId` in JWT.
- next.config.ts ignores type and ESLint errors during production builds. Don’t introduce new errors casually; still run `pnpm lint` locally.
- Permissions duplication: keep `middleware.ts` and `lib/auth/permissions.ts` in sync to avoid mismatches between server and client.
- Cookie names used across code: `jwt`, `user_data`, `storeCtx`, `sidebar_state`.

## Example: add a Branches management screen

- Create `app/(dashboard)/store/branches/page.tsx` as a Server Component reading `getCurrentUser()` and redirecting unauthenticated users; render client components for the table.
- Add `/store/branches` to ROLE permissions in both `lib/auth/permissions.ts` and `middleware.ts` if new.
- Expose navigation in `DashboardSidebar.tsx` for `ROLE_STORE_ADMIN`.

Questions or unclear parts to refine next: Do we standardize on server actions for all protected API calls and phase out client axios usage? Should we remove the temporary `ROLE_STORE_ADMIN` storeId bypass once backend JWTs include storeId?
