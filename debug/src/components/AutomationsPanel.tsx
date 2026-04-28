import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api.js";
import { darkTheme, lightTheme } from "../lib/theme.js";
import { PanelHeader } from "./ui/index.js";

function formatSchedule(schedule: string): string {
  return schedule;
}

function timeAgo(ts?: number): string {
  if (!ts) return "never";
  const diff = Date.now() - ts;
  if (diff < 60_000) return "just now";
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
  return `${Math.floor(diff / 86_400_000)}d ago`;
}

const STATUS_COLOR: Record<string, { dot: string; text: string }> = {
  running: { dot: "bg-sky-400 live-dot", text: "text-sky-400" },
  completed: { dot: "bg-emerald-400", text: "text-emerald-400" },
  failed: { dot: "bg-rose-400", text: "text-rose-400" },
};

export function AutomationsPanel({ isDark }: { isDark: boolean }) {
  const t = isDark ? darkTheme : lightTheme;
  const automations = useQuery(api.automations.list, {});
  const setEnabled = useMutation(api.automations.setEnabled);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const list = automations ?? [];
  const enabledCount = list.filter((a: any) => a.enabled).length;

  if (selectedId) {
    return (
      <AutomationDetail
        automationId={selectedId}
        onBack={() => setSelectedId(null)}
        isDark={isDark}
      />
    );
  }

  return (
    <div className="flex flex-col h-full -m-5">
      <div className={`shrink-0 border-b px-5 py-3 ${t.borderSubtle}`}>
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

      <div className="flex-1 overflow-y-auto debug-scroll p-4 space-y-3">
        {automations === undefined ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className={`h-20 rounded-xl border ${t.card} shimmer`} />
            ))}
          </div>
        ) : list.length === 0 ? (
          <p
            className={`text-sm py-8 text-center ${t.textMuted}`}
          >
            No automations yet. Text the agent: <em>"every morning at 8, summarize my calendar"</em>.
          </p>
        ) : (
          list.map((auto: any) => (
            <div
              key={auto._id}
              className={`relative border-l-2 rounded-xl p-4 cursor-pointer transition-all duration-150 fade-in ${
                auto.enabled
                  ? `${t.status.completed.border} ${t.status.completed.tint}`
                  : `border-l-transparent ${t.card} ${t.cardHover}`
              }`}
              onClick={() => setSelectedId(auto.automationId)}
            >
              <div className="flex items-center gap-2.5 mb-1.5">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setEnabled({
                      automationId: auto.automationId,
                      enabled: !auto.enabled,
                    });
                  }}
                  className={`relative inline-flex items-center w-9 h-5 rounded-full transition-colors shrink-0 ${
                    auto.enabled
                      ? "bg-emerald-500"
                      : isDark
                        ? "bg-slate-700"
                        : "bg-slate-300"
                  }`}
                >
                  <span
                    className={`inline-block w-3.5 h-3.5 rounded-full bg-white shadow-sm transition-transform ${
                      auto.enabled ? "translate-x-[18px]" : "translate-x-[3px]"
                    }`}
                  />
                </button>

                <span
                  className={`text-sm font-medium truncate ${t.textPrimary} ${!auto.enabled ? "opacity-50" : ""}`}
                >
                  {auto.name}
                </span>

                <span className={`text-xs ml-auto mono ${t.textMuted}`}>
                  {formatSchedule(auto.schedule)}
                </span>
              </div>

              <p
                className={`text-xs truncate mb-2 ml-[46px] ${t.textMuted} ${
                  !auto.enabled ? "opacity-50" : ""
                }`}
              >
                {auto.task}
              </p>

              <div
                className={`flex items-center gap-3 ml-[46px] text-[10px] mono ${t.textMuted}`}
              >
                {auto.lastRunAt && <span>Last run: {timeAgo(auto.lastRunAt)}</span>}
                {auto.nextRunAt && auto.enabled && (
                  <span>
                    Next:{" "}
                    {new Date(auto.nextRunAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                )}
                {auto.integrations.length > 0 && (
                  <span>integrations: {auto.integrations.join(", ")}</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function AutomationDetail({
  automationId,
  onBack,
  isDark,
}: {
  automationId: string;
  onBack: () => void;
  isDark: boolean;
}) {
  const auto = useQuery(api.automations.get, { automationId });
  const runs = useQuery(api.automations.recentRuns, { automationId, limit: 30 });
  const setEnabled = useMutation(api.automations.setEnabled);
  const remove = useMutation(api.automations.remove);

  const t = isDark ? darkTheme : lightTheme;

  if (!auto) {
    return (
      <div className="p-5">
        <div
          className={`h-20 rounded-xl shimmer ${
            isDark ? "bg-slate-900/40" : "bg-slate-100"
          }`}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full -m-5 fade-in">
      <div
        className={`shrink-0 border-b px-5 py-3 flex items-center gap-3 ${t.border}`}
      >
        <button
          onClick={onBack}
          className={`text-xs rounded-md px-2.5 py-1 transition-colors ${t.textSecondary} ${isDark ? "bg-slate-800 hover:bg-slate-700 hover:text-slate-200" : "bg-slate-100 hover:bg-slate-200 hover:text-slate-700"}`}
        >
          ← Back
        </button>

        <button
          onClick={() =>
            setEnabled({ automationId: auto.automationId, enabled: !auto.enabled })
          }
          className={`relative inline-flex items-center w-9 h-5 rounded-full transition-colors shrink-0 ${
            auto.enabled
              ? "bg-emerald-500"
              : isDark
                ? "bg-slate-700"
                : "bg-slate-300"
          }`}
        >
          <span
            className={`inline-block w-3.5 h-3.5 rounded-full bg-white shadow-sm transition-transform ${
              auto.enabled ? "translate-x-[18px]" : "translate-x-[3px]"
            }`}
          />
        </button>

        <span className={`text-sm font-medium ${t.textPrimary}`}>
          {auto.name}
        </span>

        <span className={`text-xs ml-auto mono ${t.textMuted}`}>
          {formatSchedule(auto.schedule)}
        </span>

        <button
          onClick={() => {
            if (confirm(`Delete automation "${auto.name}"?`)) {
              remove({ automationId: auto.automationId });
              onBack();
            }
          }}
          className="text-[11px] text-rose-500 hover:text-rose-400"
        >
          Delete
        </button>
      </div>

      <div
        className={`shrink-0 border-b px-5 py-3 space-y-2 ${t.borderSubtle}`}
      >
        <div>
          <span className={`text-[10px] font-bold mono ${t.textMuted}`}>
            TASK{" "}
          </span>
          <span className={`text-xs ${t.textSecondary}`}>
            {auto.task}
          </span>
        </div>
        {auto.integrations.length > 0 && (
          <div>
            <span className={`text-[10px] font-bold mono ${t.textMuted}`}>
              INTEGRATIONS{" "}
            </span>
            <span className={`text-xs ${t.textSecondary}`}>
              {auto.integrations.join(", ")}
            </span>
          </div>
        )}
        {auto.nextRunAt && auto.enabled && (
          <div>
            <span className={`text-[10px] font-bold mono ${t.textMuted}`}>
              NEXT RUN{" "}
            </span>
            <span className={`text-xs ${t.textSecondary}`}>
              {new Date(auto.nextRunAt).toLocaleString()}
            </span>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto debug-scroll">
        <div className={`px-5 py-2 border-b ${t.borderSubtle}`}>
          <span
            className={`text-[10px] font-semibold ${t.textMuted}`}
          >
            Run History ({runs?.length ?? 0})
          </span>
        </div>

        {runs === undefined ? (
          <div className="p-5 space-y-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`h-10 rounded shimmer ${
                  isDark ? "bg-slate-900/30" : "bg-slate-100"
                }`}
              />
            ))}
          </div>
        ) : runs.length === 0 ? (
          <p className={`text-sm text-center py-8 ${t.textMuted}`}>
            No runs yet
          </p>
        ) : (
          <div className={`divide-y ${t.divider}`}>
            {runs.map((run: any) => {
              const color = STATUS_COLOR[run.status] ?? STATUS_COLOR.running;
              return (
                <div
                  key={run._id}
                  className={`px-5 py-2.5 ${isDark ? "hover:bg-slate-900/40" : "hover:bg-slate-50"}`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-1.5 h-1.5 rounded-full shrink-0 ${color.dot}`}
                    />
                    <span
                      className={`text-[10px] font-bold mono w-20 shrink-0 capitalize ${color.text}`}
                    >
                      {run.status}
                    </span>
                    <span className={`text-xs flex-1 truncate ${t.textSecondary}`}>
                      {run.result
                        ? run.result.slice(0, 120)
                        : run.error
                          ? run.error.slice(0, 120)
                          : "—"}
                    </span>
                    <span className={`text-[10px] mono shrink-0 ${t.textMuted}`}>
                      {run.startedAt ? timeAgo(run.startedAt) : ""}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
