import React, { useState, useRef, useEffect } from "react";
import { Sun, Moon, LayoutDashboard, ArrowLeftRight, Lightbulb, ShieldCheck, Eye } from "lucide-react";
import { useApp } from "../context/AppContext";

const NAV_ITEMS = [
  { id: "dashboard",    label: "Overview",      icon: LayoutDashboard },
  { id: "transactions", label: "Transactions",  icon: ArrowLeftRight  },
  { id: "insights",     label: "Insights",      icon: Lightbulb       },
];

export default function Navbar() {
  const { role, setRole, darkMode, setDarkMode, activeTab, setActiveTab } = useApp();
  const [roleOpen, setRoleOpen] = useState(false);
  const roleRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => { if (roleRef.current && !roleRef.current.contains(e.target)) setRoleOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const roles = [
    { value: "admin",  label: "Admin",  icon: ShieldCheck },
    { value: "viewer", label: "Viewer", icon: Eye         },
  ];

  const current = roles.find((r) => r.value === role);

  return (
    <nav className="navbar">
      {/* Brand */}
      <div className="navbar-brand">
        <span className="brand-icon">₹</span>
        <span className="brand-name">FinFlow</span>
      </div>

      {/* Nav tabs — centred */}
      <div className="navbar-tabs">
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            className={`nav-tab ${activeTab === id ? "active" : ""}`}
            onClick={() => setActiveTab(id)}
          >
            <Icon size={14} />
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* Actions */}
      <div className="navbar-actions">
        {/* Custom role dropdown */}
        <div className="role-dropdown" ref={roleRef}>
          <button className="role-trigger" onClick={() => setRoleOpen((o) => !o)}>
            <current.icon size={13} />
            <span>{current.label}</span>
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ marginLeft: 2, opacity: 0.6 }}>
              <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
          {roleOpen && (
            <div className="role-menu">
              {roles.map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  className={`role-option ${role === value ? "selected" : ""}`}
                  onClick={() => { setRole(value); setRoleOpen(false); }}
                >
                  <Icon size={13} />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Dark mode toggle */}
        <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)} aria-label="Toggle dark mode">
          <span className={`toggle-track ${darkMode ? "dark" : "light"}`}>
            <span className="toggle-thumb">
              {darkMode ? <Moon size={10} /> : <Sun size={10} />}
            </span>
          </span>
        </button>

        {/* User chip */}
        <div className="user-chip">
          <span className="user-avatar">{role === "admin" ? "A" : "V"}</span>
          <span className="user-label">{role === "admin" ? "Admin" : "Viewer"}</span>
        </div>
      </div>
    </nav>
  );
}