This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started


git init  # initialize git
git remote add origin https://github.com/OSINTWeb/Profiler-v1.git
git add .
git commit -m "Initial commit"
git branch -M main  # rename to main (if needed)
git push -u origin main
First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.




Here’s a clean and scalable **Next.js backend architecture** for your application with the five features you've outlined. This design is **API-first**, privacy-respecting, and built for flexibility.

---

## 🧱 **Backend Architecture (Next.js + API Routes + MongoDB + Auth + Stripe)**

### 🌐 **Tech Stack**

* **Next.js App Router** (`app/api` directory for backend routes)
* **MongoDB Atlas** (Search logs, users, queries)
* **Prisma or Mongoose** (ORM/ODM for DB access)
* **Auth.js** or **Clerk/Auth0** (User auth with opt-in logging)
* **Stripe** (For monetized anonymous access)
* **Zod** (Input validation)
* **NextAuth.js / Middleware** (Auth gate for protected routes)

---

## 📂 Folder Structure (Minimalist & Modular)

```
/app
  /api
    /search        -> Handles new search submissions
    /logs          -> Opt-in log saving and retrieval
    /analytics     -> Handles anonymized queries
    /downloads     -> File export endpoints
    /share         -> Shareable links
/lib
  /db.ts           -> MongoDB connection
  /auth.ts         -> Auth helpers
  /stripe.ts       -> Stripe payment handler
  /logger.ts       -> Optional logger
/models
  /User.ts
  /SearchLog.ts
  /SharedLink.ts
/middleware.ts     -> Request validation/auth middleware
/utils
  /exporters.ts    -> CSV, PDF, JSON, DOCX generation
  /formatters.ts   -> Clean/format search results
```

---

## 🔧 Feature-wise Implementation Plan

---

### ✅ 1. Optional Logging

**Database:**

```ts
SearchLog {
  userId: string | null
  query: string
  createdAt: Date
  isLoggingEnabled: boolean
}
```

**Endpoint:**

```ts
POST /api/search
- if user has logging enabled, store to DB
- else, process search and discard input
```

**Toggle Logging:**

```ts
PATCH /api/logs/toggle
- user flips `isLoggingEnabled` flag
```

---

### 🔍 2. Revisit Past Searches (Opt-in)

**Endpoint:**

```ts
GET /api/logs
- Returns previous searches if logging was enabled
- Requires authentication
```

**DB Indexing** for performance:

```ts
db.SearchLog.createIndex({ userId: 1, createdAt: -1 })
```

---

### 🕵️‍♂️ 3. Anonymised Intelligence

**Use Case:** Pay-per-query anonymous log access

**Flow:**

1. User submits email/phone.
2. System finds anonymized data matches.
3. Stripe checkout for `$0.005` per query.
4. Return relevant insights.

**Endpoint:**

```ts
POST /api/analytics/access
- Verify payment (Stripe webhook)
- Filter `SearchLog` where `isAnonymous=true`
- Return results
```

**Database Flag:**

```ts
SearchLog.isAnonymous: true
```

---

### 📁 4. Verified Result Downloads

**Formats:**

* CSV: `papaparse`
* DOCX: `docx` npm package
* PDF: `pdf-lib`
* JSON: native

**Endpoint:**

```ts
POST /api/downloads
- Accepts query ID or data blob
- Returns downloadable file
```

**Security:**

* JWT signed result IDs
* User verification before download

---

### 🔗 5. Publish & Share Seamlessly

**Database:**

```ts
SharedLink {
  slug: string
  data: SearchLog
  createdAt: Date
}
```

**Endpoint:**

```ts
POST /api/share
- Store the search data
- Generate a slug (e.g., nanoid)
```

```ts
GET /api/share/[slug]
- Return the result to anyone without login
```

**UI:**

* Route: `/share/[slug]` renders beautiful result
* No signup required

---

## 🛡 Security & Middleware

* Use **middleware.ts** for token verification & rate limiting
* Optional: **reCAPTCHA** to protect `/api/search`

---

## 💬 Final Notes

| Feature   | API Route               | Auth Required   | Monetized |
| --------- | ----------------------- | --------------- | --------- |
| Search    | `/api/search`           | Optional        | ❌         |
| Logs      | `/api/logs`             | ✅               | ❌         |
| Analytics | `/api/analytics/access` | ❌               | ✅         |
| Downloads | `/api/downloads`        | ✅               | ❌         |
| Share     | `/api/share`            | ✅ (or Optional) | ❌         |

---

If you'd like, I can generate code stubs for each route or setup MongoDB/Prisma models. Just let me know.
