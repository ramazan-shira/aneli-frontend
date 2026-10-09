import { useEffect, useState } from "react";
import { api, money } from "../api.js";
import Modal from "./Modal.jsx";
import Confirm from "./Confirm.jsx";
import { Trash } from "./Icons.jsx";
import { day } from "./Charts.jsx";
const STATUSES = [
  "ordered",
  "in_preparation",
  "handed_to_courier",
  "delivered",
];

export default function Orders({ t, a }) {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(null);
  const [rm, setRm] = useState(null);
  const [err, setErr] = useState("");
  const [filter, setFilter] = useState("");
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
  const qty = (id, d) =>
    setErr("") ||
    setForm((f) => ({
      ...f,
      cart: { ...f.cart, [id]: Math.max(0, (f.cart[id] || 0) + d) },
    }));
  const total = form
    ? products.reduce((s, p) => s + p.price * (form.cart[p._id] || 0), 0)
    : 0;
  const save = async (e) => {
    e.preventDefault();
    const items = Object.entries(form.cart)
      .filter(([, q]) => q > 0)
      .map(([product, q]) => ({ product, qty: q }));
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
  const shown = filter ? orders.filter((o) => o.status === filter) : orders;
  return (
    <>
      <div className="row filters">
        <button
          className="btn"
          onClick={() => {
            setErr("");
            setForm({ customerName: "", phone: "", address: "", cart: {} });
          }}
        >
          {a.addOrder}
        </button>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
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
                    <button type="button" onClick={() => qty(p._id, -1)}>
                      −
                    </button>
                    {form.cart[p._id] || 0}
                    <button type="button" onClick={() => qty(p._id, 1)}>
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
            <div className="row">
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
              <td>
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
              <td>{o.items.map((i) => `${i.qty} × ${i.name}`).join(", ")}</td>
              <td>{money(o.total)}</td>
              <td>
                <select
                  value={o.status}
                  onChange={(e) => setStatus(o, e.target.value)}
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {t[s]}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <button
                  className="btn sm ghost danger-h"
                  onClick={() => setRm(o)}
                >
                  <Trash /> {a.del}
                </button>
              </td>
            </tr>
          ))}
          {!shown.length && (
            <tr>
              <td colSpan="6" className="muted">
                {a.noOrders}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  );
}
