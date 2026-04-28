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
              connected
                ? t.livePill
                : isDark
                  ? "bg-rose-950 border-rose-900 text-rose-400"
                  : "bg-rose-50 border-rose-200 text-rose-600"
            }`}
          >
            <span className="relative flex h-[5px] w-[5px]">
              {connected && (
                <span className={`absolute inline-flex h-full w-full rounded-full ${t.liveDot} pulse-ring`} />
              )}
              <span
                className={`relative inline-flex rounded-full h-[5px] w-[5px] ${
                  connected ? t.liveDot : isDark ? "bg-rose-400" : "bg-rose-500"
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
                  type="button"
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
