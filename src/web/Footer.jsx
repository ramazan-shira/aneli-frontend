export default function Footer({ t }) {
  return (
    <footer className="footer">
      <div>
        <div className="brand">
          <img src="/logoWhite.png" alt="" />
        </div>
        <p>{t.roots}</p>
      </div>
      <div>
        <h4>{t.contact}</h4>
        <p>{t.address1}</p>
        <p>+355 67 206 5389</p>
        <p>info@aneli.al</p>
      </div>
      <div>
        <h4>Social</h4>
        <a href="#">Instagram</a>
        <a href="#">Facebook</a>
        <a href="#">WhatsApp</a>
      </div>
      <div className="wordmark" aria-hidden="true">
        Anéli
      </div>
      <small>
        © {new Date().getFullYear()} Anéli. {t.rights} ·{" "}
        <a href="#/admin">Admin</a>
      </small>
    </footer>
  );
}
