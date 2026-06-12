"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { ink } from "@/components/palette";
import { ACCENT } from "./accent";
import { SolidBtn } from "./atoms";

const BD_PHONE = "15712017127";

// "申请合作" CTA: opens a contact modal (BD WeChat QR + phone) instead of
// navigating — there is no external landing page for partnership applications.
// Client component so the server Footer can keep its CTA without going client.
export function ApplyBtn({ onOpen }: { onOpen?: () => void }) {
  const [open, setOpen] = useState(false);

  // Escape closes; lock body scroll while open so the page doesn't scroll
  // behind the fixed overlay.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
      <SolidBtn onClick={() => { onOpen?.(); setOpen(true); }}>申请合作</SolidBtn>

      {/* portal to <body>: the nav/footer ancestors use backdrop-filter, which
          turns them into containing blocks for fixed positioning — rendered in
          place, the overlay would size to the nav pill instead of the viewport */}
      {open && createPortal(
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center px-6 backdrop-blur-sm"
          style={{ background: `${ink[900]}66` }}
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal
          aria-label="申请合作联系方式"
        >
          <div
            className="relative max-h-[85vh] w-full max-w-xs overflow-y-auto rounded-3xl px-8 pb-8 pt-10 text-center shadow-2xl"
            // pure white, not the ivory card surface — the QR screenshot has a
            // white background and would show as a mismatched patch on ivory
            style={{ background: "#FFFFFF" }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full hover:opacity-70"
              aria-label="关闭"
              onClick={() => setOpen(false)}
              style={{ color: ink[500] }}
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>

            <p className="text-lg font-semibold" style={{ color: ink[900] }}>申请合作</p>
            <p className="mt-1 text-sm" style={{ color: ink[500] }}>扫码添加微信，咨询接入合作</p>

            {/* QR screenshot already carries its own name header + scan hint */}
            <Image
              src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/brand/bd-wechat.png`}
              alt="商务微信二维码"
              width={924}
              height={1433}
              className="mx-auto mt-4 w-full rounded-xl"
            />

            <p className="mt-4 text-sm" style={{ color: ink[700] }}>
              商务负责人&nbsp;
              <a href={`tel:${BD_PHONE}`} className="font-semibold hover:opacity-70" style={{ color: ACCENT.deep }}>
                {BD_PHONE}
              </a>
            </p>
          </div>
        </div>,
        document.body,
      )}
    </>
  );
}
