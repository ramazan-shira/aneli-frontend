import { useEffect, useState } from "react";
import { api, money } from "../api.js";
import { Bars, Donut, HBars, fillDays, day } from "./Charts.jsx";
import PageHead from "./PageHead.jsx";
import { initials } from "./UserMenu.jsx";
import { Box, Bag, Euro, Clock } from "./Icons.jsx";
const RAMP = {
  ordered: "var(--s1)",
  in_preparation: "var(--s2)",
  handed_to_courier: "var(--s3)",
  delivered: "var(--s4)",
};

export default function Dashboard({ t, a, me }) {
  const [s, setS] = useState(null);
  useEffect(() => {
    api("/reports/stats", { admin: true }).then(setS);
  }, []);
  const first = (me?.name || "").split(" ")[0];
  const head = (
    <PageHead
      title={first ? a.welcomeName.replace("{name}", first) : a.dashboard}
      sub={a.dashboardSub}
    />
  );
  if (!s) return head;
  const cards = [
    [a.productsCount, s.products, Box, "olive"],
    [a.ordersMonth, s.ordersLastMonth, Bag, "gold"],
    [a.revenueMonth, money(s.revenueLastMonth), Euro, "teal"],
    [a.openOrders, s.pending, Clock, "clay"],
  ];
  const days = fillDays(s.daily, new Date(Date.now() - 29 * 864e5), new Date());
  const slices = Object.keys(RAMP).map((k) => ({
    label: t[k],
    color: RAMP[k],
    value: s.byStatus.find((x) => x._id === k)?.count || 0,
  }));
  return (
    <>
      {head}
      <div className="stats">
        {cards.map(([l, v, Icon, tone]) => (
          <div className="stat" data-tone={tone} key={l}>
            <span className="ic">
              <Icon />
            </span>
            <div>
              <b>{v}</b>
              <span>{l}</span>
            </div>
          </div>
        ))}
      </div>
      <Bars
        data={days}
        k="orders"
        label={a.ordersChart}
        note={`${s.ordersLastMonth} ${a.orderUnit}`}
        thLabel={a.date}
        perBar={(n) => a.perBar.replace("{n}", n)}
      />
      <div className="two">
        <Donut slices={slices} label={a.statusChart} unit={a.orderUnit} />
        {s.top.length ? (
          <HBars rows={s.top} label={a.topProducts} unit={a.units} />
        ) : (
          <div className="chart">
            <div className="chart-head">
              <h4>{a.topProducts}</h4>
            </div>
            <p className="muted">{a.noData}</p>
          </div>
        )}
      </div>
      <div className="chart">
        <div className="chart-head">
          <h4>{a.recent}</h4>
        </div>
        {s.latest.length ? (
          <ul className="recent">
            {s.latest.map((o) => (
              <li key={o._id}>
                <span className="av">{initials(o.customerName)}</span>
                <div className="who">
                  <b>{o.customerName}</b>
                  <span className="who-meta">
                    <small>{day(new Date(o.createdAt))}</small>
                    <span className="badge-s" data-s={o.status}>
                      {t[o.status]}
                    </span>
                  </span>
                </div>
                <div className="amt">
                  <b>{money(o.total)}</b>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="muted">{a.noOrders}</p>
        )}
      </div>
    </>
  );
}
