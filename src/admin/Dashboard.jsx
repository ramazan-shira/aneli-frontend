import { useEffect, useState } from "react";
import { api, money } from "../api.js";
import { Bars, Donut, HBars, fillDays, day } from "./Charts.jsx";
const COLORS = {
  ordered: "#E0B94A",
  in_preparation: "#A9B94A",
  handed_to_courier: "#6B7F23",
  delivered: "#3F4D17",
};

export default function Dashboard({ t, a }) {
  const [s, setS] = useState(null);
  useEffect(() => {
    api("/reports/stats", { admin: true }).then(setS);
  }, []);
  if (!s) return null;
  const cards = [
    [a.productsCount, s.products],
    [a.ordersMonth, s.ordersLastMonth],
    [a.revenueMonth, money(s.revenueLastMonth)],
    [a.openOrders, s.pending],
  ];
  const days = fillDays(s.daily, new Date(Date.now() - 29 * 864e5), new Date());
  const slices = Object.keys(COLORS).map((k) => ({
    label: t[k],
    color: COLORS[k],
    value: s.byStatus.find((x) => x._id === k)?.count || 0,
  }));
  return (
    <>
      <div className="stats">
        {cards.map(([l, v]) => (
          <div className="stat" key={l}>
            <b>{v}</b>
            <span>{l}</span>
          </div>
        ))}
      </div>
      <Bars data={days} k="orders" label={a.ordersChart} />
      <div className="two">
        <Donut slices={slices} label={a.statusChart} />
        {s.top.length ? (
          <HBars rows={s.top} label={a.topProducts} unit={a.units} />
        ) : (
          <div className="chart">
            <h4>{a.topProducts}</h4>
            <p className="muted">{a.noData}</p>
          </div>
        )}
      </div>
      <div className="chart">
        <h4>{a.recent}</h4>
        {s.latest.length ? (
          <table>
            <tbody>
              {s.latest.map((o) => (
                <tr key={o._id}>
                  <td>{day(new Date(o.createdAt))}</td>
                  <td>
                    <b>{o.customerName}</b>
                  </td>
                  <td>{money(o.total)}</td>
                  <td>{t[o.status]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="muted">{a.noOrders}</p>
        )}
      </div>
    </>
  );
}
