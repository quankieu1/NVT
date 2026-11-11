"use client";

import { useEffect, useRef, useState } from "react";
import type { GuestbookEntry } from "../data/wedding-config";
import { SeoulIvorySectionHeading } from "./SectionHeading";

const LABEL_CLASS =
  "block text-[0.7rem] tracking-[0.2em] text-(--t-accent) uppercase";
const FIELD_CLASS =
  "mt-2 w-full border-b border-(--t-secondary) bg-transparent py-2 text-(--t-ink) outline-none focus:border-(--t-primary) disabled:opacity-60";

export function GuestbookSection({
  initialEntries,
  defaultGuestName,
  index = "06",
  english = "WEDDING GUESTBOOK",
  title = "Sổ Lưu Bút",
  subtitle = "Để lại đôi lời thân thương cho cô dâu chú rể",
  formTitle = "Gửi lời chúc",
}: {
  initialEntries: GuestbookEntry[];
  defaultGuestName?: string;
  index?: string;
  english?: string;
  title?: string;
  subtitle?: string;
  formTitle?: string;
}) {
  const [entries, setEntries] = useState<GuestbookEntry[]>(initialEntries);
  const [authorName, setAuthorName] = useState(defaultGuestName ?? "");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submittedData, setSubmittedData] = useState<{
    authorName: string;
    message: string;
    note: string;
  } | null>(null);
  const statusRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (defaultGuestName && !authorName) {
      setAuthorName(defaultGuestName);
    }
  }, [defaultGuestName, authorName]);

  useEffect(() => {
    fetch("/api/guestbook")
      .then((res) => res.json())
      .then((data) => {
        if (data?.status === "success" && Array.isArray(data.entries)) {
          setEntries(data.entries);
        }
      })
      .catch(() => {
        // Giữ nguyên initialEntries nếu lỗi mạng
      });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);

    const trimmedName = authorName.trim();
    const trimmedMsg = message.trim();
    if (!trimmedName || !trimmedMsg) {
      setErrorMsg("Vui lòng nhập đầy đủ tên và lời chúc của bạn.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/guestbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authorName: trimmedName,
          message: trimmedMsg,
        }),
      });
      const data = await res.json();
      if (!res.ok || data.status === "error") {
        setErrorMsg(data.message || "Có lỗi xảy ra, vui lòng thử lại.");
      } else {
        if (data.entry) {
          setEntries((prev) => [data.entry, ...prev]);
        }
        setSubmittedData({
          authorName: trimmedName,
          message: trimmedMsg,
          note:
            data.message ||
            "Lời chúc của bạn đã được lưu lại trong Sổ Lưu Bút.",
        });
      }
    } catch {
      setErrorMsg("Không thể kết nối máy chủ, vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  }

  useEffect(() => {
    if (submittedData && statusRef.current) {
      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      statusRef.current.scrollIntoView({
        block: "center",
        behavior: reduce ? "auto" : "smooth",
      });
    }
  }, [submittedData]);

  return (
    <section className="relative overflow-hidden px-5 py-16 sm:px-6 sm:py-24">
      <SeoulIvorySectionHeading
        index={index}
        english={english}
        title={title}
        align="center"
      />

      <div
        data-reveal="fade"
        style={{ "--reveal-delay": "120ms" } as React.CSSProperties}
        className="-mt-3 mb-9 text-center sm:mb-11"
      >
        <p className="font-display mx-auto max-w-md text-[0.92rem] leading-relaxed text-(--si-ink-soft) italic sm:text-[1.02rem]">
          {subtitle}
        </p>
        <div
          aria-hidden="true"
          className="mt-5 flex items-center justify-center gap-3"
        >
          <span className="si-rule si-rule--foil si-draw si-draw--center w-12 sm:w-16" />
          <span className="text-[0.95rem] text-(--si-taupe)">♡</span>
          <span className="si-rule si-rule--foil si-draw si-draw--center w-12 sm:w-16" />
        </div>
      </div>

      <div
        data-reveal="true"
        style={{ "--reveal-delay": "240ms" } as React.CSSProperties}
        className="relative mx-auto max-w-2xl"
      >
        {entries.length > 0 && (
          <ul className="-mx-4 m-0 flex max-h-120 list-none flex-col gap-3 overflow-y-auto px-4 py-2">
            {entries.map((item) => (
              <li
                key={item.id}
                className="si-wish rounded-xl px-4 py-3.5 sm:px-5 sm:py-4"
              >
                <p className="font-display text-[0.9rem] leading-relaxed text-(--si-ink) italic sm:text-[0.98rem]">
                  “{item.message}”
                </p>
                <p className="si-eyebrow mt-2.5 text-[0.56rem] tracking-[0.24em] text-(--si-accent)">
                  — {item.authorName}
                </p>
              </li>
            ))}
          </ul>
        )}

        <div className="si-wish mx-auto mt-9 max-w-md rounded-xl px-6 py-8 sm:px-9">
          <p className="si-eyebrow text-center text-[0.6rem] tracking-[0.3em] text-(--si-accent)">
            {formTitle}
          </p>
          <span aria-hidden="true" className="mt-3 mb-6 flex justify-center">
            <span className="si-rule si-rule--foil si-draw si-draw--center w-12 sm:w-16" />
          </span>

          {submittedData ? (
            <div
              ref={statusRef}
              role="status"
              tabIndex={-1}
              className="py-2 text-center outline-none"
            >
              <span
                aria-hidden="true"
                className="mx-auto flex size-12 items-center justify-center rounded-full bg-(--t-primary) text-(--t-bg)"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  className="size-6"
                >
                  <path
                    d="M5 12.5l4.5 4.5L19 7.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <p className="font-display mt-3 text-2xl text-(--t-accent)">
                Đã gửi lời chúc
              </p>
              <p className="mt-2 text-sm leading-relaxed text-(--t-ink)/80">
                Cảm ơn {submittedData.authorName}! {submittedData.note}
              </p>
              <blockquote className="mt-4 border-t border-(--t-secondary) pt-4 text-sm leading-relaxed whitespace-pre-line text-(--t-ink)/70 italic">
                “{submittedData.message}”
              </blockquote>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="guestbook-name" className={LABEL_CLASS}>
                  Tên của bạn
                </label>
                <input
                  id="guestbook-name"
                  name="authorName"
                  required
                  disabled={submitting}
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className={FIELD_CLASS}
                />
              </div>

              <div>
                <label htmlFor="guestbook-message" className={LABEL_CLASS}>
                  Lời chúc
                </label>
                <textarea
                  id="guestbook-message"
                  name="message"
                  rows={3}
                  required
                  disabled={submitting}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className={`${FIELD_CLASS} resize-none`}
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="si-shine-btn w-full cursor-pointer rounded-full bg-(--si-ink) px-6 py-3 text-[0.78rem] font-semibold tracking-[0.14em] text-white uppercase transition hover:scale-[1.02] disabled:opacity-60"
              >
                {submitting ? "Đang gửi…" : "Gửi lời chúc"}
              </button>

              {errorMsg && (
                <p role="alert" className="text-center text-sm text-red-brand">
                  {errorMsg}
                </p>
              )}
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

