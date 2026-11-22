import React, { useState } from 'react';
import {
  Shield,
  Plus,
  Eye,
  EyeOff,
  Copy,
  ExternalLink,
  Trash2,
  Lock,
  Search,
  Pencil,
  X
} from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';

export default function AccountsView() {
  const {
    data,
    deleteVaultAccount,
    setActiveModal,
    showToast,
    searchQuery,
    addAccountCategory,
    removeAccountCategory
  } = useDashboard();

  const [activeCategory, setActiveCategory] = useState('all');
  const [isEditingCategories, setIsEditingCategories] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [revealedPasswords, setRevealedPasswords] = useState({});

  const categories = data.accountCategories || ['Academic', 'Finance', 'Dev', 'Design', 'Social', 'Entertainment', 'General'];

  const togglePasswordVisibility = (id) => {
    setRevealedPasswords((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    showToast(`Copied ${label} to clipboard! 📋`);
  };

  const handleAddCategory = (e) => {
    e.preventDefault();
    const trimmed = newCategoryName.trim();
    if (!trimmed) return;
    addAccountCategory(trimmed);
    setNewCategoryName('');
  };

  const handleRemoveCategory = (catName) => {
    if (activeCategory.toLowerCase() === catName.toLowerCase()) {
      setActiveCategory('all');
    }
    removeAccountCategory(catName);
  };

  const filteredAccounts = data.personalAccounts.filter((acc) => {
    if (activeCategory !== 'all' && acc.category?.toLowerCase() !== activeCategory.toLowerCase()) return false;
    if (
      searchQuery &&
      !acc.service.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !acc.username.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !acc.email.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="view-container">
      <div className="vault-header-row">
        <div>
          <h2 className="welcome-title">Accounts</h2>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button className="btn-primary" onClick={() => setActiveModal('vault-account')}>
            <Plus size={16} />
            <span>New Account</span>
          </button>
        </div>
      </div>

      {/* Category Pills & Edit Category Controls */}
      <div className="categories-header-bar">
        <div className="sub-nav-bar">
          <button
            className={`sub-nav-btn ${activeCategory === 'all' ? 'active' : ''}`}
            onClick={() => setActiveCategory('all')}
          >
            All Accounts ({data.personalAccounts.length})
          </button>
          {categories.map((cat) => {
            const count = data.personalAccounts.filter(
              (a) => a.category?.toLowerCase() === cat.toLowerCase()
            ).length;
            const isSelected = activeCategory.toLowerCase() === cat.toLowerCase();
            return (
              <button
                key={cat}
                className={`sub-nav-btn ${isSelected ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
                style={{ textTransform: 'capitalize' }}
              >
                <span>{cat}</span>
                {count > 0 && <span className="cat-count-pill">{count}</span>}
              </button>
            );
          })}
        </div>

        {/* Edit Categories Toggle Button with Pencil Icon */}
        <button
          className={`category-edit-toggle-btn ${isEditingCategories ? 'active' : ''}`}
          onClick={() => setIsEditingCategories(!isEditingCategories)}
          title={isEditingCategories ? 'Done editing categories' : 'Add or remove categories'}
        >
          <Pencil size={13} />
          <span>{isEditingCategories ? 'Done' : 'Edit Categories'}</span>
        </button>
      </div>

      {/* Category Management Drawer */}
      {isEditingCategories && (
        <div className="glass-card category-manager-panel">
          <div className="category-manager-header">
            <div>
              <h4 className="category-manager-title">Manage Categories</h4>
            </div>
            <button
              className="vault-btn-icon"
              onClick={() => setIsEditingCategories(false)}
              title="Close category editor"
            >
              <X size={16} />
            </button>
          </div>

          {/* Add Category Form */}
          <form onSubmit={handleAddCategory} className="category-add-form">
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Gaming"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              style={{ maxWidth: '340px' }}
            />
            <button type="submit" className="btn-primary" style={{ padding: '8px 16px', gap: '6px' }}>
              <Plus size={15} />
              <span>Add Category</span>
            </button>
          </form>

          {/* Current Category Chips */}
          <div className="category-manager-chips">
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Active Categories ({categories.length}):
            </span>
            <div className="chips-flow-row">
              {categories.map((cat) => {
                const count = data.personalAccounts.filter(
                  (a) => a.category?.toLowerCase() === cat.toLowerCase()
                ).length;
                return (
                  <span key={cat} className="category-manage-chip">
                    <span className="cat-manage-name">{cat}</span>
                    <span className="cat-manage-count">
                      {count} {count === 1 ? 'account' : 'accounts'}
                    </span>
                    <button
                      type="button"
                      className="cat-manage-delete-btn"
                      onClick={() => handleRemoveCategory(cat)}
                      title={`Remove "${cat}" category`}
                    >
                      <Trash2 size={13} />
                    </button>
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Cards Grid */}
      {filteredAccounts.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '42px 20px', color: 'var(--text-muted)' }}>
          <p style={{ fontWeight: 700, fontSize: '15px', marginBottom: '6px', color: 'var(--text-main)' }}>No accounts saved yet</p>
          <span style={{ fontSize: '12.5px' }}>Click "+ Add Account" above to save credentials into your secure password vault.</span>
        </div>
      ) : (
        <div className="vault-cards-grid">
          {filteredAccounts.map((acc) => {
          const isRevealed = !!revealedPasswords[acc.id];
          return (
            <div key={acc.id} className="vault-card">
              <div className="vault-service-row">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: 'rgba(99, 102, 241, 0.1)',
                      color: 'var(--accent-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Lock size={16} />
                  </div>
                  <div>
                    <h4 className="vault-service-name">{acc.service}</h4>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      Updated {acc.updatedAt}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span
                    className={`due-badge ${acc.twoFactorEnabled ? 'badge-upcoming' : 'badge-soon'
                      }`}
                  >
                    {acc.twoFactorEnabled ? '2FA ON' : 'No 2FA'}
                  </span>
                  <button
                    className="vault-btn-icon"
                    onClick={() => deleteVaultAccount(acc.id)}
                    title="Remove from vault"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {/* Username Field */}
              <div className="vault-field">
                <span className="vault-field-label">Username</span>
                <div className="vault-field-value-box">
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{acc.username}</span>
                  <button
                    className="vault-btn-icon"
                    onClick={() => copyToClipboard(acc.username, 'username')}
                    title="Copy username"
                  >
                    <Copy size={13} />
                  </button>
                </div>
              </div>

              {/* Password Field */}
              <div className="vault-field">
                <span className="vault-field-label">Password</span>
                <div className="vault-field-value-box">
                  <span>{isRevealed ? acc.password : '••••••••••••'}</span>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button
                      className="vault-btn-icon"
                      onClick={() => togglePasswordVisibility(acc.id)}
                      title={isRevealed ? 'Hide' : 'Reveal'}
                    >
                      {isRevealed ? <EyeOff size={13} /> : <Eye size={13} />}
                    </button>
                    <button
                      className="vault-btn-icon"
                      onClick={() => copyToClipboard(acc.password, 'password')}
                      title="Copy password"
                    >
                      <Copy size={13} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Notes & Links */}
              {acc.notes && (
                <div className="vault-note-box" style={{ fontSize: '11.5px', color: 'var(--text-secondary)', background: 'rgba(0,0,0,0.02)', padding: '6px 10px', borderRadius: '6px' }}>
                  <strong>Note:</strong> {acc.notes}
                </div>
              )}

              {acc.url && (
                <div style={{ paddingTop: '4px' }}>
                  <a
                    href={acc.url}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-secondary"
                    style={{ padding: '6px 12px', fontSize: '11.5px', width: '100%', justifyContent: 'center' }}
                  >
                    <ExternalLink size={12} />
                    <span>Open Shortcut</span>
                  </a>
                </div>
              )}
            </div>
          );
        })}
      </div>
      )}
    </div>
  );
}
