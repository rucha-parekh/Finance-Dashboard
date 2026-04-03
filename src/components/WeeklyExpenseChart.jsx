import React, { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from "recharts";
import { useApp } from "../context/AppContext";
import { formatCurrency } from "../utils/helpers";

const MONTHS = [
  { key: "2025-01", label: "Jan 2025" },
  { key: "2025-02", label: "Feb 2025" },
  { key: "2025-03", label: "Mar 2025" },
  { key: "2025-04", label: "Apr 2025" },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <div className="tooltip-month">{label}</div>
      <div className="tooltip-row">
        <span>Spent</span>
        <span>{formatCurrency(payload[0].value)}</span>
      </div>
    </div>
  );
};

export default function WeeklyExpenseChart() {
  const { transactions } = useApp();
  const [month, setMonth] = useState("2025-04");

  const weeks = { "Wk 1": 0, "Wk 2": 0, "Wk 3": 0, "Wk 4": 0 };
  transactions
    .filter((t) => t.type === "expense" && t.date.startsWith(month))
    .forEach((t) => {
      const day = parseInt(t.date.split("-")[2]);
      const wk = day <= 7 ? "Wk 1" : day <= 14 ? "Wk 2" : day <= 21 ? "Wk 3" : "Wk 4";
      weeks[wk] += t.amount;
    });

  const data = Object.entries(weeks).map(([week, amount]) => ({ week, amount }));
  const max = Math.max(...data.map((d) => d.amount));

  return (
    <div className="chart-card chart-zoom-in" style={{ animationDelay: "0.15s" }}>
      <div className="chart-header">
        <h3 className="chart-title">Weekly Spending</h3>
        <select className="budget-month-select" value={month} onChange={(e) => setMonth(e.target.value)}>
          {MONTHS.map(({ key, label }) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--grid-color)" vertical={false} />
          <XAxis dataKey="week" tick={{ fill: "var(--text-muted)", fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false}
            tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="amount" radius={[5, 5, 0, 0]}>
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.amount === max ? "#C0785A" : "var(--indigo-lighter)"} />
            ))}
            <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 8 }}>
              Highlighted bar = highest spend week
            </p>
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}