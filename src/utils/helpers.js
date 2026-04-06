import { CATEGORIES } from "../data/mockData";

// ─── Formatting ───────────────────────────────────────────────
export const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);

export const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
};

// ─── Aggregations ─────────────────────────────────────────────
export const getTotals = (txns) => {
  const income = txns.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const expenses = txns.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  return { income, expenses, balance: income - expenses };
};

export const getSpendingByCategory = (txns) => {
  const map = {};
  txns
    .filter((t) => t.type === "expense")
    .forEach((t) => {
      map[t.category] = (map[t.category] || 0) + t.amount;
    });
  return Object.entries(map).map(([name, value]) => ({
    name,
    value,
    color: CATEGORIES[name]?.color || "#999",
    icon: CATEGORIES[name]?.icon || "💰",
  }));
};

export const getHighestSpendingCategory = (txns) => {
  const cats = getSpendingByCategory(txns);
  if (!cats.length) return null;
  return cats.reduce((a, b) => (a.value > b.value ? a : b));
};

export const getMonthlyComparison = (txns) => {
  const dates = txns.map((t) => t.date).sort();
  if (!dates.length) return { thisExp: 0, lastExp: 0, thisInc: 0, lastInc: 0, expDelta: 0, incDelta: 0 };

  const latest = new Date(dates[dates.length - 1]);
  const latestYear = latest.getFullYear();
  const latestMonth = latest.getMonth();
  const prevDate = new Date(latestYear, latestMonth - 1, 1);

  const thisMonth = txns.filter((t) => {
    const d = new Date(t.date);
    return d.getMonth() === latestMonth && d.getFullYear() === latestYear;
  });
  const lastMonth = txns.filter((t) => {
    const d = new Date(t.date);
    return d.getMonth() === prevDate.getMonth() && d.getFullYear() === prevDate.getFullYear();
  });

  const thisExp = getTotals(thisMonth).expenses;
  const lastExp = getTotals(lastMonth).expenses;
  const thisInc = getTotals(thisMonth).income;
  const lastInc = getTotals(lastMonth).income;

  const expDelta = lastExp > 0 ? Math.round(((thisExp - lastExp) / lastExp) * 100) : 0;
  const incDelta = lastInc > 0 ? Math.round(((thisInc - lastInc) / lastInc) * 100) : 0;

  return { thisExp, lastExp, thisInc, lastInc, expDelta, incDelta };
};

export const getHeatmapData = (txns) => {
  const map = {};
  txns
    .filter((t) => t.type === "expense")
    .forEach((t) => {
      map[t.date] = (map[t.date] || 0) + t.amount;
    });
  return map;
};

// ─── Filtering & Sorting ──────────────────────────────────────
export const filterTransactions = (txns, { search, category, type, sortBy, sortDir }) => {
  let result = [...txns];

  // Smart search: "food last month", "expenses over 500"
if (search) {
  const q = search.toLowerCase();
  const overMatch = q.match(/over[^\d]*(\d+)/);
  const catMatch = Object.keys(CATEGORIES).find((c) => q.includes(c.toLowerCase()));
  const isExpense = q.includes("expense");
  const isIncome = q.includes("income");

  if (overMatch) {
    const threshold = parseInt(overMatch[1]);
    result = result.filter((t) => {
      const amountMatch = t.amount > threshold;
      const typeMatch = isExpense ? t.type === "expense" : isIncome ? t.type === "income" : true;
      const catFilter = catMatch ? t.category === catMatch : true;
      return amountMatch && typeMatch && catFilter;
    });
  } else if (catMatch && q.includes("last month")) {
    const dates = [...transactions].map((t) => t.date).sort();
    const latest = new Date(dates[dates.length - 1]);
    const prev = new Date(latest.getFullYear(), latest.getMonth() - 1, 1);
    result = result.filter((t) => {
      const d = new Date(t.date);
      return t.category === catMatch && d.getMonth() === prev.getMonth();
    });
  } else if (catMatch) {
    result = result.filter((t) => t.category === catMatch);
  } else if (isExpense) {
    result = result.filter((t) => t.type === "expense");
  } else if (isIncome) {
    result = result.filter((t) => t.type === "income");
  } else {
    result = result.filter(
      (t) =>
        t.description.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q)
    );
  }
}

  if (category && category !== "All") result = result.filter((t) => t.category === category);
  if (type && type !== "All") result = result.filter((t) => t.type === type);

  if (sortBy) {
    result.sort((a, b) => {
      const aVal = sortBy === "date" ? new Date(a.date) : a.amount;
      const bVal = sortBy === "date" ? new Date(b.date) : b.amount;
      return sortDir === "asc" ? aVal - bVal : bVal - aVal;
    });
  }

  return result;
};

// ─── CSV Export ───────────────────────────────────────────────
export const exportToCSV = (txns) => {
  const headers = ["Date", "Description", "Category", "Type", "Amount (₹)"];
  const rows = txns.map((t) => [t.date, t.description, t.category, t.type, t.amount]);
  const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "transactions.csv";
  a.click();
  URL.revokeObjectURL(url);
};

// ─── localStorage helpers ─────────────────────────────────────
export const saveToStorage = (key, val) => {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
};
export const loadFromStorage = (key, fallback) => {
  try {
    const s = localStorage.getItem(key);
    return s !== null ? JSON.parse(s) : fallback;
  } catch { return fallback; }
};

// ─── JSON Export ──────────────────────────────────────────────
export const exportToJSON = (txns) => {
  const blob = new Blob([JSON.stringify(txns, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "transactions.json";
  a.click();
  URL.revokeObjectURL(url);
};

// ─── Spending by category for a specific "YYYY-MM" month ──────
export const getSpendingForMonth = (txns, yearMonth) => {
  return txns
    .filter((t) => t.type === "expense" && t.date.startsWith(yearMonth))
    .reduce((map, t) => {
      map[t.category] = (map[t.category] || 0) + t.amount;
      return map;
    }, {});
};