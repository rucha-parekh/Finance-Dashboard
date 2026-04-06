import React, { useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ReferenceLine, ResponsiveContainer
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
      <div className="tooltip-month">Day {label}</div>
      <div className="tooltip-row" style={{ color: payload[0].value >= 0 ? "#4EAA78" : "#C0785A" }}>
        <span>Balance</span>
        <span>{formatCurrency(payload[0].value)}</span>
      </div>
    </div>
  );
};

export default function RunningBalanceChart() {
  const { transactions } = useApp();
  const [month, setMonth] = useState("2025-04");

  const monthTxns = transactions
    .filter((t) => t.date.startsWith(month))
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  let running = 0;
  const dailyMap = {};
  monthTxns.forEach((t) => {
    running += t.type === "income" ? t.amount : -t.amount;
    dailyMap[t.date] = running;
  });

  const data = Object.keys(dailyMap).sort().map((d) => ({
    day: parseInt(d.split("-")[2]),
    balance: dailyMap[d],
  }));

  return (
    <div className="chart-card chart-zoom-in" style={{ animationDelay: "0.2s" }}>
      <div className="chart-header">
        <h3 className="chart-title">Running Balance</h3>
        <select className="budget-month-select" value={month} onChange={(e) => setMonth(e.target.value)}>
          {MONTHS.map(({ key, label }) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 24 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--grid-color)" />
          <XAxis
            dataKey="day"
            tick={{ fill: "var(--text-muted)", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            label={{ value: "Day of month", position: "insideBottom", offset: -14, fontSize: 11, fill: "var(--text-muted)" }}
          />
          <YAxis
            tick={{ fill: "var(--text-muted)", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine y={0} stroke="var(--text-muted)" strokeDasharray="4 4" />
          <Line
            type="monotone"
            dataKey="balance"
            stroke="#4EAA78"
            strokeWidth={2.5}
            dot={{ fill: "#4EAA78", r: 3, strokeWidth: 0 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}