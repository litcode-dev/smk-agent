# Debug UI Redesign — Design Spec

**Date:** 2026-04-28  
**Status:** Approved — ready for implementation  
**Scope:** Full visual polish of the Zance debug dashboard at `debug/`

---

## Background

The existing debug UI is functional but inconsistent: mixed accent colors (sky blue badges, amber permanent markers, grey active states), a cluttered header with memory pill counts, and flat sidebar styling with no clear active state. The goal is a cohesive, industry-standard look that matches tools like Supabase and Railway — without changing any underlying data or behavior.

---

## Design Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Visual direction | Structured / Supabase-inspired | Icon-led sidebar, card layout, clear hierarchy on dark slate |
| Accent color | Emerald (`#10b981` / `#059669`) | Signals "live" and "online"; used by Supabase, Fly.io, Vercel |
| Scope | Full polish across all 7 panels | Dashboard gets most attention; all panels get consistent chrome |
| Implementation approach | Design tokens + shared primitives | `theme.ts` token map + 4–5 shared components |

---

## Architecture

### Design Tokens — `debug/src/lib/theme.ts`

A single file that exports Tailwind class maps keyed by semantic role. All components import from here — no hardcoded color strings in component files.

```ts
export const theme = {
  // Backgrounds
  bg: {
    page:    'bg-[#020617]',
    surface: 'bg-[#0f172a]',
    card:    'bg-[#0f172a]',
    hover:   'hover:bg-slate-800/40',
  },
  // Borders
  border: {
    base:    'border-slate-800',
    subtle:  'border-[#0f172a]',
    accent:  'border-emerald-900',
  },
  // Text
  text: {
    primary:  'text-slate-100',
    secondary:'text-slate-400',
    muted:    'text-slate-600',
    accent:   'text-emerald-400',
  },
  // Status colors (dot, text, border, bg for the tinted card)
  status: {
    running:   { dot: 'bg-sky-400',     text: 'text-sky-400',     border: 'border-sky-900/60',     card: 'bg-sky-950/30'     },
    completed: { dot: 'bg-emerald-400', text: 'text-emerald-400', border: 'border-emerald-900/60', card: 'bg-emerald-950/30' },
    failed:    { dot: 'bg-rose-400',    text: 'text-rose-400',    border: 'border-rose-900/60',    card: 'bg-rose-950/30'    },
    cancelled: { dot: 'bg-slate-500',   text: 'text-slate-500',   border: 'border-slate-800',      card: 'bg-slate-900/30'   },
    spawned:   { dot: 'bg-amber-400',   text: 'text-amber-400',   border: 'border-amber-900/60',   card: 'bg-amber-950/30'   },
  },
  // Memory tier
  tier: {
    short:     { pill: 'bg-sky-950 text-sky-400 border-sky-900/40'     },
    long:      { pill: 'bg-violet-950 text-violet-400 border-violet-900/40' },
    permanent: { pill: 'bg-amber-950 text-amber-400 border-amber-900/40'    },
  },
} as const;
```

Light mode uses the same token keys, with a parallel `themeLight` export. All components continue to receive `isDark: boolean` as a prop (matching the existing pattern) and select the correct token map based on that value.

### Shared Components — `debug/src/components/ui/`

| Component | Props | Used by |
|---|---|---|
| `Card` | `children, className?` | Every panel |
| `Badge` | `variant: status\|tier, value: string` | Agents, Memory, Events |
| `StatCard` | `label, value, trend?, trendDir?` | Dashboard |
| `EmptyState` | `message` | All panels |
| `PanelHeader` | `title, meta?, children?` | All panels |

---

## Shell & Navigation

### Header (simplified)
- **Logo:** 26×26px rounded-lg emerald gradient square with "Z" initial
- **Title:** `Zance · debug` — 13px semi-bold + 12px muted
- **Live pill:** Emerald glowing dot + "Live" text in a dark green pill
- **Theme toggle:** Icon button, top-right
- **Removed:** Memory counts (short/long/permanent) — moved to Dashboard panel

### Sidebar
- **Width:** 196px (up from 168px)
- **Active state:** 2.5px emerald left border + very subtle `bg-emerald-950/30` tint
- **Inactive items:** `text-slate-500`, no background
- **Active badge (Agents count):** Emerald pill with dark green text
- **Divider** before Connections item

---

## Dashboard Panel

### Stat cards (4-column grid)
| Metric | Trend color |
|---|---|
| Total Cost | emerald (up = more spend, neutral framing) |
| Agents Run | emerald (up = good) |
| Tokens Used | sky |
| Failure Rate | rose (up = bad) |

Each card: label (9px uppercase tracking), value (20px bold), trend arrow + delta + "vs last week" in muted text.

### Cost over time chart
Bar chart (7 days) using the existing `agentCost` per-day data. Bars in emerald. The existing Convex query aggregates cost into a single `agentCost` value per day — no per-agent-type breakdown is available, so this is a single-series chart. Legend is omitted.

### Agent status breakdown
Single horizontal bar split into status segments (completed, running, failed, cancelled) with a legend below. Shows relative distribution of the last 60 agents.

### Memory summary
Three inline counters: Short / Long / Permanent — relocated from the header. Muted label + bold count.

### Recent agents list
Up to 8 rows: status dot (colored, live-glow when running) + task label + relative time + cost. Clicking navigates to the Agents panel detail.

---

## Agents Panel

- **Filter tabs:** Segmented pill group (All / Running / Done / Failed / Cancelled) — replaces floating buttons
- **Rows:** Status-colored 2px left border, status dot, task text, relative time (right-aligned), cost (right-aligned)
- **Active agent indicator:** Sky pill with glowing dot in panel header
- **Detail view:** Unchanged structurally — inherits new card/badge primitives

---

## Memory Panel

- **Filter tabs:** All / Short / Long / Permanent pill group
- **Segment filter:** Separate pill group (identity / preference / relationship / project / knowledge / context)
- **Search input:** Inline search field, right-aligned in header
- **Rows:** Tier pill (rounded-full, uppercase, 8px) + segment text (color-coded) + content preview + relative timestamp
- **Expand row:** Click to reveal full content — no change in behavior
- **Graph view toggle:** Unchanged

---

## Automations Panel

- **Enabled count:** Emerald pill badge in panel header
- **Toggle:** Pill toggle — emerald when on, slate-800 when off
- **Row border:** Subtle emerald tint + emerald border when enabled; standard slate when disabled
- **Disabled row:** 45% opacity
- **Schedule display:** Monospace cron expression + "ran X ago" or "never ran"

---

## Events Panel

- **Panel header:** "Events" title + live glowing dot
- **Event type pills:** `rounded-full` uppercase 8px pills with per-type color:
  - `memory.written` → emerald
  - `memory.recalled` → sky
  - `memory.extracted` → violet
  - `memory.consolidated` → amber
  - `memory.cleaned` → slate
- **Most recent event:** Slightly highlighted (emerald tinted border) to draw eye
- **Data payload:** Muted monospace text below pill row

---

## Consolidation Panel

- **Horizontal stepper** replaces vertical card stack
- **5 phases:** Loaded → Proposed → Judging → Applying → Done
- **Completed phase:** Emerald circle + checkmark + count badge below
- **Active phase:** Glowing amber circle (box-shadow pulse) + label
- **Pending phases:** Dark outlined circles with step number
- **Connector lines:** Emerald for completed segments, gradient for active transition, slate for pending
- **Phase detail card:** Below the stepper — shows current phase description and any live counts

---

## Connections Panel

- **Connected cards:** Emerald border + `bg-emerald-950/40` tint
- **Disconnected cards:** Standard slate border + 45% opacity
- **Status line:** Emerald dot + "connected" text; slate dot + "not connected" for disconnected
- **Count summary:** "N connected" emerald pill in panel header
- **No structural changes** to `ComposioSection` behavior

---

## Light Mode

All panels support `isDark: boolean`. Light mode uses:
- Page background: `#f8fafc`
- Surface: `#ffffff`
- Borders: `#e2e8f0`
- Text primary: `#0f172a`
- Text muted: `#94a3b8`
- Accent: `#059669` (slightly darker emerald for contrast on white)
- Status colors: slightly more saturated equivalents

The `theme.ts` token file exports both `theme` (dark) and `themeLight` (light) with the same shape.

---

## What Does NOT Change

- All data queries, Convex hooks, mutation handlers
- Component prop interfaces (all panels keep `isDark: boolean`)
- Routing / panel switching logic in `App.tsx`
- Agent detail view structure in `AgentsPanel`
- Memory graph view (`MemoryGraphView`)
- `ComposioSection` internal logic

---

## File Changeset (expected)

```
debug/src/lib/theme.ts                    (new)
debug/src/components/ui/Card.tsx          (new)
debug/src/components/ui/Badge.tsx         (new)
debug/src/components/ui/StatCard.tsx      (new)
debug/src/components/ui/EmptyState.tsx    (new)
debug/src/components/ui/PanelHeader.tsx   (new)
debug/src/App.tsx                         (shell, header, sidebar)
debug/src/components/DashboardPanel.tsx   (full rework)
debug/src/components/AgentsPanel.tsx      (chrome only)
debug/src/components/MemoryPanel.tsx      (chrome only)
debug/src/components/AutomationsPanel.tsx (chrome only)
debug/src/components/EventsPanel.tsx      (chrome only)
debug/src/components/ConsolidationPanel.tsx (horizontal stepper)
debug/src/components/ConnectionsPanel.tsx (thin wrapper — likely unchanged)
```
