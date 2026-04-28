import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api.js";
import MemoryGraphView from "./MemoryGraphView.js";
import { darkTheme, lightTheme } from "../lib/theme.js";
import { FilterTabs, Badge } from "./ui/index.js";

type Tier = "all" | "short" | "long" | "permanent";
type Segment = "all" | "identity" | "preference" | "relationship" | "project" | "knowledge" | "context";
type ViewMode = "table" | "graph";

const TIER_OPTIONS: { value: Tier; label: string }[] = [
  { value: "all", label: "All" },
  { value: "short", label: "Short" },
  { value: "long", label: "Long" },
  { value: "permanent", label: "Permanent" },
];

const SEGMENT_OPTIONS: Segment[] = [
  "all",
  "identity",
  "preference",
  "relationship",
  "project",
  "knowledge",
  "context",
];

export function MemoryPanel({ isDark }: { isDark: boolean }) {
  const t = isDark ? darkTheme : lightTheme;

  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [tierFilter, setTierFilter] = useState<Tier>("all");
  const [segmentFilter, setSegmentFilter] = useState<Segment>("all");
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const records = useQuery(api.memoryRecords.list, {
    tier: tierFilter !== "all" ? (tierFilter as any) : undefined,
    lifecycle: "active",
    limit: 500,
  });

  const allRecords = records ?? [];
  const filtered = allRecords.filter((r: any) => {
    if (segmentFilter !== "all" && r.segment !== segmentFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        (r.content ?? "").toLowerCase().includes(q) ||
        (r.memoryId ?? "").toLowerCase().includes(q) ||
        (r.segment ?? "").toLowerCase().includes(q)
      );
    }
    return true;
  });

  const btnActive = isDark
    ? "bg-slate-700 text-white font-medium"
    : "bg-slate-200 text-slate-800 font-medium";
  const btnInactive = isDark
    ? "text-slate-500 hover:text-slate-300 hover:bg-slate-800"
    : "text-slate-400 hover:text-slate-600 hover:bg-slate-100";

  return (
    <div className="flex flex-col h-full -m-5">
      {/* Toolbar */}
      <div
        className={`shrink-0 border-b px-5 py-3 flex flex-wrap items-center gap-3 ${t.borderSubtle}`}
      >
        <div
          className={`flex items-center rounded-md border ${t.border}`}
        >
          {(["table", "graph"] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-2.5 py-1 text-xs capitalize transition-colors ${
                viewMode === mode ? btnActive : btnInactive
              } ${mode === "table" ? "rounded-l-md" : "rounded-r-md"}`}
            >
              {mode}
            </button>
          ))}
        </div>

        {viewMode === "table" && (
          <>
            <FilterTabs
              isDark={isDark}
              options={TIER_OPTIONS}
              value={tierFilter}
              onChange={setTierFilter}
            />

            <FilterTabs
              isDark={isDark}
              options={SEGMENT_OPTIONS.map((s) => ({ value: s, label: s === "all" ? "All" : s }))}
              value={segmentFilter}
              onChange={setSegmentFilter}
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search memories…"
              className={`flex-1 min-w-[200px] text-sm rounded-md px-3 py-1.5 focus:outline-none border ${
                isDark
                  ? "bg-slate-800/50 border-slate-700 text-slate-300 placeholder:text-slate-600"
                  : "bg-white border-slate-200 text-slate-700 placeholder:text-slate-400"
              }`}
            />

            <span className={`text-xs mono ${t.textMuted}`}>
              {filtered.length}/{allRecords.length}
            </span>
          </>
        )}
      </div>

      {viewMode === "graph" && (
        <div className="flex-1 min-h-0">
          <MemoryGraphView records={allRecords as any} isDark={isDark} />
        </div>
      )}

      {viewMode === "table" && (
        <div className="flex-1 overflow-y-auto debug-scroll">
          {records === undefined ? (
            <div className="p-5 space-y-3">
              {Array.from({ length: 6 }, (_, i) => (
                <div
                  key={i}
                  className={`h-14 rounded-lg shimmer ${
                    isDark ? "bg-slate-900/30" : "bg-slate-100"
                  }`}
                />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <p className={`text-sm text-center py-12 ${t.textMuted}`}>
              No records match your filters
            </p>
          ) : (
            <div
              className={`divide-y ${
                isDark ? "divide-slate-800/40" : "divide-slate-100"
              }`}
            >
              {filtered.map((r: any) => {
                const isExpanded = expandedId === r.memoryId;

                return (
                  <div
                    key={r.memoryId}
                    className={`px-5 py-3 cursor-pointer transition-colors ${
                      isDark ? "hover:bg-slate-900/40" : "hover:bg-slate-50"
                    }`}
                    onClick={() =>
                      setExpandedId(isExpanded ? null : r.memoryId)
                    }
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Badge isDark={isDark} variant="tier" value={r.tier} />
                      {(() => {
                        const segColor = t.segment[r.segment as keyof typeof t.segment] ?? t.textMuted;
                        return (
                          <span className={`text-[9px] font-medium flex-shrink-0 ${segColor}`}>
                            {r.segment}
                          </span>
                        );
                      })()}
                      <span className={`text-[10px] mono ml-auto ${t.textMuted}`}>
                        {(r.importance ?? 0).toFixed(2)}
                      </span>
                      <span
                        className={`text-[10px] mono ${
                          isDark ? "text-slate-700" : "text-slate-300"
                        }`}
                      >
                        {r.accessCount ?? 0}x
                      </span>
                    </div>

                    <p
                      className={`text-sm ${
                        isExpanded ? "" : "line-clamp-2"
                      } ${t.textSecondary}`}
                    >
                      {r.content}
                    </p>

                    {isExpanded && (
                      <div className="mt-3 space-y-2 text-xs slide-down">
                        <div
                          className={`grid grid-cols-2 gap-x-6 gap-y-1 ${t.textMuted}`}
                        >
                          <div>
                            ID:{" "}
                            <span className={`mono ${t.textSecondary}`}>
                              {r.memoryId}
                            </span>
                          </div>
                          <div>
                            Decay:{" "}
                            <span className={`mono ${t.textSecondary}`}>
                              {r.decayRate}
                            </span>
                          </div>
                          {r.sourceTurn && (
                            <div>
                              Turn:{" "}
                              <span className={`mono ${t.textSecondary}`}>
                                {r.sourceTurn}
                              </span>
                            </div>
                          )}
                          <div>
                            Last accessed:{" "}
                            <span className={t.textSecondary}>
                              {new Date(r.lastAccessedAt).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
