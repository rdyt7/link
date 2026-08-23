import LinkCard from "./LinkCard.jsx";

export default function LinkGrid({ links, onOpenLink }) {
  if (links.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state__mark" aria-hidden="true">
          &#9633;
        </div>
        <p className="empty-state__title">Belum ada link</p>
        <p className="empty-state__desc">
          Tambahkan object baru ke array <code>links</code> pada file{" "}
          <code>src/data/links.js</code> untuk menampilkan card di sini.
        </p>
      </div>
    );
  }

  return (
    <div className="link-grid">
      {links.map((link) => (
        <LinkCard key={link.id} link={link} onOpen={onOpenLink} />
      ))}
    </div>
  );
}
