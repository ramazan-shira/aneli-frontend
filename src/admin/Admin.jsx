import { useState } from "react";
import { A } from "./adminI18n.js";
import Login from "./Login.jsx";
import Dashboard from "./Dashboard.jsx";
import Products from "./Products.jsx";
import Orders from "./Orders.jsx";
import Reports from "./Reports.jsx";
import "./admin.css";

const VIEWS = {
  dashboard: Dashboard,
  products: Products,
  orders: Orders,
  reports: Reports,
};

export default function Admin({ t, lang, setLang, theme, setTheme }) {
  const [tab, setTab] = useState("dashboard");
  const a = A[lang];
  if (!localStorage.getItem("aneli_token"))
    return (
      <Login
        a={a}
        lang={lang}
        setLang={setLang}
        theme={theme}
        setTheme={setTheme}
      />
    );
  const View = VIEWS[tab];
  return (
    <div className="admin">
      <aside className="side">
        <a href="#/" className="brand">
          <img src="/logo.svg" alt="" />
          <span>Anéli</span>
        </a>
        {Object.keys(VIEWS).map((k) => (
          <button
            key={k}
            className={tab === k ? "on" : ""}
            onClick={() => setTab(k)}
          >
            {a[k]}
          </button>
        ))}
        <div className="spacer" />
        <button onClick={() => setLang(lang === "en" ? "sq" : "en")}>
          {lang === "en" ? "Shqip (Al)" : "English (En)"}
        </button>
        <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
          {theme === "dark" ? `☀ ${a.light}` : `☾ ${a.dark}`}
        </button>
        <a className="sidelink" href="#/">
          {a.viewSite}
        </a>
        <button
          onClick={() => {
            localStorage.removeItem("aneli_token");
            location.reload();
          }}
        >
          {a.signOut}
        </button>
      </aside>
      <main className="adm-main">
        <h1>{a[tab]}</h1>
        <View t={t} a={a} />
      </main>
    </div>
  );
}
