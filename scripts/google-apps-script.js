/**
 * ============================================================================
 * GOOGLE APPS SCRIPT — LƯU SỔ LƯU BÚT (GUESTBOOK) & XÁC NHẬN THAM DỰ (RSVP)
 * ============================================================================
 *
 * HƯỚNG DẪN CÀI ĐẶT TRONG 2 PHÚT:
 * 1. Truy cập https://sheets.new để tạo 1 file Google Trang tính mới.
 *    Đặt tên file tùy ý (ví dụ: "Quản Lý Đám Cưới Văn Tuấn & Thảo Nguyên").
 * 2. Trên thanh menu, chọn: Tiện ích mở rộng (Extensions) -> Apps Script.
 * 3. Xóa đoạn code mặc định trong file Code.gs và DÁN TOÀN BỘ nội dung file này vào.
 * 4. Bấm biểu tượng Đĩa mềm (Lưu / Ctrl+S).
 * 5. Bấm nút "Triển khai" (Deploy) ở góc trên bên phải -> "Tùy chọn triển khai mới" (New deployment):
 *    - Bấm biểu tượng bánh răng chọn loại: "Ứng dụng web" (Web app)
 *    - Thực thi dưới dạng (Execute as): "Tôi" (Me)
 *    - Ai có quyền truy cập (Who has access): Chọn "Bất kỳ ai" (Anyone) <-- RẤT QUAN TRỌNG!
 * 6. Bấm "Triển khai" (Deploy), cấp quyền truy cập tài khoản Google của bạn.
 * 7. Copy đường dẫn "URL ứng dụng web" (có dạng https://script.google.com/macros/s/.../exec)
 *    và dán vào biến môi trường GOOGLE_SCRIPT_URL trên Vercel (hoặc file .env.local).
 * ============================================================================
 */

const SHEET_WISHES = "LoiChuc";
const SHEET_RSVP = "RSVP";

function ensureSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // 1. Tạo hoặc lấy bảng Lời Chúc
  let wishSheet = ss.getSheetByName(SHEET_WISHES);
  if (!wishSheet) {
    wishSheet = ss.insertSheet(SHEET_WISHES);
    wishSheet.appendRow(["ID", "Thời gian", "Tên khách mời", "Lời chúc"]);
    wishSheet.getRange("A1:D1").setFontWeight("bold").setBackground("#F1EADD");
    wishSheet.setColumnWidth(2, 160);
    wishSheet.setColumnWidth(3, 180);
    wishSheet.setColumnWidth(4, 420);
  }

  // 2. Tạo hoặc lấy bảng Xác Nhận Tham Dự (RSVP)
  let rsvpSheet = ss.getSheetByName(SHEET_RSVP);
  if (!rsvpSheet) {
    rsvpSheet = ss.insertSheet(SHEET_RSVP);
    rsvpSheet.appendRow([
      "ID",
      "Thời gian",
      "Tên khách mời",
      "Số điện thoại",
      "Tham dự",
      "Số người đi cùng",
      "Khách bên",
      "Lời nhắn"
    ]);
    rsvpSheet.getRange("A1:H1").setFontWeight("bold").setBackground("#F1EADD");
    rsvpSheet.setColumnWidth(2, 160);
    rsvpSheet.setColumnWidth(3, 180);
    rsvpSheet.setColumnWidth(4, 130);
    rsvpSheet.setColumnWidth(5, 130);
    rsvpSheet.setColumnWidth(6, 130);
    rsvpSheet.setColumnWidth(7, 130);
    rsvpSheet.setColumnWidth(8, 320);
  }

  return { wishSheet, rsvpSheet };
}

/**
 * Xử lý GET request: Lấy danh sách lời chúc từ tab "LoiChuc"
 */
function doGet(e) {
  try {
    const { wishSheet } = ensureSheets();
    const rows = wishSheet.getDataRange().getValues();
    const entries = [];

    // Bỏ qua dòng tiêu đề (index 0), đọc từ dưới lên để lời chúc mới nhất lên đầu
    for (let i = rows.length - 1; i >= 1; i--) {
      const row = rows[i];
      if (row[2] && row[3]) {
        entries.push({
          id: String(row[0] || "wish-" + i),
          createdAt: row[1] ? new Date(row[1]).toISOString() : new Date().toISOString(),
          authorName: String(row[2]),
          message: String(row[3])
        });
      }
    }

    return ContentService.createTextOutput(
      JSON.stringify({ status: "success", entries })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ status: "error", message: String(err) })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Xử lý POST request: Ghi Lời chúc mới hoặc Xác nhận tham dự (RSVP)
 */
function doPost(e) {
  try {
    const { wishSheet, rsvpSheet } = ensureSheets();
    const body = JSON.parse(e.postData.contents || "{}");
    const now = Utilities.formatDate(new Date(), "Asia/Ho_Chi_Minh", "dd/MM/yyyy HH:mm:ss");
    const id = Utilities.getUuid();

    if (body.type === "guestbook") {
      const authorName = String(body.authorName || "").trim();
      const message = String(body.message || "").trim();

      if (!authorName || !message) {
        return ContentService.createTextOutput(
          JSON.stringify({ status: "error", message: "Vui lòng nhập tên và lời chúc." })
        ).setMimeType(ContentService.MimeType.JSON);
      }

      wishSheet.appendRow([id, now, authorName, message]);

      return ContentService.createTextOutput(
        JSON.stringify({
          status: "success",
          entry: {
            id,
            authorName,
            message,
            createdAt: new Date().toISOString()
          }
        })
      ).setMimeType(ContentService.MimeType.JSON);
    }

    if (body.type === "rsvp") {
      const guestName = String(body.guestName || "").trim();
      const phone = String(body.phone || "").trim();
      const attending = body.attending === "no" ? "Không thể tham dự" : "Sẽ tham dự";
      const guestCount = Number(body.guestCount || 1);
      const guestSide = body.guestSide === "bride" ? "Nhà Gái" : "Nhà Trai";
      const message = String(body.message || "").trim();

      if (!guestName) {
        return ContentService.createTextOutput(
          JSON.stringify({ status: "error", message: "Vui lòng nhập tên của bạn." })
        ).setMimeType(ContentService.MimeType.JSON);
      }

      rsvpSheet.appendRow([
        id,
        now,
        guestName,
        phone,
        attending,
        guestCount,
        guestSide,
        message
      ]);

      // Nếu khách có để lại lời chúc trong form RSVP thì tự động thêm luôn vào Sổ Lưu Bút
      if (message) {
        wishSheet.appendRow([id + "-w", now, guestName, message]);
      }

      return ContentService.createTextOutput(
        JSON.stringify({
          status: "success",
          message: "Cảm ơn bạn đã xác nhận tham dự!"
        })
      ).setMimeType(ContentService.MimeType.JSON);
    }

    return ContentService.createTextOutput(
      JSON.stringify({ status: "error", message: "Loại yêu cầu không hợp lệ." })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ status: "error", message: String(err) })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

