import React from 'react';
import { Home, Shield, Wallet, GraduationCap, Settings } from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';

export default function Sidebar() {
  const { activeView, setActiveView, data, isSidebarOpen, setIsSidebarOpen } = useDashboard();

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'accounts', label: 'Accounts', icon: Shield },
    { id: 'finance', label: 'Finance', icon: Wallet },
    { id: 'academic', label: 'Academic', icon: GraduationCap }
  ];

  const handleNavClick = (viewId) => {
    setActiveView(viewId);
    setIsSidebarOpen(false);
  };

  return (
    <>
      {/* Dimmed backdrop when slide-out drawer is open on narrow screens */}
      <div
        className={`sidebar-drawer-backdrop ${isSidebarOpen ? 'active' : ''}`}
        onClick={() => setIsSidebarOpen(false)}
        aria-hidden="true"
      />

      <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div>
          <div className="sidebar-header">
            <div className="brand-header-flex">
              <span className="brand-emoji-logo" role="img" aria-label="dashboard logo">👾</span>
              <h1 className="brand-text">
                {data?.profile?.name?.trim() ? `${data.profile.name.trim()}’s` : 'My'}<br />Dashboard
              </h1>
            </div>
          </div>

          <nav className="sidebar-nav">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;

              return (
                <button
                  key={item.id}
                  className={`nav-link ${isActive ? 'active' : ''}`}
                  onClick={() => handleNavClick(item.id)}
                  title={item.label}
                  aria-label={item.label}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="sidebar-footer">
          <button
            className={`nav-link ${activeView === 'settings' ? 'active' : ''}`}
            onClick={() => handleNavClick('settings')}
            title="Settings"
            aria-label="Settings"
          >
            <Settings size={20} />
            <span>Settings</span>
          </button>
        </div>
      </aside>
    </>
  );
}
