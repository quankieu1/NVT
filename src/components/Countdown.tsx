"use client";

import { useEffect, useState } from "react";
import { SeoulIvorySectionHeading } from "./SectionHeading";

interface TimeParts {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function computeCountdown(targetIso: string): TimeParts {
  const diff = Math.max(0, new Date(targetIso).getTime() - Date.now());
  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return { days, hours, minutes, seconds };
}

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function RollingDigit({
  current,
  previous,
}: {
  current: number;
  previous: number;
}) {
  return (
    <span
      className="si-roll si-display font-medium tabular-nums text-(--si-ink)"
      style={{ fontSize: "clamp(1.9rem, 9vw, 2.7rem)" }}
    >
      <span className="sr-only">{pad2(current)}</span>
      <span
        key={current}
        aria-hidden="true"
        className="si-roll-track si-roll-go"
      >
        <span>{pad2(previous)}</span>
        <span>{pad2(current)}</span>
      </span>
    </span>
  );
}

const TIME_UNITS: Array<{ key: "hours" | "minutes" | "seconds"; label: string }> = [
  { key: "hours", label: "Giờ" },
  { key: "minutes", label: "Phút" },
  { key: "seconds", label: "Giây" },
];

export function Countdown({
  targetIso,
  index = "08",
  english = "SAVE THE DATE",
  title = "Đếm Ngược Ngày",
  todayMessage = "Hôm nay là ngày trọng đại!",
}: {
  targetIso: string;
  index?: string;
  english?: string;
  title?: string;
  todayMessage?: string;
}) {
  const [state, setState] = useState<{
    current: TimeParts;
    previous: TimeParts;
  } | null>(null);

  useEffect(() => {
    const initial = computeCountdown(targetIso);
    setState({ current: initial, previous: initial });

    const interval = setInterval(() => {
      setState((prev) => {
        const next = computeCountdown(targetIso);
        return {
          previous: prev ? prev.current : next,
          current: next,
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [targetIso]);

  const isToday =
    state !== null &&
    state.current.days === 0 &&
    state.current.hours === 0 &&
    state.current.minutes === 0 &&
    state.current.seconds === 0;

  return (
    <section className="si-band relative overflow-hidden px-5 py-16 sm:px-6 sm:py-24">
      <div className="relative mx-auto max-w-xl text-center">
        <SeoulIvorySectionHeading
          index={index}
          english={english}
          title={title}
          align="center"
        />

        {isToday ? (
          <p className="font-display text-[1.15rem] text-(--si-ink) italic sm:text-[1.35rem]">
            {todayMessage}
          </p>
        ) : (
          <>
            <p
              data-reveal="scale"
              className="si-display si-gold-text leading-none font-medium tabular-nums"
              style={{
                fontSize: "clamp(4rem, 22vw, 7rem)",
                letterSpacing: "0.01em",
              }}
            >
              D-{state ? state.current.days : "–"}
            </p>

            <div
              data-reveal="true"
              style={{ "--reveal-delay": "200ms" } as React.CSSProperties}
              className="mt-6 flex items-stretch justify-center gap-5 sm:gap-7"
            >
              {TIME_UNITS.map(({ key, label }, i) => (
                <div
                  key={key}
                  className="flex items-stretch gap-5 sm:gap-7"
                >
                  {i > 0 && (
                    <span
                      aria-hidden="true"
                      className="si-draw--v w-px self-stretch bg-(--si-line)"
                    />
                  )}
                  <div className="text-center">
                    {state ? (
                      <RollingDigit
                        current={state.current[key]}
                        previous={state.previous[key]}
                      />
                    ) : (
                      <span
                        className="si-roll si-display font-medium tabular-nums text-(--si-ink)"
                        style={{ fontSize: "clamp(1.9rem, 9vw, 2.7rem)" }}
                      >
                        --
                      </span>
                    )}
                    <p className="si-eyebrow mt-2.5 text-[0.56rem] text-(--si-accent) sm:text-[0.62rem]">
                      {label}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {state && (
              <p className="sr-only">
                Còn {state.current.days} ngày nữa là tới ngày cưới.
              </p>
            )}
          </>
        )}
      </div>
    </section>
  );
}

