# Debug UI Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply a cohesive emerald-accent visual redesign across all 7 panels of the Zance debug dashboard without changing any data or logic.

**Architecture:** Design tokens in `theme.ts` + 5 shared UI primitives under `components/ui/` are created first; then each panel is updated panel-by-panel to use them. The `isDark: boolean` prop pattern is preserved everywhere.

**Tech Stack:** React 18, Vite, Tailwind CSS v4 (`@tailwindcss/vite` plugin), Convex React, TypeScript. No charting library — existing SVG chart in DashboardPanel stays. No new dependencies needed.

---

## File Map

| File | Status | What changes |
|---|---|---|
| `debug/src/lib/theme.ts` | **Create** | Dark + light token maps |
| `debug/src/components/ui/index.tsx` | **Create** | `Card`, `Badge`, `EmptyState`, `PanelHeader`, `FilterTabs` |
| `debug/src/App.tsx` | **Modify** | Header (remove MetricPill, add emerald live pill), sidebar (196px, emerald active state, divider) |
| `debug/src/components/DashboardPanel.tsx` | **Modify** | Stat card chrome, range tab style, chart color, memory summary row |
| `debug/src/components/AgentsPanel.tsx` | **Modify** | Filter tabs → pill group, rows → left-border accent + right-aligned meta |
| `debug/src/components/MemoryPanel.tsx` | **Modify** | Filter pills, row tier badge → rounded-full, timestamp column |
| `debug/src/components/AutomationsPanel.tsx` | **Modify** | Header badge, enabled card border tint, schedule style |
| `debug/src/components/EventsPanel.tsx` | **Modify** | Panel header, event type → pill badges, first-row highlight |
| `debug/src/components/ConsolidationPanel.tsx` | **Modify** | Vertical phase cards → horizontal stepper |

---

## Task 1: Design tokens

**Files:**
- Create: `debug/src/lib/theme.ts`

- [ ] **Step 1: Create `theme.ts`**

```ts
// debug/src/lib/theme.ts
// Single source of truth for dark/light class maps.
// All components import `darkTheme` / `lightTheme` and pick with:
//   const t = isDark ? darkTheme : lightTheme

export const darkTheme = {
  // Page & surface backgrounds
  page:    "bg-[#020617]",
  surface: "bg-[#0f172a]",
  card:    "bg-[#0f172a] border-slate-800",
  cardHover: "hover:bg-slate-800/40",

  // Text
  textPrimary:   "text-slate-100",
  textSecondary: "text-slate-400",
  textMuted:     "text-slate-500",
  textAccent:    "text-emerald-400",

  // Borders
  border:       "border-slate-800",
  borderSubtle: "border-[#0f172a]",

  // Divider
  divider: "border-slate-800",

  // Panel header title
  panelTitle: "text-slate-100 text-[13px] font-semibold",
  panelMeta:  "text-slate-500 text-[11px]",

  // Filter pill group container
  filterGroup: "bg-[#0f172a] border-slate-800",
  filterActive: "bg-slate-800 text-slate-100 font-medium",
  filterInactive: "text-slate-500 hover:text-slate-300",

  // Status colors
  status: {
    running:   { dot: "bg-sky-400",     text: "text-sky-400",     border: "border-sky-900/50",     tint: "bg-sky-950/20"     },
    spawned:   { dot: "bg-amber-400",   text: "text-amber-400",   border: "border-amber-900/50",   tint: "bg-amber-950/20"   },
    completed: { dot: "bg-emerald-400", text: "text-emerald-400", border: "border-emerald-900/50", tint: "bg-emerald-950/20" },
    failed:    { dot: "bg-rose-400",    text: "text-rose-400",    border: "border-rose-900/50",    tint: "bg-rose-950/20"    },
    cancelled: { dot: "bg-slate-500",   text: "text-slate-500",   border: "border-slate-800",      tint: "bg-slate-900/20"   },
  },

  // Memory tier badge pills
  tier: {
    short:     "bg-sky-950 text-sky-400 border border-sky-900/40",
    long:      "bg-violet-950 text-violet-400 border border-violet-900/40",
    permanent: "bg-amber-950 text-amber-400 border border-amber-900/40",
  },

  // Memory segment text colors
  segment: {
    identity:     "text-rose-400",
    preference:   "text-teal-400",
    relationship: "text-pink-400",
    project:      "text-orange-400",
    knowledge:    "text-blue-400",
    context:      "text-slate-400",
  },

  // Event type pill backgrounds
  event: {
    "memory.written":      "bg-emerald-950 text-emerald-400 border border-emerald-900/40",
    "memory.recalled":     "bg-sky-950 text-sky-400 border border-sky-900/40",
    "memory.extracted":    "bg-violet-950 text-violet-400 border border-violet-900/40",
    "memory.consolidated": "bg-amber-950 text-amber-400 border border-amber-900/40",
    "memory.cleaned":      "bg-slate-800 text-slate-400 border border-slate-700/40",
  },

  // Live pill (header + events panel)
  livePill: "bg-emerald-950 border border-emerald-900 text-emerald-400",
  liveDot:  "bg-emerald-400",

  // Emerald badge (enabled counts, connected count)
  accentBadge: "bg-emerald-950 border border-emerald-900 text-emerald-400",

  // Sidebar
  sidebarBorder: "border-[#0f172a]",
  sidebarActiveBg: "bg-emerald-950/30",
  sidebarActiveBorder: "border-l-emerald-500",
  sidebarActiveText: "text-slate-100 font-medium",
  sidebarInactiveText: "text-slate-500 hover:text-slate-300 hover:bg-slate-800/30",
  sidebarAgentBadge: "bg-emerald-500 text-emerald-950",

  // Chart colors
  chartCost: "#10b981",
  chartInput: "#38bdf8",
  chartOutput: "#34d399",

  // Stepper
  stepperComplete: "bg-emerald-950 border-emerald-500 text-emerald-400",
  stepperActive:   "bg-amber-950 border-amber-400",
  stepperPending:  "bg-[#0f172a] border-slate-700 text-slate-500",
  stepperLineComplete: "bg-emerald-500",
  stepperLinePending:  "bg-slate-800",
} as const;

export const lightTheme = {
  page:    "bg-slate-50",
  surface: "bg-white",
  card:    "bg-white border-slate-200",
  cardHover: "hover:bg-slate-50",

  textPrimary:   "text-slate-900",
  textSecondary: "text-slate-600",
  textMuted:     "text-slate-400",
  textAccent:    "text-emerald-600",

  border:       "border-slate-200",
  borderSubtle: "border-slate-100",

  divider: "border-slate-200",

  panelTitle: "text-slate-900 text-[13px] font-semibold",
  panelMeta:  "text-slate-400 text-[11px]",

  filterGroup: "bg-slate-100 border-slate-200",
  filterActive: "bg-white text-slate-900 font-medium shadow-sm",
  filterInactive: "text-slate-500 hover:text-slate-700",

  status: {
    running:   { dot: "bg-sky-500",     text: "text-sky-600",     border: "border-sky-200",     tint: "bg-sky-50"     },
    spawned:   { dot: "bg-amber-500",   text: "text-amber-600",   border: "border-amber-200",   tint: "bg-amber-50"   },
    completed: { dot: "bg-emerald-500", text: "text-emerald-600", border: "border-emerald-200", tint: "bg-emerald-50" },
    failed:    { dot: "bg-rose-500",    text: "text-rose-600",    border: "border-rose-200",    tint: "bg-rose-50"    },
    cancelled: { dot: "bg-slate-400",   text: "text-slate-500",   border: "border-slate-200",   tint: "bg-slate-50"   },
  },

  tier: {
    short:     "bg-sky-50 text-sky-600 border border-sky-200",
    long:      "bg-violet-50 text-violet-600 border border-violet-200",
    permanent: "bg-amber-50 text-amber-600 border border-amber-200",
  },

  segment: {
    identity:     "text-rose-600",
    preference:   "text-teal-600",
    relationship: "text-pink-600",
    project:      "text-orange-600",
    knowledge:    "text-blue-600",
    context:      "text-slate-500",
  },

  event: {
    "memory.written":      "bg-emerald-50 text-emerald-700 border border-emerald-200",
    "memory.recalled":     "bg-sky-50 text-sky-700 border border-sky-200",
    "memory.extracted":    "bg-violet-50 text-violet-700 border border-violet-200",
    "memory.consolidated": "bg-amber-50 text-amber-700 border border-amber-200",
    "memory.cleaned":      "bg-slate-100 text-slate-600 border border-slate-200",
  },

  livePill: "bg-emerald-50 border border-emerald-200 text-emerald-700",
  liveDot:  "bg-emerald-500",

  accentBadge: "bg-emerald-50 border border-emerald-200 text-emerald-700",

  sidebarBorder: "border-slate-200",
  sidebarActiveBg: "bg-emerald-50",
  sidebarActiveBorder: "border-l-emerald-500",
  sidebarActiveText: "text-slate-900 font-medium",
  sidebarInactiveText: "text-slate-500 hover:text-slate-700 hover:bg-slate-100/60",
  sidebarAgentBadge: "bg-emerald-500 text-white",

  chartCost: "#059669",
  chartInput: "#0284c7",
  chartOutput: "#059669",

  stepperComplete: "bg-emerald-50 border-emerald-500 text-emerald-600",
  stepperActive:   "bg-amber-50 border-amber-400",
  stepperPending:  "bg-slate-50 border-slate-300 text-slate-400",
  stepperLineComplete: "bg-emerald-500",
  stepperLinePending:  "bg-slate-200",
} as const;

export type Theme = typeof darkTheme;
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd /path/to/smk-agent && npm run typecheck 2>&1 | head -20
```
Expected: no errors from `theme.ts` (zero imports yet, so no errors).

- [ ] **Step 3: Commit**

```bash
git add debug/src/lib/theme.ts
git commit -m "feat(debug-ui): add design token maps (darkTheme / lightTheme)"
```

---

## Task 2: Shared UI primitives

**Files:**
- Create: `debug/src/components/ui/index.tsx`

- [ ] **Step 1: Create `debug/src/components/ui/index.tsx`**

```tsx
// debug/src/components/ui/index.tsx
// Shared primitives for all debug panels.
// Import: import { Card, Badge, EmptyState, PanelHeader, FilterTabs } from "../ui/index.js"

import type { ReactNode } from "react";
import { darkTheme, lightTheme } from "../../lib/theme.js";

// ── Card ────────────────────────────────────────────────────────────────────
export function Card({
  isDark,
  className = "",
  children,
}: {
  isDark: boolean;
  className?: string;
  children: ReactNode;
}) {
  const t = isDark ? darkTheme : lightTheme;
  return (
    <div className={`rounded-xl border p-4 ${t.card} ${className}`}>
      {children}
    </div>
  );
}

// ── Badge ───────────────────────────────────────────────────────────────────
// variant="status" — uses status colors (running/completed/failed/cancelled/spawned)
// variant="tier"   — uses tier colors (short/long/permanent)
// variant="accent" — uses the emerald accent badge (enabled count, connected count)
export function Badge({
  isDark,
  variant,
  value,
}: {
  isDark: boolean;
  variant: "status" | "tier" | "accent";
  value: string;
}) {
  const t = isDark ? darkTheme : lightTheme;
  let cls = "";
  if (variant === "accent") {
    cls = t.accentBadge;
  } else if (variant === "tier") {
    cls = t.tier[value as keyof typeof t.tier] ?? t.tier.short;
  } else {
    cls = t.status[value as keyof typeof t.status]?.text ?? t.textMuted;
  }
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[8px] font-bold uppercase tracking-[0.04em] ${cls}`}
    >
      {value}
    </span>
  );
}

// ── EmptyState ───────────────────────────────────────────────────────────────
export function EmptyState({
  isDark,
  message,
}: {
  isDark: boolean;
  message: string;
}) {
  const t = isDark ? darkTheme : lightTheme;
  return (
    <div className={`py-10 text-center text-sm ${t.textMuted}`}>{message}</div>
  );
}

// ── PanelHeader ──────────────────────────────────────────────────────────────
// Renders a consistent panel title row. `right` is an optional right-side slot
// (e.g. a Badge or a pill group).
export function PanelHeader({
  isDark,
  title,
  meta,
  right,
}: {
  isDark: boolean;
  title: string;
  meta?: string;
  right?: ReactNode;
}) {
  const t = isDark ? darkTheme : lightTheme;
  return (
    <div className="flex items-center gap-2">
      <span className={t.panelTitle}>{title}</span>
      {meta && <span className={t.panelMeta}>{meta}</span>}
      {right && <div className="ml-auto">{right}</div>}
    </div>
  );
}

// ── FilterTabs ───────────────────────────────────────────────────────────────
// Segmented pill control. `options` is an array of { value, label } objects.
export function FilterTabs<T extends string>({
  isDark,
  options,
  value,
  onChange,
}: {
  isDark: boolean;
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  const t = isDark ? darkTheme : lightTheme;
  return (
    <div
      className={`flex gap-0.5 border rounded-lg p-0.5 ${t.filterGroup}`}
    >
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`px-2.5 py-1 text-[10px] rounded-md transition-colors ${
            value === opt.value ? t.filterActive : t.filterInactive
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npm run typecheck 2>&1 | head -20
```
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add debug/src/components/ui/index.tsx
git commit -m "feat(debug-ui): add shared UI primitives (Card, Badge, EmptyState, PanelHeader, FilterTabs)"
```

---

## Task 3: App shell — header + sidebar

**Files:**
- Modify: `debug/src/App.tsx`

**What changes:**
1. Remove `MetricPill` component and the `counts = useQuery(api.memoryRecords.countsByTier, {})` query (memory counts move to DashboardPanel — it already has `data.memories` from `api.dashboard.metrics`).
2. Header: logo becomes an emerald gradient `Z` square, title reformatted as `Zance · debug`, live status becomes an emerald pill.
3. Sidebar: width `w-[196px]`, active item gets emerald left border + tint, inactive items use `sidebarInactiveText`, agent badge uses `sidebarAgentBadge`, divider added before Connections.

- [ ] **Step 1: Replace `App.tsx`**

Replace the entire file with:

```tsx
// debug/src/App.tsx
import { useEffect, useState } from "react";
import { useQuery } from "convex/react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  MachineRobotIcon,
  AiBrain02Icon,
  WorkflowCircle03Icon,
  Activity01Icon,
  Link04Icon,
  DashboardSquare01Icon,
  ArrowShrink02Icon,
} from "@hugeicons/core-free-icons";
import { api } from "../../convex/_generated/api.js";
import { useSocket } from "./lib/useSocket.js";
import { DashboardPanel } from "./components/DashboardPanel.js";
import { AgentsPanel } from "./components/AgentsPanel.js";
import { AutomationsPanel } from "./components/AutomationsPanel.js";
import { MemoryPanel } from "./components/MemoryPanel.js";
import { EventsPanel } from "./components/EventsPanel.js";
import { ConnectionsPanel } from "./components/ConnectionsPanel.js";
import { ConsolidationPanel } from "./components/ConsolidationPanel.js";
import { darkTheme, lightTheme } from "./lib/theme.js";

type View =
  | "dashboard"
  | "agents"
  | "automations"
  | "memory"
  | "events"
  | "consolidation"
  | "connections";

type Theme = "dark" | "light";

const NAV_ICONS: Record<View, any> = {
  dashboard: DashboardSquare01Icon,
  agents: MachineRobotIcon,
  automations: WorkflowCircle03Icon,
  memory: AiBrain02Icon,
  events: Activity01Icon,
  consolidation: ArrowShrink02Icon,
  connections: Link04Icon,
};

const NAV: { id: View; label: string }[] = [
  { id: "dashboard", label: "Dashboard" },
  { id: "agents", label: "Agents" },
  { id: "automations", label: "Automations" },
  { id: "memory", label: "Memory" },
  { id: "events", label: "Events" },
  { id: "consolidation", label: "Consolidation" },
  { id: "connections", label: "Connections" },
];

const CONNECTIONS_DIVIDER_BEFORE: View = "connections";

function getStoredTheme(): Theme {
  try {
    return (localStorage.getItem("zance-debug-theme") as Theme) || "dark";
  } catch {
    return "dark";
  }
}

export function App() {
  const [view, setView] = useState<View>("dashboard");
  const [theme, setTheme] = useState<Theme>(getStoredTheme);
  const { connected } = useSocket();

  const agents = useQuery(api.agents.list, {});
  const activeAgentCount = (agents ?? []).filter(
    (a) => a.status === "running" || a.status === "spawned",
  ).length;

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.classList.toggle("light", theme === "light");
    document.body.style.background = theme === "dark" ? "#020617" : "#f8fafc";
    document.body.style.color = theme === "dark" ? "#e2e8f0" : "#1e293b";
    localStorage.setItem("zance-debug-theme", theme);
  }, [theme]);

  const isDark = theme === "dark";
  const t = isDark ? darkTheme : lightTheme;

  return (
    <div className={`h-full flex flex-col ${t.page} ${t.textPrimary}`}>
      {/* ── Header ── */}
      <header
        className={`flex items-center justify-between px-5 py-2.5 border-b shrink-0 ${t.borderSubtle} ${t.surface} backdrop-blur-sm`}
      >
        <div className="flex items-center gap-3">
          {/* Emerald gradient Z logo */}
          <div className="w-[26px] h-[26px] rounded-lg flex items-center justify-center shrink-0 bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-sm">
            <span className="text-white text-[11px] font-extrabold leading-none">Z</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className={`text-[13px] font-semibold ${t.textPrimary}`}>Zance</span>
            <span className={`${t.textMuted} text-[13px]`}>·</span>
            <span className={`text-[12px] ${t.textMuted}`}>debug</span>
          </div>
          {/* Live pill */}
          <div
            className={`flex items-center gap-1.5 rounded-full px-2 py-0.5 border text-[10px] font-medium ${
              connected ? t.livePill : (isDark ? "bg-rose-950 border-rose-900 text-rose-400" : "bg-rose-50 border-rose-200 text-rose-600")
            }`}
          >
            <span className="relative flex h-[5px] w-[5px]">
              {connected && (
                <span className={`absolute inline-flex h-full w-full rounded-full ${t.liveDot} pulse-ring`} />
              )}
              <span
                className={`relative inline-flex rounded-full h-[5px] w-[5px] ${
                  connected ? t.liveDot : (isDark ? "bg-rose-400" : "bg-rose-500")
                }`}
              />
            </span>
            {connected ? "Live" : "Disconnected"}
          </div>
        </div>

        {/* Theme toggle */}
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className={`p-1.5 rounded-lg transition-colors ${
            isDark
              ? "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
              : "text-slate-500 hover:text-slate-700 hover:bg-slate-200"
          }`}
          title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
          {isDark ? (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
        </button>
      </header>

      <div className="flex flex-1 min-h-0">
        {/* ── Sidebar ── */}
        <nav
          className={`w-[196px] shrink-0 border-r flex flex-col py-1.5 ${t.sidebarBorder} ${t.surface}`}
        >
          {NAV.map((item) => {
            const isActive = view === item.id;
            return (
              <div key={item.id}>
                {item.id === CONNECTIONS_DIVIDER_BEFORE && (
                  <div className={`border-t mx-3 my-1.5 ${t.divider}`} />
                )}
                <button
                  onClick={() => setView(item.id)}
                  className={`relative w-full flex items-center gap-3 px-4 py-2.5 text-left text-[12.5px] transition-all duration-150 border-l-2 ${
                    isActive
                      ? `${t.sidebarActiveBg} ${t.sidebarActiveBorder} ${t.sidebarActiveText}`
                      : `border-l-transparent ${t.sidebarInactiveText}`
                  }`}
                >
                  <HugeiconsIcon icon={NAV_ICONS[item.id]} size={16} className="shrink-0" />
                  {item.label}
                  {item.id === "agents" && activeAgentCount > 0 && (
                    <span
                      className={`ml-auto flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-[9px] font-bold ${t.sidebarAgentBadge}`}
                    >
                      {activeAgentCount}
                    </span>
                  )}
                </button>
              </div>
            );
          })}

          <div className="mt-auto px-4 py-3 flex items-center gap-2">
            <img src="/appicon.png" alt="" className="w-5 h-5 rounded" />
            <span className={`text-[10px] ${t.textMuted} mono`}>v0.1</span>
          </div>
        </nav>

        {/* ── Main ── */}
        <main className="flex-1 min-w-0 overflow-hidden debug-scroll">
          <div className="h-full overflow-auto debug-scroll p-5 fade-in">
            {view === "dashboard" && <DashboardPanel isDark={isDark} />}
            {view === "agents" && <AgentsPanel isDark={isDark} />}
            {view === "automations" && <AutomationsPanel isDark={isDark} />}
            {view === "memory" && <MemoryPanel isDark={isDark} />}
            {view === "events" && <EventsPanel isDark={isDark} />}
            {view === "consolidation" && <ConsolidationPanel isDark={isDark} />}
            {view === "connections" && <ConnectionsPanel isDark={isDark} />}
          </div>
        </main>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Run typecheck**

```bash
npm run typecheck 2>&1 | grep -E "error|Error" | head -20
```
Expected: no errors.

- [ ] **Step 3: Start dev server and visually verify shell**

```bash
npm run dev:debug
```
Open `http://localhost:5173`. Verify:
- Header shows emerald gradient "Z" logo, "Zance · debug", emerald live pill (no memory counts)
- Sidebar is wider, active item has emerald left border + subtle tint, divider above Connections

- [ ] **Step 4: Commit**

```bash
git add debug/src/App.tsx
git commit -m "feat(debug-ui): redesign app shell — emerald header, wider sidebar with accent active state"
```

---

## Task 4: Dashboard panel

**Files:**
- Modify: `debug/src/components/DashboardPanel.tsx`

**What changes:**
1. Replace hardcoded `c` color object with `t = isDark ? darkTheme : lightTheme` from theme.ts
2. Range selector: update active tab color from `bg-slate-700` to `bg-slate-800`; overall pill group border to `t.border`
3. `StatCard`: update card classes to use `t.card`; update label color to `t.textMuted`; update value color to `t.textPrimary`
4. Chart colors: cost chart `colors` → `[t.chartCost]`; token chart → `[t.chartInput, t.chartOutput]`
5. Section headers (`h3` elements): replace `c.label` with `t.textMuted`, text from uppercase to `text-[13px] font-semibold`
6. Add memory summary row: use `data.memories.shortTerm`, `data.memories.longTerm`, `data.memories.permanent` (already in the query)

- [ ] **Step 1: Update imports and `c` object**

At the top of `DashboardPanel.tsx`, add the theme import and replace the `c` usages.

Find the block starting at line 91:
```tsx
  const c = isDark
    ? {
        card: "bg-slate-900/60 border-slate-800",
        label: "text-slate-500",
        value: "text-slate-100",
        sub: "text-slate-400",
        chart: "bg-slate-900/40 border-slate-800",
      }
    : {
        card: "bg-white border-slate-200",
        label: "text-slate-500",
        value: "text-slate-900",
        sub: "text-slate-600",
        chart: "bg-white border-slate-200",
      };
```

Replace with:
```tsx
  const t = isDark ? darkTheme : lightTheme;
  // Backwards-compat shim — StatCard still uses `c`. Remove once StatCard is updated below.
  const c = {
    card: t.card,
    label: t.textMuted,
    value: t.textPrimary,
    sub: t.textSecondary,
    chart: t.card,
  };
```

And add the import at the top of the file:
```tsx
import { darkTheme, lightTheme } from "../lib/theme.js";
```

- [ ] **Step 2: Update range selector styling**

Find the range selector pill group (the `<div>` containing RANGES buttons, around line 120):
```tsx
        <div
          className={`flex items-center rounded-lg border text-xs ${
            isDark
              ? "border-slate-700 bg-slate-900/50"
              : "border-slate-200 bg-slate-50"
          }`}
        >
          {RANGES.map((r) => (
            <button
              key={r.id}
              onClick={() => setRange(r.id)}
              className={`px-3 py-1.5 transition-colors ${
                range === r.id
                  ? isDark
                    ? "bg-slate-700 text-white font-medium"
                    : "bg-white text-slate-900 font-medium shadow-sm"
                  : isDark
                    ? "text-slate-500 hover:text-slate-300"
                    : "text-slate-500 hover:text-slate-700"
              } ${r.id === "7d" ? "rounded-l-lg" : ""} ${
                r.id === "all" ? "rounded-r-lg" : ""
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
```

Replace with:
```tsx
        <div
          className={`flex items-center gap-0.5 rounded-lg border p-0.5 text-xs ${t.filterGroup}`}
        >
          {RANGES.map((r) => (
            <button
              key={r.id}
              onClick={() => setRange(r.id)}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                range === r.id ? t.filterActive : t.filterInactive
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
```

- [ ] **Step 3: Update section headers (h3 elements)**

There are 4 `<h3>` elements inside chart/section cards (Cost Over Time, Token Usage Over Time, Agent Status, Token Breakdown).

Find each instance of:
```tsx
            <h3
              className={`text-xs font-semibold uppercase tracking-wider mb-3 ${c.label}`}
            >
```

Replace each with:
```tsx
            <h3
              className={`text-[12px] font-semibold mb-3 ${t.textSecondary}`}
            >
```

(There are 4 of these — do all 4.)

- [ ] **Step 4: Update chart colors**

Find the `StackedAreaChart` call for cost (has `keys={["agentCost"]}`):
```tsx
            <StackedAreaChart
              data={filtered.days}
              keys={["agentCost"]}
              colors={isDark ? ["#38bdf8"] : ["#0284c7"]}
              labels={["Agents"]}
              format={(v) => `$${v.toFixed(2)}`}
              isDark={isDark}
            />
```

Replace `colors` prop with:
```tsx
              colors={[t.chartCost]}
```

Find the `StackedAreaChart` call for tokens (has `keys={["inputTokens", "outputTokens"]}`):
```tsx
              colors={isDark ? ["#38bdf8", "#34d399"] : ["#0284c7", "#059669"]}
```

Replace with:
```tsx
              colors={[t.chartInput, t.chartOutput]}
```

- [ ] **Step 5: Add memory summary row**

After the closing `</div>` of the stat cards grid (after the `grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6` div), add a memory summary row:

```tsx
      {/* Memory summary — relocated from header */}
      <div className={`flex items-center gap-6 rounded-xl border px-4 py-3 ${t.card}`}>
        <span className={`text-[11px] font-semibold uppercase tracking-wider ${t.textMuted}`}>Memory</span>
        {(
          [
            ["Short",    data.memories.shortTerm,  isDark ? "text-sky-400"    : "text-sky-600"    ],
            ["Long",     data.memories.longTerm,    isDark ? "text-violet-400" : "text-violet-600" ],
            ["Permanent",data.memories.permanent,   isDark ? "text-amber-400"  : "text-amber-600"  ],
          ] as const
        ).map(([label, count, color]) => (
          <div key={label} className="flex items-center gap-1.5 text-xs">
            <span className={t.textMuted}>{label}</span>
            <span className={`mono font-semibold ${color}`}>{count}</span>
          </div>
        ))}
      </div>
```

- [ ] **Step 6: Run typecheck**

```bash
npm run typecheck 2>&1 | grep -E "error|Error" | head -20
```
Expected: no errors.

- [ ] **Step 7: Visually verify Dashboard**

With `npm run dev:debug` running, open Dashboard. Verify:
- Stat cards use new card style
- Range selector is pill group style
- Cost chart bars are emerald
- Memory row shows short/long/permanent counts with color coding
- Section headers are `text-[12px] font-semibold` (not all-caps)

- [ ] **Step 8: Commit**

```bash
git add debug/src/components/DashboardPanel.tsx
git commit -m "feat(debug-ui): update Dashboard panel — theme tokens, emerald chart, memory summary row"
```

---

## Task 5: Agents panel

**Files:**
- Modify: `debug/src/components/AgentsPanel.tsx`

**What changes:**
1. Panel header: replace the `<h2>` uppercase label + bare active count with `PanelHeader` + sky pill for active count
2. Filter buttons: replace floating buttons with `FilterTabs` component
3. Agent rows: add status-colored left border + right-aligned status label + cost

- [ ] **Step 1: Update imports**

Add to the top of `AgentsPanel.tsx`:
```tsx
import { darkTheme, lightTheme } from "../lib/theme.js";
import { PanelHeader, FilterTabs } from "./ui/index.js";
```

- [ ] **Step 2: Update panel toolbar**

Find the toolbar `<div>` (the `shrink-0 border-b` div starting around line 59):
```tsx
      <div
        className={`shrink-0 border-b px-5 py-3 flex items-center gap-3 ${
          isDark ? "border-slate-800" : "border-slate-200"
        }`}
      >
        <h2
          className={`text-xs font-semibold uppercase tracking-wider ${
            isDark ? "text-slate-500" : "text-slate-400"
          }`}
        >
          Agents
        </h2>
        {activeCount > 0 && (
          <span className="flex items-center gap-1.5 text-xs text-sky-400 font-medium">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-sky-400 pulse-ring" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-400" />
            </span>
            {activeCount} active
          </span>
        )}
        <div className="ml-auto flex items-center gap-1">
          {["all", "running", "completed", "failed"].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-2.5 py-1 text-xs rounded-md capitalize transition-colors ${
                statusFilter === s
                  ? isDark
                    ? "bg-slate-700 text-white font-medium"
                    : "bg-slate-200 text-slate-800 font-medium"
                  : isDark
                    ? "text-slate-500 hover:text-slate-300 hover:bg-slate-800"
                    : "text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
```

Replace with:
```tsx
      {(() => {
        const t = isDark ? darkTheme : lightTheme;
        return (
          <div
            className={`shrink-0 border-b px-5 py-3 flex items-center gap-3 ${t.borderSubtle}`}
          >
            <PanelHeader
              isDark={isDark}
              title="Agents"
              right={
                <FilterTabs
                  isDark={isDark}
                  options={[
                    { value: "all", label: "All" },
                    { value: "running", label: "Running" },
                    { value: "completed", label: "Done" },
                    { value: "failed", label: "Failed" },
                  ]}
                  value={statusFilter}
                  onChange={setStatusFilter}
                />
              }
            />
            {activeCount > 0 && (
              <span
                className={`flex items-center gap-1.5 rounded-full px-2 py-0.5 border text-[10px] font-medium ${
                  isDark
                    ? "bg-sky-950 border-sky-900 text-sky-400"
                    : "bg-sky-50 border-sky-200 text-sky-600"
                }`}
              >
                <span className="relative flex h-[5px] w-[5px]">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-sky-400 pulse-ring" />
                  <span className="relative inline-flex rounded-full h-[5px] w-[5px] bg-sky-400" />
                </span>
                {activeCount} active
              </span>
            )}
          </div>
        );
      })()}
```

- [ ] **Step 3: Update agent row card styling**

Find the agent row `<div>` with class `border rounded-xl p-4 cursor-pointer`:
```tsx
              <div
                key={agent._id}
                onClick={() => setSelected(agent.agentId)}
                className={`border rounded-xl p-4 cursor-pointer transition-all duration-150 fade-in ${cardBg} ${hoverBg}`}
              >
```

Replace with:
```tsx
              {(() => {
                const t = isDark ? darkTheme : lightTheme;
                const statusCfg = t.status[agent.status as keyof typeof t.status] ?? t.status.cancelled;
                return (
              <div
                key={agent._id}
                onClick={() => setSelected(agent.agentId)}
                className={`relative border-l-2 rounded-xl p-4 cursor-pointer transition-all duration-150 fade-in ${cardBg} ${hoverBg} ${statusCfg.border} ${statusCfg.tint}`}
              >
```

And close the extra IIFE after the closing `</div>` of the row:
```tsx
              </div>
                );
              })()}
```

- [ ] **Step 4: Run typecheck**

```bash
npm run typecheck 2>&1 | grep -E "error|Error" | head -20
```
Expected: no errors.

- [ ] **Step 5: Visually verify Agents panel**

Navigate to Agents panel. Verify:
- Panel header uses new title style
- Filter is a pill group (not floating buttons)
- Agent rows have a colored left border matching their status

- [ ] **Step 6: Commit**

```bash
git add debug/src/components/AgentsPanel.tsx
git commit -m "feat(debug-ui): update Agents panel — pill filter tabs, status left-border rows"
```

---

## Task 6: Memory panel

**Files:**
- Modify: `debug/src/components/MemoryPanel.tsx`

**What changes:**
1. Panel header: add title + record count using `PanelHeader`
2. Tier filter: replace buttons with `FilterTabs`
3. Segment filter: replace buttons with `FilterTabs` (smaller)
4. Rows: tier badge → `Badge variant="tier"`, segment → color from `t.segment`, add right-aligned timestamp

- [ ] **Step 1: Update imports**

Add to the top of `MemoryPanel.tsx`:
```tsx
import { darkTheme, lightTheme } from "../lib/theme.js";
import { PanelHeader, FilterTabs, Badge } from "./ui/index.js";
```

- [ ] **Step 2: Replace tier filter buttons with `FilterTabs`**

Find the tier filter buttons block. It will look like a `div` containing `TIER_OPTIONS.map(...)` buttons. Replace the entire tier filter section with:

```tsx
              <FilterTabs
                isDark={isDark}
                options={TIER_OPTIONS}
                value={tierFilter}
                onChange={setTierFilter}
              />
```

- [ ] **Step 3: Replace segment filter buttons with `FilterTabs`**

Find the segment filter buttons block (the `SEGMENT_OPTIONS.map(...)` section). Replace with:

```tsx
              <FilterTabs
                isDark={isDark}
                options={SEGMENT_OPTIONS.map((s) => ({ value: s, label: s === "all" ? "All" : s }))}
                value={segmentFilter}
                onChange={setSegmentFilter}
              />
```

- [ ] **Step 4: Update memory record rows**

Find the block that renders each memory record row. The tier badge currently uses `TIER_BADGE[record.tier]`. Replace the tier span with:

```tsx
                      <Badge isDark={isDark} variant="tier" value={record.tier} />
```

And replace the segment text span (currently uses `SEGMENT_COLOR[record.segment]`) with:

```tsx
                      {(() => {
                        const t = isDark ? darkTheme : lightTheme;
                        const segColor = t.segment[record.segment as keyof typeof t.segment] ?? t.textMuted;
                        return (
                          <span className={`text-[9px] font-medium flex-shrink-0 ${segColor}`}>
                            {record.segment}
                          </span>
                        );
                      })()}
```

- [ ] **Step 5: Run typecheck**

```bash
npm run typecheck 2>&1 | grep -E "error|Error" | head -20
```
Expected: no errors.

- [ ] **Step 6: Visually verify Memory panel**

Navigate to Memory. Verify:
- Tier and segment filters are pill groups
- Tier badges are `rounded-full` with correct colors (sky=short, violet=long, amber=permanent)
- Segment text is color-coded

- [ ] **Step 7: Commit**

```bash
git add debug/src/components/MemoryPanel.tsx
git commit -m "feat(debug-ui): update Memory panel — pill filters, tier badge pills, segment colors"
```

---

## Task 7: Automations panel

**Files:**
- Modify: `debug/src/components/AutomationsPanel.tsx`

**What changes:**
1. Panel header: replace `<h2>` + bare count with `PanelHeader` + emerald badge for enabled count
2. Enabled rows: add emerald left border + subtle tint
3. Schedule tag: replace sky `Scheduled` badge with `mono` cron expression only

- [ ] **Step 1: Update imports**

Add to the top of `AutomationsPanel.tsx`:
```tsx
import { darkTheme, lightTheme } from "../lib/theme.js";
import { PanelHeader } from "./ui/index.js";
```

- [ ] **Step 2: Update toolbar**

Find the toolbar `<div>` (the `shrink-0 border-b` div):
```tsx
      <div
        className={`shrink-0 border-b px-5 py-3 flex items-center gap-3 ${
          isDark ? "border-slate-800" : "border-slate-200"
        }`}
      >
        <h2
          className={`text-xs font-semibold uppercase tracking-wider ${
            isDark ? "text-slate-500" : "text-slate-400"
          }`}
        >
          Automations
        </h2>
        <span className={`text-xs mono ${mutedText}`}>
          {enabledCount} enabled / {list.length} total
        </span>
      </div>
```

Replace with:
```tsx
      {(() => {
        const t = isDark ? darkTheme : lightTheme;
        return (
          <div
            className={`shrink-0 border-b px-5 py-3 ${t.borderSubtle}`}
          >
            <PanelHeader
              isDark={isDark}
              title="Automations"
              right={
                enabledCount > 0 ? (
                  <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${t.accentBadge}`}>
                    {enabledCount} enabled
                  </span>
                ) : undefined
              }
            />
          </div>
        );
      })()}
```

- [ ] **Step 3: Update automation row card for enabled state**

Find the automation row card `<div>` with `border rounded-xl p-4`:
```tsx
            <div
              key={auto._id}
              className={`border rounded-xl p-4 cursor-pointer transition-all duration-150 fade-in ${cardBg} ${hoverBg}`}
              onClick={() => setSelectedId(auto.automationId)}
            >
```

Replace with:
```tsx
            {(() => {
              const t = isDark ? darkTheme : lightTheme;
              return (
            <div
              key={auto._id}
              className={`relative border-l-2 rounded-xl p-4 cursor-pointer transition-all duration-150 fade-in ${
                auto.enabled
                  ? `${t.status.completed.border} ${t.status.completed.tint}`
                  : `border-l-transparent ${cardBg}`
              } ${hoverBg}`}
              onClick={() => setSelectedId(auto.automationId)}
            >
```

And close after the row's `</div>`:
```tsx
            </div>
              );
            })()}
```

- [ ] **Step 4: Remove the sky `Scheduled` badge from the row**

Find the `Scheduled` badge span:
```tsx
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded border font-medium ${
                    isDark
                      ? "text-sky-400 bg-sky-400/10 border-sky-500/20"
                      : "text-sky-600 bg-sky-50 border-sky-200"
                  }`}
                >
                  Scheduled
                </span>
```

Remove it entirely (it's redundant — all automations are scheduled by definition).

- [ ] **Step 5: Run typecheck**

```bash
npm run typecheck 2>&1 | grep -E "error|Error" | head -20
```
Expected: no errors.

- [ ] **Step 6: Visually verify Automations panel**

Navigate to Automations. Verify:
- Header shows "Automations" title + emerald "N enabled" badge
- Enabled automations have emerald left border + subtle tint
- No "Scheduled" badge on rows

- [ ] **Step 7: Commit**

```bash
git add debug/src/components/AutomationsPanel.tsx
git commit -m "feat(debug-ui): update Automations panel — emerald header badge, enabled-row tint"
```

---

## Task 8: Events panel

**Files:**
- Modify: `debug/src/components/EventsPanel.tsx`

**What changes:**
1. Panel header: replace `<h2>` with `PanelHeader` + live glowing dot
2. Event type badge: replace `bg-[type]/20 text-[type]` pattern with theme event pills
3. First (most recent) event row: add emerald tinted border

- [ ] **Step 1: Replace `EventsPanel.tsx` in full**

The file is short enough to replace entirely:

```tsx
// debug/src/components/EventsPanel.tsx
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api.js";
import { darkTheme, lightTheme } from "../lib/theme.js";
import { PanelHeader, EmptyState } from "./ui/index.js";

export function EventsPanel({ isDark }: { isDark: boolean }) {
  const events = useQuery(api.memoryEvents.recent, { limit: 200 });
  const t = isDark ? darkTheme : lightTheme;

  const row = isDark ? "bg-[#0f172a] border-slate-800" : "bg-white border-slate-200";
  const rowFirst = isDark ? "bg-emerald-950/20 border-emerald-900/50" : "bg-emerald-50 border-emerald-200";

  return (
    <div className={`rounded-xl border p-4 ${t.card}`}>
      <div className="mb-3">
        <PanelHeader
          isDark={isDark}
          title="Events"
          right={
            <span className="flex items-center gap-1.5">
              <span className="relative flex h-[5px] w-[5px]">
                <span className={`absolute inline-flex h-full w-full rounded-full ${t.liveDot} pulse-ring`} />
                <span className={`relative inline-flex rounded-full h-[5px] w-[5px] ${t.liveDot}`} />
              </span>
              <span className={`text-[10px] font-medium ${t.textAccent}`}>live</span>
            </span>
          }
        />
      </div>

      {!events ? (
        <EmptyState isDark={isDark} message="Loading…" />
      ) : events.length === 0 ? (
        <EmptyState
          isDark={isDark}
          message="No events yet. Chat with the agent to see memory events stream in."
        />
      ) : (
        <div className="space-y-1.5">
          {events.map((e, idx) => {
            const pillCls =
              t.event[e.eventType as keyof typeof t.event] ??
              (isDark ? "bg-slate-800 text-slate-400 border border-slate-700/40" : "bg-slate-100 text-slate-600 border border-slate-200");
            return (
              <div
                key={e._id}
                className={`border rounded-lg p-2.5 ${idx === 0 ? rowFirst : row}`}
              >
                <div className="flex items-center gap-2 text-[10px] mono flex-wrap">
                  <span className={`px-2 py-0.5 rounded-full font-bold uppercase tracking-[0.03em] text-[8px] ${pillCls}`}>
                    {e.eventType}
                  </span>
                  {e.conversationId && (
                    <span className={t.textMuted}>{e.conversationId}</span>
                  )}
                  {e.memoryId && (
                    <span className={t.textMuted}>mem:{e.memoryId.slice(-6)}</span>
                  )}
                  {e.agentId && (
                    <span className={t.textMuted}>agent:{e.agentId.slice(-6)}</span>
                  )}
                  <span className={`${t.textMuted} ml-auto`}>
                    {new Date(e.createdAt).toLocaleTimeString()}
                  </span>
                </div>
                {e.data && (
                  <div className={`text-[11px] mono mt-1 break-all ${t.textSecondary}`}>
                    {e.data}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Run typecheck**

```bash
npm run typecheck 2>&1 | grep -E "error|Error" | head -20
```
Expected: no errors.

- [ ] **Step 3: Visually verify Events panel**

Navigate to Events. Verify:
- Header shows "Events" + live glowing dot
- Event type badges are rounded-full pills with correct colors
- Most recent event row has emerald tint

- [ ] **Step 4: Commit**

```bash
git add debug/src/components/EventsPanel.tsx
git commit -m "feat(debug-ui): update Events panel — live dot header, rounded pill badges, first-row tint"
```

---

## Task 9: Consolidation panel — horizontal stepper

**Files:**
- Modify: `debug/src/components/ConsolidationPanel.tsx`

**What changes:**
The vertical phase card stack (one card per phase) is replaced with a horizontal 5-step stepper. The underlying data logic (`livePhases`, `runs`, `useSocket`) stays 100% unchanged. Only the render output changes.

The stepper maps the 5 named phases to steps: Loaded → Proposed → Judging → Applying → Done.

- [ ] **Step 1: Update imports**

Add to the top of `ConsolidationPanel.tsx`:
```tsx
import { darkTheme, lightTheme } from "../lib/theme.js";
import { PanelHeader } from "./ui/index.js";
```

- [ ] **Step 2: Add a `PhaseStepper` helper component inside the file**

Add this component at the bottom of `ConsolidationPanel.tsx` (before the last `}`):

```tsx
// Maps the live phase stream to 5 stepper slots.
const STEPPER_SLOTS = [
  { key: "loaded",    label: "Loaded"  },
  { key: "proposed",  label: "Proposed" },
  { key: "judging",   label: "Judging"  },
  { key: "applying",  label: "Applying" },
  { key: "completed", label: "Done"     },
] as const;

type StepperSlotKey = typeof STEPPER_SLOTS[number]["key"];

// Given the latest phase from live events, determine which stepper slot is active.
function phaseToSlotIndex(phase: string): number {
  if (phase === "loaded" || phase === "started" || phase === "proposing") return 0;
  if (phase === "proposed") return 1;
  if (phase === "judging" || phase === "judged") return 2;
  if (phase === "applying") return 3;
  if (phase === "completed" || phase === "failed") return 4;
  return -1;
}

function PhaseStepper({
  isDark,
  phases,
  isRunning,
  currentPhase,
  detail,
}: {
  isDark: boolean;
  phases: string[];  // list of completed phase keys
  isRunning: boolean;
  currentPhase: string | null;
  detail: string | null;
}) {
  const t = isDark ? darkTheme : lightTheme;
  const activeIdx = currentPhase ? phaseToSlotIndex(currentPhase) : -1;

  return (
    <div>
      {/* Step row */}
      <div className="flex items-center gap-0 mb-4">
        {STEPPER_SLOTS.map((slot, i) => {
          const isDone = activeIdx > i || (!isRunning && activeIdx === i && (currentPhase === "completed" || currentPhase === "failed"));
          const isActive = isRunning && activeIdx === i;
          const isPending = !isDone && !isActive;
          const isLast = i === STEPPER_SLOTS.length - 1;

          // Count badge for completed steps
          let countLabel: string | null = null;
          if (slot.key === "loaded") countLabel = phases.includes("loaded") ? "✓" : null;
          if (slot.key === "proposed") countLabel = phases.includes("proposed") ? "✓" : null;
          if (slot.key === "completed") countLabel = isDone ? "✓" : null;

          return (
            <div key={slot.key} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-shrink-0">
                {/* Circle */}
                <div
                  className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-[10px] font-bold ${
                    isDone
                      ? t.stepperComplete
                      : isActive
                        ? `${t.stepperActive} ${isDark ? "shadow-[0_0_8px_rgba(251,191,36,0.4)]" : "shadow-sm"}`
                        : t.stepperPending
                  }`}
                >
                  {isDone ? "✓" : isActive ? (
                    <span className={`w-2 h-2 rounded-full ${isDark ? "bg-amber-400 live-dot" : "bg-amber-500 live-dot"}`} />
                  ) : (
                    <span className={isDark ? "text-slate-600" : "text-slate-400"}>{i + 1}</span>
                  )}
                </div>
                {/* Label */}
                <span
                  className={`text-[8px] font-semibold uppercase tracking-[0.04em] mt-1.5 text-center leading-tight ${
                    isDone ? t.textAccent : isActive ? (isDark ? "text-amber-400" : "text-amber-600") : t.textMuted
                  }`}
                >
                  {slot.label}
                </span>
              </div>
              {/* Connector line */}
              {!isLast && (
                <div
                  className={`flex-1 h-[2px] mx-1 mb-4 ${
                    isDone ? t.stepperLineComplete : t.stepperLinePending
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Detail card */}
      {detail && (
        <div
          className={`rounded-lg border px-3 py-2.5 text-[11px] ${
            isDark
              ? currentPhase === "failed"
                ? "border-rose-900/50 bg-rose-950/30 text-rose-400"
                : currentPhase === "completed"
                  ? "border-emerald-900/50 bg-emerald-950/20 text-emerald-400"
                  : "border-amber-900/50 bg-amber-950/20 text-amber-400"
              : currentPhase === "failed"
                ? "border-rose-200 bg-rose-50 text-rose-700"
                : currentPhase === "completed"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                  : "border-amber-200 bg-amber-50 text-amber-700"
          }`}
        >
          {detail}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Replace the Pipeline Timeline section inside `ConsolidationDetail`**

Inside `ConsolidationDetail` (starting around line 269), find the `<section>` block with the "Pipeline Timeline" heading (lines ~417–481). It looks like this:

```tsx
        {/* Pipeline timeline (live + historical) */}
        <section>
          <div
            className={`text-[10px] font-semibold uppercase tracking-wider mb-3 ${muted}`}
          >
            Pipeline Timeline
          </div>
          {allPhases.length === 0 ? (
            <div className={`text-sm ${muted}`}>
              No live phase events captured. Scroll down for the stored
              proposals and decisions from this run.
            </div>
          ) : (
            <div className="space-y-0">
              {allPhases.map((p, i) => {
                const cfg = PHASE_CONFIG[p.phase] ?? PHASE_CONFIG.started;
                const isLast = i === allPhases.length - 1;
                return (
                  <div key={`${p.ts}-${i}`} className="flex gap-3 slide-down">
                    <div className="flex flex-col items-center shrink-0 w-5">
                      <div className="mt-1.5 text-[14px] leading-none">
                        {cfg.icon}
                      </div>
                      {!isLast && (
                        <div
                          className={`flex-1 w-px mt-1 ${
                            isDark ? "bg-slate-800" : "bg-slate-200"
                          }`}
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0 pb-4">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span
                          className={`text-[10px] font-bold mono tracking-wider ${cfg.color}`}
                        >
                          {cfg.label}
                        </span>
                        <span className={`text-[10px] mono ${muted}`}>
                          {new Date(p.ts).toLocaleTimeString()}
                        </span>
                      </div>
                      <div
                        className={`text-xs ${
                          isDark ? "text-slate-400" : "text-slate-600"
                        } mono`}
                      >
                        {p.memoriesCount !== undefined &&
                          `memories scanned: ${p.memoriesCount}`}
                        {p.proposalsCount !== undefined &&
                          `proposals: ${p.proposalsCount}`}
                        {p.approvedCount !== undefined &&
                          `approved: ${p.approvedCount} · rejected: ${p.rejectedCount ?? 0}`}
                        {p.mergedCount !== undefined &&
                          `merged: ${p.mergedCount} · pruned: ${p.prunedCount ?? 0}`}
                        {p.error && (
                          <span className="text-rose-400">{p.error}</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
```

Replace the entire block above with:

```tsx
        {/* Pipeline stepper */}
        <section>
          <PhaseStepper
            isDark={isDark}
            phases={allPhases.map((p) => p.phase)}
            isRunning={
              run.status !== "completed" && run.status !== "failed"
            }
            currentPhase={allPhases.at(-1)?.phase ?? run.status ?? null}
            detail={(() => {
              const last = allPhases.at(-1);
              if (!last) return null;
              if (last.memoriesCount !== undefined) return `Loaded ${last.memoriesCount} memories`;
              if (last.proposalsCount !== undefined) return `${last.proposalsCount} proposals — ${last.approvedCount ?? 0} approved, ${last.rejectedCount ?? 0} rejected`;
              if (last.mergedCount !== undefined) return `Applied: ${last.mergedCount} merged, ${last.prunedCount ?? 0} pruned`;
              if (last.error) return `Error: ${last.error}`;
              return null;
            })()}
          />
        </section>
```

- [ ] **Step 4: Run typecheck**

```bash
npm run typecheck 2>&1 | grep -E "error|Error" | head -20
```
Expected: no errors.

- [ ] **Step 5: Visually verify Consolidation panel**

Navigate to Consolidation. Verify:
- Run rows list looks consistent with other panels
- Clicking a run shows the horizontal stepper
- Completed steps show emerald ✓, active step shows amber glowing dot, pending steps show numbers

- [ ] **Step 6: Commit**

```bash
git add debug/src/components/ConsolidationPanel.tsx
git commit -m "feat(debug-ui): update Consolidation panel — horizontal phase stepper"
```

---

## Task 10: Final typecheck + smoke test

**Files:** none new

- [ ] **Step 1: Full typecheck**

```bash
npm run typecheck 2>&1
```
Expected: exit 0, no errors.

- [ ] **Step 2: Build check**

```bash
npm run build:debug 2>&1 | tail -10
```
Expected: build succeeds, no errors.

- [ ] **Step 3: Visual smoke test — all 7 panels**

With `npm run dev:debug` running at `http://localhost:5173`, verify each panel:

| Panel | Check |
|---|---|
| Dashboard | Stat cards, emerald cost chart, memory summary row, range tabs |
| Agents | Pill filter tabs, left-border rows, active count pill |
| Memory | Pill tier/segment filters, `rounded-full` tier badges |
| Automations | Enabled count badge, emerald left border on enabled rows |
| Events | Live dot, rounded pill badges, first-row emerald tint |
| Consolidation | Horizontal stepper on run detail |
| Connections | (unchanged structurally — inherits Card chrome from ComposioSection) |

Also toggle light mode and verify all panels look correct in light mode.

- [ ] **Step 4: Final commit**

```bash
git add -p  # review any remaining unstaged changes
git commit -m "feat(debug-ui): complete visual redesign — emerald accent, design tokens, all 7 panels"
```
