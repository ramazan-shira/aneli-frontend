import { Fragment, useRef } from "react";
import CountUp from "./CountUp.jsx";
import Marquee from "./Marquee.jsx";
const dust = Array.from({ length: 18 }, (_, i) => ({
  "--x": `${(i * 53) % 100}%`,
  "--s": `${3 + ((i * 7) % 6)}px`,
  "--t": `${9 + ((i * 5) % 9)}s`,
  "--dl": `${-i * 1.3}s`,
}));

export default function Hero({ t }) {
  const hero = useRef(),
    stage = useRef();
  const move = (e) => {
    const x = e.clientX / innerWidth,
      y = e.clientY / innerHeight;
    hero.current.style.setProperty("--mx", `${x * 100}%`);
    hero.current.style.setProperty("--my", `${y * 100}%`);
    stage.current.style.setProperty("--ry", `${(x - 0.5) * 44}deg`);
    stage.current.style.setProperty("--rx", `${-(y - 0.5) * 30}deg`);
  };
  const words = t.heroTitle.split(" ");
  return (
    <>
      <section id="home" className="hero" ref={hero} onMouseMove={move}>
        <div className="dust" aria-hidden="true">
          {dust.map((s, i) => (
            <span key={i} style={s} />
          ))}
        </div>
        <div className="hero-inner">
          <div className="hero-copy">
            <h1>
              {words.map((w, i) => (
                <Fragment key={i}>
                  <span className="w">
                    <span
                      className={i >= words.length - 2 ? "hl" : ""}
                      style={{ "--i": i }}
                    >
                      {w}
                    </span>
                  </span>{" "}
                </Fragment>
              ))}
            </h1>
            <p className="fade" style={{ "--d": ".9s" }}>
              {t.heroText}
            </p>
            <div className="hero-cta fade" style={{ "--d": "1.1s" }}>
              <a className="btn gold" href="#products">
                {t.shop}
              </a>
              <a className="btn outline" href="#about">
                {t.about}
              </a>
            </div>
          </div>
          <div
            className="stage fade"
            style={{ "--d": ".5s" }}
            ref={stage}
            aria-hidden="true"
          >
            <div className="float">
              <div className="glow" />
              <svg className="ring" viewBox="0 0 200 200">
                <defs>
                  <path
                    id="ringp"
                    d="M100,100 m-82,0 a82,82 0 1,1 164,0 a82,82 0 1,1 -164,0"
                  />
                </defs>
                <text>
                  <textPath href="#ringp">{t.ring.repeat(2)}</textPath>
                </text>
              </svg>
              <div className="scene">
                <div className="olive">
                  <span className="shine" />
                </div>
                <div className="leaf l1" />
                <div className="leaf l2" />
                <div className="orbit">
                  <div className="drop" />
                </div>
                <div className="orbit o2">
                  <div className="drop sm" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <a className="cue" href="#about" aria-label="Scroll">
          <i />
        </a>
        <svg
          className="wave"
          viewBox="0 0 1440 90"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M0 50C220 100 460 0 720 38s500 60 720 8V90H0z"
            fill="var(--bg)"
          />
        </svg>
      </section>
      <div className="stats-strip" data-reveal>
        {t.stats.map(([n, l]) => (
          <div key={l}>
            <b>
              <CountUp text={n} />
            </b>
            <span>{l}</span>
          </div>
        ))}
      </div>
      <Marquee items={t.marquee} />
    </>
  );
}
