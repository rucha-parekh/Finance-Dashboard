import React from "react";
import { Wallet, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { useApp } from "../context/AppContext";
import { getTotals, formatCurrency, getMonthlyComparison } from "../utils/helpers";
import { useCountUp } from "../hooks/useCountUp";

function StatCard({ label, amount, icon: Icon, accent, delta, lastMonthAmount }) {
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
      {lastMonthAmount !== undefined && (
        <div className="stat-subtitle">
          Last month: {formatCurrency(lastMonthAmount)}
        </div>
      )}
      <div className="stat-shine" />
    </div>
  );
}

export default function SummaryCards() {
  const { transactions } = useApp();
  const { income, expenses, balance } = getTotals(transactions);
  const { thisExp, lastExp, delta } = getMonthlyComparison(transactions);

  return (
    <div className="summary-cards">
      <StatCard label="Total Balance" amount={balance} icon={Wallet} accent="#4EAA78" />
      <StatCard label="Total Income" amount={income} icon={TrendingUp} accent="#5A8FE8" delta={8} lastMonthAmount={95000} />
      <StatCard label="Total Expenses" amount={expenses} icon={TrendingDown} accent="#C0785A" delta={delta} lastMonthAmount={lastExp} />
    </div>
  );
}