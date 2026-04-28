// Single source of truth for dark/light class maps.
// All components import `darkTheme` / `lightTheme` and pick with:
//   const t = isDark ? darkTheme : lightTheme

export const darkTheme = {
  page:    "bg-[#020617]",
  surface: "bg-[#0f172a]",
  card:    "bg-[#0f172a] border-slate-800",
  cardHover: "hover:bg-slate-800/40",

  textPrimary:   "text-slate-100",
  textSecondary: "text-slate-400",
  textMuted:     "text-slate-500",
  textAccent:    "text-emerald-400",

  border:       "border-slate-800",
  borderSubtle: "border-[#0f172a]",

  divider: "border-slate-800",

  panelTitle: "text-slate-100 text-[13px] font-semibold",
  panelMeta:  "text-slate-500 text-[11px]",

  filterGroup: "bg-[#0f172a] border-slate-800",
  filterActive: "bg-slate-800 text-slate-100 font-medium",
  filterInactive: "text-slate-500 hover:text-slate-300",

  status: {
    running:   { dot: "bg-sky-400",     text: "text-sky-400",     border: "border-sky-900/50",     tint: "bg-sky-950/20"     },
    spawned:   { dot: "bg-amber-400",   text: "text-amber-400",   border: "border-amber-900/50",   tint: "bg-amber-950/20"   },
    completed: { dot: "bg-emerald-400", text: "text-emerald-400", border: "border-emerald-900/50", tint: "bg-emerald-950/20" },
    failed:    { dot: "bg-rose-400",    text: "text-rose-400",    border: "border-rose-900/50",    tint: "bg-rose-950/20"    },
    cancelled: { dot: "bg-slate-500",   text: "text-slate-500",   border: "border-slate-800",      tint: "bg-slate-900/20"   },
  },

  tier: {
    short:     "bg-sky-950 text-sky-400 border border-sky-900/40",
    long:      "bg-violet-950 text-violet-400 border border-violet-900/40",
    permanent: "bg-amber-950 text-amber-400 border border-amber-900/40",
  },

  segment: {
    identity:     "text-rose-400",
    preference:   "text-teal-400",
    relationship: "text-pink-400",
    project:      "text-orange-400",
    knowledge:    "text-blue-400",
    context:      "text-slate-400",
  },

  event: {
    "memory.written":      "bg-emerald-950 text-emerald-400 border border-emerald-900/40",
    "memory.recalled":     "bg-sky-950 text-sky-400 border border-sky-900/40",
    "memory.extracted":    "bg-violet-950 text-violet-400 border border-violet-900/40",
    "memory.consolidated": "bg-amber-950 text-amber-400 border border-amber-900/40",
    "memory.cleaned":      "bg-slate-800 text-slate-400 border border-slate-700/40",
  },

  livePill: "bg-emerald-950 border border-emerald-900 text-emerald-400",
  liveDot:  "bg-emerald-400",

  accentBadge: "bg-emerald-950 border border-emerald-900 text-emerald-400",

  sidebarBorder: "border-[#0f172a]",
  sidebarActiveBg: "bg-emerald-950/30",
  sidebarActiveBorder: "border-l-emerald-500",
  sidebarActiveText: "text-slate-100 font-medium",
  sidebarInactiveText: "text-slate-500 hover:text-slate-300 hover:bg-slate-800/30",
  sidebarAgentBadge: "bg-emerald-500 text-emerald-950",

  chartCost: "#10b981",
  chartInput: "#38bdf8",
  chartOutput: "#34d399",

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
