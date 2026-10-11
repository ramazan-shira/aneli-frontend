import { useEffect, useState } from "react";
import { api } from "../api.js";
import PageHead from "./PageHead.jsx";
import { initials } from "./UserMenu.jsx";

export default function Profile({ a, me, setMe }) {
  const [name, setName] = useState(me?.name || "");
  const [nameMsg, setNameMsg] = useState(null);
  const [busy, setBusy] = useState(false);
  const [pw, setPw] = useState({ current: "", next: "", again: "" });
  const [pwMsg, setPwMsg] = useState(null);
  const [pwBusy, setPwBusy] = useState(false);
  useEffect(() => {
    if (me) setName(me.name);
  }, [me]);

  const saveName = async (e) => {
    e.preventDefault();
    setNameMsg(null);
    setBusy(true);
    try {
      setMe(
        await api("/auth/me", { method: "PUT", body: { name }, admin: true }),
      );
      setNameMsg({ ok: true, text: a.profileSaved });
    } catch (x) {
      setNameMsg({ text: x.message });
    }
    setBusy(false);
  };
  const savePw = async (e) => {
    e.preventDefault();
    setPwMsg(null);
    if (pw.next.length < 6) return setPwMsg({ text: a.passwordMin });
    if (pw.next !== pw.again) return setPwMsg({ text: a.passwordMismatch });
    setPwBusy(true);
    try {
      await api("/auth/password", {
        method: "PUT",
        body: { currentPassword: pw.current, newPassword: pw.next },
        admin: true,
      });
      setPw({ current: "", next: "", again: "" });
      setPwMsg({ ok: true, text: a.passwordSaved });
    } catch (x) {
      setPwMsg({
        text:
          x.message === "Current password is incorrect"
            ? a.wrongCurrent
            : x.message,
      });
    }
    setPwBusy(false);
  };
  const set = (k) => (e) => setPw({ ...pw, [k]: e.target.value });
  return (
    <>
      <PageHead title={a.profile} sub={a.profileSub} />
      <div className="profile-grid">
        <form className="panel form" onSubmit={saveName}>
          <div className="prof-top">
            <span className="big-av">{initials(name || me?.name)}</span>
            <div>
              <h3>{a.profileCardTitle}</h3>
              <p className="muted">{me?.email}</p>
            </div>
          </div>
          <label>
            {a.fullName}
            <input
              required
              minLength="2"
              maxLength="60"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
            />
          </label>
          <label>
            {a.emailReadonly}
            <input value={me?.email || ""} disabled />
          </label>
          {nameMsg && (
            <p role="status" className={nameMsg.ok ? "msg-ok" : "form-err"}>
              {nameMsg.text}
            </p>
          )}
          <div>
            <button
              className="btn"
              disabled={busy || !name.trim() || name.trim() === me?.name}
            >
              {busy ? a.saving : a.saveChanges}
            </button>
          </div>
        </form>
        <form className="panel form" onSubmit={savePw}>
          <div className="prof-top">
            <h3>{a.passwordCardTitle}</h3>
          </div>
          <label>
            {a.currentPassword}
            <input
              type="password"
              required
              autoComplete="current-password"
              value={pw.current}
              onChange={set("current")}
            />
          </label>
          <label>
            {a.newPassword}
            <input
              type="password"
              required
              minLength="6"
              autoComplete="new-password"
              value={pw.next}
              onChange={set("next")}
            />
          </label>
          <label>
            {a.repeatPassword}
            <input
              type="password"
              required
              minLength="6"
              autoComplete="new-password"
              value={pw.again}
              onChange={set("again")}
            />
          </label>
          {pwMsg && (
            <p role="status" className={pwMsg.ok ? "msg-ok" : "form-err"}>
              {pwMsg.text}
            </p>
          )}
          <div>
            <button className="btn" disabled={pwBusy}>
              {pwBusy ? a.saving : a.updatePassword}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
