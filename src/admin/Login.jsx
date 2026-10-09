import { useState } from "react";
import { api } from "../api.js";
import { gallery } from "../web/art.js";
import { Mail, Lock, Check } from "./Icons.jsx";
const dust = Array.from({ length: 14 }, (_, i) => ({
  "--x": `${(i * 37 + 8) % 100}%`,
  "--s": `${3 + ((i * 5) % 5)}px`,
  "--t": `${10 + ((i * 3) % 8)}s`,
  "--dl": `${-i * 1.4}s`,
}));

export default function Login({ a, lang, setLang, theme, setTheme }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const go = async (e) => {
    e.preventDefault();
    setErr("");
    setBusy(true);
    try {
      const { token } = await api("/auth/login", {
        method: "POST",
        body: { email, password },
      });
      localStorage.setItem("aneli_token", token);
      location.reload();
    } catch (x) {
      setErr(x.message === "Wrong email or password" ? a.invalid : x.message);
      setBusy(false);
    }
  };
  return (
    <div className="auth">
      <section className="auth-form">
        <div className="auth-tools">
          <button
            type="button"
            onClick={() => setLang(lang === "en" ? "sq" : "en")}
            aria-label="Language"
          >
            {lang === "en" ? "En" : "Al"}
          </button>
          <button
            type="button"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Theme"
          >
            {theme === "dark" ? "☀" : "☾"}
          </button>
        </div>
        <form className="auth-card" onSubmit={go}>
          <img src="/logo.svg" width="60" alt="" className="auth-logo" />
          <h1>{a.welcome}</h1>
          <p className="muted">{a.loginSub}</p>
          <label className="fld">
            <span>{a.email}</span>
            <div>
              <Mail />
              <input
                type="email"
                required
                autoFocus
                autoComplete="username"
                placeholder="admin@aneli.al"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </label>
          <label className="fld">
            <span>{a.password}</span>
            <div>
              <Lock />
              <input
                type={show ? "text" : "password"}
                required
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="eye"
                onClick={() => setShow(!show)}
              >
                {show ? a.hide : a.show}
              </button>
            </div>
          </label>
          {err && (
            <p className="form-err" role="alert">
              {err}
            </p>
          )}
          <button className="btn auth-btn" disabled={busy}>
            {busy ? a.signingIn : a.signIn}
          </button>
          <a className="auth-back" href="#/">
            {a.backToSite}
          </a>
        </form>
      </section>
      <section className="auth-art">
        <img className="auth-bg" src={gallery[0].src} alt="" />
        <div className="auth-dust" aria-hidden="true">
          {dust.map((s, i) => (
            <span key={i} style={s} />
          ))}
        </div>
        <div className="auth-copy">
          <span className="auth-tag">
            <img src="/logo.svg" width="22" alt="" /> Anéli · {a.panelTag}
          </span>
          <h2>{a.panelTitle}</h2>
          <p>{a.panelText}</p>
          <ul>
            {a.panelFeats.map((f) => (
              <li key={f}>
                <Check /> {f}
              </li>
            ))}
          </ul>
          <div className="auth-stats">
            {a.panelStats.map(([n, l]) => (
              <div key={l}>
                <b>{n}</b>
                <span>{l}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
