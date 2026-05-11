# Data Fetching Standards

## Rule: server components only

**ALL data fetching must happen inside async Server Components. No exceptions.**

Data must never be fetched via:
- Route handlers (`src/app/api/`)
- Client Components (`"use client"`)
- `useEffect` + `fetch`
- SWR, React Query, or any client-side data library
- Any other mechanism not listed as allowed above

If a component needs data, it must either be a Server Component itself, or receive the data as a prop passed down from a parent Server Component.

## Rule: all queries go through `/data` helpers

**Database queries must never be written inline inside a page or layout. Every query must live in a dedicated helper function inside the `src/data/` directory.**

Helper functions in `src/data/` are the only place Drizzle ORM queries are written. Pages and layouts call these helpers — they do not construct queries themselves.

```
src/
  data/
    workouts.ts     ← query helpers for the workouts table
    exercises.ts    ← query helpers for the exercises table
    sets.ts         ← query helpers for the sets table
  app/
    dashboard/
      page.tsx      ← calls helpers from src/data/, never queries directly
```

## Rule: use Drizzle ORM — never raw SQL

**All database access must use the Drizzle ORM client from `@/db`. Raw SQL strings are not permitted.**

```ts
// ALLOWED — Drizzle query builder
import { db } from "@/db"
import { workouts } from "@/db/schema"
import { eq, and, gte, lt } from "drizzle-orm"

const rows = await db
  .select()
  .from(workouts)
  .where(eq(workouts.userId, userId))

// NOT ALLOWED — raw SQL
await db.execute(sql`SELECT * FROM workouts WHERE user_id = ${userId}`)
```

## Rule: every query must be scoped to the authenticated user

**This is a hard security requirement. A logged-in user must only ever be able to read or write their own data.**

Every helper function in `src/data/` that touches user-owned tables (`workouts`, `workout_exercises`, `sets`) must:

1. Accept `userId` as an explicit parameter — never read it from a global or infer it inside the helper
2. Include `eq(table.userId, userId)` (or an equivalent join condition) in every `WHERE` clause
3. Never return rows belonging to a different user

The caller (the Server Component) is responsible for obtaining the authenticated `userId` from Clerk and passing it to the helper.

```ts
// src/data/workouts.ts
import { db } from "@/db"
import { workouts, workoutExercises, exercises } from "@/db/schema"
import { and, eq, gte, lt } from "drizzle-orm"

export async function getWorkoutsForDate(userId: string, date: Date) {
  const start = new Date(date)
  start.setHours(0, 0, 0, 0)
  const end = new Date(date)
  end.setHours(23, 59, 59, 999)

  return db
    .select()
    .from(workouts)
    .where(
      and(
        eq(workouts.userId, userId),   // ← user scope — never omit this
        gte(workouts.startedAt, start),
        lt(workouts.startedAt, end),
      ),
    )
    .orderBy(workouts.startedAt)
}
```

```ts
// src/app/dashboard/page.tsx
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { getWorkoutsForDate } from "@/data/workouts"

export default async function DashboardPage() {
  const { userId } = await auth()
  if (!userId) redirect("/sign-in")

  const workoutList = await getWorkoutsForDate(userId, new Date())

  // render workoutList with shadcn components...
}
```

## What belongs where

| Concern | Location |
|---|---|
| Drizzle query logic | `src/data/<table>.ts` |
| Auth check + `userId` retrieval | Server Component (`page.tsx` / `layout.tsx`) |
| Rendering data | Server Component, passing props to Client Components as needed |
| Mutations (writes) | Server Actions defined in `src/data/` or co-located `actions.ts` files — still no route handlers |

## Enforcement checklist

Before committing any data-related code, verify:

- [ ] Data is fetched inside an async Server Component, not a Client Component
- [ ] No `fetch()`, `useEffect`, SWR, or React Query used for database data
- [ ] No route handlers created under `src/app/api/` for internal data access
- [ ] All queries live in helper functions inside `src/data/`
- [ ] All queries use the Drizzle query builder — no raw SQL
- [ ] Every query on a user-owned table includes `eq(table.userId, userId)` in the `WHERE` clause
- [ ] `userId` is sourced from Clerk's `auth()` in the Server Component and passed explicitly to the helper
