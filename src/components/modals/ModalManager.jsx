import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';
import TimePicker, { to24HourTime } from '../TimePicker';

export default function ModalManager() {
  const {
    activeModal,
    setActiveModal,
    addTransaction,
    addFinancialAccount,
    addTask,
    addAssignment,
    addScheduleSlot,
    addAcademicResource,
    addNote,
    addVaultAccount,
    addSubscription,
    addGoal,
    addBill,
    addReminder,
    addCourse,
    data
  } = useDashboard();

  if (!activeModal) return null;

  const closeModal = () => setActiveModal(null);

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        {activeModal === 'transaction' && (
          <TransactionModalForm onClose={closeModal} onSubmit={addTransaction} accounts={data.finance.accounts} />
        )}
        {activeModal === 'financial-account' && (
          <FinancialAccountModalForm onClose={closeModal} onSubmit={addFinancialAccount} />
        )}
        {activeModal === 'task' && (
          <TaskModalForm onClose={closeModal} onSubmit={addTask} />
        )}
        {activeModal === 'assignment' && (
          <AssignmentModalForm onClose={closeModal} onSubmit={addAssignment} courses={data.academic.courses} />
        )}
        {activeModal === 'schedule-slot' && (
          <ScheduleSlotModalForm onClose={closeModal} onSubmit={addScheduleSlot} />
        )}
        {activeModal === 'resource' && (
          <ResourceModalForm onClose={closeModal} onSubmit={addAcademicResource} />
        )}
        {activeModal === 'note' && (
          <NoteModalForm onClose={closeModal} onSubmit={addNote} courses={data.academic.courses} />
        )}
        {activeModal === 'vault-account' && (
          <VaultAccountModalForm onClose={closeModal} onSubmit={addVaultAccount} categories={data.accountCategories} />
        )}
        {activeModal === 'subscription' && (
          <SubscriptionModalForm onClose={closeModal} onSubmit={addSubscription} />
        )}
        {activeModal === 'goal' && (
          <GoalModalForm onClose={closeModal} onSubmit={addGoal} />
        )}
        {activeModal === 'bill' && (
          <BillModalForm onClose={closeModal} onSubmit={addBill} />
        )}
        {activeModal === 'reminder' && (
          <ReminderModalForm onClose={closeModal} onSubmit={addReminder} />
        )}
        {activeModal === 'course' && (
          <CourseModalForm onClose={closeModal} onSubmit={addCourse} />
        )}
      </div>
    </div>
  );
}

// Transaction Form
function TransactionModalForm({ onClose, onSubmit, accounts }) {
  const [formData, setFormData] = useState({
    title: '',
    type: 'expense',
    amount: '',
    category: 'Food',
    accountId: accounts[0]?.id || '',
    date: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <>
      <div className="modal-header">
        <h3 className="modal-title">Record Transaction</h3>
        <button className="modal-close-btn" onClick={onClose}><X size={18} /></button>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Title</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. Groceries"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Type</label>
            <select
              className="form-select"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Amount (₱)</label>
            <input
              type="number"
              step="0.01"
              className="form-input"
              placeholder="0.00"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              required
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Category</label>
            <select
              className="form-select"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              <option value="Food">Food & Dining</option>
              <option value="Education">Education & Books</option>
              <option value="Software">Software & Tech</option>
              <option value="Income">Salary / Stipend</option>
              <option value="Utilities">Utilities</option>
              <option value="Shopping">Shopping</option>
              <option value="Transport">Transportation</option>
              <option value="Health">Health & Wellness</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Account Used</label>
            <select
              className="form-select"
              value={formData.accountId}
              onChange={(e) => setFormData({ ...formData, accountId: e.target.value })}
            >
              {accounts.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Date</label>
          <input
            type="date"
            className="form-input"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
          <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn-primary">Save Transaction</button>
        </div>
      </form>
    </>
  );
}

// Task Form
function TaskModalForm({ onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    title: '',
    category: 'Academic',
    priority: 'medium',
    dueDate: new Date().toISOString().split('T')[0],
    dueTime: '10:00 AM'
  });
  const [hasSpecificTime, setHasSpecificTime] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      dueTime: hasSpecificTime ? formData.dueTime : ''
    });
    onClose();
  };

  return (
    <>
      <div className="modal-header">
        <h3 className="modal-title">New Task</h3>
        <button className="modal-close-btn" onClick={onClose}><X size={18} /></button>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Task Name</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. Prepare presentation, Submit lab"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Category</label>
            <select
              className="form-select"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              <option value="Academic">Academic</option>
              <option value="Personal">Personal</option>
              <option value="Health">Health</option>
              <option value="Finance">Finance</option>
              <option value="Work">Work</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Priority</label>
            <select
              className="form-select"
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
            >
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Due Date</label>
            <input
              type="date"
              className="form-input"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            />
          </div>
          <div className="form-group">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <label className="form-label" style={{ margin: 0 }}>Specific Time</label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11.5px', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={hasSpecificTime}
                  onChange={(e) => setHasSpecificTime(e.target.checked)}
                />
                Enable
              </label>
            </div>
            {hasSpecificTime ? (
              <TimePicker
                value={formData.dueTime || '10:00 AM'}
                onChange={(val) => setFormData({ ...formData, dueTime: val })}
              />
            ) : (
              <div style={{ height: '36px', display: 'flex', alignItems: 'center', fontSize: '12px', color: 'var(--text-muted)' }}>
                All day / by end of day
              </div>
            )}
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
          <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn-primary">Create Task</button>
        </div>
      </form>
    </>
  );
}

// Assignment Form
function AssignmentModalForm({ onClose, onSubmit, courses = [] }) {
  const [formData, setFormData] = useState({
    title: '',
    courseCode: courses[0]?.code || '',
    priority: 'high',
    dueDate: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <>
      <div className="modal-header">
        <h3 className="modal-title">Add Academic Assignment</h3>
        <button className="modal-close-btn" onClick={onClose}><X size={18} /></button>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Task Title</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. Figma Prototype"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Course</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. CS 341"
            value={formData.courseCode}
            onChange={(e) => setFormData({ ...formData, courseCode: e.target.value })}
            required
          />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Priority</label>
            <select
              className="form-select"
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
            >
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Due Date</label>
            <input
              type="date"
              className="form-input"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Notes</label>
          <textarea
            className="form-input"
            rows={3}
            style={{ resize: 'vertical', minHeight: '68px', padding: '8px 12px', fontSize: '13px' }}
            placeholder="Add assignment rubric, study notes..."
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
          <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn-primary">Add Assignment</button>
        </div>
      </form>
    </>
  );
}

// Vault Account Form
function VaultAccountModalForm({ onClose, onSubmit, categories }) {
  const availableCategories = categories && categories.length > 0
    ? categories
    : ['Academic', 'Finance', 'Dev', 'Design', 'Social', 'Entertainment', 'General'];

  const [formData, setFormData] = useState({
    service: '',
    category: availableCategories[0] || 'General',
    username: '',
    email: '',
    password: '',
    url: '',
    twoFactorEnabled: 'true',
    notes: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <>
      <div className="modal-header">
        <h3 className="modal-title">Store Account in Vault</h3>
        <button className="modal-close-btn" onClick={onClose}><X size={18} /></button>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Platform</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Google"
              value={formData.service}
              onChange={(e) => setFormData({ ...formData, service: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Category</label>
            <select
              className="form-select"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              {availableCategories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Username</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. User_1"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-input"
              placeholder="e.g. user@domain.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <input
            type="text"
            className="form-input"
            placeholder="Enter password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Login URL</label>
            <input
              type="url"
              className="form-input"
              placeholder="https://..."
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label className="form-label">2-Factor Authentication (2FA)</label>
            <select
              className="form-select"
              value={formData.twoFactorEnabled}
              onChange={(e) => setFormData({ ...formData, twoFactorEnabled: e.target.value })}
            >
              <option value="true">Enabled (Protected)</option>
              <option value="false">Not Enabled</option>
            </select>
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Security Notes</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. Hardware key, recovery codes"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
          <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn-primary">Save to Vault</button>
        </div>
      </form>
    </>
  );
}

// Subscription Form
function SubscriptionModalForm({ onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    name: '',
    cost: '',
    cycle: 'monthly',
    category: 'Entertainment',
    renewalDate: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <>
      <div className="modal-header">
        <h3 className="modal-title">Track Subscription</h3>
        <button className="modal-close-btn" onClick={onClose}><X size={18} /></button>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Service Name</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. Spotify, ChatGPT, Netflix"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Cost (₱)</label>
            <input
              type="number"
              step="0.01"
              className="form-input"
              placeholder="9.99"
              value={formData.cost}
              onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Billing Cycle</label>
            <select
              className="form-select"
              value={formData.cycle}
              onChange={(e) => setFormData({ ...formData, cycle: e.target.value })}
            >
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Category</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. AI Tools, Entertainment"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Renewal Date</label>
            <input
              type="date"
              className="form-input"
              value={formData.renewalDate}
              onChange={(e) => setFormData({ ...formData, renewalDate: e.target.value })}
              required
            />
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
          <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn-primary">Add Subscription</button>
        </div>
      </form>
    </>
  );
}

// Goal Form
function GoalModalForm({ onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    title: '',
    targetAmount: '',
    currentAmount: '',
    category: 'Savings',
    deadline: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <>
      <div className="modal-header">
        <h3 className="modal-title">New Savings Goal</h3>
        <button className="modal-close-btn" onClick={onClose}><X size={18} /></button>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Goal Title</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. Emergency Fund"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Target Amount (₱)</label>
            <input
              type="number"
              step="1"
              className="form-input"
              placeholder="5000"
              value={formData.targetAmount}
              onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Current Saved (₱)</label>
            <input
              type="number"
              step="1"
              className="form-input"
              placeholder="1000"
              value={formData.currentAmount}
              onChange={(e) => setFormData({ ...formData, currentAmount: e.target.value })}
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Category</label>
            <input
              type="text"
              className="form-input"
              placeholder="Savings, Travel, Tech"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Target Deadline</label>
            <input
              type="date"
              className="form-input"
              value={formData.deadline}
              onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
            />
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
          <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn-primary">Create Goal</button>
        </div>
      </form>
    </>
  );
}

// Bill Form
function BillModalForm({ onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    dueDate: new Date().toISOString().split('T')[0],
    category: 'Utilities',
    autoPay: false
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <>
      <div className="modal-header">
        <h3 className="modal-title">New Bill Reminder</h3>
        <button className="modal-close-btn" onClick={onClose}><X size={18} /></button>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Bill Name</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. Fiber Internet, Electric & Water"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Amount (₱)</label>
            <input
              type="number"
              step="0.01"
              className="form-input"
              placeholder="75.00"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Due Date</label>
            <input
              type="date"
              className="form-input"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              required
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Category</label>
            <input
              type="text"
              className="form-input"
              placeholder="Utilities, Credit Card, Housing"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Auto-Pay Active?</label>
            <select
              className="form-select"
              value={formData.autoPay ? 'true' : 'false'}
              onChange={(e) => setFormData({ ...formData, autoPay: e.target.value === 'true' })}
            >
              <option value="false">No (Manual)</option>
              <option value="true">Yes (Auto-Pay)</option>
            </select>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
          <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn-primary">Save Bill Reminder</button>
        </div>
      </form>
    </>
  );
}

// Reminder Form
function ReminderModalForm({ onClose, onSubmit }) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('10:00 AM');
  const [priority, setPriority] = useState('high');

  const handleSubmit = (e) => {
    e.preventDefault();
    const time24 = to24HourTime(time);
    const datetime = `${date}T${time24}`;
    onSubmit({
      title,
      date,
      time,
      datetime,
      priority
    });
    onClose();
  };

  return (
    <>
      <div className="modal-header">
        <h3 className="modal-title">Set Priority Reminder</h3>
        <button className="modal-close-btn" onClick={onClose}><X size={18} /></button>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Reminder Message</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. Submit CS341 commit, Pay internet bill"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Alert Date</label>
            <input
              type="date"
              className="form-input"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <TimePicker
              label="Alert Time"
              value={time}
              onChange={(val) => setTime(val)}
            />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Priority</label>
          <select
            className="form-select"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="high">High (Urgent)</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
          <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn-primary">Set Reminder</button>
        </div>
      </form>
    </>
  );
}

// Course Form
function CourseModalForm({ onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    credits: '4',
    professor: '',
    room: '',
    schedule: '',
    grade: 'A',
    progress: '75'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <>
      <div className="modal-header">
        <h3 className="modal-title">Enroll Academic Course</h3>
        <button className="modal-close-btn" onClick={onClose}><X size={18} /></button>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Course Code</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. CS 341, DES 280"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Credits</label>
            <input
              type="number"
              className="form-input"
              value={formData.credits}
              onChange={(e) => setFormData({ ...formData, credits: e.target.value })}
              required
            />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Course Name</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. Distributed Systems & Cloud Architecture"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Professor</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Dr. Michael Vance"
              value={formData.professor}
              onChange={(e) => setFormData({ ...formData, professor: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Classroom</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Gates Hall 302"
              value={formData.room}
              onChange={(e) => setFormData({ ...formData, room: e.target.value })}
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Schedule Slot</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Mon/Wed 10:00 - 11:30"
              value={formData.schedule}
              onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Letter Grade Target</label>
            <input
              type="text"
              className="form-input"
              value={formData.grade}
              onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
            />
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
          <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn-primary">Enroll Course</button>
        </div>
      </form>
    </>
  );
}

// Financial Account Form
function FinancialAccountModalForm({ onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    name: '',
    institution: '',
    type: 'Savings',
    balance: '',
    last4: '',
    color: '#0284c7'
  });

  const colorPresets = [
    { label: 'Sky Blue', hex: '#0284c7' },
    { label: 'Emerald', hex: '#10b981' },
    { label: 'Indigo', hex: '#6366f1' },
    { label: 'Violet', hex: '#8b5cf6' },
    { label: 'Rose Pink', hex: '#f43f5e' },
    { label: 'Amber', hex: '#f59e0b' },
    { label: 'Slate', hex: '#334155' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      institution: formData.institution.trim() || 'Provider',
      balance: parseFloat(formData.balance) || 0,
      last4: formData.last4 ? formData.last4.slice(-4) : Math.floor(1000 + Math.random() * 9000).toString()
    });
    onClose();
  };

  return (
    <>
      <div className="modal-header">
        <h3 className="modal-title">Add Financial Account</h3>
        <button className="modal-close-btn" onClick={onClose}><X size={18} /></button>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Account Nickname</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. Main Savings, Daily Allowance"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Provider</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. BDO, BPI, GCash, Maya"
            value={formData.institution}
            onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Account Type</label>
            <select
              className="form-select"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            >
              <option value="Savings">Savings</option>
              <option value="Checking">Checking</option>
              <option value="Digital Wallet">Digital Wallet</option>
              <option value="Credit Card">Credit Card</option>
              <option value="Investment">Investment</option>
              <option value="Cash">Cash / Other</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Current Balance (₱)</label>
            <input
              type="number"
              step="0.01"
              className="form-input"
              placeholder="0.00"
              value={formData.balance}
              onChange={(e) => setFormData({ ...formData, balance: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Card Theme Color</label>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', height: '42px' }}>
            {colorPresets.map((c) => (
              <button
                key={c.hex}
                type="button"
                onClick={() => setFormData({ ...formData, color: c.hex })}
                style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  background: c.hex,
                  border: formData.color === c.hex ? '3px solid white' : '2px solid transparent',
                  boxShadow: formData.color === c.hex ? '0 0 0 2px var(--accent-primary)' : 'none',
                  cursor: 'pointer',
                  transition: 'all 0.15s'
                }}
                title={c.label}
              />
            ))}
          </div>
        </div>

        {/* Live Card Preview */}
        <div style={{ marginTop: '10px', marginBottom: '20px' }}>
          <label className="form-label" style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Card Preview</label>
          <div
            className="account-credit-card"
            style={{
              background: `linear-gradient(135deg, ${formData.color}, #1e1b4b)`,
              minHeight: '120px',
              padding: '16px'
            }}
          >
            <div className="acc-card-top">
              <span className="acc-card-type">{formData.type}</span>
              <div className="acc-card-chip" />
            </div>
            <div>
              <div style={{ fontSize: '11px', opacity: 0.85 }}>{formData.institution || 'Provider'}</div>
              <div className="acc-card-balance" style={{ fontSize: '20px' }}>
                ₱{(parseFloat(formData.balance) || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
            <div className="acc-card-bottom" style={{ fontSize: '11px' }}>
              <span>{formData.name || 'Account Name'}</span>
              <span style={{ fontFamily: 'var(--font-mono)' }}>••••••••</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn-primary">Add Account</button>
        </div>
      </form >
    </>
  );
}

// Course Resource Form (Link-based)
function ResourceModalForm({ onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    title: '',
    courseCode: '',
    type: 'link',
    url: '',
    notes: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <>
      <div className="modal-header">
        <h3 className="modal-title">Add Resource Link</h3>
        <button className="modal-close-btn" onClick={onClose}><X size={18} /></button>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Resource Title</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. Distributed Systems Lecture Slides"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Course</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. CS 341"
              value={formData.courseCode}
              onChange={(e) => setFormData({ ...formData, courseCode: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Type</label>
            <select
              className="form-select"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            >
              <option value="link">Web Link / Article</option>
              <option value="drive">Drive Folder</option>
              <option value="book">Textbook / Reading</option>
              <option value="video">Video Lectures</option>
              <option value="docs">Documentation</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Resource URL</label>
          <input
            type="url"
            className="form-input"
            placeholder="https://..."
            value={formData.url}
            onChange={(e) => setFormData({ ...formData, url: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Notes</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. Key reference for midterm and consensus lab"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
          <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn-primary">Add Resource</button>
        </div>
      </form>
    </>
  );
}

// Schedule Slot Form (Add Class)
function ScheduleSlotModalForm({ onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    day: 'Mon',
    courseCode: '',
    startTime: '09:00 AM',
    endTime: '10:30 AM',
    room: 'Gates 302',
    color: '#6366f1'
  });

  const colors = [
    { label: 'Indigo', hex: '#6366f1' },
    { label: 'Violet', hex: '#8b5cf6' },
    { label: 'Emerald', hex: '#10b981' },
    { label: 'Sky', hex: '#0284c7' },
    { label: 'Pink', hex: '#ec4899' },
    { label: 'Amber', hex: '#f59e0b' },
    { label: 'Rose', hex: '#f43f5e' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <>
      <div className="modal-header">
        <h3 className="modal-title">Add Class to Timetable</h3>
        <button className="modal-close-btn" onClick={onClose}><X size={18} /></button>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Day of Week</label>
            <select
              className="form-select"
              value={formData.day}
              onChange={(e) => setFormData({ ...formData, day: e.target.value })}
            >
              <option value="Mon">Monday</option>
              <option value="Tue">Tuesday</option>
              <option value="Wed">Wednesday</option>
              <option value="Thu">Thursday</option>
              <option value="Fri">Friday</option>
              <option value="Sat">Saturday</option>
              <option value="Sun">Sunday</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Course / Class Code</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. CS 341, MATH 225"
              value={formData.courseCode}
              onChange={(e) => setFormData({ ...formData, courseCode: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <TimePicker
              label="Start Time"
              value={formData.startTime}
              onChange={(val) => setFormData({ ...formData, startTime: val })}
            />
          </div>
          <div className="form-group">
            <TimePicker
              label="End Time"
              value={formData.endTime}
              onChange={(val) => setFormData({ ...formData, endTime: val })}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Room / Building / Link</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. Gates Hall 302, Online Zoom"
            value={formData.room}
            onChange={(e) => setFormData({ ...formData, room: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Card Accent Color</label>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {colors.map((c) => (
              <button
                key={c.hex}
                type="button"
                onClick={() => setFormData({ ...formData, color: c.hex })}
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: c.hex,
                  border: formData.color === c.hex ? '3px solid white' : '2px solid transparent',
                  boxShadow: formData.color === c.hex ? '0 0 0 2px var(--accent-primary)' : 'none',
                  cursor: 'pointer'
                }}
                title={c.label}
              />
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
          <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn-primary">Add Class</button>
        </div>
      </form>
    </>
  );
}
