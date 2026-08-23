import { useEffect, useState } from "react";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import LinkGrid from "./components/LinkGrid.jsx";
import PasswordModal from "./components/PasswordModal.jsx";
import GatewayModal from "./components/GatewayModal.jsx";
import { links } from "./data/links.js";
import {
  generateToken,
  storePendingToken,
  getPendingToken,
  clearPendingToken,
  buildReturnUrl,
  buildGatewayUrl,
  stripQueryParams,
} from "./utils/gateway.js";

export default function App() {
  const [activeCard, setActiveCard] = useState(null); // link sedang minta password
  const [gateway, setGateway] = useState(null); // { link, mode, status, popupBlocked? }

  // ---------------------------------------------------------------
  // Saat app dimuat: cek apakah URL membawa ?gw_token=... — artinya
  // user baru saja kembali dari gateway milik sendiri (selfHosted).
  // Ini SATU-SATUNYA cara app tahu "user sudah selesai", dan HANYA
  // berlaku untuk gateway yang memang diprogram untuk redirect balik
  // ke sini. Untuk gateway pihak ketiga, blok ini tidak pernah aktif.
  // ---------------------------------------------------------------
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("gw_token");
    if (!token) return;

    const pending = getPendingToken(token);
    stripQueryParams();

    if (!pending) {
      setGateway({ link: { title: "" }, mode: "self-hosted", status: "expired" });
      return;
    }

    clearPendingToken(token);
    setGateway({
      link: { title: pending.title, url: pending.destinationUrl },
      mode: "self-hosted",
      status: "completing",
    });

    const timer = setTimeout(() => {
      // Navigasi terakhir ke tujuan asli. Ini meninggalkan SPA ini
      // sepenuhnya — itu memang tujuan akhirnya.
      window.location.href = pending.destinationUrl;
    }, 900);

    return () => clearTimeout(timer);
  }, []);

  function handleOpenLink(link) {
    setActiveCard(link);
  }

  function handlePasswordSuccess(link) {
    setActiveCard(null);

    if (link.selfHosted) {
      // ---- Gateway milik sendiri: redirect satu tab + token callback ----
      const token = generateToken();
      storePendingToken(token, { title: link.title, destinationUrl: link.url });
      const returnUrl = buildReturnUrl(token);
      const gatewayHref = buildGatewayUrl(link, token, returnUrl);

      setGateway({ link, mode: "self-hosted", status: "opening" });

      setTimeout(() => {
        window.location.href = gatewayHref;
      }, 700);
    } else {
      // ---- Gateway pihak ketiga: buka tab baru, tunggu konfirmasi manual ----
      const newTab = window.open(link.gatewayUrl, "_blank", "noopener,noreferrer");
      setGateway({
        link,
        mode: "third-party",
        status: "waiting",
        popupBlocked: !newTab,
      });
    }
  }

  function handleReopenGateway() {
    if (!gateway) return;
    const newTab = window.open(gateway.link.gatewayUrl, "_blank", "noopener,noreferrer");
    setGateway((g) => ({ ...g, popupBlocked: !newTab }));
  }

  function handleManualContinue() {
    if (!gateway) return;
    setGateway((g) => ({ ...g, status: "manual-completing" }));
    setTimeout(() => {
      window.open(gateway.link.url, "_blank", "noopener,noreferrer");
      setGateway(null);
    }, 550);
  }

  function handleCloseGateway() {
    setGateway(null);
  }

  return (
    <div className="page">
      <Header />

      <main className="content">
        <LinkGrid links={links} onOpenLink={handleOpenLink} />
      </main>

      <Footer />

      {activeCard && (
        <PasswordModal
          link={activeCard}
          onClose={() => setActiveCard(null)}
          onSuccess={handlePasswordSuccess}
        />
      )}

      {gateway && (
        <GatewayModal
          gateway={gateway}
          onReopenGateway={handleReopenGateway}
          onManualContinue={handleManualContinue}
          onClose={handleCloseGateway}
        />
      )}
    </div>
  );
}
