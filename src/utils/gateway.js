// =====================================================================
// Helper untuk mekanisme "gateway" + callback token.
//
// PENTING soal batasan (baca ini sebelum pakai di production):
// - Ini BUKAN sistem keamanan yang kuat. Token hanya disimpan di
//   sessionStorage milik browser user sendiri, jadi tidak melewati
//   server mana pun dan tidak bisa diverifikasi ulang oleh siapa pun
//   selain browser itu sendiri. Tujuannya murni UX: supaya app tahu
//   "oh, user ini baru saja kembali dari gateway yang saya buka",
//   bukan untuk membuktikan sesuatu secara kriptografis.
// - Callback semacam ini HANYA bisa bekerja kalau `gatewayUrl` adalah
//   website yang kamu kontrol sendiri dan kamu program agar membaca
//   query string `redirect`, `token`, `return`, lalu melakukan
//   redirect balik ke `return` setelah prosesnya selesai. Lihat
//   folder `gateway-example/` untuk contoh implementasi gateway-nya.
// - Kalau gatewayUrl adalah situs pihak ketiga yang tidak bisa kamu
//   ubah, TIDAK ADA cara React mengetahui otomatis bahwa user sudah
//   selesai di sana. Satu-satunya jalan adalah tombol "Lanjutkan"
//   yang diklik manual oleh user. Jangan pernah berasumsi sebaliknya.
// =====================================================================

const STORAGE_PREFIX = "gw_pending_";
const TOKEN_TTL_MS = 15 * 60 * 1000; // token berlaku 15 menit

export function generateToken() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // fallback sederhana untuk lingkungan tanpa crypto.randomUUID
  return `tok_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

export function storePendingToken(token, { title, destinationUrl }) {
  const payload = {
    title,
    destinationUrl,
    expiresAt: Date.now() + TOKEN_TTL_MS,
  };
  try {
    sessionStorage.setItem(STORAGE_PREFIX + token, JSON.stringify(payload));
  } catch {
    // sessionStorage bisa gagal (mis. private mode ketat) — flow tetap
    // lanjut, hanya saja auto-continue di sisi kembali tidak akan jalan.
  }
}

export function getPendingToken(token) {
  try {
    const raw = sessionStorage.getItem(STORAGE_PREFIX + token);
    if (!raw) return null;
    const payload = JSON.parse(raw);
    if (Date.now() > payload.expiresAt) {
      sessionStorage.removeItem(STORAGE_PREFIX + token);
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

export function clearPendingToken(token) {
  try {
    sessionStorage.removeItem(STORAGE_PREFIX + token);
  } catch {
    // abaikan
  }
}

export function buildReturnUrl(token) {
  const base = `${window.location.origin}${window.location.pathname}`;
  return `${base}?gw_token=${encodeURIComponent(token)}`;
}

// Menyusun URL gateway lengkap dengan query string yang bisa dibaca
// oleh gateway milik sendiri: redirect (tujuan akhir), token, dan
// return (URL untuk kembali ke app ini).
export function buildGatewayUrl(link, token, returnUrl) {
  const params = new URLSearchParams({
    redirect: link.url,
    token,
    return: returnUrl,
  });
  const separator = link.gatewayUrl.includes("?") ? "&" : "?";
  return `${link.gatewayUrl}${separator}${params.toString()}`;
}

// Membersihkan query string (?gw_token=...) dari address bar tanpa
// reload halaman, supaya token tidak "menempel" kalau user refresh.
export function stripQueryParams() {
  const cleanUrl = `${window.location.origin}${window.location.pathname}`;
  window.history.replaceState({}, "", cleanUrl);
}
