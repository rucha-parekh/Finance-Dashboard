import React from "react";
import { X, Calendar, Tag, DollarSign, ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import { useApp } from "../context/AppContext";
import { formatCurrency, formatDate } from "../utils/helpers";
import { CATEGORIES } from "../data/mockData";

export default function TransactionDrawer() {
  const { drawerTxn, setDrawerTxn } = useApp();
  const open = !!drawerTxn;

  return (
    <>
      <div className={`drawer-overlay ${open ? "visible" : ""}`} onClick={() => setDrawerTxn(null)} />
      <div className={`drawer ${open ? "open" : ""}`}>
        {drawerTxn && (
          <>
            <div className="drawer-header">
              <h3 className="drawer-title">Transaction Detail</h3>
              <button className="drawer-close" onClick={() => setDrawerTxn(null)}><X size={18} /></button>
            </div>

            <div className="drawer-amount-hero" style={{ "--cat-color": CATEGORIES[drawerTxn.category]?.color || "#999" }}>
              <div className="drawer-type-icon">
                {drawerTxn.type === "income"
                  ? <ArrowUpCircle size={36} color="#5ACA8A" />
                  : <ArrowDownCircle size={36} color="#E8715A" />}
              </div>
              <div className={`drawer-big-amount ${drawerTxn.type}`}>
                {drawerTxn.type === "expense" ? "−" : "+"}{formatCurrency(drawerTxn.amount)}
              </div>
              <div className="drawer-desc">{drawerTxn.description}</div>
            </div>

            <div className="drawer-details">
              {[
                { icon: Calendar, label: "Date", value: formatDate(drawerTxn.date) },
                { icon: Tag, label: "Category", value: `${CATEGORIES[drawerTxn.category]?.icon} ${drawerTxn.category}` },
                { icon: DollarSign, label: "Type", value: drawerTxn.type.charAt(0).toUpperCase() + drawerTxn.type.slice(1) },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="drawer-detail-row">
                  <div className="drawer-detail-icon"><Icon size={14} /></div>
                  <div className="drawer-detail-label">{label}</div>
                  <div className="drawer-detail-value">{value}</div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}
