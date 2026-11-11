"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import type { GiftItem } from "../data/wedding-config";
import { copyText } from "../lib/wedding-utils";
import { SeoulIvorySectionHeading } from "./SectionHeading";

function GiftCard({ gift, hidden }: { gift: GiftItem; hidden: boolean }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    if (gift.accountNumber && (await copyText(gift.accountNumber))) {
      setCopied(true);
    }
  }

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1500);
    return () => clearTimeout(t);
  }, [copied]);

  return (
    <div
      className={`${
        hidden ? "hidden" : ""
      } relative rounded-xl border border-(--si-line) bg-white p-3 text-center sm:block sm:p-3.5`}
    >
      <p className="si-display mb-1 hidden text-lg font-medium text-(--si-ink) sm:block sm:text-xl">
        {gift.title}
      </p>
      <p className="si-kr mb-2.5 hidden text-[0.62rem] tracking-[0.22em] text-(--si-accent) sm:block">
        {gift.englishLabel}
      </p>

      {gift.qrImage && (
        <div className="relative mx-auto aspect-square w-full max-w-52 rounded-lg border border-(--si-line) bg-white p-2 sm:p-3">
          <Image
            src={gift.qrImage.src}
            alt={gift.qrImage.alt || `Mã QR chuyển khoản ${gift.title}`}
            fill
            sizes="208px"
            className="object-contain p-2"
          />
        </div>
      )}

      {(gift.accountName || gift.bankName || gift.accountNumber) && (
        <div className="mt-3 space-y-0.5 sm:mt-4">
          {gift.accountName && (
            <p className="si-display text-sm font-semibold tracking-wide text-(--si-ink) uppercase sm:text-base">
              {gift.accountName}
            </p>
          )}
          {gift.bankName && (
            <p className="font-display text-xs text-(--si-ink-soft) italic sm:text-sm">
              {gift.bankName}
            </p>
          )}
          {gift.accountNumber && (
            <p className="pt-1 font-mono text-xs text-(--si-ink) tabular-nums sm:text-sm">
              {gift.accountNumber}
            </p>
          )}
        </div>
      )}

      <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
        {gift.accountNumber && (
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-(--si-line) px-4 py-1.5 text-xs text-(--si-ink) transition hover:opacity-80"
          >
            {copied ? "Đã copy" : "Sao chép STK"}
          </button>
        )}
        {gift.qrImage && (
          <a
            href={gift.qrImage.src}
            download={`QR-${gift.side}.webp`}
            className="inline-flex items-center gap-1.5 rounded-full border border-(--si-line) px-4 py-1.5 text-xs text-(--si-ink) transition hover:opacity-80"
          >
            Tải mã QR
          </a>
        )}
      </div>
    </div>
  );
}

function GiftModal({
  gifts,
  english,
  title,
  subtitle,
  onClose,
}: {
  gifts: GiftItem[];
  english: string;
  title: string;
  subtitle: string;
  onClose: () => void;
}) {
  const [activeTab, setActiveTab] = useState(0);
  const [portalTarget, setPortalTarget] = useState<Element | null>(null);

  useEffect(() => {
    setPortalTarget(document.querySelector("[data-thiep-root]") ?? document.body);
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  if (!portalTarget) return null;

  return createPortal(
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      <div
        aria-hidden="true"
        onClick={onClose}
        className="absolute inset-0 bg-black/55"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl border border-(--si-line) bg-(--si-bg) shadow-2xl"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Đóng"
          className="absolute top-3 right-3 z-10 flex size-10 cursor-pointer items-center justify-center rounded-full bg-(--si-taupe)/16 text-xl text-(--si-ink) transition hover:scale-110"
        >
          ×
        </button>

        <div className="p-6 text-center">
          <p
            className="si-kr text-[0.74rem] text-(--si-accent)"
            style={{ letterSpacing: "0.22em" }}
          >
            {english}
          </p>
          <p className="si-display m-0 mt-1.5 text-2xl font-medium tracking-[0.04em] text-(--si-ink) sm:text-3xl">
            {title}
          </p>
          <span aria-hidden="true" className="mt-3 mb-5 flex justify-center">
            <span className="si-rule si-rule--foil w-12 sm:w-16" />
          </span>
          <p className="font-display mx-auto mb-6 max-w-md text-[0.85rem] text-(--si-ink-soft) italic sm:text-[0.95rem]">
            {subtitle}
          </p>

          {gifts.length > 1 && (
            <div className="mb-4 flex gap-2 rounded-full border border-(--si-line) bg-(--si-bg-warm) p-1 sm:hidden">
              {gifts.map((g, idx) => (
                <button
                  key={g.side}
                  type="button"
                  onClick={() => setActiveTab(idx)}
                  className={`flex-1 cursor-pointer rounded-full px-4 py-2 text-sm font-semibold transition ${
                    activeTab === idx
                      ? "bg-(--si-ink) text-white shadow"
                      : "text-(--si-ink)"
                  }`}
                >
                  {g.title}
                </button>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-3">
            {gifts.map((g, idx) => (
              <GiftCard
                key={g.side}
                gift={g}
                hidden={gifts.length > 1 && activeTab !== idx}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="mt-7 cursor-pointer rounded-full border border-(--si-line) px-7 py-2.5 text-sm text-(--si-ink) transition hover:opacity-80 sm:mt-9"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>,
    portalTarget
  );
}

export function SeoulIvoryGift({
  gifts,
  index = "07",
  english = "WEDDING GIFT",
  title = "Mừng Cưới",
  buttonLabel = "Mừng cưới",
  note = "Sự hiện diện của quý khách đã là món quà ý nghĩa nhất với chúng mình.",
  modalSubtitle = "Quét mã QR hoặc sao chép số tài khoản",
}: {
  gifts: GiftItem[];
  index?: string;
  english?: string;
  title?: string;
  buttonLabel?: string;
  note?: string;
  modalSubtitle?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <section className="relative overflow-hidden px-5 py-16 sm:px-6 sm:py-24">
      <SeoulIvorySectionHeading
        index={index}
        english={english}
        title={title}
        align="center"
      />
      <div className="relative mx-auto -mt-2 max-w-2xl text-center">
        <div
          data-reveal="scale"
          style={{ "--reveal-delay": "120ms" } as React.CSSProperties}
        >
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="si-shine-btn inline-flex cursor-pointer items-center justify-center rounded-full px-10 py-3 text-[0.78rem] font-semibold tracking-[0.14em] uppercase transition hover:scale-[1.03] sm:px-12"
            style={{
              background: "var(--si-ink)",
              color: "#fff",
              boxShadow: "0 8px 20px rgba(74,64,57,0.25)",
            }}
          >
            <span className="relative z-1">{buttonLabel}</span>
          </button>
          <p className="font-display mx-auto mt-6 max-w-md text-[0.9rem] leading-relaxed text-(--si-ink-soft) italic sm:text-[1rem]">
            {note}
          </p>
        </div>
      </div>

      {open && (
        <GiftModal
          gifts={gifts}
          english={english}
          title={title}
          subtitle={modalSubtitle}
          onClose={() => setOpen(false)}
        />
      )}
    </section>
  );
}

