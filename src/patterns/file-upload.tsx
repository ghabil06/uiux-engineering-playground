/** File upload — local simulation with validation, progress, retry. Nothing leaves the browser. */
import React from "react";
import { Card } from "../components/ui";
import { PatternDoc, Progress } from "./primitives";
import { patternDef } from "./data";
import { Upload, X, RotateCcw, FileText } from "lucide-react";
import { cx } from "../lib/core";

type FStatus = "queued" | "uploading" | "done" | "error" | "rejected";
interface F { id: number; file: File; url: string | null; status: FStatus; pct: number; reason?: string }

const ALLOW = ["image/png", "image/jpeg", "application/pdf", "text/plain", "text/csv"];
const ALLOW_LABEL = "PNG, JPG, PDF, TXT, CSV";

const fmt = (b: number) => (b > 1048576 ? `${(b / 1048576).toFixed(1)} MB` : `${Math.max(1, Math.round(b / 1024))} KB`);

export default function UploadDemo() {
  const def = patternDef("file-upload");
  const [files, setFiles] = React.useState<F[]>([]);
  const [limitMB, setLimitMB] = React.useState(5);
  const [failNext, setFailNext] = React.useState(false);
  const [drag, setDrag] = React.useState(false);
  const idRef = React.useRef(0);
  const failRef = React.useRef(false);
  failRef.current = failNext;

  // Revoke every object URL on unmount — no leaks, no retained content.
  React.useEffect(() => () => {
    setFiles((prev) => { prev.forEach((f) => f.url && URL.revokeObjectURL(f.url)); return prev; });
  }, []);

  const add = (list: FileList | File[]) => {
    const arr = Array.from(list).slice(0, 6 - files.length || 6);
    const fresh: F[] = arr.map((file) => {
      const id = ++idRef.current;
      if (!ALLOW.includes(file.type) && file.type !== "") {
        return { id, file, url: null, status: "rejected", pct: 0, reason: `Type “${file.type || "unknown"}” not allowed (${ALLOW_LABEL}).` };
      }
      if (file.size > limitMB * 1048576) {
        return { id, file, url: null, status: "rejected", pct: 0, reason: `${fmt(file.size)} exceeds the ${limitMB} MB demo limit.` };
      }
      const url = file.type.startsWith("image/") ? URL.createObjectURL(file) : null;
      return { id, file, url, status: "queued", pct: 0 };
    });
    setFiles((p) => [...p, ...fresh]);
  };

  const remove = (id: number) => {
    setFiles((p) => {
      const f = p.find((x) => x.id === id);
      if (f?.url) URL.revokeObjectURL(f.url);
      return p.filter((x) => x.id !== id);
    });
  };

  const uploadOne = (id: number) => {
    setFiles((p) => p.map((f) => (f.id === id ? { ...f, status: "uploading", pct: 0 } : f)));
    const shouldFail = failRef.current;
    if (shouldFail) setFailNext(false);
    const iv = window.setInterval(() => {
      setFiles((p) => p.map((f) => {
        if (f.id !== id || f.status !== "uploading") return f;
        const next = f.pct + 18;
        if (next >= 100) {
          window.clearInterval(iv);
          return shouldFail
            ? { ...f, pct: 100, status: "error", reason: "Simulated network drop at 100% — retry is safe and idempotent." }
            : { ...f, pct: 100, status: "done" };
        }
        return { ...f, pct: next };
      }));
    }, 220);
  };

  const uploadAll = () => files.filter((f) => f.status === "queued" || f.status === "error").forEach((f) => uploadOne(f.id));
  const queued = files.filter((f) => f.status === "queued" || f.status === "error").length;
  const doneN = files.filter((f) => f.status === "done").length;

  return (
    <div className="space-y-4">
      <PatternDoc purpose={def.desc} useCases={def.useCases}
        states="Empty, selected, validating, uploading, done, rejected, failed + retry."
        a11y={def.keyboard + " Client checks are UX-only — the note below says real security lives server-side."} />
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-3 text-xs font-semibold text-amber-900 dark:border-amber-400/20 dark:bg-amber-500/10 dark:text-amber-100">
        Local simulation: files never leave your browser. Client-side type/size checks improve UX but
        provide <u>no</u> real security — servers must re-validate everything.
      </div>
      <Card className="space-y-3 p-5">
        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
            Size limit
            <select value={limitMB} onChange={(e) => setLimitMB(Number(e.target.value))} aria-label="Demo file size limit"
              className="h-9 rounded-lg border border-slate-300 bg-transparent px-2 dark:border-white/15">
              {[1, 5, 25].map((n) => <option key={n} value={n}>{n} MB</option>)}
            </select>
          </label>
          <label className="flex cursor-pointer items-center gap-2 text-xs font-bold text-slate-500">
            <input type="checkbox" checked={failNext} onChange={(e) => setFailNext(e.target.checked)} className="h-4 w-4 accent-rose-600" />
            Fail the next upload (to demo retry)
          </label>
          <button onClick={uploadAll} disabled={queued === 0} className="ml-auto h-10 rounded-xl bg-violet-600 px-4 text-sm font-bold text-white disabled:opacity-40">
            Upload {queued > 0 ? `${queued} file${queued === 1 ? "" : "s"}` : "— all done"}
          </button>
        </div>
        <label
          onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => { e.preventDefault(); setDrag(false); add(e.dataTransfer.files); }}
          className={cx("flex cursor-pointer flex-col items-center rounded-3xl border-2 border-dashed p-8 text-center transition",
            drag ? "border-violet-500 bg-violet-50 dark:bg-violet-500/10" : "border-slate-300 hover:border-violet-400 dark:border-white/15")}>
          <Upload size={26} aria-hidden className="text-violet-500" />
          <b className="mt-2 text-sm">{drag ? "Drop to add files" : "Drop files here or click to browse"}</b>
          <span className="text-xs text-slate-500">{ALLOW_LABEL} · up to {limitMB} MB each</span>
          <input type="file" multiple accept={ALLOW.join(",")} className="sr-only" aria-label="Choose files to upload"
            onChange={(e) => { add(e.target.files ?? []); e.target.value = ""; }} />
        </label>
        {files.length === 0 && <p className="text-center text-xs text-slate-400">Empty state: no files selected yet.</p>}
        <ul className="space-y-2" aria-label="Selected files">
          {files.map((f) => (
            <li key={f.id} className="rounded-2xl border border-slate-200 p-3 text-sm dark:border-white/10">
              <span className="flex items-center gap-2.5">
                {f.url
                  ? <img src={f.url} alt="" aria-hidden className="h-10 w-10 shrink-0 rounded-lg object-cover" />
                  : <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 dark:bg-white/10"><FileText size={18} aria-hidden /></span>}
                <span className="min-w-0 flex-1">
                  <b className="block truncate">{f.file.name}</b>
                  <span className="text-xs text-slate-500">{fmt(f.file.size)} · {f.status === "done" ? "✓ uploaded (simulated)" : f.status === "rejected" || f.status === "error" ? `✕ ${f.reason}` : f.status === "uploading" ? `Uploading… ${f.pct}%` : "Queued"}</span>
                </span>
                {(f.status === "queued" || f.status === "error") && (
                  <button onClick={() => uploadOne(f.id)} aria-label={f.status === "error" ? `Retry ${f.file.name}` : `Upload ${f.file.name}`}
                    className="rounded-lg bg-violet-600 px-3 py-1.5 text-xs font-black text-white">
                    {f.status === "error" ? <span className="flex items-center gap-1"><RotateCcw size={12} /> Retry</span> : "Upload"}
                  </button>
                )}
                <button onClick={() => remove(f.id)} aria-label={`Remove ${f.file.name}`} className="rounded-lg p-1.5 hover:bg-slate-100 dark:hover:bg-white/10"><X size={15} /></button>
              </span>
              {f.status === "uploading" && <span className="mt-2 block"><Progress value={f.pct} label={`${f.file.name} upload progress`} /></span>}
            </li>
          ))}
        </ul>
        {doneN > 0 && <p role="status" className="text-xs font-bold text-emerald-600">{doneN} file{doneN === 1 ? "" : "s"} uploaded (simulated, local only).</p>}
      </Card>
    </div>
  );
}
