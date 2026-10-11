import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Close } from "./Icons.jsx";

let locks = 0;
function lockScroll() {
  if (locks++ > 0) return;
  const h = document.documentElement;
  const gap = window.innerWidth - h.clientWidth;
  h.dataset.prevPad = h.style.paddingRight;
  h.classList.add("modal-open");
  if (gap > 0) h.style.paddingRight = `${gap}px`;
}
function unlockScroll() {
  if (--locks > 0) return;
  const h = document.documentElement;
  h.classList.remove("modal-open");
  h.style.paddingRight = h.dataset.prevPad || "";
  delete h.dataset.prevPad;
}

export default function Modal({ title, onClose, children }) {
  const box = useRef(null);
  useEffect(() => {
    lockScroll();
    const before = document.activeElement;
    box.current?.focus({ preventScroll: true });
    const esc = (e) => e.key === "Escape" && onClose();
    addEventListener("keydown", esc);
    return () => {
      removeEventListener("keydown", esc);
      unlockScroll();
      before?.focus?.({ preventScroll: true });
    };
  }, [onClose]);
  return createPortal(
    <div
      className="modal-bg"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="modal"
        ref={box}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="modal-head">
          <h3>{title}</h3>
          <button className="x" onClick={onClose} aria-label="Close">
            <Close size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body,
  );
}
