# Applicant (candidate) frontend API reference

This document describes HTTP endpoints useful for **job seekers / candidates**: registration, auth, public jobs, applications, profile, organization discovery, and notifications. It is aligned with the current Go handlers and DTOs under `backend/` (not the broken `swagger.yaml` merge state).

---

## Conventions

| Item | Value |
|------|--------|
| **Base path** | `/api/v1` |
| **Full URL** | `{API_ORIGIN}/api/v1/...` — replace `API_ORIGIN` with your server (e.g. `http://localhost:5432` per your local port setup). |
| **JSON APIs** | `Content-Type: application/json` unless noted as `multipart/form-data`. |
| **Auth** | `Authorization: Bearer <access_token>` for protected routes. |
| **IDs** | UUIDs (strings) in paths and JSON. |
| **Timestamps** | RFC3339 strings where the API returns `time.Time`. |

### Error shape (typical)

```json
{
  "message": "human readable message",
  "errors": [
    { "field": "email", "message": "..." }
  ]
}
```

`errors` may be omitted. Some auth failures return `{ "error": "..." }` instead.

### Success messages

Many endpoints return `{ "message": "..." }` or a dedicated DTO (see each route).

---

## Shared enums (use exact string values in JSON / query)

### `UserRole` (signup)

| Value |
|-------|
| `candidate` |
| `hr` |
| `admin` |

Applicants use **`candidate`**.

### `EducationLevel`

| Value |
|-------|
| `high_school` |
| `associate` |
| `bachelor` |
| `master` |
| `phd` |
| `self_taught` |
| `other` |

Signup validation for `education_level` currently allows a subset (see **Create user**); prefer values listed on `CreateUserDto` in code if validation fails.

### `JobType` (employment / preferred job type)

| Value |
|-------|
| `full_time` |
| `part_time` |
| `contract` |
| `internship` |
| `temporary` |

### `IndustryName` (signup form — **capitalized**)

| Value |
|-------|
| `Tech` |
| `Finance` |
| `Healthcare` |
| `Education` |
| `Other` |

### `ExperienceLevelEnum` (jobs & applications)

| Value |
|-------|
| `entry` |
| `mid` |
| `senior` |
| `lead` |

### `SalaryTypeEnum`

| Value |
|-------|
| `fixed` |
| `range` |
| `undisclosed` |

### `StatusEnum` (job listing filter / public job)

| Value |
|-------|
| `active` |
| `closed` |

### `ApplicationStatus`

| Value |
|-------|
| `Pending` |
| `Accepted` |
| `Rejected` |

### `NotificationType`

| Value |
|-------|
| `email` |
| `in-app` |

---

## 1. Authentication (no JWT required)

### `POST /auth/login`

**Body (JSON)**

| Field | Type | Required | Notes |
|-------|------|----------|--------|
| `email` | string | Recommended | Validated as email when present. |
| `password` | string | Yes | |

**Response `200`** — `LoginResponse`:

| Field | Type |
|-------|------|
| `id` | UUID |
| `access_token` | string |
| `refresh_token` | string |
| `email` | string |
| `first_name` | string |
| `last_name` | string |
| `is_active` | boolean |
| `role` | string |
| `last_login_organization` | UUID or null |
| `last_log_in_at` | datetime or null |
| `created_at` | datetime |
| `updated_at` | datetime |

---

### `POST /auth/refresh`

**Body (JSON)**

| Field | Type | Required |
|-------|------|----------|
| `refresh_token` | string | Yes |

**Response `200`** — same shape as **LoginResponse** (new access + refresh tokens; old refresh invalidated).

---

### `POST /auth/logout`

**Headers:** `Authorization: Bearer <access_token>` (required by route registration).

**Body (JSON)**

| Field | Type | Required |
|-------|------|----------|
| `refresh_token` | string | Yes |

Invalidates the given refresh token. Access token may still be valid until expiry.

---

### `POST /auth/forgot-password`

**Body (JSON)**

| Field | Type | Required |
|-------|------|----------|
| `email` | string | Yes, valid email |

**Response `200`** — e.g. `{ "message": "Password Reset link is sent to your email" }` (exact text may match handler).

---

### `POST /auth/reset-password`

**Body (JSON)**

| Field | Type | Required |
|-------|------|----------|
| `token` | string | Yes (from email link query) |
| `password` | string | Yes |

**Response `200`** — e.g. `{ "message": "Password Reset Successfully" }`.

---

## 2. Candidate registration (no JWT)

### `POST /users/create`

**Content-Type:** `multipart/form-data`

Used for **self-serve candidate signup** (and HR invite with `token` query — candidates cannot use invite flow).

**Form fields**

| Field | Type | Required | Notes |
|-------|------|----------|--------|
| `email` | string | Yes | Email format. |
| `password` | string | Yes | Min 8, max 72; must satisfy strong-password rules (`strongpassword` validator). |
| `first_name` | string | Yes | 2–50 chars. |
| `last_name` | string | Yes | 2–50 chars. |
| `role` | string | Yes | Use `candidate` for applicants. |
| `current_job_title` | string | No | 2–120 chars if set. |
| `years_of_experience` | integer | No | 0–60. |
| `education_level` | string | No | `high_school`, `associate`, `bachelor`, `master`, `phd`, `other` (per DTO validator). |
| `desired_annual_salary_min` | integer | No | ≥ 0. |
| `desired_annual_salary_max` | integer | No | ≥ 0. |
| `industry_interest` | string | No | `Tech`, `Finance`, `Healthcare`, `Education`, `Other`. |
| `match_smart_notification` | boolean | No | |
| `primary_skills` | string | No | e.g. comma-separated `Go,Docker` (parsed server-side). |
| `preferred_job_types` | string(s) | No | Repeat field or CSV-style per Gin binding; values: `full_time`, `part_time`, etc. |
| `resume` | file | No | **Required path for candidates:** if omitted, handler may error. Allowed: `.pdf`, `.doc`, `.docx`; max **5 MB**. |

**Query**

| Param | Required | Notes |
|-------|----------|--------|
| `token` | No | Invitation token for **HR** signup only. |

**Response `201`** — `UserResponseDto`:

| Field | Type |
|-------|------|
| `id` | UUID |
| `email` | string |
| `first_name` | string |
| `last_name` | string |
| `is_active` | boolean |
| `role` | string |
| `created_at` | datetime |
| `updated_at` | datetime |
| `deleted_at` | datetime or omitted |
| `deleted_by` | UUID or omitted |
| `last_logged_in_at` | datetime or omitted |
| `candidate_profile` | object or omitted — see below |

**`candidate_profile` object (`CandidateProfileResponse`)**

| Field | Type |
|-------|------|
| `current_job_title` | string |
| `years_of_experience` | integer |
| `primary_skills` | string array |
| `education_level` | string |
| `preferred_job_types` | string array |
| `desired_annual_salary_min` | integer |
| `desired_annual_salary_max` | integer |
| `industry_interest` | string |
| `match_smart_notification` | boolean |
| `resume_url` | string (if resume uploaded) |

---

## 3. Public jobs (no JWT)

### `GET /jobs/public`

Paginated/filtered list for the job board.

**Query parameters** (all optional unless noted)

| Param | Type | Notes |
|-------|------|--------|
| `organization_id` | UUID | |
| `title` | string | 2–255 chars |
| `deadline_from` | datetime | Parsed as `time.Time` |
| `deadline_to` | datetime | |
| `min_salary` | integer | ≥ 0 |
| `max_salary` | integer | ≥ 0 |
| `currency` | string | max 3 chars |
| `experience_level` | string | `entry`, `mid`, `senior`, `lead` |
| `employment_type` | string | `full_time`, `part_time`, `contract`, `internship`, `temporary` |
| `status` | string | `active`, `closed` |
| `is_remote` | boolean | |
| `is_resume_required` | boolean | |
| `is_cover_letter_required` | boolean | |
| `page` | integer | ≥ 1 |
| `limit` | integer | 1–100 |

**Response `200`**

```json
{
  "jobs": [ /* PublicJobResponse */ ],
  "total": 0
}
```

**`PublicJobResponse` (each element)**

| Field | Type |
|-------|------|
| `id` | UUID |
| `organization_id` | UUID |
| `title` | string |
| `description` | string |
| `location` | string |
| `is_remote` | boolean |
| `employment_type` | string |
| `expirence_level` | string (note API typo) |
| `deadline` | datetime |
| `salary_type` | string |
| `min_salary` | integer or null |
| `max_salary` | integer or null |
| `currency` | string |
| `is_resume_required` | boolean |
| `is_cover_letter_required` | boolean |
| `status` | string |

---

### `GET /jobs/public/:jobId`

**Path**

| Param | Type |
|-------|------|
| `jobId` | UUID |

**Response `200`** — single `PublicJobResponse`.

---

## 4. Public organization profile (no JWT)

### `GET /organizations/:organizationId/public`

**Path**

| Param | Type |
|-------|------|
| `organizationId` | UUID |

**Response `200`** — `OrganizationPublicResponse`:

| Field | Type |
|-------|------|
| `id` | UUID |
| `organization_name` | string |
| `website_url` | string |
| `industry` | string |
| `organization_size` | integer |
| `linkedin_url` | string (optional) |

---

## 5. Authenticated user profile (candidate)

All routes below require **`Authorization: Bearer <access_token>`**. The path `userId` must match the authenticated user (server checks).

### `GET /users/:userId/single`

**Response `200`** — `UserResponseDto` (same structure as registration response).

---

### `PATCH /users/:userId/update`

**Body (JSON)** — `UpdateUserDto` (all optional)

| Field | Type | Notes |
|-------|------|--------|
| `email` | string | Valid email |
| `first_name` | string | 2–50 |
| `last_name` | string | 2–50 |

---

### `PATCH /users/:userId/change-password`

**Body (JSON)** — `ChangePasswordDto`

| Field | Type | Required |
|-------|------|----------|
| `old_password` | string | Yes, strong password rules |
| `new_password` | string | Yes, strong password rules |

---

### `PATCH /users/:userId/update-candidate-profile`

**Body (JSON)** — `UpdateCandidateProfileDto`

| Field | Type | Required | Notes |
|-------|------|----------|--------|
| `current_job_title` | string | No | 2–120 |
| `years_of_experience` | integer | No | 0–60 |
| `education_level` | string | No | Allowed values per validator |
| `desired_annual_salary_min` | integer | No | ≥ 0 |
| `desired_annual_salary_max` | integer | No | ≥ 0 |
| `industry_interest` | string | No | **Lowercase** in validator: `tech`, `finance`, `healthcare`, `education`, `other` |
| `match_smart_notification` | boolean | **Yes** | |
| `primary_skills` | string | No | |
| `preferred_job_types` | string array | No | Each: `full_time`, `part_time`, etc. |

---

### `PATCH /users/:userId/upload-resume`

**Content-Type:** `multipart/form-data`

| Field | Type | Required |
|-------|------|----------|
| `resume` | file | Yes |

Same extension/size rules as signup (PDF/DOC/DOCX, 5 MB).

---

## 6. Applications (candidate)

Base path: `/applications` — entire group uses JWT.

### `POST /applications/job/:jobId`

Submit an application. User must be authenticated; role should be candidate in practice.

**Path**

| Param | Type |
|-------|------|
| `jobId` | UUID |

**Body (JSON)** — `ApplyRequestDto` (fields optional unless job requires resume/cover letter)

| Field | Type | Notes |
|-------|------|--------|
| `resume_url` | string | Valid URL if set |
| `cover_letter` | string | |
| `current_job_title` | string | |
| `years_of_experience` | integer | ≥ 0 |
| `primary_skills` | string array | |
| `education_level` | string | |
| `employment_type` | string | `JobType` |
| `experience_level` | string | `entry`, `mid`, `senior`, `lead` |
| `is_remote` | boolean | |
| `location` | string | |
| `min_salary` | integer | |
| `max_salary` | integer | |
| `salary_type` | string | `fixed`, `range`, `undisclosed` |
| `salary_currency` | string | |

**Server behavior (important for UI)**

- Duplicate apply to the same job → **400** (`you have already applied to this job`).
- If the job has **`is_resume_required`** and the user has no `resume_url` in the payload **and** no resume on profile → **400** (`resume_url is required...`).
- If the job has **`is_cover_letter_required`** and `cover_letter` is empty → **400**.
- Many fields are **auto-filled** from the user profile and/or job post when omitted.

**Response `201`** — `ApplicationResponseDto`:

| Field | Type |
|-------|------|
| `id` | UUID |
| `job_id` | UUID |
| `user_id` | UUID |
| `status` | `Pending` / `Accepted` / `Rejected` |
| `resume_url` | string |
| `cover_letter` | string |
| `applicant_first_name` | string |
| `applicant_last_name` | string |
| `applicant_email` | string |
| `current_job_title` | string |
| `years_of_experience` | integer |
| `primary_skills` | string array |
| `education_level` | string |
| `employment_type` | string |
| `experience_level` | string |
| `is_remote` | boolean or null |
| `location` | string |
| `min_salary` | integer or null |
| `max_salary` | integer or null |
| `salary_type` | string |
| `salary_currency` | string |
| `created_at` | datetime |
| `created_by` | UUID |
| `updated_at` | datetime |
| `updated_by` | UUID or omitted |

---

### `GET /applications`

List the current user’s applications.

**Query**

| Param | Type | Notes |
|-------|------|--------|
| `status` | string | Optional: `Pending`, `Accepted`, `Rejected` |

**Response `200`** — array of `ApplicationResponseDto`.

---

### `GET /applications/:id`

**Path:** `id` = application UUID (must belong to the current user).

**Response `200`** — `ApplicationResponseDto`.

---

### `DELETE /applications/:id`

Withdraw application. Only **`Pending`** applications can be withdrawn.

**Response `200`** — e.g. `{ "message": "successfully withdrawn" }`.

---

## 7. Notifications (candidate)

All under `/notifications` with JWT.

### `GET /notifications/`

**Query**

| Param | Type | Notes |
|-------|------|--------|
| `is_read` | boolean | Pass `true` or `false` as string |
| `module` | string | Free filter |

**Response `200`** — array of `NotificationResponseDto`:

| Field | Type |
|-------|------|
| `id` | UUID |
| `user_id` | UUID |
| `type` | `email` \| `in-app` |
| `title` | string |
| `message` | string |
| `email` | string (optional) |
| `module` | string (optional) |
| `is_read` | boolean |
| `created_at` | datetime |
| `updated_at` | datetime |

---

### `GET /notifications/unread/count`

**Response `200`** — shape from handler (typically a count object; confirm in network tab).

---

### `GET /notifications/:id`

Single notification.

---

### `PATCH /notifications/:id/read`

Mark one as read.

---

### `PATCH /notifications/all/read`

Mark all as read.

---

### `PATCH /notifications/batch/read`

**Body** — multiple IDs (see `MultipleIdRequestDto` in code).

---

### `DELETE /notifications/:id`

### `DELETE /notifications/batch`

### `DELETE /notifications/`

Delete one, batch, or all (see handler implementations for exact bodies).

---

## 8. HR-only application routes (reference)

These require JWT **and** role **HR** or **admin**. Not for applicant UI, but same base URL:

| Method | Path | Purpose |
|--------|------|---------|
| `GET` | `/applications/job/:jobId` | List applications for a job |
| `GET` | `/applications/job/:jobId/application/:id` | One application |
| `GET` | `/applications/job/:jobId/user/:userId` | Application by user + job |
| `GET` | `/applications/job/:jobId/count` | Count (`?status=`) |
| `PATCH` | `/applications/:id/status` | Body: `{ "status": "Pending"|"Accepted"|"Rejected" }` |
| `PATCH` | `/applications/batch/status` | Body: `{ "application_ids": ["uuid",...], "status": "..." }` |

---

## Quick applicant flow (suggested order)

1. `POST /users/create` with `role=candidate` + resume (multipart).
2. `POST /auth/login` → store `access_token` + `refresh_token`.
3. `GET /jobs/public` / `GET /jobs/public/:jobId` for browsing.
4. `GET /organizations/:organizationId/public` for company pages.
5. `GET /users/:userId/single` to hydrate profile; `PATCH` profile/resume as needed.
6. `POST /applications/job/:jobId` with JSON body when applying.
7. `GET /applications` and `GET /applications/:id` for dashboard.
8. `POST /auth/refresh` before access token expiry; `POST /auth/logout` to drop refresh.

---

## Regenerating Swagger

When `backend/docs/swagger.yaml` is fixed, run `swag init` from `backend` and compare with this doc. Until then, **this file + the Go DTOs** are the source of truth for applicant-facing contracts.
