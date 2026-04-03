import React, { createContext, useContext, useState, useEffect } from "react";
import { transactions as initialTxns } from "../data/mockData";
import { saveToStorage, loadFromStorage } from "../utils/helpers";

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [transactions, setTransactions] = useState(() =>
    loadFromStorage("fd_transactions", initialTxns)
  );
  const [role, setRole] = useState(() => loadFromStorage("fd_role", "admin"));
  const [darkMode, setDarkMode] = useState(() => loadFromStorage("fd_dark", false));
  const [filters, setFilters] = useState(() =>
    loadFromStorage("fd_filters", { search: "", category: "All", type: "All", sortBy: "date", sortDir: "desc" })
  );
  const [activeTab, setActiveTab] = useState("dashboard");
  const [drawerTxn, setDrawerTxn] = useState(null);

  useEffect(() => { saveToStorage("fd_transactions", transactions); }, [transactions]);
  useEffect(() => { saveToStorage("fd_role", role); }, [role]);
  useEffect(() => { saveToStorage("fd_dark", darkMode); }, [darkMode]);
  useEffect(() => { saveToStorage("fd_filters", filters); }, [filters]);

  const addTransaction = (txn) => {
    setTransactions((prev) => [{ ...txn, id: Date.now() }, ...prev]);
  };
  const editTransaction = (updated) => {
    setTransactions((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
  };
  const deleteTransaction = (id) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <AppContext.Provider value={{
      transactions, role, setRole, darkMode, setDarkMode,
      filters, setFilters, activeTab, setActiveTab,
      drawerTxn, setDrawerTxn,
      addTransaction, editTransaction, deleteTransaction,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
