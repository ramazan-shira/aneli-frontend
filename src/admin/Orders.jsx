import { useEffect, useState } from "react";
import { api, money } from "../api.js";
import Modal from "./Modal.jsx";
import Confirm from "./Confirm.jsx";
import PageHead from "./PageHead.jsx";
import { Trash, Plus, Search } from "./Icons.jsx";
import { day } from "./Charts.jsx";
const STATUSES = [
  "ordered",
  "in_preparation",
  "handed_to_courier",
  "delivered",
];

export default function Orders({ t, a }) {
  const [orders, setOrders] = useState(null);
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(null);
  const [rm, setRm] = useState(null);
  const [err, setErr] = useState("");
  const [filter, setFilter] = useState("");
  const [q, setQ] = useState("");
  const load = () => api("/orders", { admin: true }).then(setOrders);
  useEffect(() => {
    load();
    api("/products").then(setProducts);
  }, []);
  const setStatus = async (o, status) => {
    await api(`/orders/${o._id}`, {
      method: "PATCH",
      body: { status },
      admin: true,
    });
    load();
  };
  const del = async () => {
    await api(`/orders/${rm._id}`, { method: "DELETE", admin: true });
    setRm(null);
    load();
  };
  const qty = (id, d) => {
    setErr("");
    setForm((f) => ({
      ...f,
      cart: { ...f.cart, [id]: Math.max(0, (f.cart[id] || 0) + d) },
    }));
  };
  const total = form
    ? products.reduce((s, p) => s + p.price * (form.cart[p._id] || 0), 0)
    : 0;
  const save = async (e) => {
    e.preventDefault();
    const items = Object.entries(form.cart)
      .filter(([, n]) => n > 0)
      .map(([product, n]) => ({ product, qty: n }));
    if (!items.length) return setErr(a.pickItems);
    await api("/orders/manual", {
      method: "POST",
      body: {
        customerName: form.customerName,
        phone: form.phone,
        address: form.address,
        items,
      },
      admin: true,
    });
    setForm(null);
    load();
  };
  const needle = q.trim().toLowerCase();
  const shown = (orders || []).filter(
    (o) =>
      (!filter || o.status === filter) &&
      (!needle ||
        `${o.customerName} ${o.phone || ""}`.toLowerCase().includes(needle)),
  );
  const empty =
    orders && !shown.length ? (orders.length ? a.noMatches : a.noOrders) : null;
  const Status = ({ o }) => (
    <select
      className="sel-s"
      data-s={o.status}
      value={o.status}
      aria-label={a.status}
      onChange={(e) => setStatus(o, e.target.value)}
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>
          {t[s]}
        </option>
      ))}
    </select>
  );
  return (
    <>
      <PageHead title={a.orders} sub={a.ordersSub}>
        <button
          className="btn"
          onClick={() => {
            setErr("");
            setForm({ customerName: "", phone: "", address: "", cart: {} });
          }}
        >
          <Plus /> {a.addOrder}
        </button>
      </PageHead>
      <div className="toolbar">
        <div className="searchbox">
          <Search />
          <input
            type="search"
            placeholder={a.searchOrders}
            aria-label={a.searchOrders}
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <select
          value={filter}
          aria-label={a.status}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="">{a.allStatuses}</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {t[s]}
            </option>
          ))}
        </select>
      </div>

      {form && (
        <Modal title={a.newOrder} onClose={() => setForm(null)}>
          <form className="form" onSubmit={save}>
            <label>
              {a.customer}
              <input
                required
                value={form.customerName}
                onChange={(e) =>
                  setForm({ ...form, customerName: e.target.value })
                }
              />
            </label>
            <div className="two">
              <label>
                {a.phone}
                <input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </label>
              <label>
                {a.address}
                <input
                  value={form.address}
                  onChange={(e) =>
                    setForm({ ...form, address: e.target.value })
                  }
                />
              </label>
            </div>
            <div className="picker">
              {products.map((p) => (
                <div className="line" key={p._id}>
                  <span>
                    {p.name}
                    <br />
                    <small className="muted">{money(p.price)}</small>
                  </span>
                  <span className="qty">
                    <button
                      type="button"
                      onClick={() => qty(p._id, -1)}
                      aria-label="−"
                    >
                      −
                    </button>
                    {form.cart[p._id] || 0}
                    <button
                      type="button"
                      onClick={() => qty(p._id, 1)}
                      aria-label="+"
                    >
                      +
                    </button>
                  </span>
                </div>
              ))}
            </div>
            {err && (
              <p className="form-err" role="alert">
                {err}
              </p>
            )}
            <div className="row wrapx">
              <b>
                {a.total}: {money(total)}
              </b>
              <span className="row">
                <button
                  type="button"
                  className="btn ghost"
                  onClick={() => setForm(null)}
                >
                  {a.cancel}
                </button>
                <button className="btn">{a.saveOrder}</button>
              </span>
            </div>
          </form>
        </Modal>
      )}
      {rm && (
        <Confirm
          a={a}
          text={a.confirmDeleteOrder}
          name={`${rm.customerName} · ${money(rm.total)}`}
          onYes={del}
          onNo={() => setRm(null)}
        />
      )}

      {empty && <p className="empty">{empty}</p>}
      {!!shown.length && (
        <>
          <div className="tbl-wrap">
            <table>
              <thead>
                <tr>
                  <th>{a.date}</th>
                  <th>{a.customer}</th>
                  <th>{a.items}</th>
                  <th>{a.total}</th>
                  <th>{a.status}</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {shown.map((o) => (
                  <tr key={o._id}>
                    <td className="nowrap">
                      {day(new Date(o.createdAt))}
                      <br />
                      <span className="muted">
                        {o.source === "phone" ? a.byPhone : a.website}
                      </span>
                    </td>
                    <td>
                      <b>{o.customerName}</b>
                      <br />
                      <span className="muted">{o.phone}</span>
                    </td>
                    <td>
                      <ul className="plain">
                        {o.items.map((i, n) => (
                          <li key={n}>
                            {i.qty} × {i.name}
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="nowrap">
                      <b>{money(o.total)}</b>
                    </td>
                    <td>
                      <Status o={o} />
                    </td>
                    <td>
                      <div className="acts">
                        <button
                          className="btn sm ghost danger-h"
                          onClick={() => setRm(o)}
                        >
                          <Trash /> {a.del}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="cards">
            {shown.map((o) => (
              <article className="ocard" key={o._id}>
                <div className="oc-main">
                  <div className="kv">
                    <span>{a.date}</span>
                    <b>
                      {day(new Date(o.createdAt))}{" "}
                      <small className="muted">
                        · {o.source === "phone" ? a.byPhone : a.website}
                      </small>
                    </b>
                  </div>
                  <div className="kv">
                    <span>{a.customer}</span>
                    <b>
                      {o.customerName}
                      {o.phone && (
                        <small className="muted block">{o.phone}</small>
                      )}
                    </b>
                  </div>
                  <div className="kv">
                    <span>{a.items}</span>
                    <div>
                      <ul className="plain">
                        {o.items.map((i, n) => (
                          <li key={n}>
                            {i.qty} × {i.name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="kv">
                    <span>{a.total}</span>
                    <b>{money(o.total)}</b>
                  </div>
                  <div className="kv">
                    <span>{a.status}</span>
                    <div>
                      <Status o={o} />
                    </div>
                  </div>
                </div>
                <div className="pc-actions">
                  <button
                    className="ibtn danger-h"
                    onClick={() => setRm(o)}
                    aria-label={`${a.del}: ${o.customerName}`}
                    title={a.del}
                  >
                    <Trash size={18} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </>
      )}
    </>
  );
}
