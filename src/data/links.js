// =============================================================
// SUMBER DATA UTAMA — edit file ini untuk menambah/mengubah card
// =============================================================
//
// Setiap object di array `links` punya properti:
//
//   id          -> angka unik, wajib berbeda tiap card
//   title       -> nama card
//   description -> deskripsi singkat
//   gatewayUrl  -> website perantara yang dibuka lebih dulu
//   url         -> tujuan akhir (baru dibuka setelah proses gateway)
//   password    -> password khusus untuk membuka card ini
//   selfHosted  -> true / false (lihat penjelasan di bawah)
//
// -----------------------------------------------------------------
// PENTING soal `selfHosted` — ini menentukan flow yang dipakai:
//
// selfHosted: true
//   Dipakai kalau `gatewayUrl` adalah website MILIK KAMU SENDIRI,
//   yang sudah kamu program untuk membaca query string
//   ?redirect=...&token=...&return=... dan melakukan redirect balik
//   ke aplikasi ini setelah prosesnya selesai. Dengan ini, aplikasi
//   otomatis lanjut ke `url` begitu user kembali dari gateway.
//   Contoh implementasi gateway ada di folder gateway-example/.
//
// selfHosted: false (atau tidak ditulis sama sekali)
//   Dipakai kalau `gatewayUrl` adalah situs PIHAK KETIGA yang tidak
//   bisa kamu ubah (mis. shortlink, halaman iklan, dsb). Untuk kasus
//   ini React TIDAK BISA tahu kapan user selesai di sana — jadi user
//   akan diberi tombol manual "Lanjutkan ke Link Tujuan" untuk
//   melanjutkan sendiri setelah selesai.
// -----------------------------------------------------------------
//
// PERINGATAN KEAMANAN:
// Password di bawah ini dikirim ke browser apa adanya di dalam bundle
// JavaScript. Siapa pun yang membuka DevTools / "view source" bisa
// membacanya. Ini cocok untuk gate ringan (mis. supaya orang tidak
// asal klik), TAPI BUKAN pengamanan sungguhan. Jangan taruh
// password/URL rahasia yang benar-benar sensitif di sini.

export const links = [
  {
    id: 1,
    title: "Tugas Tugas",
    description: "Kumpulan Tugas Tugas",
    gatewayUrl: "https://docs.google.com/document/d/1DytftOiApJjsiHyylE1f4YspQQyupShza0Y66zNRwFc/edit?usp=sharing",
    url: "https://docs.google.com/document/d/1DytftOiApJjsiHyylE1f4YspQQyupShza0Y66zNRwFc/edit?usp=sharing",
    password: "090909",
    selfHosted: true,
  },
  // {
  //   id: 2,
  //   title: "resume aidil 23 agustus",
  //   description: "Resume aidil. password : 123456",
  //   gatewayUrl: "https://drive.google.com/drive/folders/1IoPw8MHzsAZOMLFo_3Z6cyiFXPA_HfZN?usp=sharing",
  //   url: "https://drive.google.com/drive/folders/1IoPw8MHzsAZOMLFo_3Z6cyiFXPA_HfZN?usp=sharing",
  //   password: "123456",
  //   selfHosted: true,
  // },
  {
    id: 2,
    title: "GitHub Source Code",
    description: "Repository kode sumber untuk proyek yang ada.",
    gatewayUrl: "https://github.com/rdyt7",
    url: "https://github.com/rdyt7",
    password: "git_raditya",
    selfHosted: true,
  },
    {
    id: 3,
    title: "Sharing Google Doc",
    description: "Sharing tulisan dan document.",
    gatewayUrl: "https://docs.google.com/document/d/1NFMogHgn1wT4dB-2cQCaj-lJjEdDErWRAeAfUXPKXl8/edit?usp=sharing",
    url: "https://docs.google.com/document/d/1NFMogHgn1wT4dB-2cQCaj-lJjEdDErWRAeAfUXPKXl8/edit?usp=sharing",
    password: "umum",
    selfHosted: true,
  },
    {
    id: 4,
    title: "Sharing Khusus",
    description: "Sharing tulisan dan document.",
    gatewayUrl: "https://docs.google.com/document/d/1OiNIWL7DV6Ysk8Dct51EQ_hOO4juwlZlcs9CQNCPk_E/edit?usp=sharing",
    url: "https://docs.google.com/document/d/1OiNIWL7DV6Ysk8Dct51EQ_hOO4juwlZlcs9CQNCPk_E/edit?usp=sharing",
    password: "enterpassword",
    selfHosted: true,
  },
];

// Contoh card baru:
// {
//   id: 4,
//   title: "Nama Link",
//   description: "Deskripsi singkat.",
//   gatewayUrl: "https://gateway-kamu-atau-pihak-ketiga.com",
//   url: "https://tujuan-akhir.com",
//   password: "passwordnya",
//   selfHosted: false, // ganti true kalau gatewayUrl kamu yang kontrol
// }
