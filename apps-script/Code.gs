/**
 * ═══════════════════════════════════════════════════════════════
 *  luunaliens — Google Apps Script Backend
 * ═══════════════════════════════════════════════════════════════
 *
 * CARA PAKAI:
 * 1. Buka Google Spreadsheet yang sudah disiapkan (lihat SETUP.md)
 * 2. Extensions → Apps Script
 * 3. Hapus kode default, paste seluruh isi file ini
 * 4. Simpan (Ctrl+S)
 * 5. Deploy → New deployment → Type: Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 6. Copy URL yang muncul, paste ke script.js (const API_URL)
 *
 * Sheet yang dibutuhkan:
 *   - Products
 *   - Orders
 *   - Settings
 */

// Nama sheet (harus sama persis)
const SHEET_PRODUCTS = "Products";
const SHEET_ORDERS   = "Orders";
const SHEET_SETTINGS = "Settings";

/**
 * Handle GET request → ambil produk + settings
 * Contoh: ?action=getProducts
 */
function doGet(e) {
  const action = (e.parameter.action || "getProducts").toLowerCase();

  try {
    if (action === "getproducts") {
      return jsonResponse({
        ok: true,
        products: getProducts(),
        settings: getSettings()
      });
    }

    // Health check
    if (action === "ping") {
      return jsonResponse({ ok: true, message: "luunaliens API is alive" });
    }

    return jsonResponse({ ok: false, error: "Unknown action" });
  } catch (err) {
    return jsonResponse({ ok: false, error: err.message });
  }
}

/**
 * Handle POST request → simpan order
 * Body JSON: { action: "createOrder", items: [...], total: number, message: "..." }
 */
function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    const action = (body.action || "").toLowerCase();

    if (action === "createorder") {
      const orderId = createOrder(body);
      return jsonResponse({ ok: true, orderId: orderId });
    }

    return jsonResponse({ ok: false, error: "Unknown action" });
  } catch (err) {
    return jsonResponse({ ok: false, error: err.message });
  }
}

// ─── Products ─────────────────────────────────────────────────
function getProducts() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_PRODUCTS);
  if (!sheet) throw new Error("Sheet 'Products' tidak ditemukan");

  const data = sheet.getDataRange().getValues();
  if (data.length < 2) return [];

  const headers = data[0].map(h => String(h).trim().toLowerCase());
  const products = [];

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (!row[0] && !row[1]) continue; // skip baris kosong

    const obj = {};
    headers.forEach((h, idx) => {
      obj[h] = row[idx];
    });

    // Normalisasi tipe data
    products.push({
      id: String(obj.id || i),
      name: String(obj.name || ""),
      price: Number(obj.price) || 0,
      category: String(obj.category || "all").toLowerCase(),
      description: String(obj.description || ""),
      image: String(obj.image || ""),
      tag: String(obj.tag || ""),
      stock: Number(obj.stock) || 0,
      active: toBool(obj.active),
      sort_order: Number(obj.sort_order) || i
    });
  }

  // Sort by sort_order
  products.sort((a, b) => a.sort_order - b.sort_order);
  return products;
}

// ─── Settings ─────────────────────────────────────────────────
function getSettings() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_SETTINGS);
  if (!sheet) return {};

  const data = sheet.getDataRange().getValues();
  const settings = {};

  for (let i = 1; i < data.length; i++) {
    const key = String(data[i][0] || "").trim();
    const value = data[i][1];
    if (key) settings[key] = value;
  }
  return settings;
}

// ─── Orders ───────────────────────────────────────────────────
function createOrder(body) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_ORDERS);
  if (!sheet) throw new Error("Sheet 'Orders' tidak ditemukan");

  const orderId = "ORD-" + Utilities.formatDate(new Date(), "Asia/Jakarta", "yyyyMMdd-HHmmss") + "-" + Math.floor(Math.random() * 900 + 100);
  const timestamp = Utilities.formatDate(new Date(), "Asia/Jakarta", "yyyy-MM-dd HH:mm:ss");

  const itemsStr = (body.items || [])
    .map(i => `${i.name} x${i.qty} @${i.price}`)
    .join(" | ");

  // Kolom: timestamp | order_id | items | total | message | status
  sheet.appendRow([
    timestamp,
    orderId,
    itemsStr,
    Number(body.total) || 0,
    body.message || "",
    "pending"
  ]);

  // Kurangi stok (opsional)
  try {
    decreaseStock(body.items || []);
  } catch (e) {
    // jangan gagalkan order kalau stok gagal diupdate
    console.error("Gagal update stok:", e);
  }

  return orderId;
}

function decreaseStock(items) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_PRODUCTS);
  if (!sheet) return;

  const data = sheet.getDataRange().getValues();
  const headers = data[0].map(h => String(h).trim().toLowerCase());
  const idCol = headers.indexOf("id");
  const nameCol = headers.indexOf("name");
  const stockCol = headers.indexOf("stock");

  if (stockCol === -1) return;

  items.forEach(item => {
    for (let i = 1; i < data.length; i++) {
      const matchId = idCol >= 0 && String(data[i][idCol]) === String(item.id);
      const matchName = nameCol >= 0 && String(data[i][nameCol]) === String(item.name);
      if (matchId || matchName) {
        const current = Number(data[i][stockCol]) || 0;
        const newStock = Math.max(0, current - Number(item.qty));
        sheet.getRange(i + 1, stockCol + 1).setValue(newStock);
        break;
      }
    }
  });
}

// ─── Helpers ──────────────────────────────────────────────────
function toBool(val) {
  if (typeof val === "boolean") return val;
  const s = String(val).trim().toLowerCase();
  return s === "true" || s === "1" || s === "yes" || s === "ya";
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
