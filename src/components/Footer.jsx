export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <p>
        &copy; {year} Sharing link &middot; dibangun dengan React &amp;
        Vite &middot; tautan ditambahkan langsung lewat kode
      </p>
    </footer>
  );
}
