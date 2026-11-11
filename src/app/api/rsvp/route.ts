import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const guestName = String(body.guestName ?? "").trim();
    const attending = body.attending === "no" ? "no" : "yes";
    const guestCount = Math.max(1, Math.min(20, Number(body.guestCount) || 1));
    const message = String(body.message ?? "").trim();

    if (!guestName) {
      return NextResponse.json(
        {
          status: "error",
          message: "Vui lòng nhập tên của bạn.",
          fieldErrors: { guestName: "Vui lòng nhập tên của bạn." },
        },
        { status: 400 }
      );
    }

    const scriptUrl = process.env.GOOGLE_SCRIPT_URL;
    if (scriptUrl) {
      try {
        await fetch(scriptUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "rsvp",
            guestName: guestName.slice(0, 80),
            attending,
            guestCount,
            message: message.slice(0, 1000),
          }),
        });
      } catch (err) {
        console.error("Failed to forward RSVP to Google Sheets:", err);
      }
    }

    return NextResponse.json({
      status: "success",
      message:
        attending === "yes"
          ? `Cảm ơn ${guestName}! Gia đình rất hân hạnh được đón tiếp bạn.`
          : `Cảm ơn ${guestName} đã gửi phản hồi cho gia đình.`,
    });
  } catch {
    return NextResponse.json(
      { status: "error", message: "Có lỗi xảy ra, vui lòng thử lại." },
      { status: 500 }
    );
  }
}

