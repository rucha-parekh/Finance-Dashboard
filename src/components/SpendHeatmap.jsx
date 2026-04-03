import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { getHeatmapData, formatCurrency } from "../utils/helpers";

const MONTHS = [
  { key: "2025-01", label: "Jan 2025", days: 31, startDow: 3 },
  { key: "2025-02", label: "Feb 2025", days: 28, startDow: 6 },
  { key: "2025-03", label: "Mar 2025", days: 31, startDow: 6 },
  { key: "2025-04", label: "Apr 2025", days: 30, startDow: 2 },
];

export default function SpendHeatmap() {
  const { transactions } = useApp();
  const [selectedMonth, setSelectedMonth] = useState("2025-04");
  const [tooltip, setTooltip] = useState(null); // { text, x, y }

  const heatmap = getHeatmapData(transactions);
  const monthMeta = MONTHS.find((m) => m.key === selectedMonth);

  const cells = [];
  for (let i = 0; i < monthMeta.startDow; i++) cells.push({ date: null, amount: 0 });
  for (let d = 1; d <= monthMeta.days; d++) {
    const dateStr = `${selectedMonth}-${String(d).padStart(2, "0")}`;
    cells.push({ date: dateStr, amount: heatmap[dateStr] || 0 });
  }

  const max = Math.max(...cells.map((c) => c.amount), 1);
  const getIntensity = (amt) => {
    if (!amt) return 0;
    const r = amt / max;
    if (r < 0.25) return 1;
    if (r < 0.5) return 2;
    if (r < 0.75) return 3;
    return 4;
  };

  return (
    <div className="chart-card heatmap-card" style={{ position: "relative" }}>
      <div className="chart-header">
        <h3 className="chart-title">Daily Spend Heatmap</h3>
        <select
          className="budget-month-select"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        >
          {MONTHS.map(({ key, label }) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
      </div>

      <div className="heatmap-grid-wrap" style={{ position: "relative" }}>
        <div className="heatmap-days-label">
          {["", "Mon", "", "Wed", "", "Fri", ""].map((d, i) => (
            <span key={i} className="heatmap-day-label">{d}</span>
          ))}
        </div>
        <div className="heatmap-grid">
          {cells.map((cell, i) => (
            <div
              key={i}
              className={`heatmap-cell intensity-${getIntensity(cell.amount)} ${!cell.date ? "empty" : ""}`}
              onMouseEnter={(e) => {
                if (!cell.date) return;
                const rect = e.currentTarget.getBoundingClientRect();
                const parentRect = e.currentTarget.closest(".chart-card").getBoundingClientRect();
                setTooltip({
                  text: `${cell.date}: ${formatCurrency(cell.amount)}`,
                  x: rect.left - parentRect.left + rect.width / 2,
                  y: rect.top - parentRect.top - 10,
                });
              }}
              onMouseLeave={() => setTooltip(null)}
            >
              {cell.date && (
                <span className="heatmap-cell-day">{parseInt(cell.date.split("-")[2])}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Custom tooltip — renders inside card so it's never clipped */}
      {tooltip && (
        <div
          className="heatmap-tooltip"
          style={{ left: tooltip.x, top: tooltip.y }}
        >
          {tooltip.text}
        </div>
      )}

      <div className="heatmap-legend">
        <span className="legend-text-sm">Less</span>
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className={`heatmap-cell intensity-${i}`} style={{ width: 14, height: 14 }} />
        ))}
        <span className="legend-text-sm">More</span>
      </div>
    </div>
  );
}