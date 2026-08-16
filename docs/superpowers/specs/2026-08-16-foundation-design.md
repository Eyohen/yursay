# YurSay Platform Pivot — Sub-Project 1: Foundation

## Context

YurSay is pivoting from its current shape (a creator↔brand collaboration
marketplace, branded "Connectin" in the backend) to the product described in
`yursay/yursay-premium-fixed.html`: a trust/review platform for African
social-commerce vendors. Buyers search a vendor by name or @handle, see a
Trust Score and rating breakdown, and leave photo-proof reviews. Vendors get
a public profile, can claim/verify their listing, and respond to reviews.
Admins moderate reviews and verify vendors.

This is a full pivot (confirmed with the user), not a side-by-side product.
The existing creator/brand marketplace code is being retired.

The full mockup covers 9 screens (home, business/vendor profile,
write-review, user dashboard, business dashboard, auth, categories, search,
admin). This spec covers only the **Foundation** sub-project: the data
model and backend API that every other screen will be built on. It does not
build any UI — the existing landing page stays as-is until the "Public
site" sub-project. It does not build the admin moderation UI or business
dashboard analytics — those are later sub-projects that will consume the
API this spec defines.

## Current state (relevant findings)

- `server/models/index.js` only activates `User`, `PersonalProfile`,
  `BusinessProfile`. Every other existing model (`Creator`, `Brand`,
  `Contract`, `Review`, etc.) is defined but never loaded — none of it is
  live in the database.
- `server/index.js` only mounts `/api/auth` and `/api/profile`. The other
  route files exist but aren't mounted.
- The active auth system (`User` with `userType: personal|business`, JWT
  access + refresh tokens, email verification, password reset) is generic
  enough to reuse directly: `personal` accounts become buyers, `business`
  accounts become vendor-owner accounts.
- `Category` and `Region → State → City` models are already defined,
  seeded with real data, and exposed read-only via `/api/lookup/*`. Both
  are reusable as-is for vendor categorization and location.
- Image upload already works end-to-end: `upload.routes.js` →
  `upload.controller.js` → `services/cloudinary.service.js`. Reusable as-is
  for review photos and vendor logos.
- The mockup is a static prototype (buttons fire `toast()` placeholders,
  no real backend calls), so it constrains the UI/data shape but not the
  API design.
- Confirmed decision: vendor listings are **open and claimable**
  (Yelp-style). A buyer can create a vendor listing inline while writing a
  review ("Business not listed? Add it here"); a vendor can later sign up
  with a business account and claim that listing to unlock verification
  and the business dashboard. This means `Vendor` is a standalone entity,
  not 1:1 with `BusinessProfile`.

## Data model

### Reused unchanged
`User`, `PersonalProfile`, `BusinessProfile`, `Admin`, `Category`,
`Region`, `State`, `City`.

### New: `Vendor`
The searchable business listing.

| Field | Type | Notes |
|---|---|---|
| id | UUID PK | |
| name | string | |
| primaryPlatform | enum: instagram/tiktok/facebook/whatsapp/twitter/other | nullable |
| handle | string | the @handle shown in search/profile, nullable |
| categoryId | UUID FK → Category | nullable |
| cityId | UUID FK → City | nullable |
| address | text | free-text area/street, nullable |
| description | text | nullable |
| logoUrl, coverUrl | string | nullable |
| phone, whatsapp | string | nullable |
| businessHours | string | free text, e.g. "Mon–Sat · 9am–8pm" |
| verificationStatus | enum: unclaimed/pending/verified/rejected | default `unclaimed` |
| ownerUserId | UUID FK → User, nullable | set when a business account claims the listing |
| claimedAt | date | nullable |
| createdByUserId | UUID FK → User | who added the listing |
| status | enum: active/suspended | default `active`, admin-controlled |
| avgRating | decimal | denormalized |
| reviewCount | integer | denormalized |
| trustScore | integer 0–100 | denormalized, see below |
| trustSignals | JSONB | `{verifiedReviewerPct, ownerResponseRatePct, recencyPct, fraudSignalsClear}` |

Indexes: `handle`, `categoryId`, `cityId`, `verificationStatus`, plus a
trigram/ILIKE-friendly index on `name` for search.

### New: `Review`

| Field | Type | Notes |
|---|---|---|
| id | UUID PK | |
| vendorId | UUID FK → Vendor | |
| reviewerId | UUID FK → User | must be authenticated |
| rating | integer 1–5 | |
| tags | array of string | Delivery, Quality, Authenticity, Communication, Speed, Value for Money, As Advertised, Would Buy Again, Packaging, Customer Service |
| content | text | min 20 chars, enforced at API layer |
| isAnonymous | boolean | hides reviewer name publicly only; identity still known internally |
| orderedPhotoUrl | string | nullable — "what I ordered" |
| gotPhotoUrl | string | nullable — "what I got" |
| additionalPhotos | array of string | max 5 |
| vendorResponse | text | nullable |
| vendorRespondedAt | date | nullable |
| helpfulCount | integer | default 0, for "Most Helpful" sort |
| status | enum: published/pending/removed | default `published`; flagged reviews move to `pending` for admin review |
| flagReason | string | nullable |
| flaggedById | UUID FK → User | nullable |

A user cannot review a vendor they own (`reviewerId !== vendor.ownerUserId`).
"Verified" badge on a review = `reviewer.verified` (their own email
verification status) — no separate verified-purchase concept for this
phase.

### New: `SavedVendor`
`userId` + `vendorId`, unique pair, optional `notes`. Buyer bookmarks.

## Trust score

Recomputed synchronously whenever a review is created/moderated or a
vendor's verification status changes, via a single
`recalculateVendorStats(vendorId)` utility:

- **Average rating** (60% weight) — normalized 0–100 from the 1–5 scale.
- **Verification bonus** — flat +15 if `verificationStatus === 'verified'`.
- **Review recency** (10% weight) — % of published reviews within the last
  90 days.
- **Owner response rate** (15% weight) — % of published reviews with a
  `vendorResponse`.
- Remaining weight reserved for a fraud-signal check (starts at full marks;
  hook for future abuse-detection logic).

Result clamped to 0–100. The same run also updates `avgRating`,
`reviewCount`, and the four `trustSignals` sub-values shown in the
mockup's sidebar panel.

## API surface

This phase ships backend endpoints only — no frontend pages are built or
wired in this sub-project.

- Reuse as-is: `/api/auth/*`, `/api/lookup/{categories,regions,states,cities}`,
  `/api/upload/image`.
- New `/api/vendors`:
  - `GET /` — search/list (`q` matches name or handle case-insensitively,
    filters: category, city, minRating, verifiedOnly; sort: most reviewed /
    highest rated / newest / most recent activity). Public.
  - `GET /:id` — public profile incl. rating breakdown and trust signals.
  - `POST /` — create a new (unclaimed) listing. Any authenticated user.
  - `POST /:id/claim` — business account claims a listing → sets
    `ownerUserId`, `verificationStatus: pending`.
  - `PUT /:id` — update own listing. Owner only.
- New `/api/reviews`:
  - `POST /` — create a review for a vendor. Authenticated.
  - `POST /:id/respond` — vendor owner responds.
  - `POST /:id/flag` — any authenticated user flags a review.
  - `GET /mine` — the current user's own reviews.
- New `/api/saved-vendors`: `GET /`, `POST /:vendorId`, `DELETE /:vendorId`.

Admin moderation endpoints (approve/remove flagged reviews, approve/reject
vendor verification) are deferred to the Admin sub-project — this phase
only needs `Review.status` and `Vendor.verificationStatus` to exist so
that sub-project has something to operate on.

## Cleanup

Full deletion (unwired, nothing depends on them, part of the confirmed
pivot away from the creator/brand marketplace):

- Models: `Creator`, `Brand`, `Contract`, `ContractTemplate`,
  `CollaborationRequest`, `RequestNegotiation`, `Message`, `Conversation`,
  `Notification`, `Payment`, `Payout`, `BankAccount`, `RateCard`,
  `ServicePackage`, `PortfolioItem`, `AvailabilitySlot`, `LegalClause`,
  `SocialAccount`, `TierConfiguration`, `PlatformSettings`, `SavedCreator`.
- Their controllers, routes, and migrations/seeders.
- `socket/` (real-time messaging — not part of the mockup).
- `services/papersignal.service.js` (contract e-signing), 
  `services/paystack.service.js` (payments — no pricing/payment screen in
  the mockup).
- The existing `Review` model and `review.controller.js`/`review.routes.js`
  are replaced by the new vendor-review versions above, not kept alongside.

`AuditLog` is kept (generic admin action log, reusable for the Admin
sub-project later).

## Dev workflow

Continue using the existing `sequelize.sync({ alter: true })` dev-sync flow
already in `server/index.js` rather than writing formal Sequelize
migrations — this matches how the three currently-active tables already
work locally and keeps iteration fast. Formal migrations can be introduced
before any production deploy.

No changes to the local Postgres connection/config — this spec works
within the database the user has already connected.

## Testing

- Model-level: `recalculateVendorStats` unit-testable in isolation given a
  vendor + a set of reviews.
- Controller-level: exercise the new endpoints (vendor create/search/claim,
  review create/respond/flag) against a test database.
