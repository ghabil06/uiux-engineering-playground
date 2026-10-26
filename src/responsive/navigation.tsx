/** Responsive navigation — desktop bar becomes an accessible drawer by measured width. */
import React from "react";
import { PreviewShell } from "./preview";
import { Menu, X } from "lucide-react";

const LINKS = ["Dashboard", "Orders", "Reports", "Settings"];

export default function RespNavDemo() {
  const [w, setW] = React.useState(560);
  const [page, setPage] = React.useState("Dashboard");
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => { setOpen(false); }, [page]);

  return (
    <div className="space-y-3">
      <PreviewShell width={w} onWidth={setW} min={280} max={1000} label="Navigation preview">
        {(inner) => {
          const desktop = inner >= 560;
          return (
            <div>
              <div className="flex h-12 items-center gap-2 border-b border-slate-200 px-3 dark:border-white/10">
                <b className="text-sm">Acme</b>
                {desktop ? (
                  <nav className="ml-2 flex gap-1" aria-label="Demo">
                    {LINKS.map((l) => (
                      <button key={l} onClick={() => setPage(l)} aria-current={page === l ? "page" : undefined}
                        className={page === l ? "rounded-lg bg-slate-900 px-3 py-1.5 text-[13px] font-bold text-white" : "rounded-lg px-3 py-1.5 text-[13px] font-semibold text-slate-500 hover:bg-slate-100"}>
                        {l}
                      </button>
                    ))}
                  </nav>
                ) : (
                  <button onClick={() => setOpen(true)} aria-label="Open menu" aria-expanded={open}
                    className="ml-auto rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-white/10"><Menu size={18} /></button>
                )}
              </div>
              <div className="p-4">
                <p className="text-sm"><b>{page}</b> — {desktop ? "inline bar (≥560px measured)" : "drawer mode (<560px measured)"}.</p>
                <p className="mt-1 text-xs text-slate-500">The switch follows the pane's measured width, not the window — the same logic as container queries, without the dependency.</p>
              </div>
              {!desktop && open && (
                <div className="fixed inset-0 z-[70]" role="dialog" aria-modal="true" aria-label="Demo menu">
                  <div className="absolute inset-0 bg-black/45" onClick={() => setOpen(false)} />
                  <div className="absolute inset-y-0 left-0 w-64 bg-white p-4 shadow-2xl dark:bg-slate-950">
                    <div className="mb-2 flex items-center justify-between">
                      <b className="text-sm">Acme</b>
                      <button onClick={() => setOpen(false)} aria-label="Close menu" className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-white/10"><X size={17} /></button>
                    </div>
                    <nav aria-label="Demo mobile">
                      <ul className="space-y-1">
                        {LINKS.map((l) => (
                          <li key={l}>
                            <button onClick={() => setPage(l)} aria-current={page === l ? "page" : undefined}
                              className={page === l ? "w-full rounded-xl bg-slate-900 px-3 py-2.5 text-left text-sm font-bold text-white" : "w-full rounded-xl px-3 py-2.5 text-left text-sm font-semibold hover:bg-slate-100"}>
                              {l}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </nav>
                  </div>
                </div>
              )}
            </div>
          );
        }}
      </PreviewShell>
      <p className="text-xs text-slate-500">Keyboard: Esc closes (add Esc handling via the shared Dialog in production); focus returns to the menu button; current page uses aria-current.</p>
    </div>
  );
}
