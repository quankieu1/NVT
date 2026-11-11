import { NextRequest, NextResponse } from "next/server";
import { WEDDING_CONFIG, type GuestbookEntry } from "../../../data/wedding-config";

// Lưu trữ tạm thời trong bộ nhớ nếu chưa cấu hình GOOGLE_SCRIPT_URL
const localEntries: GuestbookEntry[] = [];

export async function GET() {
  const scriptUrl = process.env.GOOGLE_SCRIPT_URL;

  if (scriptUrl) {
    try {
      const res = await fetch(`${scriptUrl}?type=guestbook`, {
        method: "GET",
        cache: "no-store",
      });
      if (res.ok) {
        const json = await res.json();
        if (Array.isArray(json.entries)) {
          return NextResponse.json({
            status: "success",
            entries: [...json.entries, ...WEDDING_CONFIG.initialGuestbookEntries],
          });
        }
      }
    } catch (error) {
      console.error("Failed to fetch guestbook from Google Sheets:", error);
    }
  }

  return NextResponse.json({
    status: "success",
    entries: [...localEntries, ...WEDDING_CONFIG.initialGuestbookEntries],
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const authorName = String(body.authorName ?? "").trim();
    const message = String(body.message ?? "").trim();

    if (!authorName) {
      return NextResponse.json(
        {
          status: "error",
          message: "Vui lòng nhập tên của bạn.",
          fieldErrors: { authorName: "Vui lòng nhập tên của bạn." },
        },
        { status: 400 }
      );
    }

    if (!message) {
      return NextResponse.json(
        {
          status: "error",
          message: "Vui lòng nhập lời chúc.",
          fieldErrors: { message: "Vui lòng nhập lời chúc." },
        },
        { status: 400 }
      );
    }

    const newEntry: GuestbookEntry = {
      id: `wish-${Date.now()}`,
      authorName: authorName.slice(0, 80),
      message: message.slice(0, 1000),
      createdAt: new Date().toISOString(),
    };

    localEntries.unshift(newEntry);

    const scriptUrl = process.env.GOOGLE_SCRIPT_URL;
    if (scriptUrl) {
      try {
        await fetch(scriptUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "guestbook",
            authorName: newEntry.authorName,
            message: newEntry.message,
          }),
        });
      } catch (err) {
        console.error("Failed to forward guestbook wish to Google Sheets:", err);
      }
    }

    return NextResponse.json({
      status: "success",
      message: "Lời chúc của bạn đã được lưu vào Sổ Lưu Bút.",
      entry: newEntry,
    });
  } catch {
    return NextResponse.json(
      { status: "error", message: "Có lỗi xảy ra, vui lòng thử lại." },
      { status: 500 }
    );
  }
}

