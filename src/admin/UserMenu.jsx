import { useEffect, useRef, useState } from "react";
import { User, Logout, Chevron } from "./Icons.jsx";

export const initials = (name = "") =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("") || "?";
export const logOut = () => {
  localStorage.removeItem("aneli_token");
  location.hash = "#/admin";
  location.reload();
};

export default function UserMenu({ me, a }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const down = (e) => {
      if (!ref.current?.contains(e.target)) setOpen(false);
    };
    const key = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", down);
    addEventListener("keydown", key);
    return () => {
      document.removeEventListener("pointerdown", down);
      removeEventListener("keydown", key);
    };
  }, [open]);
  return (
    <div className="um" ref={ref}>
      <button
        className="um-btn"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={a.userMenu}
        onClick={() => setOpen(!open)}
      >
        <span className="um-ic">
          <User size={20} />
        </span>
        <span className="um-av">{initials(me?.name)}</span>
        <span className="um-name">{me?.name || ""}</span>
        <span className="um-chev">
          <Chevron />
        </span>
      </button>
      {open && (
        <div className="um-pop" role="menu">
          <div className="um-head">
            <b>{me?.name || "…"}</b>
            <span>{me?.email}</span>
          </div>
          <a
            role="menuitem"
            href="#/admin/profile"
            onClick={() => setOpen(false)}
          >
            <User size={18} /> {a.profile}
          </a>
          <button role="menuitem" className="danger-i" onClick={logOut}>
            <Logout /> {a.signOut}
          </button>
        </div>
      )}
    </div>
  );
}
