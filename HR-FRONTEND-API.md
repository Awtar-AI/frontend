# HR & organization admin — frontend API reference

This guide covers **HR users**, **organization lifecycle**, **job management**, **applications (recruiter view)**, **team invites**, and **platform admin** organization APIs. It is derived from the Go routes and DTOs in `backend/` (not from Swagger YAML).

For **candidate** flows, see `APPLICANT-FRONTEND-API.md`.

---

## Conventions

| Item | Value |
|------|--------|
| **Base path** | `/api/v1` |
| **Full URL** | `{API_ORIGIN}/api/v1/...` |
| **JSON** | `Content-Type: application/json` unless `multipart/form-data` is specified |
| **Auth** | `Authorization: Bearer <access_token>` |
| **IDs** | UUIDs |

### JWT and organization context (important for HR)

Access tokens are built with:

- **`sub`** — user id  
- **`role`** — `hr`, `admin`, or `candidate`  
- **`organization_id`** — active organization for **HR** (string; may be empty)

Job routes (`POST/GET/PATCH/DELETE /jobs/...`) resolve the tenant with `helper.GetOrganizationID(c)`, which reads **`organization_id` from the JWT**. If it is missing or invalid, you get **403** / “organization id not found”.

**Implications for the frontend**

1. After **login**, if `role === "hr"`, persist `last_login_organization` from `LoginResponse` and treat it as the active org id for API calls that need it (it is embedded in the next access token when refreshed/logged in again — see auth service).
2. When the user **switches organization**, call `PATCH /organizations/:organizationId/switch` and then use the **new access token** from the response flow if your backend returns one — *today the switch handler returns `OrganizationDetailResponse` only; you may need to **login again** or **refresh** depending on product behavior.* (Check your deployed API: switch updates DB; a **new** JWT with updated `organization_id` typically requires **refresh** or re-login if the access token is not reissued on switch.)
3. **Admin** users carrying an `organization_id` in JWT can also hit HR job routes (job module allows **HR** or **admin**).

### Error shape

```json
{ "message": "...", "errors": [{ "field": "...", "message": "..." }] }
```

---

## Enums quick reference

### Organization status (`OrganizationStatus`)

| Value | Meaning |
|-------|--------|
| `pending` | Registered; awaiting platform approval |
| `active` | Approved; full HR features |
| `suspended` | Blocked by admin |

### Industry (registration & updates)

| Value |
|-------|
| `Tech` |
| `Finance` |
| `Healthcare` |
| `Education` |
| `Other` |

`UpdateOrganizationDto` uses `validate:"omitempty,oneof= Tech Finance ..."` (note possible **leading space** before `Tech` in the tag — if validation fails, try matching the exact tag or fix the backend).

### User roles

| Value | Typical use |
|-------|-------------|
| `hr` | Recruiters / org members |
| `admin` | Platform + optional org operations |
| `candidate` | Job seekers |

### Job: `employment_type`

`full_time` | `part_time` | `contract` | `internship` | `temporary`

### Job: `experience_level`

`entry` | `mid` | `senior` | `lead`

### Job: `salary_type`

| Value | API expectations |
|-------|------------------|
| `fixed` | `min_salary` required |
| `range` | both `min_salary` and `max_salary`; `min` ≤ `max` |
| `undisclosed` | no min/max requirement from validator |

### Job: `status` (on job posts)

| Value |
|-------|
| `active` |
| `closed` |

There is **no public REST route** in `job_handler` to PATCH job status; jobs move to **`closed`** when the **deadline** is processed by the **RabbitMQ consumer** (delayed message). Plan UI around `status` returned on job DTOs, not a manual “close” endpoint unless you add one.

### Application status (recruiting pipeline)

| Value |
|-------|
| `Pending` |
| `Accepted` |
| `Rejected` |

---

## Part 1 — HR signup & onboarding

### 1A. Founder: register company (no JWT)

**`POST /organizations/register`**  
**Content-Type:** `multipart/form-data`

Creates the **organization** (`pending`), the **owner user** as **`hr`**, hashes password, uploads **business documents** to object storage.

| Form field | Type | Required | Notes |
|------------|------|----------|--------|
| `first_name` | string | Yes | 2–50 |
| `last_name` | string | Yes | 2–50 |
| `email` | string | Yes | Valid email; must not exist |
| `phone` | string | Yes | E.164 (e.g. `+251911234567`) |
| `password` | string | Yes | 8–72, strong password rules |
| `organization_name` | string | Yes | 2–150; must be unique |
| `website_url` | string | Yes | Valid URL |
| `industry` | string | Yes | `Tech`, `Finance`, `Healthcare`, `Education`, `Other` (`RegisterOrganizationDto`) |
| `organization_size` | int | Yes | ≥ 1 |
| `linkedin_url` | string | No | URL |
| `business_documents` | file(s) | Yes | **Form name:** `business_documents`. **1–3** files. **Max 5 MB** each (see `maxDocumentSize`). Extensions: `.pdf`, `.doc`, `.docx`, `.png`, `.jpg`, `.jpeg` |

**Response `201`** — `RegisterOrganizationResponse`

| Field | Type |
|-------|------|
| `id` | UUID — new organization id |
| `message` | e.g. organization registered; review 24–48h |

**Errors:** `409` if org name or email exists.

**After registration:** user must wait until a **platform admin** sets org to **`active`** before `UpdateOrganization` succeeds.

---

### 1B. Invited HR: complete signup (no JWT)

Invites are sent by `POST /organizations/:organizationId/invite` (see below). The email should link to your **frontend** with the invitation **token** (implementation uses `FRONTEND_URL` + token for other flows).

**`POST /users/create`**  
**Content-Type:** `multipart/form-data`

| Field | Required | Notes |
|-------|----------|--------|
| `role` | Yes | Must be **`hr`** |
| `email`, `password`, `first_name`, `last_name` | Yes | Same rules as generic user create |
| `token` | Yes | **Query:** `?token=<jwt_invitation_token>` |

If `token` is present and `role != hr`, the API returns **400** (“only HR users can be created through invitation”).

Resume / candidate fields are **not** used for HR.

---

## Part 2 — Authentication (HR uses same auth as everyone)

| Method | Path | Body | Notes |
|--------|------|------|--------|
| `POST` | `/auth/login` | `{ "email", "password" }` | Returns `LoginResponse` with `access_token`, `refresh_token`, `role`, `last_login_organization`, … |
| `POST` | `/auth/refresh` | `{ "refresh_token" }` | New token pair |
| `POST` | `/auth/logout` | `{ "refresh_token" }` | Header: `Authorization: Bearer ...` |
| `POST` | `/auth/forgot-password` | `{ "email" }` | |
| `POST` | `/auth/reset-password` | `{ "token", "password" }` | |

**LoginResponse** (abridged): `id`, `access_token`, `refresh_token`, `email`, `first_name`, `last_name`, `is_active`, `role`, `last_login_organization`, `last_log_in_at`, `created_at`, `updated_at`.

Decode JWT on the client **or** rely on login payload to know **`organization_id`** for HR (embedded in access token as `organization_id` claim).

---

## Part 3 — Organization (authenticated HR)

Routes under `/organizations/...` use **JWT**. There is **no separate HR role middleware** on these routes in code; rely on business rules and correct `organizationId` paths.

### `GET /organizations/:organizationId/single`

Full org profile for owners/employees: **detail** view including **presigned `document_url`** array (short-lived MinIO URLs), **creator**, **status**, **phone**, etc.

**Response `200`** — `OrganizationDetailResponse`:

| Field | Type |
|-------|------|
| `id` | UUID |
| `phone` | string |
| `organization_name` | string |
| `website_url` | string |
| `industry` | string |
| `organization_size` | int |
| `linkedin_url` | string |
| `status` | `pending` \| `active` \| `suspended` |
| `document_url` | string array (presigned URLs) |
| `created_at`, `updated_at` | datetime |
| `creator` | `{ user_id, first_name, last_name, email }` or omitted |

**Same handler** is mounted as **`GET /admin/organizations/:organizationId/single`** for admin UI (see Part 6).

---

### `PATCH /organizations/:organizationId/update`

**Body (JSON)** — `UpdateOrganizationDto` — all optional; send only fields to change.

| Field | Type | Notes |
|-------|------|--------|
| `website_url` | string | URL |
| `industry` | string | oneof industry enum (see spacing caveat above) |
| `organization_size` | int | ≥ 1 |
| `linkedin_url` | string | URL |

**Business rule:** organization must be **`active`**. Otherwise **400** (“organization should be approved before updating”).

**Response `200`** — `OrganizationDetailResponse` (updated).

---

### `GET /organizations/:organizationId/employees`

**Response `200`** — array of `EmployeeResponse`:

| Field | Type |
|-------|------|
| `user_id` | UUID |
| `first_name` | string |
| `last_name` | string |
| `email` | string |
| `role` | string |

---

### `POST /organizations/:organizationId/invite`

**Body (JSON)** — `InviteUserDto`

| Field | Type | Required |
|-------|------|----------|
| `email` | string | Yes |
| `first_name` | string | Yes |
| `last_name` | string | Yes |

Sends invitation email (template `InvitationTemplate`) with a signed token.

**Response `200`** — `{ "message": "invitation sent successfully" }` (success DTO).

---

### `PATCH /organizations/:organizationId/switch`

**HR only** (service returns **403** for non-HR).

Sets the user’s **active organization** (used for future tokens / `last_login_organization` flow).

**Response `200`** — `OrganizationDetailResponse` for the target org.

---

### Public org profile (unauthenticated)

**`GET /organizations/:organizationId/public`** — candidate-facing subset (no documents/creator). HR can use this for “preview as candidate”.

---

## Part 4 — Jobs (HR / admin only)

**Middleware:** JWT + role **`hr`** or **`admin`** (`RoleMiddeleware`).

**Tenant:** `organization_id` inside JWT must match the org whose jobs you manage.

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/jobs` | Create job |
| `GET` | `/jobs` | List all jobs for JWT org |
| `GET` | `/jobs/:jobId` | Get one job (must belong to org) |
| `PATCH` | `/jobs/:jobId` | Partial update |
| `DELETE` | `/jobs/:jobId` | Soft-delete |

**Unauthenticated job board (for testing / marketing):**

- `GET /jobs/public` — query filters; response `{ "jobs": [...], "total": n }`
- `GET /jobs/public/:jobId` — single public job

---

### `POST /jobs`

**Body (JSON)** — `CreateJobDto`

| Field | Type | Required | Notes |
|-------|------|----------|--------|
| `title` | string | Yes | 2–255 |
| `description` | string | Yes | min 10 chars |
| `location` | string | Conditional | Required if `is_remote` is **false** |
| `is_remote` | boolean | Yes | |
| `employment_type` | string | Yes | Job type enum |
| `experience_level` | string | Yes | `entry` / `mid` / `senior` / `lead` |
| `salary_type` | string | Yes | `fixed` / `range` / `undisclosed` |
| `min_salary` | int64 | Conditional | Required for `fixed`; both min+max for `range` |
| `max_salary` | int64 | Conditional | Required for `range` |
| `currency` | string | Yes | min length 3 (e.g. `USD`) |
| `deadline` | datetime | Yes | JSON time; used to schedule auto-close via RabbitMQ |
| `is_resume_required` | boolean | Yes | |
| `is_cover_letter_required` | boolean | Yes | |
| `automatic_response` | string | No | If set: 50–200 chars |

**Response `201`** — `JobPostResponseDto`:

| Field | Type |
|-------|------|
| `id` | UUID |
| `organization_id` | UUID |
| `title`, `description`, `location` | string |
| `is_remote` | boolean |
| `employment_type` | string |
| `expirence_level` | string *(API typo; same as experience_level)* |
| `deadline` | datetime |
| `automatic_response` | string |
| `salary_type` | string |
| `min_salary`, `max_salary` | int64 or null |
| `currency` | string |
| `is_resume_required`, `is_cover_letter_required` | boolean |
| `status` | `active` \| `closed` |
| `created_by` | UUID |
| `created_at`, `updated_at` | datetime |

---

### `GET /jobs`

**Response `200`** — array of `JobPostResponseDto`.

---

### `GET /jobs/:jobId`

**Response `200`** — `JobPostResponseDto`.

---

### `PATCH /jobs/:jobId`

**Body (JSON)** — `UpdateJobDto` — all fields **optional** (pointers / omitempty). Same validation rules as create where applicable (e.g. `description` min 10 if sent, `automatic_response` 50–200 if sent).

After update, if **`deadline`** changes, the service **reschedules** the delayed close event.

**Response `200`** — `JobPostResponseDto`.

---

### `DELETE /jobs/:jobId`

**Response `204`** No Content.

---

## Part 5 — Applications (recruiter / HR)

All routes use JWT. **HR + admin** subgroup for employer actions.

**Base:** `/applications` (all methods below include the `/api/v1` prefix in real URLs).

| Method | Path | Who | Description |
|--------|------|-----|-------------|
| `GET` | `/applications/job/:jobId` | HR, admin | List applications for a job |
| `GET` | `/applications/job/:jobId/application/:id` | HR, admin | One application |
| `GET` | `/applications/job/:jobId/user/:userId` | HR, admin | Application for user+job |
| `GET` | `/applications/job/:jobId/count` | HR, admin | `{ "count": number }` optional `?status=Pending|Accepted|Rejected` |
| `PATCH` | `/applications/:id/status` | HR, admin | Update one status |
| `PATCH` | `/applications/batch/status` | HR, admin | Bulk status update |

**Query `status`** (where applicable): `Pending`, `Accepted`, `Rejected`.

### `PATCH /applications/:id/status`

**Body** — `UpdateStatusRequestDto`

```json
{ "status": "Pending" }
```

Allowed: `Pending`, `Accepted`, `Rejected`.

**Response `200`** — e.g. `{ "message": "status updated successfully" }`.

---

### `PATCH /applications/batch/status`

**Body** — `UpdateMultipleStatusRequestDto`

| Field | Type | Required |
|-------|------|----------|
| `application_ids` | UUID array | Yes, min 1 |
| `status` | string | Yes, same enum as above |

**Response `200`** — e.g. `{ "message": "statuses updated successfully" }`.

---

### `GET` list / single application (HR)

Returns **`ApplicationResponseDto`** (same shape as in applicant doc):

`id`, `job_id`, `user_id`, `status`, `resume_url`, `cover_letter`, applicant name/email, career fields, salary fields, `created_at`, `created_by`, `updated_at`, `updated_by`, etc.

---

## Part 6 — Platform admin (organization moderation)

Routes registered with **JWT only** in `organization.module.go` (no `RoleMiddeleware` in that file). **Frontend:** restrict to users with **`role: admin`**. Confirm your deployment adds extra protection if needed.

| Method | Path | Query / body | Response |
|--------|------|--------------|----------|
| `GET` | `/admin/organizations/list` | `status`, `industry`, `name`, `page`, `page_size` (defaults page 1, size 20) | `OrganizationListResponse` |
| `PATCH` | `/admin/organizations/:organizationId/update-status` | Body: `ChangeOrganizationStatusDto` `{ "status": "active" \| "suspended" \| "pending" }` | Success message |
| `DELETE` | `/admin/organizations/:organizationId/delete` | — | Success message; deletes MinIO docs |
| `GET` | `/admin/organizations/:organizationId/single` | — | `OrganizationDetailResponse` |

**Status transitions** (server-side rules):

- `pending` → `active` or `suspended`
- `active` → `suspended`
- `suspended` → `active`

**`OrganizationListResponse`:** `organizations` (array of `OrganizationSummaryResponse`), `total`, `page`, `page_size`.

**`OrganizationSummaryResponse`:** `id`, `organization_name`, `industry`, `organization_size`, `status`, `website_url`, `created_at`, `creator` (optional).

---

### Platform admin — user activate/deactivate

**`PATCH /admin/:userId/update-status`**  
**Middleware:** JWT + **admin** only.

**Body** — `ChangeStatusDto`

```json
{ "is_active": true }
```

**Response `200`** — `{ "message": "user status updated" }`.

---

## Part 7 — HR personal account (same user routes as others)

| Method | Path | Notes |
|--------|------|--------|
| `GET` | `/users/:userId/single` | JWT; path id must equal token user |
| `PATCH` | `/users/:userId/update` | Name/email |
| `PATCH` | `/users/:userId/change-password` | `old_password`, `new_password` |

Candidate-only routes (`update-candidate-profile`, `upload-resume`) are not for typical HR personas.

---

## Part 8 — Notifications (HR inbox)

Same as applicants: group **`/notifications`** with JWT.

| Method | Path | Purpose |
|--------|------|---------|
| `GET` | `/notifications/` | `?is_read=true|false&module=...` |
| `GET` | `/notifications/unread/count` | `{ "count": n }` |
| `GET` | `/notifications/:id` | Wrapped as `{ "Notification": {...} }` in handler |
| `PATCH` | `/notifications/:id/read` | |
| `PATCH` | `/notifications/all/read` | |
| `PATCH` | `/notifications/batch/read` | Body: `{ "ids": ["uuid", ...] }` |
| `DELETE` | `/notifications/:id` | |
| `DELETE` | `/notifications/` | Delete all |
| `DELETE` | `/notifications/batch` | Body: `{ "ids": [...] }` |

---

## Suggested HR frontend flows

1. **Founder:** `POST /organizations/register` → wait for **admin** to set **`active`**.
2. **Login:** `POST /auth/login` → store tokens + org id from JWT / `last_login_organization`.
3. **Dashboard org:** `GET /organizations/:id/single` → show `status`, documents, creator.
4. **If pending:** show “awaiting approval”; block `PATCH .../update` until active.
5. **Team:** `GET .../employees`, `POST .../invite` with JSON body.
6. **Multi-org HR:** `PATCH .../switch` then **refresh token** or re-login so JWT `organization_id` matches.
7. **Jobs:** CRUD on `/jobs` with correct org context.
8. **Applicants:** `GET /applications/job/:jobId`, drill-down, `PATCH` status / batch.
9. **Notifications:** poll or refresh `GET /notifications/` / unread count.

---

## Source of truth

Handlers: `internal/organization/delivery/http`, `internal/job/delivery/http`, `internal/application/delivery/http`, `internal/auth/delivery/http`, `internal/user/delivery/http`, `internal/notification/delivery/http`.  
Modules: `*_module.go` files for exact path prefixes.

Regenerate Swagger after fixing `docs/swagger.yaml` merge conflicts, then diff with this document.
