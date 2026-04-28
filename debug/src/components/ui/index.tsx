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
// variant="status" — uses status text color (running/completed/failed/cancelled/spawned)
// variant="tier"   — uses tier pill classes (short/long/permanent)
// variant="accent" — uses emerald accent badge
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
// Renders a consistent panel title row. `right` is an optional right-side slot.
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
// Segmented pill control.
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
