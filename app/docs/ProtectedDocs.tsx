"use client";

import type { FormEvent, ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { surface, ink } from "@/components/palette";
import { ACCENT } from "@/components/site/accent";

const ALLOWED_APP_KEY_HASHES = new Set([
  1956082472,
  3600394450,
  304584305,
  359047818,
  2612484695,
  557993,
  560507038,
  2930129497,
  632450472,
  1886071323,
]);
const ACCESS_SESSION_KEY = "xmly-docs-app-key-access";
const APP_KEY_PATTERN = /^[a-f0-9]{32}$/;

function hashAccessKey(value: string) {
  let hash = 2166136261;

  for (const character of value) {
    hash ^= character.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

export function ProtectedDocs({ children }: { children: ReactNode }) {
  const [appKey, setAppKey] = useState("");
  const [error, setError] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsUnlocked(sessionStorage.getItem(ACCESS_SESSION_KEY) === "unlocked");
  }, []);

  useEffect(() => {
    contentRef.current?.toggleAttribute("inert", !isUnlocked);
  }, [isUnlocked]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const normalizedAppKey = appKey.trim().toLowerCase();
    const isValid = APP_KEY_PATTERN.test(normalizedAppKey)
      && ALLOWED_APP_KEY_HASHES.has(hashAccessKey(normalizedAppKey));

    if (isValid) {
      sessionStorage.setItem(ACCESS_SESSION_KEY, "unlocked");
      setIsUnlocked(true);
      setAppKey("");
    } else {
      setError("app_key 无效，请确认后重试。");
    }
  }

  return (
    <div className="relative mx-auto max-w-6xl">
      <div
        ref={contentRef}
        data-protected-docs="content"
        aria-hidden={!isUnlocked}
        className={`transition-[filter,opacity] duration-500 ${isUnlocked ? "" : "pointer-events-none select-none blur-[12px] opacity-70"}`}
      >
        {children}
      </div>

      {!isUnlocked && (
        <div className="absolute inset-x-0 top-0 z-10 flex justify-center px-4 pt-10 sm:pt-16">
          <form
            data-protected-docs="gate"
            className="w-full max-w-md rounded-2xl border p-5 text-center shadow-xl backdrop-blur-xl sm:p-6"
            style={{ background: `${surface.raised}eb`, borderColor: ink.line }}
            onSubmit={handleSubmit}
          >
            <div
              className="mx-auto flex h-10 w-10 items-center justify-center rounded-full"
              style={{ background: ACCENT.tint, color: ACCENT.deep }}
              aria-hidden
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="5" y="10" width="14" height="10" rx="2" />
                <path d="M8 10V7a4 4 0 0 1 8 0v3" />
              </svg>
            </div>
            <h2 className="mt-3 text-lg font-semibold" style={{ color: ink[900] }}>文档内容已隐藏</h2>
            <p className="mt-1 text-xs leading-relaxed sm:text-sm" style={{ color: ink[700] }}>
              输入已授权的 app_key 后查看接入文档、品牌规范与权益方案。
            </p>

            <label className="mt-4 block text-left text-xs font-semibold" htmlFor="docs-access-app-key" style={{ color: ink[900] }}>
              app_key
            </label>
            <div className="mt-1.5 flex gap-2">
              <input
                id="docs-access-app-key"
                name="docs-access-app-key"
                type="password"
                autoComplete="off"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                value={appKey}
                onChange={(event) => {
                  setAppKey(event.target.value);
                  setError("");
                }}
                className="min-w-0 flex-1 rounded-full border bg-white/80 px-4 py-2.5 text-sm outline-none transition-shadow focus:ring-2"
                style={{ borderColor: ink.line, color: ink[900] }}
                placeholder="请输入 app_key"
              />
              <button
                type="submit"
                disabled={!appKey.trim()}
                className="whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-semibold transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
                style={{ background: ACCENT.deep, color: surface.raised }}
              >
                验证并查看
              </button>
            </div>
            <p className="mt-2 min-h-5 text-left text-xs" role="alert" style={{ color: ACCENT.deep }}>
              {error}
            </p>
          </form>
        </div>
      )}
    </div>
  );
}
