import React from "react";
import { Wallet, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { useApp } from "../context/AppContext";
import { getTotals, formatCurrency, getMonthlyComparison } from "../utils/helpers";
import { useCountUp } from "../hooks/useCountUp";

function StatCard({ label, amount, icon: Icon, accent, delta, subtitle }) {
  const animated = useCountUp(amount, 1400);

  return (
    <div className="stat-card" style={{ "--accent": accent }}>
      <div className="stat-card-header">
        <div className="stat-icon" style={{ background: accent + "22" }}>
          <Icon size={18} style={{ color: accent }} />
        </div>
        {delta !== undefined && (
          <span className={`delta-badge ${delta >= 0 ? "up" : "down"}`}>
            {delta >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
            {Math.abs(delta)}%
          </span>
        )}
      </div>
      <div className="stat-amount">{formatCurrency(animated)}</div>
      <div className="stat-label">{label}</div>
      {subtitle && <div className="stat-subtitle">{subtitle}</div>}
      <div className="stat-shine" />
    </div>
  );
}

export default function SummaryCards() {
  const { transactions } = useApp();
  const { income, expenses, balance } = getTotals(transactions);
  const { delta } = getMonthlyComparison(transactions);

  return (
    <div className="summary-cards">
      <StatCard
        label="Total Balance"
        amount={balance}
        icon={Wallet}
        accent="#5ACA8A"
        subtitle="Net this period"
      />
      <StatCard
        label="Total Income"
        amount={income}
        icon={TrendingUp}
        accent="#5A8FE8"
        delta={8}
        subtitle="vs last month"
      />
      <StatCard
        label="Total Expenses"
        amount={expenses}
        icon={TrendingDown}
        accent="#E8715A"
        delta={delta}
        subtitle="vs last month"
      />
    </div>
  );
}
