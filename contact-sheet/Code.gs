// Saves every portfolio contact-form message as a row in this Google Sheet.
// Setup steps are in contact-sheet/README.md.

const SHEET_NAME = "Messages";

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);

    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["Date (IST)", "Name", "Email", "Message"]);
      sheet.setFrozenRows(1);
    }

    const data = JSON.parse(e.postData.contents);
    sheet.appendRow([
      Utilities.formatDate(new Date(), "Asia/Kolkata", "yyyy-MM-dd HH:mm:ss"),
      clean_(data.name, 200),
      clean_(data.email, 200),
      clean_(data.message, 5000),
    ]);

    return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(
      ContentService.MimeType.JSON,
    );
  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ ok: false, error: String(err) }),
    ).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

// Trim length and stop spreadsheet formula injection (cells starting with = + - @).
function clean_(value, max) {
  const text = String(value == null ? "" : value).slice(0, max);
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}
