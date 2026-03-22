# Mesob: Frontend–Backend Setup & State Management Guide

This document explains how the Mesob project connects its Next.js frontend to the Hono backend, how it manages global state, and how it differs from a custom `request()` utility like the one you shared.

---

## 1. Frontend–Backend Connection

### API Base URL

The frontend uses **`NEXT_PUBLIC_API_URL`** (env var) to point at the backend:

| Env Var | Purpose | Example |
|--------|---------|---------|
| `NEXT_PUBLIC_API_URL` | Base URL for all API calls | `http://muyalogy.lvh.me:4400` |

**Resolution logic** (`apps/nextjs-demo/src/lib/resolve-api-origin.ts`):

```ts
const DEFAULT_API_ORIGIN = 'http://muyalogy.lvh.me:4400';

export function resolveApiOrigin(rawApiUrl?: string): string {
  return (rawApiUrl || DEFAULT_API_ORIGIN)
    .replace(/\/api\/auth\/?$/, '')
    .replace(/\/api\/?$/, '');
}
```

The project splits APIs into three base URLs:

| Helper | Path | Purpose |
|--------|------|---------|
| `getAuthApiBaseUrl()` | `{origin}/api/auth` | Auth (sign-in, users, roles, etc.) |
| `getMainApiBaseUrl()` | `{origin}/api` | Main app API |
| `getAiApiBaseUrl()` | `{origin}/api/ai` | AI chat/form endpoints |

### OpenAPI-First Architecture

Mesob does **not** use a hand-written `request()` helper. Instead:

1. **Backend** (Hono) exposes OpenAPI specs at `/api/openapi.json` and `/api/auth/openapi.json`.
2. **Frontend** downloads these specs and generates TypeScript types via `openapi-typescript`.
3. **openapi-fetch** creates a typed fetch client from those types.
4. **openapi-react-query** wraps that client to produce `useQuery` / `useMutation` hooks.

**Client setup** (`apps/nextjs-demo/src/lib/openapi-client.ts`):

```ts
import createFetchClient from 'openapi-fetch';
import type { paths as mainPaths } from '@/data/openapi';
import type { paths as authPaths } from '@/data/openapi-auth';

const rawApiUrl = process.env.NEXT_PUBLIC_API_URL;

export const authApiBaseUrl = getAuthApiBaseUrl(rawApiUrl);
export const apiBaseUrl = getMainApiBaseUrl(rawApiUrl);

export const authApiClient = createFetchClient<authPaths>({
  baseUrl: authApiBaseUrl,
  credentials: 'include',  // Sends cookies (httpOnly session cookie)
});

export const apiClient = createFetchClient<mainPaths>({
  baseUrl: apiBaseUrl,
  credentials: 'include',
});
```

**React Query hooks** (`apps/nextjs-demo/src/lib/hooks.ts`):

```ts
import createClient from 'openapi-react-query';
import { apiClient, authApiClient } from './openapi-client';

export const $api = createClient(apiClient);       // Main API hooks
export const authApi$ = createClient(authApiClient); // Auth API hooks
```

**Usage in components**:

```ts
const { data, isPending } = authApi$.useQuery('get', '/users', { params: { query: { ... } } });
const create = authApi$.useMutation('post', '/users', { onSuccess: () => { ... } });
```

### Auth: Cookies, Not Bearer Tokens

Mesob uses **httpOnly cookies** for session auth, not a Bearer token in memory:

- `credentials: 'include'` sends cookies with every request.
- No `Authorization: Bearer ...` header.
- No `setAuthToken()` / `authToken` variable.
- Session is managed server-side; frontend cannot read the cookie.

---

## 2. Global State Management

Mesob does **not** use Redux, Zustand, or a global client store.

| State Type | Solution |
|------------|----------|
| **Server state** (API data) | TanStack Query (via openapi-react-query) |
| **Auth state** (user, session) | `@mesob/auth-react` (`useSession`, `useApi`) |
| **URL state** (search params) | `nuqs` with Next.js adapter |
| **Theme** | `next-themes` |
| **i18n** | `next-intl` |

### Auth State (`@mesob/auth-react`)

The auth package provides:

- **`useSession()`**: `user`, `session`, `status`, `isAuthenticated`, `signOut`, `refresh`
- **`useApi()`**: Typed hooks for auth API (`hooks.useQuery`, etc.)
- **`useConfig()`**: Auth config (logo, cookie prefix, etc.)

Auth state is derived from a TanStack Query call to `/session`; the backend reads the httpOnly cookie and returns user/session.

### Provider Hierarchy (`apps/nextjs-demo/src/app/layout.tsx`)

```tsx
<ThemeProvider>
  <NextIntlClientProvider>
    <MesobProviderWrapper>        {/* Routing, i18n, AI */}
      <NuqsAdapterWrapper>       {/* URL state (nuqs) */}
        <MesobAuthProvider>      {/* Auth context + QueryClient for auth */}
          <ReactQueryProvider>   {/* Main app QueryClient */}
            {children}
          </ReactQueryProvider>
        </MesobAuthProvider>
      </NuqsAdapterWrapper>
    </MesobProviderWrapper>
  </NextIntlClientProvider>
</ThemeProvider>
```

---

## 3. Backend Structure (Hono)

The backend (`apps/hono-demo`) mounts routes under `/api`:

| Path | Handler |
|------|---------|
| `/api/auth/*` | `@mesob/auth-hono` (auth routes) |
| `/api/ai/*` | `@mesob/ai-hono` (AI chat/form) |
| `/api/*` | App routes (health, profile, IAM, etc.) |

CORS is configured to allow the frontend origin (e.g. `http://muyalogy.lvh.me:6600`).

---

## 4. Your Custom `request()` Utility vs Mesob

### Your Code (Summary)

```ts
let authToken: string | null = null;
export function setAuthToken(token: string | null): void { authToken = token; }

export async function request<T>(path, { method, params, headers, body, ...rest }) {
  const url = buildUrl(path, params);
  const res = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new ApiError(...);
  return res.json();
}
```

### Comparison

| Aspect | Your `request()` | Mesob |
|--------|------------------|-------|
| **Auth** | Bearer token in memory (`authToken`) | httpOnly cookies (`credentials: 'include'`) |
| **Types** | Manual `request<T>()` | OpenAPI-generated types per endpoint |
| **Caching / loading** | Manual | TanStack Query (cache, refetch, loading) |
| **API surface** | Generic `request(path, config)` | Typed `authApi$.useQuery('get', '/users', ...)` |

### When Your Approach Makes Sense

Your `request()` + Bearer token pattern is fine when:

- You use JWT or similar tokens (not cookie-based auth).
- You don’t need OpenAPI or generated types.
- You’re okay managing loading/error/cache yourself (or with a thin wrapper).

### When Mesob’s Approach Helps

- Cookie-based auth (no token in JS).
- Strong typing from OpenAPI.
- Built-in caching, refetch, and loading via TanStack Query.
- Less custom fetch/error handling code.

---

## 5. Recommendations for a New Project

### Option A: Keep Your `request()` (Simple)

If you want to keep your utility:

1. **Auth**: Decide between Bearer token vs cookies.
2. **Base URL**: Use an env var (e.g. `VITE_API_URL` or `NEXT_PUBLIC_API_URL`).
3. **Error handling**: Your `ApiError` class is reasonable; consider adding retry logic if needed.
4. **State**: Add TanStack Query and wrap `request()` in `queryFn` / `mutationFn` for caching and loading.

### Option B: Adopt Mesob’s Stack (Type-Safe, Less Custom Code)

1. **Backend**: Expose OpenAPI (Hono, Fastify, etc.).
2. **Frontend**: Use `openapi-fetch` + `openapi-react-query` + generated types.
3. **Auth**: Prefer cookies if possible; otherwise keep Bearer and pass it via a custom fetch wrapper.
4. **State**: TanStack Query for server state; React Context for auth; nuqs for URL state.

### Option C: Hybrid

- Use your `request()` for a few endpoints.
- Add `openapi-fetch` + `openapi-react-query` for the main API once you have an OpenAPI spec.

---

## 6. Quick Reference: Key Files

| File | Purpose |
|------|---------|
| `apps/nextjs-demo/src/lib/openapi-client.ts` | API clients (auth + main) |
| `apps/nextjs-demo/src/lib/hooks.ts` | `$api`, `authApi$` React Query hooks |
| `apps/nextjs-demo/src/lib/resolve-api-origin.ts` | Base URL resolution |
| `apps/nextjs-demo/src/app/layout.tsx` | Provider tree |
| `packages/auth-react/src/provider.tsx` | Auth context, session, API hooks |
| `apps/hono-demo/src/api.ts` | Backend route mounting |
| `apps/nextjs-demo/scripts/generate-api.mjs` | OpenAPI spec download + type generation |

---

## 7. Environment Setup

Create `.env.local` in `apps/nextjs-demo`:

```env
NEXT_PUBLIC_API_URL=http://muyalogy.lvh.me:4400
```

Start backend: `pnpm dev:hono`  
Start frontend: `pnpm dev:nextjs`  
Generate API types: `pnpm generate:api` (with backend running)
