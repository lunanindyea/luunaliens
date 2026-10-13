# 🍜 luunaliens — Setup Google Sheets + Apps Script

Ikuti langkah-langkah di bawah ini **sekali saja**. Setelah itu, kamu bisa update menu & lihat order cukup dari Google Spreadsheet.

---

## 1. Buat Google Spreadsheet

1. Buka [https://sheets.google.com](https://sheets.google.com) → **Blank spreadsheet**.
2. Rename spreadsheet-nya menjadi: **luunaliens Database**.

### Sheet 1: `Products`

Hapus Sheet1 default, buat sheet baru bernama **Products**.  
Isi baris pertama (header) **persis** seperti ini:

| A (id) | B (name) | C (price) | D (category) | E (description) | F (image) | G (tag) | H (stock) | I (active) | J (sort_order) |
|--------|----------|-----------|--------------|-----------------|-----------|---------|-----------|------------|----------------|

Lalu isi data produk (contoh sudah disediakan di file `sample-products.csv`):

| id | name | price | category | description | image | tag | stock | active | sort_order |
|----|------|-------|----------|-------------|-------|-----|-------|--------|------------|
| 1 | Spicy Rabboki | 28000 | noodles | Ramyeon + tteokbokki, spicy & chewy. | https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?auto=format&fit=crop&w=800&q=80 | BEST SELLER | 50 | TRUE | 1 |
| 2 | Original Kimbap | 24000 | rice | Rice roll, nori, veggies & savory filling. | https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?auto=format&fit=crop&w=800&q=80 | FRESH PICK | 40 | TRUE | 2 |
| 3 | Tteokbokki Seoul | 26000 | snack | Soft rice cakes in sweet-spicy gochujang sauce. | https://images.unsplash.com/photo-1635363638580-c2809d049eee?auto=format&fit=crop&w=800&q=80 | HOT | 35 | TRUE | 3 |
| 4 | Korean Fried Chicken | 32000 | chicken | Crunchy chicken glazed with Korean sauce. | https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=800&q=80 | CRISPY | 30 | TRUE | 4 |
| 5 | Mandu Gyoza | 22000 | snack | Crispy dumplings with a juicy savory filling. | https://images.unsplash.com/photo-1496116218417-1a781b1c416c?auto=format&fit=crop&w=800&q=80 | FAVORITE | 45 | TRUE | 5 |
| 6 | Cheesy Ramyeon | 27000 | noodles | Slurpy noodles with a creamy cheese finish. | https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80 | CHEESY | 40 | TRUE | 6 |

**Catatan kategori yang didukung:** `noodles`, `rice`, `snack`, `chicken`  
**active** = `TRUE` / `FALSE` (produk yang FALSE tidak tampil di website)

---

### Sheet 2: `Orders`

Buat sheet baru bernama **Orders**.  
Header (baris 1):

| A (timestamp) | B (order_id) | C (items) | D (total) | E (message) | F (status) |
|---------------|--------------|-----------|-----------|-------------|------------|

Tidak perlu isi data. Apps Script akan otomatis menambahkan baris baru setiap ada checkout.

Status yang bisa kamu ubah manual: `pending` → `confirmed` → `done` / `cancelled`

---

### Sheet 3: `Settings`

Buat sheet baru bernama **Settings**.  
Isi seperti ini:

| A (key) | B (value) |
|---------|-----------|
| wa_number | 6285814568534 |
| wa_template | Halo kak aku mau pesan rabboki .... 5 pack ya |

Kamu bisa tambah setting lain nanti (misal teks promo).

---

## 2. Pasang Apps Script

1. Di spreadsheet yang sama → menu **Extensions → Apps Script**.
2. Hapus semua kode yang ada di `Code.gs`.
3. Buka file `apps-script/Code.gs` dari zip ini, **copy semua isinya**, paste ke editor Apps Script.
4. Klik **Save** (ikon disket) → beri nama project: `luunaliens-api`.

### Deploy sebagai Web App

1. Klik **Deploy → New deployment**.
2. Di samping "Select type" klik gear → pilih **Web app**.
3. Isi:
   - **Description**: `luunaliens v1`
   - **Execute as**: `Me`
   - **Who has access**: `Anyone`
4. Klik **Deploy**.
5. Google akan minta otorisasi:
   - Klik **Authorize access**
   - Pilih akun Google kamu
   - Advanced → Go to luunaliens-api (unsafe) → Allow
6. Setelah sukses, **copy URL** yang muncul (bentuknya seperti):
   ```
   https://script.google.com/macros/s/AKfycbxxxxxxxxxxxxxxxx/exec
   ```

---

## 3. Hubungkan ke Website

1. Buka file `script.js` di folder website.
2. Cari baris ini:
   ```js
   const API_URL = "https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec";
   ```
3. Ganti dengan URL yang kamu copy tadi.
4. Simpan.

---

## 4. Deploy ke GitHub Pages

1. Buat repository baru di GitHub (misal `luunaliens`).
2. Upload **semua file** di folder ini (kecuali folder `apps-script` boleh ikut atau tidak, terserah).
3. Settings → Pages → Source: Deploy from a branch → `main` / `root`.
4. Tunggu 1–2 menit, website sudah live.

Kalau sudah punya domain custom (ada file `CNAME`), biarkan saja.

---

## 5. Cara Pakai Sehari-hari

| Mau apa | Lakukan di |
|---------|------------|
| Tambah / ubah menu | Sheet **Products** |
| Ubah harga | Sheet **Products** → kolom price |
| Sembunyikan produk | Sheet **Products** → kolom active = FALSE |
| Lihat pesanan masuk | Sheet **Orders** |
| Ubah status pesanan | Sheet **Orders** → kolom status |
| Ganti nomor WA | Sheet **Settings** → wa_number |

**Tidak perlu** edit kode website lagi untuk update menu!

---

## Troubleshooting

| Masalah | Solusi |
|---------|--------|
| Website tetap tampil "Mode offline" | Pastikan API_URL sudah diganti & benar |
| Order tidak masuk ke Sheets | Pastikan deployment "Who has access = Anyone" |
| Produk tidak muncul | Cek kolom `active` = TRUE dan header sheet benar |
| Error CORS | Normal di browser console saat POST (mode no-cors). Order tetap tersimpan. |
| Mau update kode Apps Script | Deploy → Manage deployments → Edit (pensil) → Version: New version → Deploy |

---

## Struktur File Website

```
luunaliens-gsheets/
├── index.html          ← halaman utama
├── script.js           ← logic + koneksi ke Sheets (GANTI API_URL di sini)
├── style.css
├── favicon.svg
├── CNAME               ← domain custom (opsional)
├── hotlink/            ← gambar lokal
├── apps-script/
│   └── Code.gs         ← kode backend (paste ke Apps Script)
├── sample-products.csv ← data contoh untuk di-import ke Sheets
├── SETUP.md            ← file ini
└── README.md
```

Selamat! Sekarang website kamu punya database gratis & bisa update menu tanpa coding. 🎉
