import { gallery } from "./art.js";
export default function About({ t }) {
  return (
    <>
      <section id="about" className="section about">
        <div className="about-text" data-reveal="left">
          <h2>{t.aboutTitle}</h2>
          {t.aboutText.map((p, i) => (
            <p key={i} className="lead">
              {p}
            </p>
          ))}
        </div>
        <div className="collage" data-reveal="zoom">
          <img className="a" src={gallery[3].src} alt="" data-speed="0.06" />
          <img className="b" src={gallery[0].src} alt="" data-speed="-0.05" />
        </div>
      </section>
      <section className="section band">
        <h2 className="center" data-reveal>
          {t.whyTitle}
        </h2>
        <div className="why">
          {t.why.map(([h, p], i) => (
            <div
              key={h}
              className="why-card"
              data-reveal
              style={{ "--d": `${i * 0.12}s` }}
            >
              <span className="num">0{i + 1}</span>
              <h3>{h}</h3>
              <p>{p}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="section">
        <h2 className="center" data-reveal>
          {t.tlTitle}
        </h2>
        <ol className="timeline">
          {t.tl.map(([y, p], i) => (
            <li key={y} data-reveal="left" style={{ "--d": `${i * 0.08}s` }}>
              <b>{y}</b>
              <span>{p}</span>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
