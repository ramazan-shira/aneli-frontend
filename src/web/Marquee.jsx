export default function Marquee({ items }) {
  return (
    <div className="marquee-wrap" aria-hidden="true"><div className="marquee"><div className="track">
      {[0, 1].map((k) => <div key={k}>{items.concat(items).map((x, i) => <span key={i}>{x}<i>✦</i></span>)}</div>)}
    </div></div></div>
  );
}
