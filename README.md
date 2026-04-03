# FinFlow — Finance Dashboard

A clean, interactive personal finance dashboard built with React. Features animated counters, role-based UI, smart search, spend heatmap, dark mode, and more.

---

## 🚀 Quick Start

### Prerequisites
- Node.js **v16+** (check with `node -v`)
- npm **v7+** (check with `npm -v`)

### Installation & Run

```bash
# 1. Navigate into the project
cd finance-dashboard

# 2. Install dependencies
npm install

# 3. Start the development server
npm start
```

The app opens at **http://localhost:3000** automatically.

### Build for Production
```bash
npm run build
```
Output goes to the `/build` folder — ready to deploy on Vercel, Netlify, or any static host.

---

## 📁 Project Structure

```
finance-dashboard/
├── public/
│   └── index.html              # HTML shell
├── src/
│   ├── index.js                # React entry point
│   ├── App.jsx                 # Root component + page routing
│   ├── index.css               # Global styles, CSS variables, animations
│   │
│   ├── context/
│   │   └── AppContext.jsx      # Global state (transactions, role, filters, dark mode)
│   │
│   ├── hooks/
│   │   └── useCountUp.js       # Animated number counter hook
│   │
│   ├── data/
│   │   └── mockData.js         # Mock transactions, categories, budgets, monthly trend
│   │
│   ├── utils/
│   │   └── helpers.js          # Formatting, filtering, aggregations, CSV export, localStorage
│   │
│   └── components/
│       ├── Navbar.jsx           # Top nav with role switcher + dark mode toggle
│       ├── DashboardPage.jsx    # Overview tab layout
│       ├── SummaryCards.jsx     # Balance / Income / Expense cards with animated counters
│       ├── BalanceTrendChart.jsx # Animated area chart (4-month trend)
│       ├── SpendingBreakdown.jsx # Donut chart with category legend
│       ├── SpendHeatmap.jsx     # GitHub-style daily spend heatmap
│       ├── TransactionsPage.jsx # Transactions tab with search, filter, sort, export
│       ├── TransactionDrawer.jsx # Slide-in detail drawer on row click
│       ├── TransactionForm.jsx  # Add/Edit modal (Admin only)
│       └── InsightsPage.jsx    # Insights tab: callouts, monthly comparison, budget bars
├── package.json
└── README.md
```

---

## ✨ Features

### Dashboard Overview
- **Animated number counters** — summary cards count up to their values on load (easeOut cubic)
- **Delta badges** — "+8% vs last month" on income/expense cards
- **Balance Trend Chart** — animated area chart showing 4-month income/expenses/balance
- **Spending Breakdown** — animated donut chart with percentage legend
- **Daily Spend Heatmap** — GitHub-style calendar grid for April, hover reveals exact amount

### Transactions
- **Smart search** — understands queries like `food last month`, `expenses over 1000`, or plain text
- **Filters** — by category and type (income/expense)
- **Sorting** — click Date or Amount column headers to toggle asc/desc
- **Slide-in drawer** — click any row to open a detail panel without leaving the page
- **CSV export** — downloads currently filtered transactions
- **Empty state** — friendly message + clear filters button when nothing matches

### Role-Based UI
- **Admin** — can add, edit, and delete transactions; form modal appears with validation
- **Viewer** — read-only; add/edit/delete buttons are hidden entirely
- Switch roles via the dropdown in the navbar — UI transitions smoothly

### Insights
- **Key Observations** — colour-coded callout cards for top spend category, month-over-month delta, and investment habit
- **Month-over-Month Bar Chart** — visual comparison of this month vs last month expenses
- **Budget Progress Bars** — animated fill bars per category, turns red if over budget

### UX & Polish
- **Dark mode** — animated sun/moon toggle, persists across sessions via localStorage
- **Persistent state** — filters, role, dark mode, and transactions all saved to localStorage
- **Skeleton animations** — cards fade and slide up on load with staggered delays
- **Responsive** — mobile bottom nav bar, stacked layouts on small screens
- **Color-coded categories** — consistent color + emoji icon for each category throughout the app

---

## 🎨 Design System

| Token | Value |
|-------|-------|
| Primary background | `#F0E7D5` (Vanilla Cream) |
| Primary text / nav | `#212842` (Midnight Indigo) |
| Income accent | `#5ACA8A` |
| Expense accent | `#E8715A` |
| Display font | Libre Baskerville (serif) |
| UI font | Montserrat (sans-serif) |

---

## 🔧 Assumptions & Approach

- All data is mock/static — no backend required
- Transactions are scoped to early 2025 for realistic mock data
- Role switching is frontend-only for demonstration purposes
- Smart search uses simple pattern matching (no NLP library needed)
- localStorage is used for persistence — clearing browser storage resets to defaults

---

## 📦 Dependencies

| Package | Purpose |
|---------|---------|
| `react` / `react-dom` | UI framework |
| `recharts` | Charts (AreaChart, PieChart, BarChart) |
| `lucide-react` | Icon set |
