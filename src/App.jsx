import { useEffect, useState } from "react";
import { T } from "./i18n.js";
import Web from "./web/Web.jsx";
import Admin from "./admin/Admin.jsx";

export default function App() {
  const [route, setRoute] = useState(location.hash);
  const [lang, setLang] = useState(localStorage.getItem("aneli_lang") || "en");
  const [theme, setTheme] = useState(
    localStorage.getItem("aneli_theme") ||
      (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"),
  );
  useEffect(() => {
    const f = () => setRoute(location.hash);
    addEventListener("hashchange", f);
    return () => removeEventListener("hashchange", f);
  }, []);
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("aneli_theme", theme);
  }, [theme]);
  useEffect(() => {
    document.documentElement.lang = lang;
    localStorage.setItem("aneli_lang", lang);
  }, [lang]);
  const ctx = { t: T[lang], lang, setLang, theme, setTheme };
  return route.startsWith("#/admin") ? <Admin {...ctx} /> : <Web {...ctx} />;
}
