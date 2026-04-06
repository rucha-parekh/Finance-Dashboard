import React from "react";
import { useApp } from "../context/AppContext";
import SummaryCards from "./SummaryCards";
import BalanceTrendChart from "./BalanceTrendChart";
import SpendingBreakdown from "./SpendingBreakdown";
import SpendHeatmap from "./SpendHeatmap";
import WeeklyExpenseChart from "./WeeklyExpenseChart";
import CategoryRankChart from "./RunningBalanceChart";

export default function DashboardPage() {
  const { role, setActiveTab } = useApp();

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Financial Overview</h1>
          {role === "admin" && (
            <p className="page-subtitle">
              You're in Admin mode —{" "}
              <button className="inline-link" onClick={() => setActiveTab("transactions")}>
                manage transactions
              </button>{" "}
              or{" "}
              <button className="inline-link" onClick={() => setActiveTab("insights")}>
                review budgets
              </button>
            </p>
          )}
          {role === "viewer" && (
            <p className="page-subtitle">Read-only view · Switch to Admin to edit data</p>
          )}
        </div>
        <div className="page-date">
          {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
        </div>
      </div>

      <SummaryCards />

      <div className="charts-row">
        <BalanceTrendChart />
        <SpendingBreakdown />
      </div>

      <div className="charts-row">
        <WeeklyExpenseChart />
        <CategoryRankChart />
      </div>

      <SpendHeatmap />
    </div>
  );
}