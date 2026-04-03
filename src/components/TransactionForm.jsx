import React, { useState } from "react";
import { X } from "lucide-react";
import { useApp } from "../context/AppContext";
import { CATEGORIES } from "../data/mockData";

const BLANK = { date: "", description: "", amount: "", category: "Food", type: "expense" };

export default function TransactionForm({ txn, onClose }) {
  const { addTransaction, editTransaction } = useApp();
  const [form, setForm] = useState(txn ? { ...txn, amount: String(txn.amount) } : BLANK);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.date) e.date = "Required";
    if (!form.description.trim()) e.description = "Required";
    if (!form.amount || isNaN(Number(form.amount)) || Number(form.amount) <= 0) e.amount = "Must be a positive number";
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    const payload = { ...form, amount: Number(form.amount) };
    txn ? editTransaction(payload) : addTransaction(payload);
    onClose();
  };

  const field = (key, label, type = "text") => (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <input
        className={`form-input ${errors[key] ? "error" : ""}`}
        type={type}
        value={form[key]}
        onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
      />
      {errors[key] && <span className="form-error">{errors[key]}</span>}
    </div>
  );

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{txn ? "Edit Transaction" : "Add Transaction"}</h3>
          <button className="drawer-close" onClick={onClose}><X size={18} /></button>
        </div>

        {field("date", "Date", "date")}
        {field("description", "Description")}
        {field("amount", "Amount (₹)", "number")}

        <div className="form-group">
          <label className="form-label">Category</label>
          <select className="form-input" value={form.category}
            onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}>
            {Object.keys(CATEGORIES).map((c) => (
              <option key={c} value={c}>{CATEGORIES[c].icon} {c}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Type</label>
          <div className="type-toggle">
            {["expense", "income"].map((t) => (
              <button key={t} className={`type-toggle-btn ${form.type === t ? "active" : ""} ${t}`}
                onClick={() => setForm((f) => ({ ...f, type: t }))}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="modal-actions">
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={handleSubmit}>{txn ? "Save Changes" : "Add Transaction"}</button>
        </div>
      </div>
    </div>
  );
}
