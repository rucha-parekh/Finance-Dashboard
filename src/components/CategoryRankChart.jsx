import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { formatCurrency } from "../utils/helpers";
import { CATEGORIES, MONTHLY_SPENDING } from "../data/mockData";

const MONTHS = [
  { key: "2025-01", label: "Jan 2025" },
  { key: "2025-02", label: "Feb 2025" },
  { key: "2025-03", label: "Mar 2025" },
  { key: "2025-04", label: "Apr 2025" },
];

export default function CategoryRankChart() {
  const [month, setMonth] = useState("2025-04");
  const spending = MONTHLY_SPENDING[month] || {};

  const data = Object.entries(spending)
    .map(([name, value]) => ({ name, value, color: CATEGORIES[name]?.color || "#999" }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);

  const max = data[0]?.value || 1;

  return (
    <div className="chart-card chart-zoom-in" style={{ animationDelay: "0.2s" }}>
      <div className="chart-header">
        <h3 className="chart-title">Top Spending Categories</h3>
        <select className="budget-month-select" value={month} onChange={(e) => setMonth(e.target.value)}>
          {MONTHS.map(({ key, label }) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
      </div>
      <div className="rank-list">
        {data.map((cat, i) => (
          <div key={cat.name} className="rank-row">
            <span className="rank-index">{i + 1}</span>
            <span className="rank-name">{cat.name}</span>
            <div className="rank-track">
              <div
                className="rank-fill"
                style={{ background: cat.color, "--w": `${(cat.value / max) * 100}%` }}
              />
            </div>
            <span className="rank-amount">{formatCurrency(cat.value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}