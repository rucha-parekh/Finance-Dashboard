import React, { useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { useApp } from "../context/AppContext";
import { formatCurrency } from "../utils/helpers";
import { CATEGORIES, MONTHLY_SPENDING } from "../data/mockData";

const MONTHS = [
  { key: "2025-01", label: "Jan 2025" },
  { key: "2025-02", label: "Feb 2025" },
  { key: "2025-03", label: "Mar 2025" },
  { key: "2025-04", label: "Apr 2025" },
];

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="chart-tooltip">
      <span style={{ fontWeight: 600 }}>{d.name}</span>
      <span style={{ marginLeft: 10 }}>{formatCurrency(d.value)}</span>
    </div>
  );
};

export default function SpendingBreakdown() {
  const [month, setMonth] = useState("2025-04");
  const spending = MONTHLY_SPENDING[month] || {};

  const data = Object.entries(spending)
    .map(([name, value]) => ({ name, value, color: CATEGORIES[name]?.color || "#999" }))
    .sort((a, b) => b.value - a.value);

  const total = data.reduce((s, d) => s + d.value, 0);

  return (
    <div className="chart-card chart-zoom-in" style={{ animationDelay: "0.1s" }}>
      <div className="chart-header">
        <h3 className="chart-title">Spending Breakdown</h3>
        <select className="budget-month-select" value={month} onChange={(e) => setMonth(e.target.value)}>
          {MONTHS.map(({ key, label }) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
      </div>
      <div className="donut-layout">
        <ResponsiveContainer width={180} height={180}>
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" innerRadius={52} outerRadius={80}
              paddingAngle={3} dataKey="value" strokeWidth={0}
              animationBegin={100} animationDuration={800}>
              {data.map((entry, i) => <Cell key={i} fill={entry.color} />)}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="donut-legend">
          {data.map((d, i) => (
            <div key={i} className="legend-row">
              <span className="legend-dot" style={{ background: d.color }} />
              <span className="legend-cat">{d.name}</span>
              <span className="legend-pct">{((d.value / total) * 100).toFixed(0)}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}