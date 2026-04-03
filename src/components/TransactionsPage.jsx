import React, { useState } from "react";
import { Search, Download, Plus, ChevronUp, ChevronDown, Trash2, Edit2, X } from "lucide-react";
import { useApp } from "../context/AppContext";
import { filterTransactions, formatCurrency, formatDate} from "../utils/helpers";
import { CATEGORIES } from "../data/mockData";
import TransactionDrawer from "./TransactionDrawer";
import TransactionForm from "./TransactionForm";
import { exportToCSV, exportToJSON } from "../utils/helpers";

const SORT_FIELDS = [
  { value: "date", label: "Date" },
  { value: "amount", label: "Amount" },
];

export default function TransactionsPage() {
  const { transactions, filters, setFilters, role, setDrawerTxn, deleteTransaction } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editTxn, setEditTxn] = useState(null);

  const filtered = filterTransactions(transactions, filters);

  const toggleSort = (field) => {
    setFilters((f) => ({
      ...f,
      sortBy: field,
      sortDir: f.sortBy === field && f.sortDir === "desc" ? "asc" : "desc",
    }));
  };

  const SortIcon = ({ field }) => {
    if (filters.sortBy !== field) return null;
    return filters.sortDir === "asc" ? <ChevronUp size={13} /> : <ChevronDown size={13} />;
  };

  return (
    <div className="page">
      {/* Toolbar */}
      <div className="txn-toolbar">
        <div className="search-wrap">
          <Search size={15} className="search-icon" />
          <input
            className="search-input"
            placeholder='Search or try "food last month", "expenses over 1000"…'
            value={filters.search}
            onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
          />
          {filters.search && (
            <button className="search-clear" onClick={() => setFilters((f) => ({ ...f, search: "" }))}>
              <X size={13} />
            </button>
          )}
        </div>

        <div className="filter-row">
          <select className="filter-select" value={filters.category}
            onChange={(e) => setFilters((f) => ({ ...f, category: e.target.value }))}>
            <option value="All">All Categories</option>
            {Object.keys(CATEGORIES).map((c) => (
              <option key={c} value={c}>{CATEGORIES[c].icon} {c}</option>
            ))}
          </select>

          <select className="filter-select" value={filters.type}
            onChange={(e) => setFilters((f) => ({ ...f, type: e.target.value }))}>
            <option value="All">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>

          <div className="export-group">
            <button className="btn-icon" onClick={() => exportToCSV(filtered)} title="Export CSV">
              <Download size={14} /> <span>CSV</span>
            </button>
            <button className="btn-icon" onClick={() => exportToJSON(filtered)} title="Export JSON">
              <Download size={14} /> <span>JSON</span>
            </button>
          </div>

          {role === "admin" && (
            <button className="btn-primary" onClick={() => { setEditTxn(null); setShowForm(true); }}>
              <Plus size={15} /> Add
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="txn-table-wrap">
        {filtered.length === 0 ? (
          <div className="empty-state">
            <span className="empty-emoji">🔍</span>
            <p>No transactions match your filters.</p>
            <button className="btn-secondary" onClick={() => setFilters({ search: "", category: "All", type: "All", sortBy: "date", sortDir: "desc" })}>
              Clear filters
            </button>
          </div>
        ) : (
          <table className="txn-table">
            <thead>
              <tr>
                <th className="th-sortable" onClick={() => toggleSort("date")}>
                  Date <SortIcon field="date" />
                </th>
                <th>Description</th>
                <th>Category</th>
                <th>Type</th>
                <th className="th-sortable th-right" onClick={() => toggleSort("amount")}>
                  Amount <SortIcon field="amount" />
                </th>
                {role === "admin" && <th className="th-right">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filtered.map((txn) => (
                <tr key={txn.id} className="txn-row" onClick={() => setDrawerTxn(txn)}>
                  <td className="td-date">{formatDate(txn.date)}</td>
                  <td className="td-desc">{txn.description}</td>
                  <td>
                    <span className="cat-chip" style={{ "--cat-color": CATEGORIES[txn.category]?.color || "#999" }}>
                      {CATEGORIES[txn.category]?.icon} {txn.category}
                    </span>
                  </td>
                  <td>
                    <span className={`type-badge ${txn.type}`}>{txn.type}</span>
                  </td>
                  <td className={`td-amount ${txn.type}`}>
                    {txn.type === "expense" ? "−" : "+"}{formatCurrency(txn.amount)}
                  </td>
                  {role === "admin" && (
                    <td className="td-actions" onClick={(e) => e.stopPropagation()}>
                      <button className="action-btn" onClick={() => { setEditTxn(txn); setShowForm(true); }}>
                        <Edit2 size={13} />
                      </button>
                      <button className="action-btn danger" onClick={() => deleteTransaction(txn.id)}>
                        <Trash2 size={13} />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="txn-footer">Showing {filtered.length} of {transactions.length} transactions</div>

      <TransactionDrawer />
      {showForm && <TransactionForm txn={editTxn} onClose={() => setShowForm(false)} />}
    </div>
  );
}
