import { useEffect, useState } from "react";
import { A } from "./adminI18n.js";
import { api } from "../api.js";
import Login from "./Login.jsx";
import Dashboard from "./Dashboard.jsx";
import Products from "./Products.jsx";
import Orders from "./Orders.jsx";
import Reports from "./Reports.jsx";
import Profile from "./Profile.jsx";
import UserMenu from "./UserMenu.jsx";
import {
  Dashboard as IDash,
  Box,
  Bag,
  Chart,
  Menu,
  Close,
  Sun,
  Moon,
  External,
} from "./Icons.jsx";
import "./admin.css";

const NAV = [
  ["dashboard", IDash],
  ["products", Box],
  ["orders", Bag],
  ["reports", Chart],
];
const VIEWS = {
  dashboard: Dashboard,
  products: Products,
  orders: Orders,
  reports: Reports,
  profile: Profile,
};

const tabFromHash = () => {
  const m = location.hash.match(/^#\/admin\/([\w-]+)/);
  return m && VIEWS[m[1]] ? m[1] : "dashboard";
};

export default function Admin({ t, lang, setLang, theme, setTheme }) {
  const [me, setMe] = useState(null);
  const [menu, setMenu] = useState(false);
  const a = A[lang],
    tab = tabFromHash(),
    hasToken = !!localStorage.getItem("aneli_token");
  useEffect(() => {
    if (hasToken)
      api("/auth/me", { admin: true })
        .then(setMe)
        .catch(() => {});
  }, [hasToken]);
  useEffect(() => {
    setMenu(false);
    window.scrollTo(0, 0);
  }, [tab]);
  useEffect(() => {
    if (!menu) return;
    const esc = (e) => e.key === "Escape" && setMenu(false);
    addEventListener("keydown", esc);
    return () => removeEventListener("keydown", esc);
  }, [menu]);
  if (!hasToken)
    return (
      <Login
        a={a}
        lang={lang}
        setLang={setLang}
        theme={theme}
        setTheme={setTheme}
      />
    );

  const View = VIEWS[tab],
    dark = theme === "dark";
  const toggleLang = () => setLang(lang === "en" ? "sq" : "en"),
    toggleTheme = () => setTheme(dark ? "light" : "dark");
  const date = new Date().toLocaleDateString(
    lang === "sq" ? "sq-AL" : "en-GB",
    { weekday: "long", day: "numeric", month: "long" },
  );
  const logo = dark ? "/logoWhite.png" : "/logoBlack.png";
  const link = (k, Icon, cls) => (
    <a
      key={k}
      href={`#/admin/${k}`}
      className={`${cls} ${tab === k ? "on" : ""}`}
      aria-current={tab === k ? "page" : undefined}
    >
      <Icon />
      {a[k]}
    </a>
  );

  return (
    <div className="admin">
      <aside className="side">
        <a href="#/admin" className="side-brand" aria-label="Anéli">
          <img src="/logoWhite.png" alt="Anéli" />
        </a>
        <nav aria-label="Admin">
          {NAV.map(([k, Icon]) => link(k, Icon, "navlink"))}
        </nav>
        <div className="spacer" />
        <a className="side-foot" href="#/">
          <External /> {a.viewSite}
        </a>
      </aside>

      <div className="adm-wrap">
        <header className="topbar">
          <a href="#/admin" className="tb-brand" aria-label="Anéli">
            <img src={logo} alt="Anéli" />
          </a>
          <span className="tb-date">{date}</span>
          <div className="tb-right">
            <div className="tb-tools">
              <button
                className="achip"
                onClick={toggleLang}
                aria-label={a.language}
              >
                {lang === "en" ? "En" : "Al"}
              </button>
              <button
                className="achip"
                onClick={toggleTheme}
                aria-label={a.theme}
              >
                {dark ? <Sun /> : <Moon />}
              </button>
            </div>
            <UserMenu me={me} a={a} />
            <button
              className="burger"
              onClick={() => setMenu(!menu)}
              aria-expanded={menu}
              aria-controls="mnav"
              aria-label={menu ? a.closeMenu : a.openMenu}
            >
              {menu ? <Close /> : <Menu />}
            </button>
          </div>
          <nav
            id="mnav"
            className={`mnav ${menu ? "open" : ""}`}
            aria-label={a.menu}
          >
            {NAV.map(([k, Icon]) => link(k, Icon, "mlink"))}
            <div className="mnav-row">
              <button className="mbtn" onClick={toggleLang}>
                {lang === "en" ? "Shqip" : "English"}
              </button>
              <button className="mbtn" onClick={toggleTheme}>
                {dark ? <Sun /> : <Moon />} {dark ? a.light : a.dark}
              </button>
            </div>
            <a className="mlink soft" href="#/">
              <External /> {a.viewSite}
            </a>
          </nav>
        </header>
        {menu && (
          <div className="mnav-backdrop" onClick={() => setMenu(false)} />
        )}
        <main className="adm-main">
          <View t={t} a={a} lang={lang} me={me} setMe={setMe} />
        </main>
      </div>
    </div>
  );
}
