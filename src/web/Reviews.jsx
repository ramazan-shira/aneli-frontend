export default function Reviews({ t }) {
  return (
    <section className="section">
      <h2 className="center" data-reveal>
        {t.reviewsTitle}
      </h2>
      <blockquote className="pull" data-reveal>
        {t.quote}
        <cite>Anéli — {t.roots}</cite>
      </blockquote>
      <div className="reviews">
        {t.reviews.map(([h, p], i) => (
          <figure key={h} data-reveal style={{ "--d": `${i * 0.12}s` }}>
            <div className="vnum">0{i + 1}</div>
            <h3>{h}</h3>
            <p>{p}</p>
          </figure>
        ))}
      </div>
    </section>
  );
}
