import React, { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { useApp } from "../context/AppContext";
import { getHighestSpendingCategory, getSpendingByCategory, formatCurrency } from "../utils/helpers";
import { CATEGORY_BUDGETS, CATEGORIES, MONTHLY_SPENDING } from "../data/mockData";
import { TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";

const MONTHS = [
  { key: "2025-01", label: "January 2025" },
  { key: "2025-02", label: "February 2025" },
  { key: "2025-03", label: "March 2025" },
  { key: "2025-04", label: "April 2025" },
];

function InsightCallout({ icon: Icon, text, accent }) {
  return (
    <div className="insight-callout" style={{ borderColor: accent }}>
      <div className="callout-icon" style={{ color: accent }}><Icon size={16} /></div>
      <p className="callout-text">{text}</p>
    </div>
  );
}

function BudgetBar({ category, spent, budget }) {
  const pct = Math.min((spent / budget) * 100, 100);
  const over = spent > budget;
  const color = CATEGORIES[category]?.color || "#999";
  return (
    <div className="budget-row">
      <div className="budget-row-header">
        <span className="budget-cat">{category}</span>
        <span className="budget-vals" style={{ color: over ? "#C0785A" : "var(--text-muted)" }}>
          {formatCurrency(spent)} / {formatCurrency(budget)}
          {over && <AlertTriangle size={12} style={{ marginLeft: 4, display: "inline", verticalAlign: "middle" }} />}
        </span>
      </div>
      <div className="budget-track">
        <div className="budget-fill" style={{
          background: over ? "#C0785A" : color,
          "--pct": `${pct}%`
        }} />
      </div>
      <div className="budget-pct">{pct.toFixed(0)}% used</div>
    </div>
  );
}

export default function InsightsPage() {
  const { transactions } = useApp();
  const [budgetMonth, setBudgetMonth] = useState("2025-04");

  const topCat = getHighestSpendingCategory(transactions);
  const cats = getSpendingByCategory(transactions);

  // Month-over-month: use static MONTHLY_SPENDING so it always has data
  const monthCompData = MONTHS.map(({ key, label }) => {
    const spending = MONTHLY_SPENDING[key] || {};
    const total = Object.values(spending).reduce((s, v) => s + v, 0);
    return { month: label.split(" ")[0], amount: total };
  });

  const investment = cats.find((c) => c.name === "Investment");
  const spending = MONTHLY_SPENDING[budgetMonth] || {};

  return (
    <div className="page">
      <div className="insights-grid">
        {/* Callouts */}
        <div className="insights-callouts">
          <h3 className="section-title">Key Observations</h3>
          {topCat && (
            <InsightCallout
              icon={TrendingDown}
              text={`Highest spend category overall is ${topCat.name} at ${formatCurrency(topCat.value)} across all recorded months.`}
              accent={topCat.color}
            />
          )}
          <InsightCallout
            icon={TrendingUp}
            text={`April spending is up vs March. Rent and Entertainment are the primary drivers of the increase.`}
            accent="#5A8FE8"
          />
          {investment && (
            <InsightCallout
              icon={TrendingUp}
              text={`${formatCurrency(investment.value)} was directed into investments this period — a positive habit.`}
              accent="#4EAA78"
            />
          )}
        </div>

        {/* Month-over-month bar chart */}
        <div className="chart-card">
          <div className="chart-header">
            <h3 className="chart-title">Monthly Expenses Trend</h3>
            <span className="chart-badge">Jan – Apr</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={monthCompData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--grid-color)" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: "var(--text-muted)", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false}
                tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
              <Tooltip
                formatter={(v) => [formatCurrency(v), "Expenses"]}
                contentStyle={{ background: "var(--indigo)", border: "none", borderRadius: 8, color: "var(--cream)", fontSize: 12 }}
              />
              <Bar dataKey="amount" radius={[5, 5, 0, 0]}>
                {monthCompData.map((entry, i) => (
                  <Cell key={i} fill={i === monthCompData.length - 1 ? "#C0785A" : "var(--indigo-lighter)"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Budget progress with month selector */}
        <div className="chart-card budget-card">
          <div className="chart-header">
            <h3 className="chart-title">Budget Progress</h3>
            <select
              className="budget-month-select"
              value={budgetMonth}
              onChange={(e) => setBudgetMonth(e.target.value)}
            >
              {MONTHS.map(({ key, label }) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
          <div className="budget-list">
            {Object.entries(CATEGORY_BUDGETS).map(([cat, budget]) => (
              <BudgetBar key={cat} category={cat} spent={spending[cat] || 0} budget={budget} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}