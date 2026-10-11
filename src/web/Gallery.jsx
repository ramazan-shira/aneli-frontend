import { useEffect, useRef, useState } from "react";
import { shots, copy } from "./photos.js";

export default function Gallery({ t, lang = "en" }) {
  const c = copy[lang] || copy.en;
  const [i, setI] = useState(null);
  const open = i !== null;
  const box = useRef(null);
  const touchX = useRef(null);
  const go = (d) => setI((x) => (x + d + shots.length) % shots.length);

  useEffect(() => {
    if (!open) return;
    const f = (e) =>
      e.key === "Escape"
        ? setI(null)
        : e.key === "ArrowRight"
          ? go(1)
          : e.key === "ArrowLeft" && go(-1);
    addEventListener("keydown", f);
    return () => removeEventListener("keydown", f);
  }, [open]);

  useEffect(() => {
    const el = box.current;
    if (!open || !el) return;
    const stop = (e) => e.preventDefault();
    el.addEventListener("wheel", stop, { passive: false });
    el.addEventListener("touchmove", stop, { passive: false });
    return () => {
      el.removeEventListener("wheel", stop);
      el.removeEventListener("touchmove", stop);
    };
  }, [open]);

  const swipeEnd = (e) => {
    if (touchX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    touchX.current = null;
    if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
  };

  return (
    <section id="gallery" className="section">
      <h2 className="center" data-reveal>
        {t.galleryTitle}
      </h2>
      <p className="center muted" data-reveal>
        {c.intro}
      </p>

      <div className="shots">
        {shots.map((s, k) => (
          <figure
            key={s.src}
            className="shot"
            data-reveal
            style={{ "--d": `${k * 0.09}s` }}
          >
            <button
              className="ph"
              onClick={() => setI(k)}
              aria-label={`${c.ui.open}: ${c.shots[k][0]}`}
            >
              <img
                src={s.src}
                alt={c.shots[k][0]}
                loading="lazy"
                decoding="async"
                data-speed="0.03"
                style={{ objectPosition: s.pos }}
              />
            </button>
          </figure>
        ))}
      </div>

      {open && (
        <div
          className="lightbox lb2"
          ref={box}
          data-lenis-prevent=""
          role="dialog"
          aria-modal="true"
          aria-label={c.shots[i][0]}
          onClick={() => setI(null)}
          onTouchStart={(e) => {
            touchX.current = e.touches[0].clientX;
          }}
          onTouchEnd={swipeEnd}
        >
          <div
            className="lb-bg"
            key={`bg${i}`}
            style={{ backgroundImage: `url(${shots[i].src})` }}
          />
          <button
            className="lb-x"
            onClick={() => setI(null)}
            aria-label={c.ui.close}
            autoFocus
          >
            ×
          </button>
          <button
            className="lb-nav l"
            onClick={(e) => {
              e.stopPropagation();
              go(-1);
            }}
            aria-label={c.ui.prev}
          >
            ‹
          </button>
          <figure key={i} onClick={(e) => e.stopPropagation()}>
            <img src={shots[i].src} alt={c.shots[i][0]} />
            <figcaption>
              <span>
                {i + 1} / {shots.length}
              </span>
              <h3>{c.shots[i][0]}</h3>
              <p>{c.shots[i][1]}</p>
            </figcaption>
          </figure>
          <button
            className="lb-nav r"
            onClick={(e) => {
              e.stopPropagation();
              go(1);
            }}
            aria-label={c.ui.next}
          >
            ›
          </button>
        </div>
      )}
    </section>
  );
}
