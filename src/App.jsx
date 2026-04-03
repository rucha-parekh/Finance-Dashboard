import React, { useEffect } from "react";
import { AppProvider, useApp } from "./context/AppContext";
import Navbar from "./components/Navbar";
import DashboardPage from "./components/DashboardPage";
import TransactionsPage from "./components/TransactionsPage";
import InsightsPage from "./components/InsightsPage";
import { LayoutDashboard, ArrowLeftRight, Lightbulb } from "lucide-react";
import "./index.css";

const MOBILE_NAV = [
  { id: "dashboard", label: "Overview", icon: LayoutDashboard },
  { id: "transactions", label: "Transactions", icon: ArrowLeftRight },
  { id: "insights", label: "Insights", icon: Lightbulb },
];

function AppContent() {
  const { activeTab, setActiveTab, darkMode } = useApp();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  return (
    <div className="app-shell">
      <Navbar />
      <main className="main-content">
        {activeTab === "dashboard"     && <DashboardPage />}
        {activeTab === "transactions"  && <TransactionsPage />}
        {activeTab === "insights"      && <InsightsPage />}
      </main>

      {/* Mobile bottom nav */}
      <nav className="mobile-nav">
        {MOBILE_NAV.map(({ id, label, icon: Icon }) => (
          <button key={id} className={`mobile-nav-btn ${activeTab === id ? "active" : ""}`}
            onClick={() => setActiveTab(id)}>
            <Icon size={20} />
            {label}
          </button>
        ))}
      </nav>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
