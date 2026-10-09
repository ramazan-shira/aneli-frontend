import { useEffect, useState } from "react";
import { gallery } from "./art.js";
export default function Gallery({ t }) {
  const [i, setI] = useState(null);
  const go = (d) => setI((x) => (x + d + gallery.length) % gallery.length);
  useEffect(() => {
    if (i === null) return;
    const f = (e) =>
      e.key === "Escape"
        ? setI(null)
        : e.key === "ArrowRight"
          ? go(1)
          : e.key === "ArrowLeft" && go(-1);
    addEventListener("keydown", f);
    return () => removeEventListener("keydown", f);
  }, [i]);
  return (
    <section id="gallery" className="section">
      <h2 className="center" data-reveal>
        {t.galleryTitle}
      </h2>
      <p className="center muted" data-reveal>
        {t.gallerySub}
      </p>
      <div className="gallery">
        {gallery.map((g, k) => (
          <button
            key={k}
            className={`g-item ${g.wide ? "wide" : ""}`}
            data-reveal="zoom"
            style={{ "--d": `${(k % 4) * 0.08}s` }}
            onClick={() => setI(k)}
          >
            <img src={g.src} alt={g.alt} loading="lazy" />
            <span>{g.alt}</span>
          </button>
        ))}
      </div>
      {i !== null && (
        <div className="lightbox" onClick={() => setI(null)} role="dialog">
          <button
            className="lb-nav l"
            onClick={(e) => {
              e.stopPropagation();
              go(-1);
            }}
            aria-label="Previous"
          >
            ‹
          </button>
          <figure key={i} onClick={(e) => e.stopPropagation()}>
            <img src={gallery[i].src} alt={gallery[i].alt} />
            <figcaption>{gallery[i].alt}</figcaption>
          </figure>
          <button
            className="lb-nav r"
            onClick={(e) => {
              e.stopPropagation();
              go(1);
            }}
            aria-label="Next"
          >
            ›
          </button>
        </div>
      )}
    </section>
  );
}
