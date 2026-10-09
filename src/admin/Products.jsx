import { useEffect, useState } from "react";
import { api, money } from "../api.js";
import Modal from "./Modal.jsx";
import Confirm from "./Confirm.jsx";
import { Pencil, Trash } from "./Icons.jsx";
const EMPTY = { name: "", description: "", price: "", badge: "", image: "" };

export default function Products({ a }) {
  const [list, setList] = useState([]);
  const [edit, setEdit] = useState(null);
  const [rm, setRm] = useState(null);
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
  return (
    <>
      <div>
        <button className="btn" onClick={() => setEdit({ ...EMPTY })}>
          {a.addProduct}
        </button>
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
      <table>
        <thead>
          <tr>
            <th></th>
            <th>{a.name}</th>
            <th>{a.price}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {list.map((p) => (
            <tr key={p._id}>
              <td>
                <img src={p.image} width="48" alt="" />
              </td>
              <td>
                <b>{p.name}</b>
                <br />
                <span className="muted">{p.description}</span>
              </td>
              <td>{money(p.price)}</td>
              <td className="acts">
                <button className="btn sm ghost" onClick={() => setEdit(p)}>
                  <Pencil /> {a.edit}
                </button>
                <button
                  className="btn sm ghost danger-h"
                  onClick={() => setRm(p)}
                >
                  <Trash /> {a.del}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
