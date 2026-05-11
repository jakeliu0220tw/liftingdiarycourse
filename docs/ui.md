# UI Coding Standards

## Rule: shadcn/ui only

**All UI in this project must be built exclusively with shadcn/ui components. No custom UI components may be created.**

This applies to every layer of the UI: layout primitives, form controls, feedback elements, navigation, overlays, and typography. If a component does not exist in shadcn/ui, request it be added via the CLI before writing any markup.

## Why

Custom components fragment the design system, create inconsistency, and duplicate work shadcn/ui already handles. Enforcing a single source of truth keeps the codebase predictable and maintainable.

## Setup

- **Style:** `radix-nova`
- **Base color:** `neutral`
- **CSS variables:** enabled
- **Icon library:** `lucide`
- **Component output path:** `src/components/ui/`
- **Config:** `components.json` at the project root

## Adding components

Install new shadcn/ui components with the CLI:

```bash
npx shadcn@latest add <component-name>
```

Components are written to `src/components/ui/`. Import them from the `@/components/ui/` alias:

```tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
```

## What is and is not allowed

| Allowed | Not allowed |
|---|---|
| shadcn/ui components from `@/components/ui/` | Hand-rolled `<div>`/`<span>` wrappers dressed as components |
| Composing multiple shadcn/ui components together in a page or route file | New files under `src/components/` that are not shadcn/ui output |
| Passing className props to shadcn/ui components for one-off layout adjustments | Separate component files that wrap or re-export shadcn/ui with added logic |
| Lucide icons (already bundled) | Custom icon components |

## Composition vs. abstraction

You may compose shadcn/ui components inline within a page or layout file to build more complex UI. What you may **not** do is extract that composition into a new component file.

**Allowed — inline composition in a page:**
```tsx
// src/app/dashboard/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Lifts</CardTitle>
      </CardHeader>
      <CardContent>
        <Button>Add Entry</Button>
      </CardContent>
    </Card>
  );
}
```

**Not allowed — extracting into a custom component:**
```tsx
// src/components/RecentLiftsCard.tsx  ← DO NOT CREATE
export function RecentLiftsCard() { ... }
```

## Date formatting

All dates must be formatted using `date-fns`. The standard display format is ordinal day, abbreviated month, full year:

```
1st Sep 2025
2nd Aug 2025
3rd Jan 2026
4th Jun 2024
```

Use the format string `do MMM yyyy`:

```tsx
import { format } from "date-fns";

format(date, "do MMM yyyy"); // "1st Sep 2025"
```

Never use `Date.toLocaleDateString()`, `Intl.DateTimeFormat`, or manual string concatenation for display dates.

## Enforcement checklist

Before committing UI code, verify:

- [ ] Every UI element comes from `@/components/ui/`
- [ ] No new files were added to `src/components/` outside of `src/components/ui/`
- [ ] No inline `styled-components`, CSS modules, or raw HTML elements used as UI components
- [ ] Any needed component not yet installed was added with `npx shadcn@latest add`
- [ ] All displayed dates use `date-fns` with the `do MMM yyyy` format string
