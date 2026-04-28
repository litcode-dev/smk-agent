import { api } from "../convex/_generated/api.js";
import { convex } from "./convex-client.js";
import { cancelAgent, runningAgentIds } from "./execution-agent.js";
import { broadcast } from "./broadcast.js";

const STALE_MS = 15 * 60 * 1000;

// Called once at startup to immediately fail agents left in "running" state
// by a previous server process. Without this, the heartbeat loop would wait
// up to 15 minutes before cleaning them up.
export async function markOrphanedAgents(): Promise<void> {
  const runningInDb = await convex.query(api.agents.list, { status: "running", limit: 100 });
  for (const a of runningInDb) {
    await convex.mutation(api.agents.update, {
      agentId: a.agentId,
      status: "failed",
      error: "Server restarted while agent was running.",
    });
    broadcast("agent_stale", { agentId: a.agentId });
  }
  if (runningInDb.length > 0) {
    console.log(`[startup] marked ${runningInDb.length} orphaned agent(s) as failed`);
  }
}

export async function sweepStaleAgents(): Promise<void> {
  const runningInDb = await convex.query(api.agents.list, { status: "running", limit: 100 });
  const now = Date.now();
  const live = new Set(runningAgentIds());

  for (const a of runningInDb) {
    const age = now - a.startedAt;
    if (age < STALE_MS) continue;

    if (live.has(a.agentId)) {
      cancelAgent(a.agentId);
    }
    await convex.mutation(api.agents.update, {
      agentId: a.agentId,
      status: "failed",
      error: `Marked failed after ${Math.round(age / 1000)}s (stale heartbeat).`,
    });
    broadcast("agent_stale", { agentId: a.agentId });
  }
}

export function startHeartbeatLoop(intervalMs = 60_000): () => void {
  const timer = setInterval(() => {
    sweepStaleAgents().catch((err) => console.error("[heartbeat] sweep error", err));
  }, intervalMs);
  return () => clearInterval(timer);
}
