# YurSay Platform Pivot — Sub-Project 2: Admin Panel

## Context

Following the Foundation sub-project (`2026-08-16-foundation-design.md`), the
backend now has `Vendor`, `Review`, and `SavedVendor` models with public
APIs, but no admin surface: nothing lets an admin moderate flagged reviews,
verify a business claim, manage users, act on fraud reports, or change
platform settings. The `Admin` model and `adminAuth` middleware exist but
are unused — no routes call them.

The mockup's `#page-admin` (`yursay/yursay-premium-fixed.html`, lines
2040–2488) defines 6 screens: Overview, Moderate Reviews, Manage Users,
Verify Businesses, Fraud Reports, Settings. This sub-project builds all 6,
full-stack: new admin API endpoints plus the React admin frontend that
consumes them.

The `admin/` folder is a separate Vite+React+Tailwind app (deployed
standalone — it has its own `vercel.json`/`staticwebapp.config.json`), left
over from an earlier, unrelated crypto-payments product ("connectin-admin").
Its `src/pages` and `src/components/*` directories are empty; `App.jsx`
still imports ~20 page files (Merchants, Transactions, Coinley checkout,
Naira Merchants, etc.) that don't exist on disk, so nothing in the app
currently renders. It is being fully repurposed as the YurSay admin panel;
none of the old payment-app code is kept.

## Current state (relevant findings)

- `server/models/index.js` activates `User`, `PersonalProfile`,
  `BusinessProfile`, `Admin`, `AuditLog`, `Region`, `State`, `City`,
  `Category`, `Vendor`, `Review`, `SavedVendor`.
- `Admin` model: `email`, `password`, `firstName`, `lastName`, `role`
  (`super_admin`/`admin`/`moderator`/`support`), `permissions` (JSONB,
  currently shaped around the old creator/brand/payment resources),
  `status` (`active`/`inactive`), `lastLoginAt`, `refreshToken`.
- `adminAuth` middleware already verifies a JWT with an `adminId` claim,
  loads the `Admin`, and rejects if not found or `status !== 'active'` —
  reusable as-is. No route currently issues an admin JWT, though.
- `recalculateVendorStats(vendorId)` (`server/utils/trustScore.js`) already
  recomputes `avgRating`, `reviewCount`, `trustScore`, `trustSignals` from
  published reviews and vendor verification status — reused unchanged,
  called after every admin review/verification action that can affect it.
- `AuditLog` model exists and is kept (per the Foundation spec) for exactly
  this purpose; not yet written to by anything.
- `services/email.service.js` already sends templated emails
  (verification, password reset) — reused for the admin-invite email.
- `admin/tailwind.config.js` and `admin/src/index.css` currently reference
  Bricolage Grotesque/Inter fonts and Tailwind-first styling, unrelated to
  the mockup's Montserrat/DM Sans design tokens.
- `admin/package.json` has payment-app-only deps: `coinley-checkout`,
  `coinley-sdk`, `react-paystack`, `qrcode.react`.

## Data model

### Reused unchanged
`User`, `Vendor`, `Review`, `Admin`, `AuditLog`.

### `Vendor` — new fields
| Field | Type | Notes |
|---|---|---|
| isBlacklisted | boolean | default `false` |
| blacklistedAt | date | nullable |
| blacklistReason | text | nullable |
| fraudCaseStatus | enum: none/open/investigating/monitoring/resolved/dismissed | default `none` |
| fraudSeverity | enum: low/medium/high | nullable |

### New: `FraudReport`
Individual community reports of suspected fraud against a vendor; rolled up
into the vendor's `fraudCaseStatus`/`fraudSeverity` fields.

| Field | Type | Notes |
|---|---|---|
| id | UUID PK | |
| vendorId | UUID FK → Vendor | |
| reporterId | UUID FK → User, nullable | who filed it |
| reasonTag | string | short label, e.g. "Payment, no delivery" |
| description | text | nullable |

Indexes: `vendorId`, `reasonTag`.

`recalculateVendorFraudStats(vendorId)` (new util, same shape as
`recalculateVendorStats`): counts open `FraudReport`s for the vendor, sets
`fraudSeverity` to `high` at ≥10 reports, `medium` at ≥3, else `low`; sets
`fraudCaseStatus` to `open` if it was `none`. Called after every new
`FraudReport` is created. Admin actions (`investigate`/`monitor`/`resolve`/
`dismiss`/`blacklist`) set `fraudCaseStatus` directly and do not re-run the
severity calculation.

### New: `PlatformSetting`
Single-row global config table (created once via a seeder, never a second
row).

| Field | Type | Notes |
|---|---|---|
| id | UUID PK | |
| autoFlagSuspiciousReviews | boolean | default `true` |
| requirePhotoForOneStarReviews | boolean | default `false` |
| autoFlagThreshold | integer | default `3`; one of 3/5/10 |
| allowNewRegistrations | boolean | default `true` |
| allowBusinessClaims | boolean | default `true` |
| maintenanceMode | boolean | default `false` |

### `Admin.permissions` — new default shape
```
{
  reviews:      { read: true, moderate: false },
  users:        { read: true, suspend: false },
  vendors:      { read: true, verify: false },
  fraudReports: { read: true, act: false },
  settings:     { read: true, write: false },
  team:         { read: true, invite: false }
}
```
`super_admin` role bypasses permission checks entirely (existing `role`
field); other roles are checked per-action against this JSONB.

## Auto-flagging on review creation

`review.controller.js`'s existing create-review path is extended: on
create, if `PlatformSetting.autoFlagSuspiciousReviews` is on and the
review matches a simple fraud-pattern heuristic (contains a promo-code-like
token, or the reviewer's account was created within 24h), the review is
created with `status: 'pending'` and `flagReason` set automatically instead
of `published`, landing it in the moderation queue without a user flag.
This is the only change to existing (non-admin) code in this sub-project.

## API surface

All routes below are mounted at `/api/admin` and require `adminAuth`
except `POST /auth/login`. Every mutating route also runs a permission
check (skipped for `super_admin`) and writes an `AuditLog` row
(`adminId`, `action`, `targetType`, `targetId`, `metadata`).

- `POST /auth/login` — email + password, issues a JWT with `{ adminId }`,
  updates `lastLoginAt`. Rate-limited like `/api/auth/login`.
- `GET /auth/me` — current admin profile.
- `GET /overview` — total users, total reviews, total vendors, pending
  reviews count, pending verifications count, week-over-week deltas for
  the stat cards, plus a short preview list for the moderation and
  verification queues.
- `GET /reviews?status=pending&flagReason=&q=&sort=` — paginated
  moderation queue.
- `POST /reviews/:id/approve` — sets `status: 'published'`, clears
  `flagReason`, calls `recalculateVendorStats`.
- `POST /reviews/:id/remove` — sets `status: 'removed'`, calls
  `recalculateVendorStats`.
- `POST /reviews/:id/escalate` — no state change; writes an `AuditLog`
  entry only (there is no senior-moderator tier yet — called out as a
  deliberate scope cut, not silently dropped).
- `GET /users?status=&q=&sort=&page=` — paginated user list with review
  counts.
- `POST /users/:id/suspend` — sets `User.status: 'suspended'`.
- `POST /users/:id/reinstate` — sets `User.status: 'active'`.
- `GET /vendors/verification-queue?q=` — vendors with
  `verificationStatus: 'pending'`.
- `POST /vendors/:id/verify` — sets `verificationStatus: 'verified'`,
  calls `recalculateVendorStats`.
- `POST /vendors/:id/reject` — sets `verificationStatus: 'rejected'`,
  requires a `reason` in the body (emailed to the claimer).
- `POST /vendors/:id/request-info` — no state change; sends an email via
  `email.service.js`.
- `GET /fraud-reports?severity=&status=` — vendors with open fraud cases,
  each with its `FraudReport`s and reason-tag counts.
- `POST /fraud-reports/:vendorId/blacklist` — sets `isBlacklisted: true`,
  `fraudCaseStatus: 'resolved'`, requires `reason`.
- `POST /fraud-reports/:vendorId/warn` — no state change beyond an email
  to the vendor owner (if claimed) and an `AuditLog` entry.
- `POST /fraud-reports/:vendorId/monitor` — sets `fraudCaseStatus:
  'monitoring'`.
- `POST /fraud-reports/:vendorId/investigate` — sets `fraudCaseStatus:
  'investigating'`.
- `POST /fraud-reports/:vendorId/dismiss` — sets `fraudCaseStatus:
  'dismissed'`, requires a `note`.
- `GET /settings`, `PUT /settings` — the `PlatformSetting` singleton row.
- `GET /team` — all `Admin`s (id, name, email, role, lastLoginAt).
- `POST /team/invite` — creates an `Admin` with a random temp password and
  `status: 'active'`, emails a set-password link (reusing the existing
  password-reset-token pattern on a new `Admin.resetPasswordToken`/
  `resetPasswordExpires` pair — same two columns `User` already has).
- `PUT /team/:id/role` — updates `role`/`permissions`. `super_admin` only.

Deliberately **not** built this phase (stubbed UI-only, per the approved
scope): "Export full platform data" and "Purge cached search index" in
Settings' Danger Zone — no export job or search infra exists yet.

## Frontend (`admin/`)

The app is deployed standalone (not under an `/admin` URL prefix), so
routes are plain paths:

`/login`, `/overview`, `/moderation`, `/users`, `/verification`,
`/fraud-reports`, `/settings` — all except `/login` render inside a shared
`AdminLayout` (dark `--p900` header + sidebar, ported from the mockup's
`.dash-side`/`.sb-item` markup) and are wrapped in a `ProtectedAdminRoute`
that redirects to `/login` if no valid admin session is in
`AdminAuthContext`.

Structure:
- `src/context/AdminAuthContext.jsx` — admin + JWT in state, persisted to
  `localStorage`; exposes `login`, `logout`, `admin`.
- `src/api/admin.api.js` — one function per endpoint above, using an axios
  instance with the admin JWT attached and `VITE_URL` as the base (same
  env var pattern as `admin/src/url.js`).
- `src/pages/`: `AdminLogin`, `AdminOverview`, `ModerateReviews`,
  `ManageUsers`, `VerifyBusinesses`, `FraudReports`, `PlatformSettings`.
- `src/components/layout/AdminLayout.jsx`, `Sidebar.jsx`, `AdminHeader.jsx`.
- `src/components/common/`: `Card`, `StatCard`, `Chip`, `Button`,
  `DataTable`, `TogglePill` — thin React wrappers around the ported CSS
  classes below, not new visual designs.
- `src/styles/admin-design-system.css` — the mockup's `:root` design
  tokens (`--p*` palette, spacing, radius, elevation, motion vars) and its
  hand-rolled component classes (`.card`, `.chip`, `.btn`, `.tbl`,
  `.stat-card`, `.tog-pill`, `.sb-item`, `.filter-bar`, `.doc-check`,
  `.sev-hi`/`.sev-md`) copied over verbatim and reused as-is, imported
  once in `main.jsx`. Not reimplemented as Tailwind utilities — the
  mockup's system is already coherent and tested; Tailwind stays available
  for one-off layout spacing only.
- `index.css`/`tailwind.config.js` font imports switch from Bricolage
  Grotesque/Inter to Montserrat/DM Sans to match.

## Cleanup

- `admin/src/App.jsx` fully replaced: only the routes listed above (no
  existing routes are kept — none of the old imports resolve to real
  files today).
- Remove from `admin/package.json`: `coinley-checkout`, `coinley-sdk`,
  `react-paystack`, `qrcode.react` (payment-app-only, unused by the admin
  panel).
- Backend: add `fraudReport.js`, `platformSetting.js` to
  `activeModelFiles` in `server/models/index.js`; add `admin.routes.js` /
  `admin.controller.js`; mount `app.use('/api/admin', adminRoutes)` in
  `server/index.js`.

## Dev workflow

Same as Foundation: `sequelize.sync({ alter: true })`, no formal
migrations yet. `PlatformSetting`'s single row is created by a one-off
seeder (`seedPlatformSettings.js`) rather than `sync` (a sync can't
guarantee row-seeding), following the existing `seeders/` pattern.

## Testing

- Model-level: `recalculateVendorFraudStats` unit-testable given a vendor
  + a set of `FraudReport`s (mirrors the existing `recalculateVendorStats`
  test shape).
- Controller-level: every admin mutation endpoint — status transitions,
  `AuditLog` row written, permission check rejects a `moderator` token on
  a `write`-gated action, `super_admin` bypasses the check.
- Frontend: no test runner exists in `admin/` currently; verified via
  manual QA against the dev server (login → each of the 6 panels →
  representative action per panel), not a new automated test framework.
