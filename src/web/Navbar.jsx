import { useState } from "react";
export default function Navbar({ t, lang, setLang, theme, setTheme }) {
  const [open, setOpen] = useState(false);
  const nav = [
    ["home", t.home],
    ["about", t.about],
    ["gallery", t.gallery],
    ["products", t.products],
    ["contact", t.contact],
  ];
  return (
    <header className="nav">
      <a href="#home" className="brand" aria-label="Anéli">
        <span className="logo">
          <img className="logo-w" src="/logoWhite.png" alt="Anéli" />
          <img
            className="logo-b"
            src="/logoBlack.png"
            alt=""
            aria-hidden="true"
          />
        </span>
      </a>
      <button
        className="burger"
        onClick={() => setOpen(!open)}
        aria-label="Menu"
      >
        ☰
      </button>
      <nav className={open ? "open" : ""} onClick={() => setOpen(false)}>
        {nav.map(([id, l]) => (
          <a key={id} href={`#${id}`}>
            {l}
          </a>
        ))}
      </nav>
      <div className="tools">
        <button
          className="chip"
          onClick={() => setLang(lang === "en" ? "sq" : "en")}
          aria-label="Language"
        >
          {lang === "en" ? "En" : "Al"}
        </button>
        <button
          className="chip"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          aria-label="Theme"
        >
          {theme === "dark" ? "☀" : "☾"}
        </button>
      </div>
    </header>
  );
}
