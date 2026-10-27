# 🍜 Panduan SEO Lengkap — luunaliens.my.id

File-file SEO sudah ditambahkan ke repo ini. Ikuti langkah di bawah **setelah kamu deploy ulang**.

---

## ✅ Apa yang sudah ditambahkan di ZIP ini

| File | Fungsi |
|------|--------|
| `robots.txt` | Memberi tahu Google bot apa yang boleh di-crawl + lokasi sitemap |
| `sitemap.xml` | Daftar URL penting agar Google lebih cepat index |
| `site.webmanifest` | Support PWA + icon di mobile |
| `favicon.svg` + PNG variants | Favicon multi-size (16, 32, 180, 192, 512) |
| `apple-touch-icon.png` | Icon saat disimpan di home screen iPhone |
| `og-image.jpg` | Gambar preview saat link dishare (sudah ada, 1200×630) |
| `index.html` (diperbarui) | Meta lengkap, Open Graph, Twitter Card, JSON-LD Schema, canonical, robots |

---

## 🚀 Langkah 1 — Deploy ulang

1. Download ZIP revisi ini.
2. Extract, lalu **replace** semua file di repo GitHub kamu (atau push via git).
3. Pastikan GitHub Pages aktif (Settings → Pages → Source: main branch / root).
4. Tunggu 1–5 menit, lalu cek:
   - https://luunaliens.my.id/robots.txt
   - https://luunaliens.my.id/sitemap.xml
   - https://luunaliens.my.id/og-image.jpg
   - https://luunaliens.my.id/favicon.svg

---

## 🔍 Langkah 2 — Google Search Console (WAJIB)

1. Buka: **https://search.google.com/search-console**
2. Klik **Add property** → pilih **URL prefix** → masukkan `https://luunaliens.my.id/`
3. Verifikasi domain (pilih metode **HTML tag** atau **DNS**):
   - Cara termudah: **HTML tag** → copy meta tag yang diberikan Google.
   - Tempelkan di `<head>` `index.html` (sebelum `</head>`), commit & push lagi.
4. Setelah verified:
   - Masuk ke **Sitemaps** → submit `https://luunaliens.my.id/sitemap.xml`
   - Masuk ke **URL Inspection** → test `https://luunaliens.my.id/` → **Request Indexing**

---

## 📊 Langkah 3 — Google Analytics 4 (Opsional tapi sangat disarankan)

1. Buka: **https://analytics.google.com/**
2. Buat akun + property baru (Web).
3. Dapatkan Measurement ID (`G-XXXXXXXX`).
4. Tambahkan di `index.html` sebelum `</head>`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXX');
</script>
```

---

## 🖼️ Langkah 4 — Test Open Graph & Preview

Setelah deploy, test preview share link di:

| Platform | Tool |
|----------|------|
| Facebook / WhatsApp | https://developers.facebook.com/tools/debug/ |
| Twitter / X | https://cards-dev.twitter.com/validator |
| LinkedIn | https://www.linkedin.com/post-inspector/ |
| Umum | https://www.opengraph.xyz/ |

Masukkan `https://luunaliens.my.id/` lalu klik **Scrape Again / Fetch new information**.

---

## 📱 Langkah 5 — Google Business Profile (jika punya lokasi fisik / delivery area)

1. Buka: **https://business.google.com/**
2. Buat / klaim bisnis "luunaliens".
3. Isi kategori: **Korean restaurant** / **Food delivery service**.
4. Tambahkan website: `https://luunaliens.my.id/`
5. Upload foto menu & makanan.

Ini sangat membantu ranking lokal ("korean food dekat saya").

---

## 🔑 Langkah 6 — Keyword & Konten (jangka panjang)

Kata kunci utama yang sudah dipakai:
- korean food
- makanan korea
- ramyeon / kimbap / tteokbokki
- order whatsapp
- delivery makanan korea

Saran tambahan:
- Buat post Instagram / TikTok rutin dengan hashtag + link bio ke website.
- Nanti kalau mau, bisa tambah halaman `/menu` atau blog sederhana.

---

## 🛠️ Checklist Cepat Setelah Deploy

- [ ] robots.txt bisa diakses
- [ ] sitemap.xml bisa diakses
- [ ] Google Search Console verified + sitemap submitted
- [ ] Request indexing homepage
- [ ] Test OG image di Facebook Debugger
- [ ] Favicon muncul di tab browser
- [ ] (Opsional) Google Analytics terpasang
- [ ] (Opsional) Google Business Profile

---

## 📌 Catatan Penting

1. **JSON-LD** sudah berisi schema `FoodEstablishment`. Kalau kamu punya nomor WhatsApp resmi atau alamat, edit di `index.html` bagian `telephone` dan `address`.
2. Link Instagram & TikTok di footer masih `#`. Ganti dengan URL aslimu.
3. Update `lastmod` di `sitemap.xml` setiap kali ada perubahan besar (atau biarkan, Google tetap crawl).
4. Jangan hapus `og-image.jpg` — ukurannya sudah ideal (1200×630).

---

Made with 🍜 for **luunaliens**
)
