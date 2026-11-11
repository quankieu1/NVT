"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { WEDDING_CONFIG } from "../../data/wedding-config";
import { copyText } from "../../lib/wedding-utils";

export default function GuestLinkGeneratorPage() {
  const [baseUrl, setBaseUrl] = useState("https://ten-mien-cua-ban.vn");
  const [rawList, setRawList] = useState(
    "Anh Tuấn & Gia đình\nChị Thanh Mai\nBạn Lê Tất Thắng\nVợ chồng Anh Nam"
  );
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setBaseUrl(window.location.origin);
    }
  }, []);

  const guests = rawList
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const buildUrl = (name: string) => {
    const cleanBase = baseUrl.replace(/\/+$/, "");
    return `${cleanBase}/?guest=${encodeURIComponent(name)}`;
  };

  async function handleCopySingle(name: string, idx: number) {
    const ok = await copyText(buildUrl(name));
    if (ok) {
      setCopiedIndex(idx);
      setTimeout(() => setCopiedIndex(null), 1600);
    }
  }

  async function handleCopyAll() {
    const text = guests
      .map((name) => `${name}: ${buildUrl(name)}`)
      .join("\n");
    const ok = await copyText(text);
    if (ok) {
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 1800);
    }
  }

  return (
    <main className="min-h-screen bg-[#fbf8f2] px-4 py-12 text-[#4a4039] sm:px-6">
      <div className="mx-auto max-w-2xl rounded-2xl border border-[#b49a7e]/40 bg-white p-6 shadow-xl sm:p-9">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#b49a7e]/30 pb-5">
          <div>
            <p className="font-display text-xs font-semibold tracking-[0.25em] text-[#9c8463] uppercase">
              WEDDING INVITATION TOOL
            </p>
            <h1 className="font-display mt-1 text-2xl font-semibold sm:text-3xl">
              Tạo Link Thiệp Mời Cá Nhân Hóa
            </h1>
            <p className="mt-1 text-sm text-[#4a4039]/75">
              {WEDDING_CONFIG.couple.groom.shortName} &amp;{" "}
              {WEDDING_CONFIG.couple.bride.shortName}
            </p>
          </div>
          <Link
            href="/"
            className="rounded-full border border-[#b49a7e] px-4 py-2 text-xs font-semibold tracking-wider text-[#4a4039] uppercase transition hover:bg-[#4a4039] hover:text-white"
          >
            ← Xem Thiệp Chính
          </Link>
        </div>

        <div className="mt-6 space-y-5">
          <div>
            <label
              htmlFor="base-url"
              className="block text-xs font-semibold tracking-wider text-[#9c8463] uppercase"
            >
              Tên miền website thiệp cưới
            </label>
            <input
              id="base-url"
              type="text"
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              className="mt-2 w-full rounded-lg border border-[#b49a7e]/50 bg-[#fbf8f2] px-3.5 py-2.5 text-sm outline-none focus:border-[#4a4039]"
            />
          </div>

          <div>
            <label
              htmlFor="guest-list"
              className="block text-xs font-semibold tracking-wider text-[#9c8463] uppercase"
            >
              Danh sách tên khách mời (Mỗi dòng 1 khách mời)
            </label>
            <textarea
              id="guest-list"
              rows={6}
              value={rawList}
              onChange={(e) => setRawList(e.target.value)}
              placeholder="Nhập tên khách mời, mỗi người 1 dòng..."
              className="mt-2 w-full rounded-lg border border-[#b49a7e]/50 bg-[#fbf8f2] px-3.5 py-2.5 text-sm outline-none focus:border-[#4a4039]"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <h2 className="font-display text-lg font-semibold">
              Danh sách Link ({guests.length} khách)
            </h2>
            {guests.length > 0 && (
              <button
                type="button"
                onClick={handleCopyAll}
                className="cursor-pointer rounded-full bg-[#4a4039] px-4 py-2 text-xs font-semibold tracking-wider text-white uppercase transition hover:opacity-90"
              >
                {copiedAll ? "Đã sao chép tất cả!" : "Sao chép tất cả"}
              </button>
            )}
          </div>

          <ul className="divide-y divide-[#b49a7e]/25 rounded-xl border border-[#b49a7e]/35 bg-[#fbf8f2]">
            {guests.map((guest, idx) => {
              const url = buildUrl(guest);
              return (
                <li
                  key={`${guest}-${idx}`}
                  className="flex flex-col justify-between gap-2.5 p-3.5 sm:flex-row sm:items-center"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-[#4a4039]">{guest}</p>
                    <p className="truncate font-mono text-xs text-[#9c8463]">
                      {url}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <a
                      href={`/?guest=${encodeURIComponent(guest)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full border border-[#b49a7e] px-3.5 py-1.5 text-xs font-medium text-[#4a4039] transition hover:bg-white"
                    >
                      Xem thử
                    </a>
                    <button
                      type="button"
                      onClick={() => handleCopySingle(guest, idx)}
                      className="cursor-pointer rounded-full bg-[#4a4039] px-3.5 py-1.5 text-xs font-medium text-white transition hover:opacity-90"
                    >
                      {copiedIndex === idx ? "Đã copy!" : "Copy link"}
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </main>
  );
}

