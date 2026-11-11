"use client";

import { useEffect, useState } from "react";
import { SeoulIvorySectionHeading } from "./SectionHeading";

const LABEL_CLASS =
  "block text-[0.7rem] tracking-[0.2em] text-(--t-accent) uppercase";
const FIELD_CLASS =
  "mt-2 w-full border-b border-(--t-secondary) bg-transparent py-2 text-(--t-ink) outline-none focus:border-(--t-primary) disabled:opacity-60";

export function RsvpSection({
  defaultGuestName,
  english = "R.S.V.P",
  title = "Xác Nhận Tham Dự",
}: {
  defaultGuestName?: string;
  english?: string;
  title?: string;
}) {
  const [guestName, setGuestName] = useState(defaultGuestName ?? "");
  const [attending, setAttending] = useState<"yes" | "no">("yes");
  const [guestCount, setGuestCount] = useState(1);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{
    status: "success" | "error";
    message: string;
  } | null>(null);

  useEffect(() => {
    if (defaultGuestName && !guestName) {
      setGuestName(defaultGuestName);
    }
  }, [defaultGuestName, guestName]);

  const disabled = submitting || result?.status === "success";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setResult(null);

    const trimmedName = guestName.trim();
    if (!trimmedName) {
      setResult({
        status: "error",
        message: "Vui lòng nhập tên của bạn.",
      });
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guestName: trimmedName,
          attending,
          guestCount,
          message: message.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok || data.status === "error") {
        setResult({
          status: "error",
          message: data.message || "Có lỗi xảy ra, vui lòng thử lại.",
        });
      } else {
        setResult({
          status: "success",
          message:
            data.message ||
            "Cảm ơn bạn đã xác nhận tham dự cùng gia đình chúng mình!",
        });
      }
    } catch {
      setResult({
        status: "error",
        message: "Không thể kết nối máy chủ, vui lòng thử lại.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section
      id="rsvp"
      className="relative overflow-hidden px-5 py-16 sm:px-6 sm:py-24"
    >
      <div className="relative mx-auto max-w-xl">
        <SeoulIvorySectionHeading
          english={english}
          title={title}
          align="center"
        />

        <div
          data-reveal="scale"
          className="si-wish mx-auto max-w-md rounded-xl px-6 py-8 sm:px-9 sm:py-10"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="rsvp-name" className={LABEL_CLASS}>
                Tên của bạn
              </label>
              <input
                id="rsvp-name"
                name="guestName"
                required
                disabled={disabled}
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                className={FIELD_CLASS}
              />
            </div>

            <div>
              <label htmlFor="rsvp-attending" className={LABEL_CLASS}>
                Bạn sẽ tham dự?
              </label>
              <select
                id="rsvp-attending"
                name="attending"
                disabled={disabled}
                value={attending}
                onChange={(e) =>
                  setAttending(e.target.value === "no" ? "no" : "yes")
                }
                className={FIELD_CLASS}
              >
                <option value="yes">Có, mình sẽ đến</option>
                <option value="no">Rất tiếc, mình không đến được</option>
              </select>
            </div>

            <div>
              <label htmlFor="rsvp-count" className={LABEL_CLASS}>
                Số người tham dự
              </label>
              <input
                id="rsvp-count"
                name="guestCount"
                type="number"
                min={1}
                max={20}
                disabled={disabled}
                value={guestCount}
                onChange={(e) => setGuestCount(Number(e.target.value) || 1)}
                className={FIELD_CLASS}
              />
            </div>

            <div>
              <label htmlFor="rsvp-message" className={LABEL_CLASS}>
                Lời nhắn (không bắt buộc)
              </label>
              <textarea
                id="rsvp-message"
                name="message"
                rows={3}
                disabled={disabled}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className={`${FIELD_CLASS} resize-none`}
              />
            </div>

            <button
              type="submit"
              disabled={disabled}
              className="si-shine-btn w-full cursor-pointer rounded-full bg-(--si-ink) px-6 py-3 text-[0.78rem] font-semibold tracking-[0.14em] text-white uppercase transition hover:scale-[1.02] disabled:opacity-60"
            >
              {submitting ? "Đang gửi…" : "Gửi xác nhận"}
            </button>

            {result && (
              <p
                role={result.status === "error" ? "alert" : "status"}
                className={`text-center text-sm ${
                  result.status === "error"
                    ? "text-red-brand"
                    : "text-(--t-primary)"
                }`}
              >
                {result.message}
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}

