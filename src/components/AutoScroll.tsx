"use client";

import { useEffect, useRef, useState } from "react";
import { findScrollParent } from "../lib/wedding-utils";

const STOP_KEYS = new Set([
  " ",
  "Spacebar",
  "PageUp",
  "PageDown",
  "ArrowUp",
  "ArrowDown",
  "Home",
  "End",
]);

export function AutoScroll() {
  const [showPill, setShowPill] = useState(false);
  const anchorRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    let pillTimer: ReturnType<typeof setTimeout>;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const scrollParent = findScrollParent(anchorRef.current);
    const getClientHeight = () =>
      scrollParent?.clientHeight ?? window.innerHeight;
    const getScrollHeight = () =>
      scrollParent?.scrollHeight ?? document.documentElement.scrollHeight;

    let rafId = 0;
    let lastTime: number | null = null;
    let carry = 0;
    let stopped = false;

    const stopEvents = ["wheel", "touchstart", "pointerdown", "keydown"];

    function stopAutoScroll() {
      if (stopped) return;
      stopped = true;
      cancelAnimationFrame(rafId);
      clearTimeout(pillTimer);
      setShowPill(false);
      for (const evt of stopEvents) {
        window.removeEventListener(evt, handleUserInput);
      }
      document.removeEventListener("visibilitychange", handleVisibility);
    }

    function handleUserInput(e: Event) {
      if (!(e instanceof KeyboardEvent) || STOP_KEYS.has(e.key)) {
        stopAutoScroll();
      }
    }

    function handleVisibility() {
      if (document.hidden) {
        cancelAnimationFrame(rafId);
        lastTime = null;
      } else if (!stopped) {
        rafId = requestAnimationFrame(step);
      }
    }

    function step(now: number) {
      if (stopped) return;
      if (lastTime === null) lastTime = now;
      const dt = (now - lastTime) / 1000;
      lastTime = now;
      carry += 78 * dt;
      const delta = Math.floor(carry);
      if (delta > 0) {
        carry -= delta;
        (scrollParent ?? window).scrollBy(0, delta);
      }
      const currentTop = scrollParent?.scrollTop ?? window.scrollY;
      if (currentTop + getClientHeight() >= getScrollHeight() - 2) {
        stopAutoScroll();
      } else {
        rafId = requestAnimationFrame(step);
      }
    }

    function onInvitationOpened() {
      const startWait = performance.now();
      rafId = requestAnimationFrame(function waitReady() {
        const elapsed = performance.now() - startWait;
        const scrollable = getScrollHeight() - getClientHeight();
        if (elapsed >= 0 && scrollable > 400) {
          setShowPill(true);
          pillTimer = setTimeout(() => setShowPill(false), 4000);
          for (const evt of stopEvents) {
            window.addEventListener(evt, handleUserInput, { passive: true });
          }
          document.addEventListener("visibilitychange", handleVisibility);
          rafId = requestAnimationFrame(step);
        } else if (elapsed < 6500) {
          rafId = requestAnimationFrame(waitReady);
        }
      });
    }

    window.addEventListener("thiep-opened", onInvitationOpened, { once: true });
    return () => {
      window.removeEventListener("thiep-opened", onInvitationOpened);
      stopAutoScroll();
    };
  }, []);

  return (
    <>
      <span ref={anchorRef} aria-hidden="true" className="hidden" />
      {showPill && (
        <p
          role="status"
          aria-live="polite"
          className="pointer-events-none fixed bottom-[calc(env(safe-area-inset-bottom,0px)+18px)] left-1/2 z-[2000] max-w-[90vw] -translate-x-1/2 rounded-full bg-black/70 px-4 py-2 text-[13px] font-medium whitespace-nowrap text-white shadow-lg backdrop-blur-sm"
        >
          Đang tự cuộn · chạm để dừng
        </p>
      )}
    </>
  );
}

