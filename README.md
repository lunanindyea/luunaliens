# 🍜 luunaliens — Korean Food Landing Page + Google Sheets Database

Landing page modern + **database gratis** menggunakan Google Sheets & Apps Script.

## ✨ Fitur

### Frontend (tetap sama & lebih baik)
- Responsive desktop, tablet, mobile
- Hero slider 5 makanan Korea
- Menu dinamis dari Google Sheets
- Filter kategori + search
- Shopping cart + quantity (localStorage)
- Checkout ke WhatsApp **+ simpan order ke Sheets**
- Floating WhatsApp button
- Bahasa Indonesia / English
- Promo, About, Cara Order, FAQ
- Stok real-time (produk sold out otomatis nonaktif)

### Backend (baru – gratis)
- Produk, harga, stok, tag dikelola di Google Sheets
- Setiap checkout otomatis tercatat di sheet **Orders**
- Stok berkurang otomatis saat order masuk
- Nomor WA & template pesan bisa diubah dari sheet **Settings**
- Tidak perlu server bayar, tidak perlu Firebase, tidak perlu Vercel function

## 🚀 Cara Deploy

**Baca file `SETUP.md`** — di dalamnya ada panduan lengkap step-by-step:

1. Buat Google Spreadsheet (Products + Orders + Settings)
2. Paste kode Apps Script & deploy Web App
3. Ganti `API_URL` di `script.js`
4. Push ke GitHub Pages

## 📁 Struktur

```
├── index.html
├── script.js          ← ganti API_URL di sini
├── style.css
├── favicon.svg
├── CNAME
├── hotlink/
├── apps-script/
│   └── Code.gs        ← paste ke Google Apps Script
├── sample-products.csv
├── SETUP.md           ← PANDUAN LENGKAP
└── README.md
```

## 🛠️ Update Menu Sehari-hari

Cukup buka Google Spreadsheet → sheet **Products**:
- Tambah baris baru = menu baru muncul di website
- Ubah harga / stok / tag = langsung terupdate
- Set `active = FALSE` = menu hilang dari website

Tidak perlu edit kode atau push GitHub lagi.

## 📌 Catatan

- Website tetap pure static (GitHub Pages).
- Semua data produk & order ada di Google Sheets milikmu.
- Mode offline / fallback: kalau API belum di-set, website tetap jalan dengan 6 menu default.

---

Made with 🍜 + ❤️ for **luunaliens**
