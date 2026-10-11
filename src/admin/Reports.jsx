import { useEffect, useState } from "react";
import { api, money } from "../api.js";
import { Bars, fillDays, day } from "./Charts.jsx";
import PageHead from "./PageHead.jsx";
import { Printer } from "./Icons.jsx";
const ago = (n) => day(new Date(Date.now() - n * 864e5));

export default function Reports({ a }) {
  const [from, setFrom] = useState(ago(30));
  const [to, setTo] = useState(day(new Date()));
  const [rows, setRows] = useState(null);
  useEffect(() => {
    api(`/reports?from=${from}&to=${to}`, { admin: true }).then(setRows);
  }, [from, to]);
  const days = fillDays(rows || [], from, to).slice(-120);
  const sum = (k) => (rows || []).reduce((s, r) => s + r[k], 0),
    n = sum("orders");
  const quick = (d) => {
    setFrom(ago(d));
    setTo(day(new Date()));
  };
  const active = (d) => from === ago(d) && to === day(new Date());
  const perBar = (k) => a.perBar.replace("{n}", k);
  return (
    <>
      <PageHead title={a.reports} sub={a.reportsSub} />
      <div className="filterbar">
        <div className="seg" role="group" aria-label={a.reports}>
          {[
            [7, a.last7],
            [30, a.last30],
            [90, a.last90],
          ].map(([d, l]) => (
            <button
              key={d}
              className={active(d) ? "on" : ""}
              aria-pressed={active(d)}
              onClick={() => quick(d)}
            >
              {l}
            </button>
          ))}
        </div>
        <div className="fb-dates">
          <label>
            {a.from}
            <input
              type="date"
              value={from}
              max={to}
              onChange={(e) => setFrom(e.target.value)}
            />
          </label>
          <label>
            {a.to}
            <input
              type="date"
              value={to}
              min={from}
              onChange={(e) => setTo(e.target.value)}
            />
          </label>
        </div>
        <button className="btn ghost fb-print" onClick={() => window.print()}>
          <Printer /> {a.print}
        </button>
      </div>
      <div className="stats three">
        <div className="stat" data-tone="gold">
          <div>
            <b>{n}</b>
            <span>{a.ordersInPeriod}</span>
          </div>
        </div>
        <div className="stat" data-tone="teal">
          <div>
            <b>{money(sum("revenue"))}</b>
            <span>{a.revenueInPeriod}</span>
          </div>
        </div>
        <div className="stat" data-tone="olive">
          <div>
            <b>{money(n ? sum("revenue") / n : 0)}</b>
            <span>{a.avgOrder}</span>
          </div>
        </div>
      </div>
      {rows && !n ? (
        <p className="empty">{a.noOrdersPeriod}</p>
      ) : (
        <div className={rows ? "" : "reloading"}>
          <div className="stack">
            <Bars
              data={days}
              k="orders"
              label={a.ordersPerDay}
              thLabel={a.date}
              perBar={perBar}
            />
            <Bars
              data={days}
              k="revenue"
              label={a.revenuePerDay}
              thLabel={a.date}
              perBar={perBar}
              fmt={(v) => `€${Math.round(v)}`}
            />
          </div>
        </div>
      )}
    </>
  );
}
