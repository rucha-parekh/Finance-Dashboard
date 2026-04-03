import React, { useState } from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from "recharts";
import { monthlyTrend } from "../data/mockData";
import { formatCurrency } from "../utils/helpers";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <div className="tooltip-month">{label}</div>
      {payload.map((p) => (
        <div key={p.name} className="tooltip-row" style={{ color: p.color }}>
          <span>{p.name === "income" ? "Income" : p.name === "expenses" ? "Expenses" : "Balance"}</span>
          <span>{formatCurrency(p.value)}</span>
        </div>
      ))}
    </div>
  );
};

const RANGES = [
  { label: "1M", count: 1 },
  { label: "3M", count: 3 },
  { label: "All", count: 4 },
];

export default function BalanceTrendChart() {
  const [range, setRange] = useState("All");
  const count = RANGES.find((r) => r.label === range)?.count ?? 4;
  const data = monthlyTrend.slice(-count);

  return (
    <div className="chart-card chart-zoom-in">
      <div className="chart-header">
        <h3 className="chart-title">Balance Trend</h3>
        <div className="range-tabs">
          {RANGES.map(({ label }) => (
            <button
              key={label}
              className={`range-tab ${range === label ? "active" : ""}`}
              onClick={() => setRange(label)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#5A8FE8" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#5A8FE8" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#C0785A" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#C0785A" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="balGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4EAA78" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#4EAA78" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--grid-color)" />
          <XAxis dataKey="month" tick={{ fill: "var(--text-muted)", fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false}
            tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
          <Tooltip content={<CustomTooltip />} />
          <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12, color: "var(--text-muted)" }} />
          <Area type="monotone" dataKey="income" stroke="#5A8FE8" strokeWidth={2.5}
            fill="url(#incomeGrad)" dot={{ fill: "#5A8FE8", strokeWidth: 0, r: 4 }} activeDot={{ r: 6 }} />
          <Area type="monotone" dataKey="expenses" stroke="#C0785A" strokeWidth={2.5}
            fill="url(#expGrad)" dot={{ fill: "#C0785A", strokeWidth: 0, r: 4 }} activeDot={{ r: 6 }} />
          <Area type="monotone" dataKey="balance" stroke="#4EAA78" strokeWidth={2.5}
            fill="url(#balGrad)" dot={{ fill: "#4EAA78", strokeWidth: 0, r: 4 }} activeDot={{ r: 6 }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}