# Password Backend

Lightweight REST API for secure password storage and management built with **Node.js + Express** and **Supabase** (Postgres + Auth). Ready for serverless deployment (Vercel) and designed to be the data layer for password-manager apps.

---

## Table of contents

* [Features](#features)
* [Project structure](#project-structure)
* [Data model](#data-model)
* [Requirements](#requirements)
* [Environment variables](#environment-variables)
* [Local development](#local-development)
* [API endpoints & examples](#api-endpoints--examples)
* [Security recommendations](#security-recommendations)
* [Deployment (Vercel)](#deployment-vercel)
* [Testing](#testing)
* [Observability & monitoring](#observability--monitoring)
* [Notes & next steps](#notes--next-steps)
* [License](#license)

---

## Features

* CRUD for password entries (`set`, `get`, `delete`)
* Per-user isolation (username derived from email prefix by convention)
* Uses Supabase client for database & auth integration
* Designed for serverless deployment (Vercel-ready routing)
* Small, focused codebase suitable for extension (e.g., encryption improvements, sharing, tags)

---

## Project structure

```
password-backend/
├── api/                     # Express route handlers
│   ├── deletePassword.js
│   ├── getPassword.js
│   └── setPassword.js
├── util/
│   ├── db.js                # DB operation helpers (Supabase wrappers)
│   └── supabaseClient.js    # Supabase client initialization
├── server.js                # Main Express server (or serverless adapter)
├── package.json
└── vercel.json              # Vercel routing / config
```

---

## Data model

Each password entry minimally contains:

* `id` (string/uuid) — unique identifier
* `site` (string) — website or service name
* `username` (string) — account identifier for the site
* `password` (string) — **encrypted** password (ciphertext)
* `user` (string) — owner identifier (derived from the owner’s email prefix in this project)
* `created_at`, `updated_at` (timestamps) — optional but recommended

> Note: The repo currently expects `password` to be stored encrypted. Use KMS/secure key management in production.

---

## Requirements

* Node.js (16+ recommended)
* npm or yarn
* Supabase project (Postgres + Service Role key for server-side operations)
* If deploying to Vercel: a Vercel account

---

## Environment variables

Create a `.env` (or set in your deployment platform):

```env
# Supabase
SUPABASE_URL=https://your-supabase-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key   # keep secret; server-only
SUPABASE_ANON_KEY=optional-readonly-key          # not required for server operations

# App
PORT=3000
ENCRYPTION_KEY=base64-or-hex-key-for-encryption  # do NOT check into VCS
NODE_ENV=development
```

**Security**: Never commit `SUPABASE_SERVICE_ROLE_KEY` or `ENCRYPTION_KEY` to source control. Use environment variables or a secrets manager.

---

## Local development

1. Clone and install:

```bash
git clone <repo-url>
cd password-backend
npm install
```

2. Add `.env` with keys (see above).

3. Run:

```bash
# development
npm run dev         # or: node server.js

# if server.js exports a handler for serverless, you may use vercel dev
npx vercel dev
```

4. Hit endpoints (examples below).

---

## API endpoints & examples

### 1) Create / Update password — `POST /api/setPassword`

Creates a new entry or updates an existing one.

**Request**

```http
POST /api/setPassword
Content-Type: application/json
Authorization: Bearer <jwt-or-api-key>

{
  "id": "optional-existing-id",
  "site": "example.com",
  "username": "alice@example.com",
  "password": "plain-or-encrypted-string",
  "user": "alice"              // derived from email prefix convention
}
```

**Response**

```json
{
  "success": true,
  "id": "generated-or-provided-id"
}
```

---

### 2) Get passwords — `GET /api/getPassword`

Retrieve password entries for a user (filtered by `user`).

**Example**

```http
GET /api/getPassword?user=alice
Authorization: Bearer <jwt-or-api-key>
```

**Response**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-1",
      "site": "example.com",
      "username": "alice@example.com",
      "password": "encrypted-ciphertext",
      "user": "alice",
      "created_at": "2025-01-01T12:34:56Z"
    }
  ]
}
```

---

### 3) Delete password — `POST /api/deletePassword`

Delete by `id`.

**Request**

```http
POST /api/deletePassword
Content-Type: application/json
Authorization: Bearer <jwt-or-api-key>

{ "id": "uuid-1", "user": "alice" }
```

**Response**

```json
{ "success": true, "deleted": 1 }
```

---

## Security recommendations

1. **Encrypt passwords** before persisting. Use strong symmetric encryption (AES-GCM) with per-record IV and authenticated encryption. Manage keys using a KMS (AWS KMS, GCP KMS, Azure Key Vault) — **do not** store raw keys in repo.
2. **Server-side auth only**: Validate the `Authorization` token server-side. Use Supabase Auth or JWTs. Ensure the service role key is server-only.
3. **Least privilege**: If possible, use a custom RLS policy in Supabase and avoid exposing service role to the edge when not needed. Use function-level Service Role only for server operations that must bypass RLS.
4. **Input validation**: Validate all client input and sanitize where necessary. Use a validation library (Joi, Zod, express-validator).
5. **Rate limiting**: Add rate limiting (express-rate-limit) to protect endpoints from abuse.
6. **Audit logging**: Log create/update/delete operations with user id and timestamp. Store logs separately.
7. **Avoid sending plaintext passwords** in responses. If you must (for testing), mark it clearly and ensure secure channels (HTTPS).
8. **Rotate keys** periodically and provide a key-rotation strategy for encrypted data (re-encrypt on rotation).

---

## Deployment (Vercel)

This project includes `vercel.json` and is prepared for serverless deployment.

1. Set project env variables in the Vercel dashboard (`SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_URL`, `ENCRYPTION_KEY`).
2. Deploy:

```bash
vercel --prod
```

3. If using serverless functions (`/api/*`), ensure `server.js` exports a handler compatible with Vercel or use separate function files under `/api`.

---

## Testing

* **Unit tests**: add tests for `db.js` and route handlers (mocha/jest).
* **Integration tests**: spin up a test Supabase instance (or use a sandbox) and run end-to-end tests against the API.
* **Manual**: use curl or Postman to exercise endpoints (examples above).

---

## Observability & monitoring

* Add structured logging (pino/winston).
* Add error tracking: Sentry, LogRocket, Rollbar.
* Add basic metrics: requests/sec, error rate, latency (Prometheus + Grafana, or a hosted alternative).

---

## Notes & next steps

* Consider adding user registration / authentication flows (if not handled by Supabase Auth).
* Add RBAC or RLS (Row Level Security) on Supabase to enforce per-user access at DB level.
* Add support for password sharing, folders, tags, and search.
* Provide a first-party minimal web UI or example client demonstrating how to call the API and decrypt/display password data securely.

---

## Example curl commands

Create/update:

```bash
curl -X POST https://your-domain/api/setPassword \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"site":"example.com","username":"alice@example.com","password":"encrypted-value","user":"alice"}'
```

List:

```bash
curl "https://your-domain/api/getPassword?user=alice" \
  -H "Authorization: Bearer $TOKEN"
```

Delete:

```bash
curl -X POST https://your-domain/api/deletePassword \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"id":"uuid-1","user":"alice"}'
```

---

## License

Specify a license for your repo (MIT is common for small projects). Example:
`LICENSE` file with MIT contents.

---

If you want, I can:

* Generate the `README.md` as a downloadable file, or
* Produce an **OpenAPI 3.0** spec for these endpoints, or
* Create a small example client (HTML + JS) showing how to call `/api/getPassword` and decrypt a record (assuming you provide the encryption approach).

Which one should I do next?
