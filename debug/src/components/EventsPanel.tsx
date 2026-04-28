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
