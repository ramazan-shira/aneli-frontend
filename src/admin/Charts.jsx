export const day = (d) => d.toISOString().slice(0, 10);
// Fill days with no orders so charts show a continuous range
export function fillDays(rows, from, to) {
  const map = Object.fromEntries(rows.map((r) => [r._id, r])), out = [];
  for (let d = new Date(from); d <= new Date(to); d = new Date(d.getTime() + 864e5)) { const k = day(d); out.push(map[k] || { _id: k, orders: 0, revenue: 0 }); }
  return out;
}
export function Bars({ data, k, label, fmt = (v) => v }) {
  const max = Math.max(1, ...data.map((d) => d[k])), step = 30, w = Math.max(320, data.length * step + 10);
  return (
    <div className="chart"><h4>{label}</h4>
      <div className="scroll"><svg width={w} height="200" role="img" aria-label={label}>
        {[0, 0.5, 1].map((g) => <line key={g} x1="0" x2={w} y1={160 - g * 130} y2={160 - g * 130} className="gridline" />)}
        {data.map((d, i) => { const h = (d[k] / max) * 130; return (
          <g key={d._id}><rect x={i * step + 6} y={160 - h} width="20" height={h} rx="3" className="bar" />
            {d[k] > 0 && <text x={i * step + 16} y={154 - h} textAnchor="middle" className="tick">{fmt(d[k])}</text>}
            {(i % Math.ceil(data.length / 15) === 0) && <text x={i * step + 16} y="182" textAnchor="middle" className="tick">{d._id.slice(5)}</text>}</g>); })}
      </svg></div></div>);
}
export function Donut({ slices, label }) {
  const total = slices.reduce((s, x) => s + x.value, 0), R = 52, C = 2 * Math.PI * R; let off = 0;
  return (
    <div className="chart"><h4>{label}</h4>
      <div className="donut">
        <svg width="150" height="150" viewBox="0 0 150 150" role="img" aria-label={label}>
          <g transform="rotate(-90 75 75)"><circle cx="75" cy="75" r={R} fill="none" stroke="var(--line)" strokeWidth="22" />
            {total > 0 && slices.map((s) => { const len = (s.value / total) * C, el = <circle key={s.label} cx="75" cy="75" r={R} fill="none" stroke={s.color} strokeWidth="22" strokeDasharray={`${len} ${C - len}`} strokeDashoffset={-off} />; off += len; return el; })}</g>
          <text x="75" y="82" textAnchor="middle" className="donut-n">{total}</text>
        </svg>
        <ul>{slices.map((s) => <li key={s.label}><i style={{ background: s.color }} />{s.label}<b>{s.value}</b></li>)}</ul>
      </div></div>);
}
export function HBars({ rows, label, unit }) {
  const max = Math.max(1, ...rows.map((r) => r.qty));
  return (
    <div className="chart"><h4>{label}</h4>
      {rows.map((r) => <div className="hb" key={r._id}><span>{r._id}</span><div><i style={{ width: `${(r.qty / max) * 100}%` }} /></div><b>{r.qty} {unit}</b></div>)}
    </div>);
}
