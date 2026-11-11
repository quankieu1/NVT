"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { PhotoItem } from "../data/wedding-config";

export function PhotoLightbox({
  photos,
  startIndex,
  onClose,
}: {
  photos: PhotoItem[];
  startIndex: number;
  onClose: () => void;
}) {
  const [index, setIndex] = useState(startIndex);
  const touchStartX = useRef<number | null>(null);

  const prev = useCallback(() => {
    setIndex((i) => (i - 1 + photos.length) % photos.length);
  }, [photos.length]);

  const next = useCallback(() => {
    setIndex((i) => (i + 1) % photos.length);
  }, [photos.length]);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
    }
    document.addEventListener("keydown", handleKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose, prev, next]);

  const current = photos[index];
  if (!current || typeof document === "undefined") return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Xem ảnh cưới phóng to"
      className="fixed inset-0 z-[1200] flex flex-col items-center justify-center bg-black/92 p-4 select-none"
      onTouchStart={(e) => {
        touchStartX.current = e.touches[0]?.clientX ?? null;
      }}
      onTouchEnd={(e) => {
        if (touchStartX.current === null) return;
        const dx = (e.changedTouches[0]?.clientX ?? 0) - touchStartX.current;
        if (Math.abs(dx) > 45) {
          if (dx > 0) prev();
          else next();
        }
        touchStartX.current = null;
      }}
    >
      <div
        aria-hidden="true"
        onClick={onClose}
        className="absolute inset-0"
      />

      {/* Top Bar */}
      <div className="relative z-10 flex w-full max-w-4xl items-center justify-between px-2 py-2 text-white">
        <span className="font-mono text-xs tracking-widest opacity-80">
          {String(index + 1).padStart(2, "0")} /{" "}
          {String(photos.length).padStart(2, "0")}
        </span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Đóng"
          className="flex size-10 cursor-pointer items-center justify-center rounded-full bg-white/15 text-xl text-white transition hover:bg-white/25"
        >
          ×
        </button>
      </div>

      {/* Main Photo */}
      <div className="relative z-10 my-auto flex max-h-[82vh] w-full max-w-3xl items-center justify-center">
        {photos.length > 1 && (
          <button
            type="button"
            onClick={prev}
            aria-label="Ảnh trước"
            className="absolute left-2 z-20 flex size-10 cursor-pointer items-center justify-center rounded-full bg-black/50 text-white transition hover:bg-black/75 sm:left-4 sm:size-11"
          >
            ‹
          </button>
        )}

        <div className="relative flex max-h-[80vh] w-full items-center justify-center overflow-hidden">
          <Image
            src={current.src}
            alt={current.alt || `Ảnh cưới ${index + 1}`}
            width={current.width || 1200}
            height={current.height || 1800}
            className="max-h-[80vh] w-auto rounded-md object-contain shadow-2xl"
            priority
          />
        </div>

        {photos.length > 1 && (
          <button
            type="button"
            onClick={next}
            aria-label="Ảnh tiếp theo"
            className="absolute right-2 z-20 flex size-10 cursor-pointer items-center justify-center rounded-full bg-black/50 text-white transition hover:bg-black/75 sm:right-4 sm:size-11"
          >
            ›
          </button>
        )}
      </div>
    </div>,
    document.body
  );
}

