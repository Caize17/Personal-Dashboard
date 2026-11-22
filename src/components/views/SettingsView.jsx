import React from 'react';
import {
  Download,
  Upload,
  RotateCcw,
  Palette,
  Database,
  Check,
  AlertTriangle,
  BellRing,
  CheckCircle2
} from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';

export default function SettingsView() {
  const {
    data,
    setTheme,
    resetToDemo,
    exportJSON,
    importJSON,
    nativeNotifStatus,
    enableNativeNotifications
  } = useDashboard();

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      importJSON(event.target.result);
    };
    reader.readAsText(file);
  };

  const currentTheme = data.settings?.theme || 'ethereal-glass';

  const themes = [
    {
      id: 'ethereal-glass',
      name: 'Ethereal Glass',
      tag: 'Lavender & Violet',
      desc: 'Dreamy frosted glass with pastel periwinkle and soft amethyst ambient glow.',
      swatch: 'linear-gradient(135deg, #8b5cf6, #ec4899, #38bdf8)'
    },
    {
      id: 'classic-blue',
      name: 'Soft Sky Blue',
      tag: 'Crisp & Airy',
      desc: 'Light sky-blue aesthetic with high-contrast white rounded cards and cobalt accents.',
      swatch: 'linear-gradient(135deg, #0284c7, #38bdf8, #bae6fd)'
    },
    {
      id: 'midnight-aurora',
      name: 'Midnight Aurora',
      tag: 'Dark Obsidian',
      desc: 'Deep obsidian glass backdrop accented with neon violet and vivid cyan highlights.',
      swatch: 'linear-gradient(135deg, #0f172a, #6366f1, #06b6d4)'
    }
  ];

  return (
    <div className="view-container">
      <div style={{ maxWidth: '880px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: '22px' }}>
        
        {/* Header Title & Subtext */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h2 className="welcome-title">Settings & Preferences</h2>
            <p className="welcome-sub">
              Customize visual color themes and manage dashboard data backups
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span className="badge" style={{ padding: '6px 12px', fontSize: '11.5px', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--accent-primary)', border: '1px solid var(--glass-border)' }}>
              Theme: {currentTheme.replace('-', ' ')}
            </span>
          </div>
        </div>

        {/* 1. APPEARANCE & THEMES */}
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: 'rgba(139, 92, 246, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8b5cf6' }}>
                <Palette size={18} />
              </div>
              <div>
                <h3 className="section-title" style={{ fontSize: '16px' }}>Visual Color Theme</h3>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  Switch the overall color palette, glass transparency, and ambient background lighting
                </p>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
            {themes.map((t) => {
              const isSelected = currentTheme === t.id;
              return (
                <div
                  key={t.id}
                  className="glass-card"
                  style={{
                    cursor: 'pointer',
                    borderRadius: '16px',
                    padding: '16px',
                    position: 'relative',
                    border: isSelected ? '2px solid var(--accent-primary)' : '1px solid var(--glass-border)',
                    background: isSelected ? 'var(--glass-card-hover)' : 'var(--glass-card)',
                    transition: 'all 0.2s ease',
                    boxShadow: isSelected ? '0 8px 24px -4px rgba(99, 102, 241, 0.25)' : undefined
                  }}
                  onClick={() => setTheme(t.id)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <div style={{ width: '32px', height: '18px', borderRadius: '6px', background: t.swatch }} />
                    {isSelected ? (
                      <span className="badge" style={{ background: 'var(--accent-primary)', color: '#fff', fontSize: '10.5px', padding: '2px 8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Check size={11} strokeWidth={3} />
                        Active
                      </span>
                    ) : (
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{t.tag}</span>
                    )}
                  </div>

                  <div style={{ fontWeight: 700, fontSize: '14px', marginBottom: '4px', color: 'var(--text-main)' }}>
                    {t.name}
                  </div>
                  <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', lineHeight: '1.45' }}>
                    {t.desc}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. NATIVE DESKTOP NOTIFICATIONS */}
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-primary)' }}>
                <BellRing size={18} />
              </div>
              <div>
                <h3 className="section-title" style={{ fontSize: '16px' }}>Native OS Notifications</h3>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  Receive system desktop alerts for tasks and assignments due today or overdue
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              {nativeNotifStatus === 'granted' ? (
                <span className="badge" style={{ padding: '6px 14px', fontSize: '11.5px', background: 'rgba(16, 185, 129, 0.12)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <CheckCircle2 size={13} /> Active
                </span>
              ) : (
                <button className="btn-primary" onClick={enableNativeNotifications} style={{ padding: '7px 16px', fontSize: '12.5px' }}>
                  <BellRing size={14} />
                  <span>Enable Notifications</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 3. DATA BACKUP & RESET */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
              <Database size={18} />
            </div>
            <div>
              <h3 className="section-title" style={{ fontSize: '16px' }}>Data Management & Backups</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Export full dashboard JSON backups, restore previous snapshots, or reset to factory demo state
              </p>
            </div>
          </div>

          {/* Backup & Restore Action Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px', marginBottom: '20px' }}>
            <button
              className="btn-secondary"
              style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              onClick={exportJSON}
            >
              <Download size={16} color="var(--accent-primary)" />
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: 600, fontSize: '13px' }}>Export Backup (JSON)</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Download your data locally</div>
              </div>
            </button>

            <label
              className="btn-secondary"
              style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}
            >
              <Upload size={16} color="#0284c7" />
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: 600, fontSize: '13px' }}>Restore / Import JSON</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Upload previously saved file</div>
              </div>
              <input type="file" accept=".json" onChange={handleFileUpload} style={{ display: 'none' }} />
            </label>
          </div>

          {/* Danger Zone: Reset Data */}
          <div style={{ padding: '16px', borderRadius: '14px', background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <AlertTriangle size={18} color="#e11d48" />
                <div>
                  <div style={{ fontWeight: 600, fontSize: '13.5px', color: '#e11d48' }}>Reset Demo Data</div>
                  <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                    Replaces all customized records with fresh default sample data
                  </div>
                </div>
              </div>

              <button
                className="btn-secondary"
                style={{ color: '#e11d48', borderColor: 'rgba(239, 68, 68, 0.3)', gap: '6px' }}
                onClick={() => {
                  if (window.confirm('Are you sure you want to reset all dashboard items to default demo data? This cannot be undone.')) {
                    resetToDemo();
                  }
                }}
              >
                <RotateCcw size={14} />
                <span>Reset to Default</span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
