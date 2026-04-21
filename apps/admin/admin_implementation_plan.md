# Awtar AI — Admin Panel UI Implementation Plan

Based on scanning the actual Go backend codebase located at `C:\Users\samue\Desktop\backend`, here are all the backend features identified, mapping directly to what we need to build for the Admin UI in your frontend folder.

---

## 1. Backend Features & Endpoints Discovered

**Base URL:** `http://localhost:8080/api/v1`  
**Auth:** JWT Bearer token. The Admin role is enforced by `adminMiddleware` on all `/admin/*` routes.

### Admin-only Endpoints mapping to features

| Method | Route | What it does for the UI |
|--------|-------|-------------|
| `POST` | `/auth/login` | **Admin Login:** Authenticates the admin and returns the JWT access and refresh tokens. |
| `POST` | `/auth/logout` | **Admin Logout:** Ends the session and invalidates tokens. |
| `PATCH` | `/admin/{userId}/update-status` | **User Management:** Let the Admin activate or deactivate users. |
| `GET` | `/admin/organizations/list` | **Dashboard / Orgs List:** Fetches a paginated list of all organizations with filters (`status`, `industry`, `name`). |
| `GET` | `/admin/organizations/{id}/single` | **Org Details:** Fetches the full detailed profile of a specific organization, including its creator info and verification document URLs. |
| `PATCH` | `/admin/organizations/{id}/update-status` | **Org Approvals:** Changes the state of an organization (`pending` → `active` → `suspended`). |
| `DELETE` | `/admin/organizations/{id}/delete` | **Org Cleanup:** Soft-deletes a rejected organization. |
| `GET` | `/organizations/{id}/employees` | **Org Details:** Lists the specific HR employees assigned to a company. |

---

## 2. Frontend Pages to Build

We will build excellent, aesthetically pleasing UI utilizing Next.js 16, Tailwind CSS v4, Lucide React, and Recharts, maintaining a premium look with dark navy and red accent colors.

### 1. `/login` — Admin Login Portal
- A sleek, centered login card with form processing.
- Connects to `POST /auth/login`.
- Stores `access_token` securely and routes the admin to the `/dashboard`.

### 2. `/dashboard` — Admin Overview
- **Stat Cards:** At-a-glance metrics for Total Organizations, Pending Approvals, Active, and Suspended users.
- **Charts:** Beautiful charts showing org registrations and status distribution.
- **Recent Pending Table:** Quick action table showing the latest pending registrations waiting for admin approval.

### 3. `/organizations` — Organization Management
- Full, polished data table.
- Implement search by name and filtering by status / industry.
- Shows dynamic status badges (Pending = warning/yellow, Active = success/green, Suspended = destructive/red).
- Actions for View, Approve, Suspend, and Delete.

### 4. `/organizations/[id]` — Organization Detail View
- Comprehensive detail page for a specific organization.
- **Creator Details:** Highlights who registered the company.
- **Verification Documents:** Area to view/download uploaded `.pdf` / `.png` verification files.
- **Employee Table:** Lists the HR users attached to the platform.
- **Status Controls:** Prominent buttons to approve or suspend the organization.

### 5. `/users` — User Directory
- A clean list/search interface to manage users globally.
- Toggle for activating/deactivating any user via `PATCH /admin/{userId}/update-status`.

### 6. `/settings` — Admin Account Settings
- Account overview and standard profile preferences.
- Secure Logout action.

---

## 3. Frontend Architecture

We will implement this directly inside `apps/admin/app/` in your `awtar frontend` workspace:

```text
apps/admin/app/
├── globals.css              ← Setup identical aesthetic tokens as your main app
├── layout.tsx               ← Global fonts and structure
├── page.tsx                 ← Root redirect
├── _components/
│   ├── admin-shell.tsx      ← The persistent sidebar navigation and topbar
│   ├── stat-card.tsx        ← Reusable dashboard stat blocks
│   ├── status-badge.tsx     ← Responsive status indicators
│   └── charts/              ← Animated recharts wrappers
├── lib/
│   ├── api.ts               ← Fetch interceptors for JWT injection
│   └── types.ts             ← Global TypeScript interfaces matching backend DTOs
├── login/page.tsx
├── dashboard/page.tsx
├── organizations/
│   ├── page.tsx
│   └── [id]/page.tsx
├── users/page.tsx
└── settings/page.tsx
```
