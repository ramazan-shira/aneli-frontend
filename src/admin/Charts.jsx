import { useEffect, useRef, useState } from "react";

export const day = (d) => d.toISOString().slice(0, 10);
export function fillDays(rows, from, to) {
  const map = Object.fromEntries(rows.map((r) => [r._id, r])),
    out = [];
  for (
    let d = new Date(from);
    d <= new Date(to);
    d = new Date(d.getTime() + 864e5)
  ) {
    const k = day(d);
    out.push(map[k] || { _id: k, orders: 0, revenue: 0 });
  }
  return out;
}
const fmtDay = (id) => `${id.slice(8, 10)}.${id.slice(5, 7)}`;
const compact = (v) => (v >= 1000 ? `${+(v / 1000).toFixed(1)}K` : `${v}`);

function useWidth() {
  const ref = useRef(null);
  const [w, setW] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) =>
      setW(Math.floor(e.contentRect.width)),
    );
    ro.observe(el);
    setW(Math.floor(el.getBoundingClientRect().width));
    return () => ro.disconnect();
  }, []);
  return [ref, w];
}
function axis(max) {
  if (max <= 4) return { step: 1, top: Math.max(1, Math.ceil(max)) };
  const raw = max / 4,
    p = 10 ** Math.floor(Math.log10(raw)),
    n = raw / p;
  const step = (n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10) * p;
  return { step, top: Math.ceil(max / step) * step };
}
const colPath = (x, y, w, h) => {
  const r = Math.min(4, w / 2, h);
  return `M${x},${y + h}V${y + r}Q${x},${y} ${x + r},${y}H${x + w - r}Q${x + w},${y} ${x + w},${y + r}V${y + h}Z`;
};

export function Bars({
  data,
  k,
  label,
  note,
  fmt = (v) => v,
  perBar,
  thLabel = "Date",
}) {
  const [ref, w] = useWidth();
  const [hov, setHov] = useState(null);
  const timer = useRef(null);
  const H = w && w < 480 ? 176 : 212,
    padL = 38,
    padR = 6,
    padT = 16,
    padB = 28;
  const innerW = Math.max(0, w - padL - padR),
    innerH = H - padT - padB;
  const per = innerW ? Math.max(1, Math.ceil((data.length * 8) / innerW)) : 1;
  const groups = [];
  for (let i = 0; i < data.length; i += per) {
    const s = data.slice(i, i + per);
    groups.push({
      _id: s[0]._id,
      end: s[s.length - 1]._id,
      orders: s.reduce((a, r) => a + r.orders, 0),
      revenue: s.reduce((a, r) => a + r.revenue, 0),
    });
  }
  const max = Math.max(1, ...groups.map((g) => g[k])),
    { step, top } = axis(max);
  const ticks = [];
  for (let v = 0; v <= top + 1e-9; v += step) ticks.push(v);
  const slot = groups.length ? innerW / groups.length : 0,
    bw = Math.min(24, Math.max(2, slot - 2));
  const y = (v) => padT + innerH - (v / top) * innerH;
  const every = Math.max(1, Math.ceil(46 / Math.max(slot, 1)));
  const peak = groups.reduce(
    (m, g, i) => (g[k] > (groups[m]?.[k] ?? -1) ? i : m),
    0,
  );
  const cx = (i) => padL + slot * i + slot / 2;
  const range = (g) =>
    g._id === g.end ? fmtDay(g._id) : `${fmtDay(g._id)} – ${fmtDay(g.end)}`;
  const show = (i, e) => {
    setHov(i);
    clearTimeout(timer.current);
    if (e.pointerType === "touch")
      timer.current = setTimeout(() => setHov(null), 2600);
  };
  const g = hov !== null ? groups[hov] : null;
  return (
    <div className="chart">
      <div className="chart-head">
        <h4>{label}</h4>
        {note && <span className="chart-note">{note}</span>}
      </div>
      <div className="plot" ref={ref}>
        {w > 0 && (
          <svg width={w} height={H} role="img" aria-label={label}>
            {ticks.map((v) => (
              <g key={v}>
                <line
                  className="gl"
                  x1={padL}
                  x2={w - padR}
                  y1={y(v)}
                  y2={y(v)}
                />
                <text
                  className="axt"
                  x={padL - 8}
                  y={y(v) + 4}
                  textAnchor="end"
                >
                  {compact(v)}
                </text>
              </g>
            ))}
            {groups.map((gr, i) => {
              const h = (gr[k] / top) * innerH;
              return (
                <g key={gr._id}>
                  {h > 0 && (
                    <path
                      className={`bar ${hov === i ? "on" : ""}`}
                      d={colPath(cx(i) - bw / 2, y(gr[k]), bw, h)}
                    />
                  )}
                  {i % every === 0 && cx(i) + 16 <= w && (
                    <text
                      className="axt"
                      x={cx(i)}
                      y={H - 8}
                      textAnchor="middle"
                    >
                      {fmtDay(gr._id)}
                    </text>
                  )}
                  <rect
                    x={padL + slot * i}
                    y={padT}
                    width={slot}
                    height={innerH}
                    fill="transparent"
                    onPointerEnter={(e) => show(i, e)}
                    onPointerDown={(e) => show(i, e)}
                    onPointerLeave={(e) =>
                      e.pointerType === "mouse" && setHov(null)
                    }
                  />
                </g>
              );
            })}
            {groups.length > 1 && groups[peak][k] > 0 && hov === null && (
              <text
                className="valt"
                x={Math.min(Math.max(cx(peak), padL + 18), w - padR - 18)}
                y={y(groups[peak][k]) - 6}
                textAnchor="middle"
              >
                {fmt(groups[peak][k])}
              </text>
            )}
          </svg>
        )}
        {g && (
          <div
            className="tip"
            style={{
              left: Math.min(Math.max(cx(hov), 56), w - 56),
              top: Math.max(y(g[k]) - 8, 34),
            }}
          >
            <b>{fmt(g[k])}</b>
            {range(g)}
          </div>
        )}
      </div>
      {per > 1 && perBar && <p className="chart-foot">{perBar(per)}</p>}
      <div className="sr-only">
        <table>
          <caption>{label}</caption>
          <thead>
            <tr>
              <th>{thLabel}</th>
              <th>{label}</th>
            </tr>
          </thead>
          <tbody>
            {groups.map((gr) => (
              <tr key={gr._id}>
                <td>{range(gr)}</td>
                <td>{fmt(gr[k])}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function Donut({ slices, label, unit }) {
  const total = slices.reduce((s, x) => s + x.value, 0),
    R = 52,
    C = 2 * Math.PI * R,
    GAP = total > 0 && slices.filter((s) => s.value).length > 1 ? 2.5 : 0;
  let off = 0;
  return (
    <div className="chart">
      <div className="chart-head">
        <h4>{label}</h4>
      </div>
      <div className="donut">
        <svg
          width="148"
          height="148"
          viewBox="0 0 150 150"
          role="img"
          aria-label={`${label}: ${slices.map((s) => `${s.label} ${s.value}`).join(", ")}`}
        >
          <g transform="rotate(-90 75 75)">
            <circle
              cx="75"
              cy="75"
              r={R}
              fill="none"
              stroke="var(--line)"
              strokeWidth="20"
            />
            {total > 0 &&
              slices.map((s) => {
                if (!s.value) return null;
                const len = (s.value / total) * C,
                  el = (
                    <circle
                      key={s.label}
                      cx="75"
                      cy="75"
                      r={R}
                      fill="none"
                      stroke={s.color}
                      strokeWidth="20"
                      strokeDasharray={`${Math.max(len - GAP, 0.5)} ${C - Math.max(len - GAP, 0.5)}`}
                      strokeDashoffset={-off}
                    />
                  );
                off += len;
                return el;
              })}
          </g>
          <text x="75" y="76" textAnchor="middle" className="donut-n">
            {total}
          </text>
          <text x="75" y="94" textAnchor="middle" className="axt">
            {unit}
          </text>
        </svg>
        <ul>
          {slices.map((s) => (
            <li key={s.label}>
              <i style={{ background: s.color }} />
              <span>{s.label}</span>
              <b>{s.value}</b>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function HBars({ rows, label, unit }) {
  const max = Math.max(1, ...rows.map((r) => r.qty));
  return (
    <div className="chart">
      <div className="chart-head">
        <h4>{label}</h4>
      </div>
      <ol className="hbars">
        {rows.map((r) => (
          <li key={r._id}>
            <div className="hb-top">
              <span className="hb-name">{r._id}</span>
              <b>
                {r.qty} {unit}
              </b>
            </div>
            <div className="hb-bar">
              <i style={{ width: `${Math.max((r.qty / max) * 100, 3)}%` }} />
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
