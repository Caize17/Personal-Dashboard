import React from 'react';
import { Home, Shield, Wallet, GraduationCap, Settings } from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';

export default function Sidebar() {
  const { activeView, setActiveView, data } = useDashboard();

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'accounts', label: 'Accounts', icon: Shield },
    { id: 'finance', label: 'Finance', icon: Wallet },
    { id: 'academic', label: 'Academic', icon: GraduationCap }
  ];

  return (
    <aside className="sidebar">
      <div>
        <div className="sidebar-header">
          <div className="brand-header-flex">
            <span className="brand-emoji-logo" role="img" aria-label="dashboard logo">👾</span>
            <h1 className="brand-text">{data?.profile?.name?.trim() ? `${data.profile.name.trim()}’s` : 'My'}<br />Dashboard</h1>
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
                onClick={() => setActiveView(item.id)}
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
          onClick={() => setActiveView('settings')}
        >
          <Settings size={20} />
          <span>Settings</span>
        </button>
      </div>
    </aside>
  );
}
