# Pustaka Tautan — versi password + gateway

Website statis (React + Vite) untuk membagikan link yang dilindungi
password dan dibuka lewat website perantara ("gateway") terlebih
dahulu. Tanpa backend, tanpa database, tanpa login.

## Menjalankan

```bash
npm install
npm run dev
```

Buka `http://localhost:5173`.

## Menambah card baru

Edit **satu file saja**: `src/data/links.js`. Tambahkan object baru ke
array `links` — lihat komentar di dalam file itu untuk penjelasan tiap
properti (termasuk kapan pakai `selfHosted: true` vs `false`).

## Alur (flow)

1. User klik **"Buka Link"** di sebuah card → modal password muncul.
2. User isi password. Salah → pesan error, tidak ada website yang
   dibuka. Benar → modal password tertutup, lanjut ke gateway.
3. Yang terjadi selanjutnya tergantung `selfHosted`:
   - **`selfHosted: true`** (gateway milik kamu sendiri): aplikasi
     redirect di tab yang sama ke `gatewayUrl` dengan menambahkan
     `?redirect=...&token=...&return=...`. Setelah proses di gateway
     selesai, gateway redirect balik ke `return`, aplikasi membaca
     token dari sessionStorage, lalu **otomatis** membuka `url`
     tujuan akhir. Contoh implementasi gateway-nya ada di
     `gateway-example/index.html`.
   - **`selfHosted: false`** (gateway pihak ketiga): `gatewayUrl`
     dibuka di **tab baru**, aplikasi tetap terbuka di tab asal dan
     menampilkan tombol **"Lanjutkan ke Link Tujuan"** yang harus
     diklik manual setelah user selesai di tab gateway.

## Tiga hal yang perlu dibedakan (sesuai pertanyaan kamu)

1. **Membuka website gateway terlebih dahulu** — ini selalu terjadi
   segera setelah password benar, baik `selfHosted` maupun tidak.
   Bedanya cuma di tab sama vs tab baru.
2. **Menunggu user menyelesaikan proses di gateway** — untuk gateway
   pihak ketiga, aplikasi ini benar-benar tidak tahu apa yang terjadi
   di tab itu. Tidak ada polling, tidak ada deteksi otomatis. Yang
   ditunggu murni tindakan manual: user klik "Lanjutkan" sendiri.
3. **Redirect otomatis ke URL tujuan** — ini HANYA bisa terjadi untuk
   gateway `selfHosted: true`, karena mekanismenya bergantung pada
   gateway itu sendiri yang secara sengaja diprogram untuk redirect
   balik ke aplikasi ini membawa token. Untuk gateway pihak ketiga
   yang tidak bisa kamu ubah, redirect otomatis **tidak mungkin**
   dibuat — itu bukan keterbatasan implementasi, tapi keterbatasan
   fundamental: React tidak punya cara mengetahui aktivitas di tab
   lain yang bukan miliknya, kecuali tab itu sendiri yang "melapor
   balik" lewat navigasi/redirect.

## Batasan penting

- **Password bukan keamanan sungguhan.** Semua password ada di dalam
  bundle JavaScript yang dikirim ke browser — siapa pun bisa
  membacanya lewat DevTools. Cocok untuk gate ringan (mis. anti-klik-
  asal), bukan untuk melindungi data yang benar-benar rahasia.
- **Token callback juga bukan kriptografis.** Token hanya tersimpan
  di `sessionStorage` browser user sendiri untuk keperluan UX (supaya
  app tahu "user ini baru kembali dari gateway"), bukan bukti yang
  bisa diverifikasi pihak lain.
- **Tidak ada iframe.** Gateway pihak ketiga sering memblokir iframe
  lewat `X-Frame-Options`/CSP, jadi gateway selalu dibuka sebagai
  navigasi tab, bukan disematkan di dalam halaman.

## Struktur

```
src/
├── components/
│   ├── Header.jsx
│   ├── LinkGrid.jsx
│   ├── LinkCard.jsx
│   ├── PasswordModal.jsx
│   └── GatewayModal.jsx
├── utils/
│   └── gateway.js       ← token, sessionStorage, penyusunan URL
├── data/
│   └── links.js          ← edit di sini untuk menambah card
├── App.jsx                ← state machine utama (password → gateway)
├── main.jsx
└── index.css
gateway-example/
└── index.html             ← contoh gateway self-hosted (deploy terpisah)
```
# link
