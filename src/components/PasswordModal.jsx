import { useEffect, useRef, useState } from "react";

export default function PasswordModal({ link, onClose, onSuccess }) {
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("idle"); // idle | checking | error | success
  const [errorTick, setErrorTick] = useState(0); // dipakai untuk re-trigger animasi shake
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape" && status !== "checking") onClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [status, onClose]);

  function handleSubmit(e) {
    e.preventDefault();
    if (status === "checking" || status === "success") return;
    if (!password.trim()) return;

    setStatus("checking");

    // Simulasi jeda validasi supaya loading state terasa nyata.
    // Perbandingan password terjadi di sisi client — lihat catatan
    // keamanan di src/data/links.js.
    setTimeout(() => {
      if (password === link.password) {
        setStatus("success");
        setTimeout(() => onSuccess(link), 500);
      } else {
        setStatus("error");
        setErrorTick((t) => t + 1);
        setPassword("");
      }
    }, 550);
  }

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <div
        className="modal password-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="password-modal-title"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <button className="modal__close" onClick={onClose} aria-label="Tutup">
          &times;
        </button>

        <p className="modal__eyebrow">Card terkunci</p>
        <h2 id="password-modal-title" className="modal__title">
          {link.title}
        </h2>
        <p className="modal__desc">
          Masukkan password untuk melanjutkan ke website perantara.
        </p>

        <form onSubmit={handleSubmit} className="password-form">
          <input
            ref={inputRef}
            key={errorTick}
            type="password"
            className={`password-form__input${status === "error" ? " password-form__input--error" : ""}`}
            placeholder="Masukkan password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={status === "checking" || status === "success"}
            autoComplete="off"
          />

          {status === "error" && (
            <p className="password-form__message password-form__message--error">
              Password salah. Coba lagi.
            </p>
          )}
          {status === "success" && (
            <p className="password-form__message password-form__message--success">
              Password benar membuka website perantara&hellip;
            </p>
          )}

          <button
            type="submit"
            className="password-form__submit"
            disabled={status === "checking" || status === "success" || !password.trim()}
          >
            {status === "checking" && <span className="spinner" aria-hidden="true" />}
            {status === "checking"
              ? "Memeriksa..."
              : status === "success"
              ? "Berhasil"
              : "Buka Link"}
          </button>
        </form>

        <p className="modal__footnote">
          Validasi ini berjalan di browser kamu, bukan di server cocok
          sebagai gate ringan, bukan pengaman data sensitif.
        </p>
      </div>
    </div>
  );
}
