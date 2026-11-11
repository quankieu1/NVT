import type { CSSProperties } from "react";
import type { CropConfig } from "../data/wedding-config";

export const WEDDING_TIME_ZONE = "Asia/Ho_Chi_Minh";

const WEEKDAY_MAP: Record<number, string> = {
  0: "Chủ Nhật",
  1: "Thứ Hai",
  2: "Thứ Ba",
  3: "Thứ Tư",
  4: "Thứ Năm",
  5: "Thứ Sáu",
  6: "Thứ Bảy",
};

export function getVnDateParts(isoString: string) {
  const date = new Date(isoString);
  const formatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: WEDDING_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    weekday: "short",
    hour12: false,
  });

  const parts = formatter.formatToParts(date);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";

  const day = get("day");
  const month = get("month");
  const year = get("year");
  const hour = get("hour");
  const minute = get("minute");

  // Compute weekday in VN timezone
  const vnDateStr = `${year}-${month}-${day}T12:00:00+07:00`;
  const vnDayIndex = new Date(vnDateStr).getUTCDay();

  return {
    day,
    month,
    year,
    time: `${hour}:${minute}`,
    shortDateDots: `${day}. ${month}. ${year}`,
    shortDateSpacedDots: `${day} . ${month} . ${year}`,
    weekdayVi: WEEKDAY_MAP[vnDayIndex] ?? "Chủ Nhật",
  };
}

export function cropStyles(
  crop?: CropConfig,
  objectPosition: string = "center"
): { frame: CSSProperties; image: CSSProperties } {
  if (!crop || (crop.x === 0 && crop.y === 0 && crop.width === 1 && crop.height === 1)) {
    return {
      frame: { position: "absolute", inset: 0 },
      image: { objectFit: "cover", objectPosition },
    };
  }

  const wPct = (1 / crop.width) * 100;
  const hPct = (1 / crop.height) * 100;
  const leftPct = (-crop.x / crop.width) * 100;
  const topPct = (-crop.y / crop.height) * 100;

  return {
    frame: {
      position: "absolute",
      width: `${wPct}%`,
      height: `${hPct}%`,
      left: `${leftPct}%`,
      top: `${topPct}%`,
    },
    image: {
      objectFit: "cover",
      objectPosition,
    },
  };
}

export function findScrollParent(el: HTMLElement | null): HTMLElement | null {
  for (let cur = el?.parentElement ?? null; cur; cur = cur.parentElement) {
    const { overflowY } = getComputedStyle(cur);
    if (overflowY === "auto" || overflowY === "scroll") {
      return cur;
    }
  }
  return null;
}

export async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}

