# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## IMPORTANT: Always read docs first

**Before writing any code, read every relevant file in `/docs/` for the area you are working in.** The `/docs/` directory contains mandatory coding standards that override default behavior. Non-compliance is not acceptable.

| Working on | Read first |
|---|---|
| Any UI / frontend code | `docs/ui.md` |
| Any data fetching, database queries, or server data access | `docs/data-fetching.md` |

If no doc exists for an area, proceed with general best practices — but check `/docs/` first regardless.

## Commands

```bash
npm run dev      # start dev server at localhost:3000
npm run build    # production build
npm run lint     # run ESLint
```

No test suite is configured yet.

## Stack

- **Next.js 16.2.4** with the App Router (`src/app/`)
- **React 19.2.4**
- **TypeScript** (strict mode, path alias `@/*` → `src/*`)
- **Tailwind CSS v4** via `@tailwindcss/postcss`

## Architecture

This is a fresh Next.js App Router project. All routes live under `src/app/` using the file-system router:

- `src/app/layout.tsx` — root layout; loads Geist fonts, sets `<html>` and `<body>` wrappers
- `src/app/page.tsx` — home route (`/`)
- `src/app/globals.css` — global styles

New routes are added as `src/app/<segment>/page.tsx`. Shared UI components should go in `src/components/` (not yet created). Server-side data fetching uses async Server Components by default; Client Components require the `"use client"` directive.

## Next.js version note

This project uses **Next.js 16**, which has breaking changes from earlier versions. Before writing any Next.js-specific code, read the relevant guide in `node_modules/next/dist/docs/` (App Router docs are under `01-app/`). Heed deprecation notices.

