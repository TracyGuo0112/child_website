"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { surface, ink } from "@/components/palette";
import { ACCENT } from "./accent";

// Docs gate. This modal never holds a valid key — it writes whatever the user
// typed to the `docs_key` cookie, probes /docs/ (nginx maps the cookie to
// allow/deny at the edge), and only navigates on a 200. Keeping the real check
// server-side is the whole point: on a static export there is no runtime to
// verify against, and any key shipped to the client would be readable in the
// bundle. Controlled like ContactModal so NavBar can keep it mounted outside the
// mobile dropdown, which unmounts its children on toggle.
export function DocsAuthModal({ open, onClose, onContact }: { open: boolean; onClose: () => void; onContact: () => void }) {
  const [key, setKey] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Escape closes; lock body scroll while open; focus the field on open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    inputRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  async function submit() {
    const k = key.trim();
    if (!k || busy) return;
    const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
    // Scope the cookie to the docs path so it rides every /docs sub-resource
    // request (html/css/img/pdf) yet never leaks to the rest of the site.
    document.cookie = `docs_key=${encodeURIComponent(k)}; path=${base}/docs; max-age=86400; SameSite=Lax`;
    setBusy(true);
    setError("");
    try {
      // Same-origin, so the cookie we just set is sent automatically; nginx
      // answers 200 (allow) / 403 (deny).
      const res = await fetch(`${base}/docs/`, { method: "HEAD" });
      if (res.ok) window.location.href = `${base}/docs/`;
      else setError("appkey 无效，请确认后重试");
    } catch {
      setError("网络异常，请稍后重试");
    } finally {
      setBusy(false);
    }
  }

  if (!open) return null;

  // portal to <body>: the nav ancestor uses backdrop-filter, which becomes a
  // containing block for fixed positioning — rendered in place, the overlay
  // would size to the nav pill instead of the viewport (same as ContactModal).
  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center px-6 backdrop-blur-sm"
      style={{ background: `${ink[900]}66` }}
      onClick={onClose}
      role="dialog"
      aria-modal
      aria-label="访问技术文档"
    >
      <div
        className="relative w-full max-w-sm rounded-lg px-8 pb-8 pt-10 shadow-2xl"
        style={{ background: surface.raised }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full hover:opacity-70"
          aria-label="关闭"
          onClick={onClose}
          style={{ color: ink[500] }}
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        <p className="text-lg font-semibold" style={{ color: ink[900] }}>访问技术文档</p>
        <p className="mt-1 text-sm" style={{ color: ink[500] }}>请输入我们提供的 appkey</p>

        <input
          ref={inputRef}
          type="text"
          value={key}
          onChange={(e) => { setKey(e.target.value); if (error) setError(""); }}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="appkey"
          autoComplete="off"
          spellCheck={false}
          className="mt-5 w-full rounded-lg px-4 py-2.5 text-sm outline-none"
          style={{
            color: ink[900],
            background: surface.paper,
            border: `1.5px solid ${error ? ACCENT.deep : ink.line}`,
          }}
        />

        {error && <p className="mt-2 text-xs" style={{ color: ACCENT.deep }}>{error}</p>}

        <button
          onClick={submit}
          disabled={busy || !key.trim()}
          className="mt-5 w-full whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-semibold transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
          style={{ background: ACCENT.deep, color: surface.raised }}
        >
          {busy ? "验证中…" : "进入文档"}
        </button>

        {/* escape hatch for vendors without a key yet — hands off to the BD contact modal */}
        <button
          onClick={onContact}
          className="mt-4 w-full text-center text-xs hover:opacity-70"
          style={{ color: ink[500] }}
        >
          还没有？<span style={{ color: ACCENT.deep, fontWeight: 600 }}>联系商务</span>
        </button>
      </div>
    </div>,
    document.body,
  );
}
