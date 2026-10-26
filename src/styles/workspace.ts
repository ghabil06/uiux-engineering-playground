/**
 * Style Laboratory — shared demonstration scenario.
 *
 * Every style demo renders the SAME project-management workspace
 * (project summary, KPI cards, task list, progress visualization,
 * primary action) so visual treatments can be compared fairly.
 * Data is deterministic and local; all "server" effects are simulated
 * in state and labelled as such in the UI.
 */
import React from "react";

export type TaskStatus = "todo" | "doing" | "done" | "blocked";

export interface WsTask {
  id: string;
  title: string;
  owner: string;
  initials: string;
  status: TaskStatus;
  priority: "low" | "med" | "high";
  due: string;
}

export interface WsKpi {
  label: string;
  value: string;
  delta: string;
  tone: "up" | "warn" | "bad" | "flat";
}

export const PROJECT = {
  name: "Atlas Website Redesign",
  client: "Northwind Traders",
  due: "Nov 14, 2026",
  members: ["AK", "JM", "RS", "+4"],
  weekProgress: [28, 35, 33, 44, 52, 49, 61, 68],
} as const;

export const KPIS: WsKpi[] = [
  { label: "Tasks complete", value: "42 / 61", delta: "+6 this week", tone: "up" },
  { label: "In progress", value: "12", delta: "2 at risk", tone: "warn" },
  { label: "Blocked", value: "3", delta: "needs review", tone: "bad" },
  { label: "Velocity", value: "+18%", delta: "vs last sprint", tone: "up" },
];

export const TASKS: WsTask[] = [
  { id: "t1", title: "Design homepage hero variants", owner: "Amara K.", initials: "AK", status: "doing", priority: "high", due: "Oct 28" },
  { id: "t2", title: "Migrate pricing page to CMS", owner: "Jonas M.", initials: "JM", status: "todo", priority: "med", due: "Oct 30" },
  { id: "t3", title: "Fix checkout focus trap on mobile", owner: "Rin S.", initials: "RS", status: "blocked", priority: "high", due: "Oct 27" },
  { id: "t4", title: "Write onboarding email sequence", owner: "Amara K.", initials: "AK", status: "todo", priority: "low", due: "Nov 02" },
  { id: "t5", title: "Compress hero images (WebP)", owner: "Jonas M.", initials: "JM", status: "done", priority: "med", due: "Oct 24" },
  { id: "t6", title: "Usability test: new navigation", owner: "Rin S.", initials: "RS", status: "doing", priority: "med", due: "Oct 31" },
  { id: "t7", title: "Audit color contrast (AA)", owner: "Amara K.", initials: "AK", status: "done", priority: "high", due: "Oct 22" },
  { id: "t8", title: "Draft launch announcement", owner: "Jonas M.", initials: "JM", status: "todo", priority: "low", due: "Nov 05" },
];

export const ACTIVITY = [
  { who: "Rin S.", what: "flagged “Fix checkout focus trap” as blocked", when: "12 min ago" },
  { who: "Amara K.", what: "completed “Audit color contrast (AA)”", when: "1 h ago" },
  { who: "Jonas M.", what: "moved “Compress hero images” to Done", when: "3 h ago" },
  { who: "Priya N.", what: "commented on “Homepage hero variants”", when: "Yesterday" },
];

export type WsTab = "overview" | "tasks" | "activity";
export type WsNotice = { kind: "success" | "info"; text: string } | null;

export interface Workspace {
  name: string;
  setName: (v: string) => void;
  tab: WsTab;
  setTab: (t: WsTab) => void;
  query: string;
  setQuery: (v: string) => void;
  status: "all" | TaskStatus;
  setStatus: (s: "all" | TaskStatus) => void;
  tasks: WsTask[];
  visible: WsTask[];
  done: number;
  total: number;
  pct: number;
  selected: WsTask | null;
  setSelected: (t: WsTask | null) => void;
  toggleDone: (id: string) => void;
  addTask: () => void;
  notice: WsNotice;
  notify: (kind: "success" | "info", text: string) => void;
  loading: boolean;
  refresh: () => void;
  errorSim: boolean;
  triggerError: () => void;
  retry: () => void;
  reset: () => void;
}

/**
 * Shared client-side behavior for all 12 style demos.
 * Loading / error are simulated locally with timers and always labelled.
 */
export function useWorkspace(): Workspace {
  const [name, setName] = React.useState<string>(PROJECT.name);
  const [tab, setTab] = React.useState<WsTab>("overview");
  const [query, setQuery] = React.useState("");
  const [status, setStatus] = React.useState<"all" | TaskStatus>("all");
  const [tasks, setTasks] = React.useState<WsTask[]>(TASKS);
  const [selected, setSelected] = React.useState<WsTask | null>(null);
  const [notice, setNotice] = React.useState<WsNotice>(null);
  const [loading, setLoading] = React.useState(false);
  const [errorSim, setErrorSim] = React.useState(false);
  const timer = React.useRef<number | null>(null);

  React.useEffect(() => () => { if (timer.current) window.clearTimeout(timer.current); }, []);

  const notify = (kind: "success" | "info", text: string) => {
    setNotice({ kind, text });
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setNotice(null), 4000);
  };

  const q = query.trim().toLowerCase();
  const visible = tasks.filter(
    (t) =>
      (status === "all" || t.status === status) &&
      (!q || (t.title + " " + t.owner).toLowerCase().includes(q)),
  );
  const done = tasks.filter((t) => t.status === "done").length;
  const total = tasks.length;
  const pct = Math.round((done / total) * 100);

  const toggleDone = (id: string) => {
    setTasks((prev) => {
      const next = prev.map((t) =>
        t.id === id ? { ...t, status: t.status === "done" ? ("todo" as TaskStatus) : ("done" as TaskStatus) } : t,
      );
      const flipped = next.find((t) => t.id === id)!;
      notify(
        flipped.status === "done" ? "success" : "info",
        flipped.status === "done" ? `“${flipped.title}” marked done (local demo state).` : `“${flipped.title}” reopened.`,
      );
      return next;
    });
  };

  const addTask = () => {
    const n = tasks.length + 1;
    const fresh: WsTask = {
      id: `t-new-${n}`,
      title: `New task ${n} — triage in standup`,
      owner: "You",
      initials: "YO",
      status: "todo",
      priority: "med",
      due: "Nov 07",
    };
    setTasks((prev) => [fresh, ...prev]);
    notify("success", `“${fresh.title}” added locally — nothing was sent to a server.`);
  };

  const refresh = () => {
    setLoading(true);
    setErrorSim(false);
    window.setTimeout(() => {
      setLoading(false);
      notify("info", "Workspace reloaded from local demo data.");
    }, 800);
  };

  const triggerError = () => {
    setLoading(false);
    setErrorSim(true);
  };

  const retry = () => {
    setErrorSim(false);
    refresh();
  };

  const reset = () => {
    setTasks(TASKS);
    setQuery("");
    setStatus("all");
    setTab("overview");
    setSelected(null);
    setErrorSim(false);
    setLoading(false);
    setName(PROJECT.name);
    notify("info", "Demo reset to deterministic starting data.");
  };

  return {
    name, setName, tab, setTab, query, setQuery, status, setStatus,
    tasks, visible, done, total, pct, selected, setSelected,
    toggleDone, addTask, notice, notify, loading, refresh,
    errorSim, triggerError, retry, reset,
  };
}
