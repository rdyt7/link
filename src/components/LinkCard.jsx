const TAB_COLORS = [
  "#3552D6", // indigo
  "#2F6B4F", // moss
  "#A6763D", // ochre
  "#6A4C93", // plum
  "#1F7A72", // teal
  "#B4562F", // rust
];

function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export default function LinkCard({ link, onOpen }) {
  const tabColor = TAB_COLORS[hashString(link.title) % TAB_COLORS.length];
  const initial = link.title.trim().charAt(0).toUpperCase() || "?";

  return (
    <article className="link-card">
      <div className="link-card__top">
        <div className="link-card__tab" style={{ backgroundColor: tabColor }}>
          {initial}
        </div>
        <span className="link-card__lock" title="Dilindungi password" aria-hidden="true">
          &#128274;
        </span>
      </div>

      <div className="link-card__body">
        <p className="link-card__eyebrow">
          {link.selfHosted ? "Gateway sendiri" : "Gateway pihak ketiga"}
        </p>
        <h2 className="link-card__title">{link.title}</h2>
        <p className="link-card__desc">{link.description}</p>

        <button className="link-card__cta" onClick={() => onOpen(link)}>
          Buka Link
          <span className="link-card__cta-arrow" aria-hidden="true">
            &#8599;
          </span>
        </button>
      </div>
    </article>
  );
}
