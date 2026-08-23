export default function GatewayModal({
  gateway,
  onReopenGateway,
  onManualContinue,
  onClose,
}) {
  const { link, mode, status, popupBlocked } = gateway;
  const isSelfHosted = mode === "self-hosted";

  return (
    <div className="modal-backdrop" onMouseDown={status === "waiting" ? onClose : undefined}>
      <div
        className="modal gateway-modal"
        role="dialog"
        aria-modal="true"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {status === "waiting" && (
          <button className="modal__close" onClick={onClose} aria-label="Tutup">
            &times;
          </button>
        )}

        {/* ---- self-hosted: baru saja akan pindah ke gateway sendiri ---- */}
        {status === "opening" && (
          <div className="gateway-state">
            <span className="spinner spinner--lg" aria-hidden="true" />
            <h2 className="modal__title">Mengalihkan ke website perantara&hellip;</h2>
            <p className="modal__desc">
              Kamu akan dibawa ke <strong>{link.gatewayUrl}</strong>. Setelah
              proses di sana selesai, gateway akan mengarahkanmu kembali ke
              sini secara otomatis.
            </p>
          </div>
        )}

        {/* ---- self-hosted: sudah kembali dari gateway via callback ---- */}
        {status === "completing" && (
          <div className="gateway-state">
            <span className="check-mark" aria-hidden="true">
              &#10003;
            </span>
            <h2 className="modal__title">Terverifikasi</h2>
            <p className="modal__desc">
              Callback dari gateway diterima. Membuka{" "}
              <strong>{link.title}</strong>&hellip;
            </p>
          </div>
        )}

        {/* ---- third-party: user klik "Lanjutkan" manual ---- */}
        {status === "manual-completing" && (
          <div className="gateway-state">
            <span className="check-mark" aria-hidden="true">
              &#10003;
            </span>
            <h2 className="modal__title">Melanjutkan</h2>
            <p className="modal__desc">
              Membuka <strong>{link.title}</strong> di tab baru&hellip;
            </p>
          </div>
        )}

        {/* ---- self-hosted: token hilang/kedaluwarsa saat kembali ---- */}
        {status === "expired" && (
          <div className="gateway-state">
            <span className="warn-mark" aria-hidden="true">
              !
            </span>
            <h2 className="modal__title">Sesi tidak valid</h2>
            <p className="modal__desc">
              Token callback tidak ditemukan atau sudah kedaluwarsa (berlaku
              15 menit). Silakan ulangi dari halaman utama.
            </p>
            <button className="gateway-modal__primary" onClick={onClose}>
              Kembali ke Beranda
            </button>
          </div>
        )}

        {/* ---- third-party: menunggu konfirmasi manual dari user ---- */}
        {status === "waiting" && (
          <div className="gateway-state gateway-state--left">
            <p className="modal__eyebrow">
              {isSelfHosted ? "Menunggu proses gateway" : "Website perantara pihak ketiga"}
            </p>
            <h2 className="modal__title">{link.title}</h2>

            {popupBlocked && (
              <p className="password-form__message password-form__message--error">
                Tab baru terblokir oleh browser. Klik tombol di bawah untuk
                membukanya secara manual.
              </p>
            )}

            <p className="modal__desc">
              Website perantara sudah dibuka di tab baru:{" "}
              <strong>{link.gatewayUrl}</strong>. Karena ini situs pihak
              ketiga yang tidak dimodifikasi, aplikasi ini{" "}
              <strong>tidak bisa mengetahui secara otomatis</strong> kapan
              kamu selesai di sana tidak ada callback maupun API yang bisa
              dipantau. Selesaikan prosesnya di tab tersebut, lalu kembali ke
              sini dan klik tombol di bawah untuk lanjut ke tujuan.
            </p>

            <div className="gateway-modal__actions">
              <button className="gateway-modal__secondary" onClick={onReopenGateway}>
                Buka Lagi Tab Perantara
              </button>
              <button className="gateway-modal__primary" onClick={onManualContinue}>
                Lanjutkan ke Link Tujuan.
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
