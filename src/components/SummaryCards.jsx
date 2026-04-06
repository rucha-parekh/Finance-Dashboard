import React from "react";
import { Wallet, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { useApp } from "../context/AppContext";
import { getTotals, formatCurrency, getMonthlyComparison } from "../utils/helpers";
import { useCountUp } from "../hooks/useCountUp";

function StatCard({ label, amount, icon: Icon, accent, delta, lastAmount, period }) {
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
      {lastAmount !== undefined && (
        <div className="stat-subtitle">
          {period} · prev. {formatCurrency(lastAmount)}
        </div>
      )}
      <div className="stat-shine" />
    </div>
  );
}

export default function SummaryCards() {
  const { transactions } = useApp();
  const { income, expenses, balance } = getTotals(transactions);
  const { thisExp, lastExp, thisInc, lastInc, expDelta, incDelta } = getMonthlyComparison(transactions);

  return (
    <div className="summary-cards">
      <StatCard
        label="Net Balance"
        amount={balance}
        icon={Wallet}
        accent="#4EAA78"
        subtitle="All time"
      />
      <StatCard
        label="Income · Apr 2025"
        amount={thisInc}
        icon={TrendingUp}
        accent="#5A8FE8"
        delta={incDelta}
        lastAmount={lastInc}
        period="Apr 2025"
      />
      <StatCard
        label="Expenses · Apr 2025"
        amount={thisExp}
        icon={TrendingDown}
        accent="#C0785A"
        delta={expDelta}
        lastAmount={lastExp}
        period="Apr 2025"
      />
    </div>
  );
}