import React, { useState } from 'react';
import {
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  Repeat,
  Plus,
  Trash2,
  CheckCircle,
  CreditCard,
  X
} from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';

export default function FinanceView() {
  const {
    data,
    deleteTransaction,
    toggleSubscription,
    deleteSubscription,
    updateGoalFunds,
    deleteGoal,
    toggleBillPaid,
    deleteBill,
    deleteFinancialAccount,
    setActiveModal,
    searchQuery
  } = useDashboard();

  const [activeTab, setActiveTab] = useState('transactions');
  const [filterType, setFilterType] = useState('all');
  const [activeGoalInput, setActiveGoalInput] = useState(null);
  const [goalAddAmount, setGoalAddAmount] = useState('');

  const currency = data.settings?.currency || '₱';

  // Compute metrics
  const totalNetWorth = data.finance.accounts.reduce((sum, a) => sum + a.balance, 0);
  const monthlyInflow = data.finance.transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  const monthlyOutflow = data.finance.transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  const recurringTotal = data.finance.subscriptions
    .filter((s) => s.status === 'active')
    .reduce((sum, s) => sum + (s.cycle === 'yearly' ? s.cost / 12 : s.cost), 0);

  // Filter transactions
  const filteredTransactions = data.finance.transactions.filter((tx) => {
    if (filterType !== 'all' && tx.type !== filterType) return false;
    if (
      searchQuery &&
      !tx.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !tx.category.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="view-container">
      {/* Finance Stats Grid */}
      <div className="finance-stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">Total Net Worth</span>
            <div className="stat-icon stat-icon-indigo">
              <Wallet size={18} />
            </div>
          </div>
          <div className="stat-value">
            {currency}{totalNetWorth.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="stat-subtext tx-income">
            ↑ Across {data.finance.accounts.length} connected accounts
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">Monthly Inflow</span>
            <div className="stat-icon stat-icon-green">
              <ArrowDownLeft size={18} />
            </div>
          </div>
          <div className="stat-value">
            {currency}{monthlyInflow.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">Monthly Outflow</span>
            <div className="stat-icon stat-icon-rose">
              <ArrowUpRight size={18} />
            </div>
          </div>
          <div className="stat-value">
            {currency}{monthlyOutflow.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="stat-subtext" style={{ color: 'var(--accent-primary)' }}>
            {currency}{Math.max(0, data.profile.monthlyBudget - monthlyOutflow).toFixed(2)} budget left
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">Subscriptions</span>
            <div className="stat-icon stat-icon-purple">
              <Repeat size={18} />
            </div>
          </div>
          <div className="stat-value">
            {currency}{recurringTotal.toFixed(2)}
            <span style={{ fontSize: '14px', color: 'var(--text-muted)', fontWeight: 500 }}>/mo</span>
          </div>
          <div className="stat-subtext">
            {data.finance.subscriptions.filter((s) => s.status === 'active').length} active services
          </div>
        </div>
      </div>

      {/* Sub Navigation Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div className="sub-nav-bar">
          <button
            className={`sub-nav-btn ${activeTab === 'transactions' ? 'active' : ''}`}
            onClick={() => setActiveTab('transactions')}
          >
            Transactions
          </button>
          <button
            className={`sub-nav-btn ${activeTab === 'subscriptions' ? 'active' : ''}`}
            onClick={() => setActiveTab('subscriptions')}
          >
            Subscriptions
          </button>
          <button
            className={`sub-nav-btn ${activeTab === 'goals' ? 'active' : ''}`}
            onClick={() => setActiveTab('goals')}
          >
            Savings Goals
          </button>
          <button
            className={`sub-nav-btn ${activeTab === 'bills' ? 'active' : ''}`}
            onClick={() => setActiveTab('bills')}
          >
            Bill Reminders
          </button>
          <button
            className={`sub-nav-btn ${activeTab === 'accounts' ? 'active' : ''}`}
            onClick={() => setActiveTab('accounts')}
          >
            Financial Accounts
          </button>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          {activeTab === 'transactions' && (
            <button className="btn-primary" onClick={() => setActiveModal('transaction')}>
              <Plus size={16} />
              <span>Record Transaction</span>
            </button>
          )}
          {activeTab === 'subscriptions' && (
            <button className="btn-primary" onClick={() => setActiveModal('subscription')}>
              <Plus size={16} />
              <span>New Subscription</span>
            </button>
          )}
          {activeTab === 'goals' && (
            <button className="btn-primary" onClick={() => setActiveModal('goal')}>
              <Plus size={16} />
              <span>Create Goal</span>
            </button>
          )}
          {activeTab === 'bills' && (
            <button className="btn-primary" onClick={() => setActiveModal('bill')}>
              <Plus size={16} />
              <span>New Bill</span>
            </button>
          )}
          {activeTab === 'accounts' && (
            <button className="btn-primary" onClick={() => setActiveModal('financial-account')}>
              <Plus size={16} />
              <span>Add Account</span>
            </button>
          )}
        </div>
      </div>

      {/* Tab 1: Transactions Table */}
      {activeTab === 'transactions' && (
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h3 className="section-title">Income & Expenses</h3>
            </div>
            <select
              className="form-select"
              style={{ width: 'auto', padding: '6px 14px', fontSize: '13px' }}
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="income">Income Only</option>
              <option value="expense">Expenses Only</option>
            </select>
          </div>

          <div className="custom-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Account</th>
                  <th>Amount</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted)' }}>
                      No transactions recorded yet. Click "+ Add Entry" to log income or expenses.
                    </td>
                  </tr>
                ) : (
                  filteredTransactions.map((tx) => {
                    const acc = data.finance.accounts.find((a) => a.id === tx.accountId);
                    return (
                      <tr key={tx.id}>
                        <td style={{ fontFamily: 'var(--font-mono)', fontSize: '12.5px', color: 'var(--text-muted)' }}>
                          {tx.date}
                        </td>
                        <td style={{ fontWeight: 600 }}>{tx.title}</td>
                        <td>
                          <span className="task-pill-badge" style={{ background: 'rgba(99, 102, 241, 0.15)', color: 'var(--accent-primary)' }}>
                            {tx.category}
                          </span>
                        </td>
                        <td style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>
                          {acc ? `${acc.name} (••${acc.last4})` : 'Primary'}
                        </td>
                        <td>
                          <span className={`tx-amount ${tx.type === 'income' ? 'tx-income' : 'tx-expense'}`}>
                            {tx.type === 'income' ? '+' : '-'}{currency}{tx.amount.toFixed(2)}
                          </span>
                        </td>
                        <td>
                          <button
                            className="vault-btn-icon"
                            onClick={() => deleteTransaction(tx.id)}
                            title="Delete entry"
                          >
                            <Trash2 size={15} />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Subscriptions Table */}
      {activeTab === 'subscriptions' && (
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <div>
              <h3 className="section-title">Active Services</h3>
            </div>
          </div>

          <div className="custom-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Service</th>
                  <th>Category</th>
                  <th>Cost</th>
                  <th>Billing Cycle</th>
                  <th>Next Renewal</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {data.finance.subscriptions.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted)' }}>
                      No subscriptions added yet. Click "+ Add Service" to track recurring memberships.
                    </td>
                  </tr>
                ) : (
                  data.finance.subscriptions.map((sub) => (
                    <tr key={sub.id}>
                      <td style={{ fontWeight: 700 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span
                            style={{
                              width: '10px',
                              height: '10px',
                              borderRadius: '50%',
                              background: sub.iconColor || '#6366f1'
                            }}
                          />
                          <span>{sub.name}</span>
                        </div>
                      </td>
                      <td>{sub.category}</td>
                      <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>{currency}{sub.cost.toFixed(2)}</td>
                      <td style={{ textTransform: 'capitalize' }}>{sub.cycle}</td>
                      <td style={{ fontFamily: 'var(--font-mono)', fontSize: '12.5px' }}>{sub.renewalDate}</td>
                      <td>
                        <button
                          className={`due-badge ${sub.status === 'active' ? 'badge-upcoming' : 'badge-soon'}`}
                          style={{ border: 'none', cursor: 'pointer' }}
                          onClick={() => toggleSubscription(sub.id)}
                          title="Click to toggle status"
                        >
                          {sub.status === 'active' ? 'Active' : 'Paused'}
                        </button>
                      </td>
                      <td>
                        <button
                          className="vault-btn-icon"
                          onClick={() => deleteSubscription(sub.id)}
                          title="Delete subscription"
                        >
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Savings Goals */}
      {activeTab === 'goals' && (
        <div className="goals-grid">
          {data.finance.goals.length === 0 ? (
            <div className="empty-tasks-placeholder" style={{ padding: '36px 0', width: '100%', gridColumn: '1 / -1' }}>
              No financial goals created yet. Click "+ Add Goal" above to start tracking targets.
            </div>
          ) : (
            data.finance.goals.map((goal) => {
            const pct = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
            return (
              <div key={goal.id} className="goal-card">
                <div className="goal-header">
                  <span className="goal-title">{goal.title}</span>
                  <button
                    className="vault-btn-icon"
                    onClick={() => deleteGoal(goal.id)}
                    title="Remove goal"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontSize: '24px', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>
                    {currency}{goal.currentAmount.toLocaleString()}
                  </span>
                  <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                    Target: {currency}{goal.targetAmount.toLocaleString()}
                  </span>
                </div>
                <div className="progress-bar-wrap">
                  <div
                    className="progress-bar-fill"
                    style={{ width: `${pct}%`, background: goal.color || '#8b5cf6' }}
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: 'var(--text-muted)' }}>
                  <span>{pct}% Funded</span>
                  {goal.deadline && <span>Target: {goal.deadline}</span>}
                </div>
                {activeGoalInput === goal.id ? (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const val = parseFloat(goalAddAmount);
                      if (!isNaN(val) && val > 0) {
                        updateGoalFunds(goal.id, val);
                        setActiveGoalInput(null);
                        setGoalAddAmount('');
                      }
                    }}
                    style={{ display: 'flex', gap: '6px', marginTop: '6px', alignItems: 'center' }}
                  >
                    <div style={{ position: 'relative', flex: 1 }}>
                      <span
                        style={{
                          position: 'absolute',
                          left: '9px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          fontSize: '12px',
                          fontWeight: 700,
                          color: 'var(--text-muted)'
                        }}
                      >
                        {currency}
                      </span>
                      <input
                        type="number"
                        step="any"
                        min="0.01"
                        autoFocus
                        placeholder="Amount"
                        value={goalAddAmount}
                        onChange={(e) => setGoalAddAmount(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Escape') {
                            setActiveGoalInput(null);
                            setGoalAddAmount('');
                          }
                        }}
                        className="form-input"
                        style={{ padding: '6px 8px 6px 24px', fontSize: '12px', height: '32px' }}
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="btn-primary"
                      style={{ padding: '6px 12px', fontSize: '12px', height: '32px' }}
                    >
                      Add
                    </button>
                    <button
                      type="button"
                      className="btn-secondary"
                      style={{ padding: '6px 8px', fontSize: '12px', height: '32px' }}
                      onClick={() => {
                        setActiveGoalInput(null);
                        setGoalAddAmount('');
                      }}
                      title="Cancel"
                    >
                      <X size={14} />
                    </button>
                  </form>
                ) : (
                  <button
                    className="btn-secondary"
                    style={{
                      padding: '7px 12px',
                      fontSize: '12.5px',
                      width: '100%',
                      justifyContent: 'center',
                      marginTop: '6px',
                      gap: '6px'
                    }}
                    onClick={() => {
                      setActiveGoalInput(goal.id);
                      setGoalAddAmount('');
                    }}
                  >
                    <Plus size={14} />
                    <span>Add</span>
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>
      )}

      {/* Tab 4: Bill Reminders */}
      {activeTab === 'bills' && (
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <div>
              <h3 className="section-title">Upcoming Bill Deadlines</h3>
            </div>
          </div>

          <div className="custom-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Bill Name</th>
                  <th>Category</th>
                  <th>Amount</th>
                  <th>Due Date</th>
                  <th>Auto-Pay</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {data.finance.bills.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted)' }}>
                      No scheduled bills. Click "+ Add Bill" to stay ahead of upcoming expenses.
                    </td>
                  </tr>
                ) : (
                  data.finance.bills.map((bill) => (
                    <tr key={bill.id}>
                      <td style={{ fontWeight: 700 }}>{bill.title}</td>
                      <td>{bill.category}</td>
                      <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>{currency}{bill.amount.toFixed(2)}</td>
                      <td style={{ fontFamily: 'var(--font-mono)', fontSize: '12.5px' }}>{bill.dueDate}</td>
                      <td>
                        <span className={`due-badge ${bill.autoPay ? 'badge-upcoming' : 'badge-soon'}`}>
                          {bill.autoPay ? 'Auto-Pay ON' : 'Manual'}
                        </span>
                      </td>
                      <td>
                        <button
                          className={`due-badge ${bill.isPaid ? 'badge-upcoming' : 'badge-urgent'}`}
                          style={{ border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                          onClick={() => toggleBillPaid(bill.id)}
                        >
                          {bill.isPaid ? (
                            <>
                              <CheckCircle size={12} />
                              <span>Paid</span>
                            </>
                          ) : (
                            <span>Mark Paid</span>
                          )}
                        </button>
                      </td>
                      <td>
                        <button
                          className="vault-btn-icon"
                          onClick={() => deleteBill(bill.id)}
                          title="Delete bill"
                        >
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 5: Financial Accounts */}
      {activeTab === 'accounts' && (
        <div className="accounts-cards-row">
          {data.finance.accounts.map((acc) => (
            <div
              key={acc.id}
              className="account-credit-card"
              style={{
                background: `linear-gradient(135deg, ${acc.color || '#6366f1'}, #1e1b4b)`
              }}
            >
              <div className="acc-card-top">
                <span className="acc-card-type">{acc.type}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div className="acc-card-chip" />
                  <button
                    className="acc-card-remove-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteFinancialAccount(acc.id);
                    }}
                    title="Remove Financial Account"
                    aria-label={`Remove ${acc.name}`}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
              <div>
                <div style={{ fontSize: '12px', opacity: 0.85 }}>{acc.institution}</div>
                <div className="acc-card-balance">
                  {currency}{acc.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>
              <div className="acc-card-bottom">
                <span>{acc.name}</span>
                <span style={{ fontFamily: 'var(--font-mono)' }}>•••• {acc.last4}</span>
              </div>
            </div>
          ))}

          {/* Plus Add Account Card */}
          <div
            className="account-credit-card add-account-card"
            onClick={() => setActiveModal('financial-account')}
            role="button"
            tabIndex={0}
            title="Add a new financial account"
          >
            <div className="add-account-card-icon">
              <Plus size={24} />
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-primary)' }}>Add Financial Account</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                Bank, e-wallet, or credit card
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
