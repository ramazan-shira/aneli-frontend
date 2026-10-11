import { useEffect, useState } from "react";
import { api, money } from "../api.js";
import Modal from "./Modal.jsx";
import Confirm from "./Confirm.jsx";
import PageHead from "./PageHead.jsx";
import { Pencil, Trash, Plus, Search } from "./Icons.jsx";
const EMPTY = { name: "", description: "", price: "", badge: "", image: "" };

export default function Products({ a }) {
  const [list, setList] = useState(null);
  const [edit, setEdit] = useState(null);
  const [rm, setRm] = useState(null);
  const [q, setQ] = useState("");
  const load = () => api("/products").then(setList);
  useEffect(() => {
    load();
  }, []);
  const pick = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const r = new FileReader();
    r.onload = () => setEdit((p) => ({ ...p, image: r.result }));
    r.readAsDataURL(file);
  };
  const save = async (e) => {
    e.preventDefault();
    await api(edit._id ? `/products/${edit._id}` : "/products", {
      method: edit._id ? "PUT" : "POST",
      body: { ...edit, price: Number(edit.price) },
      admin: true,
    });
    setEdit(null);
    load();
  };
  const del = async () => {
    await api(`/products/${rm._id}`, { method: "DELETE", admin: true });
    setRm(null);
    load();
  };
  const set = (k) => (e) => setEdit({ ...edit, [k]: e.target.value });
  const shown = (list || []).filter((p) =>
    p.name.toLowerCase().includes(q.trim().toLowerCase()),
  );
  const empty =
    list && !shown.length ? (list.length ? a.noMatches : a.noProducts) : null;
  return (
    <>
      <PageHead title={a.products} sub={a.productsSub}>
        <button className="btn" onClick={() => setEdit({ ...EMPTY })}>
          <Plus /> {a.addProduct}
        </button>
      </PageHead>
      <div className="toolbar">
        <div className="searchbox">
          <Search />
          <input
            type="search"
            placeholder={a.searchProducts}
            aria-label={a.searchProducts}
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
      </div>

      {edit && (
        <Modal
          title={edit._id ? a.editProduct : a.addProduct}
          onClose={() => setEdit(null)}
        >
          <form className="form" onSubmit={save}>
            <label>
              {a.name}
              <input required value={edit.name} onChange={set("name")} />
            </label>
            <label>
              {a.description}
              <textarea
                required
                rows="3"
                value={edit.description}
                onChange={set("description")}
              />
            </label>
            <div className="two">
              <label>
                {a.price}
                <input
                  required
                  type="number"
                  step="0.01"
                  min="0"
                  value={edit.price}
                  onChange={set("price")}
                />
              </label>
              <label>
                {a.badge}
                <input value={edit.badge || ""} onChange={set("badge")} />
              </label>
            </div>
            <label>
              {a.image}
              <input type="file" accept="image/*" onChange={pick} />
            </label>
            {edit.image && <img className="preview" src={edit.image} alt="" />}
            <div className="row end">
              <button
                type="button"
                className="btn ghost"
                onClick={() => setEdit(null)}
              >
                {a.cancel}
              </button>
              <button className="btn">{a.save}</button>
            </div>
          </form>
        </Modal>
      )}
      {rm && (
        <Confirm
          a={a}
          text={a.confirmDeleteProduct}
          name={rm.name}
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
                  <th>{a.name}</th>
                  <th>{a.price}</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {shown.map((p) => (
                  <tr key={p._id}>
                    <td>
                      <div className="pt">
                        <img src={p.image} alt="" />
                        <div>
                          <b>{p.name}</b>
                          {p.badge && <span className="pill">{p.badge}</span>}
                          <p className="muted clamp1">{p.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="nowrap">
                      <b>{money(p.price)}</b>
                    </td>
                    <td>
                      <div className="acts">
                        <button
                          className="btn sm ghost"
                          onClick={() => setEdit(p)}
                        >
                          <Pencil /> {a.edit}
                        </button>
                        <button
                          className="btn sm ghost danger-h"
                          onClick={() => setRm(p)}
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
            {shown.map((p) => (
              <article className="pcard" key={p._id}>
                <img src={p.image} alt="" />
                <div className="pc-body">
                  <div className="kv">
                    <span>{a.name}</span>
                    <b>{p.name}</b>
                  </div>
                  <div className="kv">
                    <span>{a.priceLabel}</span>
                    <b>{money(p.price)}</b>
                  </div>
                  <p className="muted clamp2">{p.description}</p>
                </div>
                <div className="pc-actions">
                  <button
                    className="ibtn"
                    onClick={() => setEdit(p)}
                    aria-label={`${a.edit}: ${p.name}`}
                    title={a.edit}
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    className="ibtn danger-h"
                    onClick={() => setRm(p)}
                    aria-label={`${a.del}: ${p.name}`}
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
