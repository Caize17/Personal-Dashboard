import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  getNativeNotificationPermission,
  requestNativeNotificationPermission,
  sendNativeNotification,
  checkAndDispatchDeadlineNotifications
} from '../utils/notifications';
import { sortScheduleSlots } from '../components/TimePicker';

const STORAGE_KEY = 'amils_react_dashboard_state_v2';

export const PHILIPPINES_WEATHER_PRESETS = {
  'Manila, Philippines': {
    city: 'Manila, Philippines',
    temp: '31°',
    tempMin: '25°',
    tempMax: '33°',
    condition: 'Tropical Sun & Showers',
    icon: 'sun-rain',
    humidity: '76%',
    forecast: [
      { day: 'FRI', temp: '31°', low: '25°', icon: 'sun-rain' },
      { day: 'SAT', temp: '32°', low: '26°', icon: 'sun' },
      { day: 'SUN', temp: '30°', low: '25°', icon: 'rain' },
      { day: 'MON', temp: '31°', low: '25°', icon: 'cloud-sun' },
      { day: 'TUE', temp: '33°', low: '26°', icon: 'sun' },
      { day: 'WED', temp: '32°', low: '25°', icon: 'sun-rain' },
      { day: 'THU', temp: '31°', low: '24°', icon: 'sun' }
    ]
  },
  'Quezon City, Philippines': {
    city: 'Quezon City, Philippines',
    temp: '30°',
    tempMin: '24°',
    tempMax: '32°',
    condition: 'Passing Rain Clouds',
    icon: 'rain',
    humidity: '79%',
    forecast: [
      { day: 'FRI', temp: '30°', low: '24°', icon: 'rain' },
      { day: 'SAT', temp: '31°', low: '25°', icon: 'sun' },
      { day: 'SUN', temp: '29°', low: '24°', icon: 'rain' },
      { day: 'MON', temp: '32°', low: '25°', icon: 'sun' },
      { day: 'TUE', temp: '31°', low: '25°', icon: 'cloud-sun' },
      { day: 'WED', temp: '30°', low: '24°', icon: 'rain' },
      { day: 'THU', temp: '32°', low: '25°', icon: 'sun' }
    ]
  },
  'Cebu City, Philippines': {
    city: 'Cebu City, Philippines',
    temp: '32°',
    tempMin: '26°',
    tempMax: '33°',
    condition: 'Coastal Breeze & Sunny',
    icon: 'sun',
    humidity: '72%',
    forecast: [
      { day: 'FRI', temp: '32°', low: '26°', icon: 'sun' },
      { day: 'SAT', temp: '33°', low: '26°', icon: 'sun' },
      { day: 'SUN', temp: '31°', low: '25°', icon: 'sun-rain' },
      { day: 'MON', temp: '32°', low: '26°', icon: 'sun' },
      { day: 'TUE', temp: '30°', low: '25°', icon: 'cloud-sun' },
      { day: 'WED', temp: '32°', low: '25°', icon: 'sun' },
      { day: 'THU', temp: '33°', low: '26°', icon: 'sun' }
    ]
  },
  'Baguio, Philippines': {
    city: 'Baguio, Philippines',
    temp: '21°',
    tempMin: '16°',
    tempMax: '23°',
    condition: 'Mountain Mist & Cool Air',
    icon: 'cloud',
    humidity: '85%',
    forecast: [
      { day: 'FRI', temp: '21°', low: '16°', icon: 'cloud' },
      { day: 'SAT', temp: '22°', low: '17°', icon: 'rain' },
      { day: 'SUN', temp: '20°', low: '15°', icon: 'cloud' },
      { day: 'MON', temp: '23°', low: '16°', icon: 'cloud-sun' },
      { day: 'TUE', temp: '21°', low: '15°', icon: 'cloud' },
      { day: 'WED', temp: '20°', low: '15°', icon: 'rain' },
      { day: 'THU', temp: '22°', low: '16°', icon: 'cloud-sun' }
    ]
  },
  'Davao City, Philippines': {
    city: 'Davao City, Philippines',
    temp: '31°',
    tempMin: '24°',
    tempMax: '32°',
    condition: 'Mild Tropical & Sun',
    icon: 'sun',
    humidity: '74%',
    forecast: [
      { day: 'FRI', temp: '31°', low: '24°', icon: 'sun' },
      { day: 'SAT', temp: '31°', low: '24°', icon: 'sun-rain' },
      { day: 'SUN', temp: '32°', low: '25°', icon: 'sun' },
      { day: 'MON', temp: '30°', low: '24°', icon: 'cloud' },
      { day: 'TUE', temp: '32°', low: '25°', icon: 'sun' },
      { day: 'WED', temp: '31°', low: '25°', icon: 'sun-rain' },
      { day: 'THU', temp: '32°', low: '25°', icon: 'sun' }
    ]
  }
};

export const getWeatherForCity = (cityName) => {
  if (!cityName) return PHILIPPINES_WEATHER_PRESETS['Manila, Philippines'];
  if (PHILIPPINES_WEATHER_PRESETS[cityName]) {
    return PHILIPPINES_WEATHER_PRESETS[cityName];
  }
  const clean = cityName.trim().toLowerCase();
  const matchedKey = Object.keys(PHILIPPINES_WEATHER_PRESETS).find(
    (k) => k.toLowerCase().includes(clean) || clean.includes(k.toLowerCase().split(',')[0].toLowerCase())
  );
  if (matchedKey) return PHILIPPINES_WEATHER_PRESETS[matchedKey];

  return {
    city: cityName.includes('Philippines') ? cityName : `${cityName}, Philippines`,
    temp: '31°',
    tempMin: '25°',
    tempMax: '32°',
    condition: 'Tropical Weather',
    icon: 'sun-rain',
    humidity: '75%',
    forecast: [
      { day: 'FRI', temp: '31°', low: '25°', icon: 'sun-rain' },
      { day: 'SAT', temp: '32°', low: '25°', icon: 'sun' },
      { day: 'SUN', temp: '30°', low: '24°', icon: 'rain' },
      { day: 'MON', temp: '31°', low: '25°', icon: 'cloud-sun' },
      { day: 'TUE', temp: '32°', low: '26°', icon: 'sun' },
      { day: 'WED', temp: '31°', low: '25°', icon: 'sun-rain' },
      { day: 'THU', temp: '30°', low: '24°', icon: 'cloud' }
    ]
  };
};

export const initialDashboardData = {
  profile: {
    name: '',
    title: '',
    greeting: 'Welcome',
    subGreeting: '',
    monthlyBudget: 0,
    academicTargetGPA: 0
  },
  settings: {
    theme: 'ethereal-glass', // 'ethereal-glass' | 'classic-blue' | 'midnight-aurora'
    currency: '₱',
    clockFormat: '24h',
    weather: PHILIPPINES_WEATHER_PRESETS['Manila, Philippines']
  },
  finance: {
    accounts: [],
    transactions: [],
    subscriptions: [],
    goals: [],
    bills: []
  },
  academic: {
    courses: [],
    assignments: [],
    notes: [],
    schedules: [],
    resources: []
  },
  organization: {
    tasks: [],
    scheduleEvents: [],
    reminders: []
  },
  personalAccounts: [],
  accountCategories: ['Academic', 'Finance', 'Design', 'Social', 'Entertainment', 'General']
};

const DashboardContext = createContext(null);

export function DashboardProvider({ children }) {
  const [data, setData] = useState(() => {
    try {
      localStorage.removeItem('amils_react_dashboard_state_v1');
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (!parsed.settings) parsed.settings = {};
        parsed.settings.currency = parsed.settings.currency || '₱';
        if (!parsed.settings?.weather?.forecast || parsed.settings?.weather?.city === 'Lagos') {
          parsed.settings = {
            ...parsed.settings,
            weather: PHILIPPINES_WEATHER_PRESETS['Manila, Philippines']
          };
        }
        if (parsed.academic?.schedules) {
          parsed.academic.schedules = sortScheduleSlots(parsed.academic.schedules);
        }
        return { ...initialDashboardData, ...parsed };
      }
    } catch (e) {
      console.warn('Failed to parse local storage data, fallback to initial:', e);
    }
    return initialDashboardData;
  });

  const [activeView, setActiveView] = useState('home');
  const [academicTab, setAcademicTab] = useState('schedule'); // 'schedule' | 'assignments' | 'resources'
  const [activeModal, setActiveModal] = useState(null); // 'transaction' | 'task' | 'assignment' | 'note' | 'vault-account' | 'subscription' | 'goal' | 'bill' | 'reminder' | 'course' | 'schedule-slot'
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [toasts, setToasts] = useState([]);

  // Auto-save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  }, [data]);

  // Apply theme to document element and body
  useEffect(() => {
    const theme = data.settings?.theme || 'ethereal-glass';
    document.documentElement.setAttribute('data-theme', theme);
    document.body.setAttribute('data-theme', theme);
  }, [data.settings?.theme]);

  // Toast notification helper
  const showToast = (message) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  };

  // --- Native OS Notifications ---
  const [nativeNotifStatus, setNativeNotifStatus] = useState(() => getNativeNotificationPermission());

  const enableNativeNotifications = async () => {
    const res = await requestNativeNotificationPermission();
    setNativeNotifStatus(res);
    if (res === 'granted') {
      showToast('Native OS notifications enabled');
      checkAndDispatchDeadlineNotifications(data, (view) => setActiveView(view));
    } else if (res === 'denied') {
      showToast('Notification permission denied by system');
    }
  };

  const testNativeNotification = () => {
    if (nativeNotifStatus !== 'granted') {
      enableNativeNotifications();
      return;
    }
    sendNativeNotification("Amil's Personal Dashboard", {
      body: 'Test alert: Native OS notifications are active on your device!',
      tag: 'test-' + Date.now()
    });
    showToast('Sent native test notification');
  };

  // Check deadline notifications on load and whenever tasks/reminders/assignments/bills change
  useEffect(() => {
    if (nativeNotifStatus === 'granted') {
      checkAndDispatchDeadlineNotifications(data, (view) => setActiveView(view));
    }
  }, [data.organization?.tasks, data.organization?.reminders, data.academic?.assignments, data.finance?.bills, nativeNotifStatus]);

  // Real-time deadline check running every 10 seconds so exact times trigger promptly
  useEffect(() => {
    if (nativeNotifStatus !== 'granted') return;
    const interval = setInterval(() => {
      checkAndDispatchDeadlineNotifications(data, (view) => setActiveView(view));
    }, 10 * 1000);
    return () => clearInterval(interval);
  }, [data, nativeNotifStatus]);

  // --- Theme ---
  const cycleTheme = () => {
    const themes = ['ethereal-glass', 'classic-blue', 'midnight-aurora'];
    const current = data.settings.theme || 'ethereal-glass';
    const next = themes[(themes.indexOf(current) + 1) % themes.length];
    setData((prev) => ({
      ...prev,
      settings: { ...prev.settings, theme: next }
    }));
    showToast(`Switched theme to: ${next.replace('-', ' ')}`);
  };

  const setTheme = (themeName) => {
    setData((prev) => ({
      ...prev,
      settings: { ...prev.settings, theme: themeName }
    }));
    showToast(`Theme updated`);
  };

  // --- Transactions ---
  const addTransaction = (tx) => {
    const newTx = {
      id: 'tx-' + Date.now(),
      date: tx.date || new Date().toISOString().split('T')[0],
      title: tx.title,
      category: tx.category || 'General',
      type: tx.type || 'expense',
      amount: parseFloat(tx.amount) || 0,
      accountId: tx.accountId || data.finance.accounts[0]?.id
    };

    setData((prev) => {
      const updatedAccounts = prev.finance.accounts.map((acc) => {
        if (acc.id === newTx.accountId) {
          return {
            ...acc,
            balance: newTx.type === 'income' ? acc.balance + newTx.amount : acc.balance - newTx.amount
          };
        }
        return acc;
      });

      return {
        ...prev,
        finance: {
          ...prev.finance,
          accounts: updatedAccounts,
          transactions: [newTx, ...prev.finance.transactions]
        }
      };
    });

    showToast(`Transaction added: ${newTx.title}`);
  };

  const deleteTransaction = (id) => {
    setData((prev) => {
      const tx = prev.finance.transactions.find((t) => t.id === id);
      const updatedAccounts = prev.finance.accounts.map((acc) => {
        if (tx && acc.id === tx.accountId) {
          return {
            ...acc,
            balance: tx.type === 'income' ? acc.balance - tx.amount : acc.balance + tx.amount
          };
        }
        return acc;
      });

      return {
        ...prev,
        finance: {
          ...prev.finance,
          accounts: updatedAccounts,
          transactions: prev.finance.transactions.filter((t) => t.id !== id)
        }
      };
    });
    showToast('Transaction removed');
  };

  // --- Financial Accounts ---
  const addFinancialAccount = (acc) => {
    const newAcc = {
      id: 'acc-' + Date.now(),
      name: acc.name?.trim() || 'New Account',
      institution: acc.institution?.trim() || 'Bank',
      type: acc.type || 'Savings',
      balance: parseFloat(acc.balance) || 0,
      last4: acc.last4 ? acc.last4.toString().slice(-4) : '0000',
      color: acc.color || '#0284c7'
    };

    setData((prev) => ({
      ...prev,
      finance: {
        ...prev.finance,
        accounts: [...prev.finance.accounts, newAcc]
      }
    }));
    showToast(`Account added: ${newAcc.name}`);
  };

  const deleteFinancialAccount = (id) => {
    setData((prev) => ({
      ...prev,
      finance: {
        ...prev.finance,
        accounts: prev.finance.accounts.filter((a) => a.id !== id)
      }
    }));
    showToast('Financial account removed');
  };

  // --- Subscriptions ---
  const addSubscription = (sub) => {
    const newSub = {
      id: 'sub-' + Date.now(),
      name: sub.name,
      category: sub.category || 'Service',
      cost: parseFloat(sub.cost) || 0,
      cycle: sub.cycle || 'monthly',
      renewalDate: sub.renewalDate || new Date().toISOString().split('T')[0],
      status: sub.status || 'active',
      iconColor: sub.iconColor || '#6366f1'
    };
    setData((prev) => ({
      ...prev,
      finance: {
        ...prev.finance,
        subscriptions: [...prev.finance.subscriptions, newSub]
      }
    }));
    showToast(`Subscription added: ${newSub.name}`);
  };

  const toggleSubscription = (id) => {
    setData((prev) => ({
      ...prev,
      finance: {
        ...prev.finance,
        subscriptions: prev.finance.subscriptions.map((s) =>
          s.id === id ? { ...s, status: s.status === 'active' ? 'paused' : 'active' } : s
        )
      }
    }));
  };

  const deleteSubscription = (id) => {
    setData((prev) => ({
      ...prev,
      finance: {
        ...prev.finance,
        subscriptions: prev.finance.subscriptions.filter((s) => s.id !== id)
      }
    }));
    showToast('Subscription deleted');
  };

  // --- Goals ---
  const addGoal = (goal) => {
    const newGoal = {
      id: 'goal-' + Date.now(),
      title: goal.title,
      targetAmount: parseFloat(goal.targetAmount) || 1000,
      currentAmount: parseFloat(goal.currentAmount) || 0,
      category: goal.category || 'General',
      deadline: goal.deadline || '',
      color: goal.color || '#8b5cf6'
    };
    setData((prev) => ({
      ...prev,
      finance: {
        ...prev.finance,
        goals: [...prev.finance.goals, newGoal]
      }
    }));
    showToast(`Savings goal created: ${newGoal.title}`);
  };

  const updateGoalFunds = (id, delta) => {
    setData((prev) => ({
      ...prev,
      finance: {
        ...prev.finance,
        goals: prev.finance.goals.map((g) =>
          g.id === id ? { ...g, currentAmount: Math.max(0, g.currentAmount + parseFloat(delta)) } : g
        )
      }
    }));
    showToast('Goal funds updated');
  };

  const deleteGoal = (id) => {
    setData((prev) => ({
      ...prev,
      finance: {
        ...prev.finance,
        goals: prev.finance.goals.filter((g) => g.id !== id)
      }
    }));
    showToast('Goal deleted');
  };

  // --- Bills ---
  const addBill = (bill) => {
    const newBill = {
      id: 'bill-' + Date.now(),
      title: bill.title,
      amount: parseFloat(bill.amount) || 0,
      dueDate: bill.dueDate || new Date().toISOString().split('T')[0],
      isPaid: false,
      category: bill.category || 'Utilities',
      autoPay: !!bill.autoPay
    };
    setData((prev) => ({
      ...prev,
      finance: {
        ...prev.finance,
        bills: [...prev.finance.bills, newBill]
      }
    }));
    showToast(`Bill reminder created: ${newBill.title}`);
  };

  const toggleBillPaid = (id) => {
    setData((prev) => ({
      ...prev,
      finance: {
        ...prev.finance,
        bills: prev.finance.bills.map((b) => (b.id === id ? { ...b, isPaid: !b.isPaid } : b))
      }
    }));
  };

  const deleteBill = (id) => {
    setData((prev) => ({
      ...prev,
      finance: {
        ...prev.finance,
        bills: prev.finance.bills.filter((b) => b.id !== id)
      }
    }));
    showToast('Bill removed');
  };

  // --- Tasks ---
  const addTask = (task) => {
    const newTask = {
      id: 'task-' + Date.now(),
      title: task.title,
      category: task.category || 'General',
      priority: task.priority || 'medium',
      completed: false,
      dueDate: task.dueDate || '',
      dueTime: task.dueTime || ''
    };
    setData((prev) => {
      const updated = {
        ...prev,
        organization: {
          ...prev.organization,
          tasks: [newTask, ...prev.organization.tasks]
        }
      };
      if (nativeNotifStatus === 'granted') {
        setTimeout(() => checkAndDispatchDeadlineNotifications(updated, (view) => setActiveView(view)), 80);
      }
      return updated;
    });
    showToast(`Task added: ${newTask.title}`);
  };

  const toggleTask = (id) => {
    setData((prev) => ({
      ...prev,
      organization: {
        ...prev.organization,
        tasks: prev.organization.tasks.map((t) =>
          t.id === id ? { ...t, completed: !t.completed } : t
        )
      }
    }));
  };

  const deleteTask = (id) => {
    setData((prev) => ({
      ...prev,
      organization: {
        ...prev.organization,
        tasks: prev.organization.tasks.filter((t) => t.id !== id)
      }
    }));
    showToast('Task removed');
  };

  // --- Assignments ---
  const addAssignment = (asg) => {
    const newAsg = {
      id: 'asg-' + Date.now(),
      courseCode: asg.courseCode || 'General',
      title: asg.title,
      dueDate: asg.dueDate || '',
      priority: asg.priority || 'medium',
      status: asg.status || 'pending',
      notes: asg.notes?.trim() || '',
      weight: asg.weight || ''
    };
    setData((prev) => ({
      ...prev,
      academic: {
        ...prev.academic,
        assignments: [newAsg, ...prev.academic.assignments]
      }
    }));
    showToast(`Assignment added: ${newAsg.title}`);
  };

  const toggleAssignment = (id) => {
    setData((prev) => ({
      ...prev,
      academic: {
        ...prev.academic,
        assignments: prev.academic.assignments.map((a) =>
          a.id === id ? { ...a, status: a.status === 'completed' ? 'pending' : 'completed' } : a
        )
      }
    }));
  };

  const updateAssignmentStatus = (id, newStatus) => {
    setData((prev) => ({
      ...prev,
      academic: {
        ...prev.academic,
        assignments: prev.academic.assignments.map((a) =>
          a.id === id ? { ...a, status: newStatus } : a
        )
      }
    }));
    showToast(`Assignment moved to ${newStatus.replace('-', ' ')}`);
  };

  const deleteAssignment = (id) => {
    setData((prev) => ({
      ...prev,
      academic: {
        ...prev.academic,
        assignments: prev.academic.assignments.filter((a) => a.id !== id)
      }
    }));
    showToast('Assignment deleted');
  };

  // --- Schedules ---
  const addScheduleSlot = (slot) => {
    const newSlot = {
      id: 'sch-' + Date.now(),
      day: slot.day || 'Mon',
      startTime: slot.startTime || '09:00 AM',
      endTime: slot.endTime || '10:00 AM',
      courseCode: slot.courseCode?.trim() || 'Course',
      room: slot.room?.trim() || 'TBD',
      color: slot.color || '#6366f1'
    };
    setData((prev) => ({
      ...prev,
      academic: {
        ...prev.academic,
        schedules: sortScheduleSlots([...prev.academic.schedules, newSlot])
      }
    }));
    showToast(`Class added: ${newSlot.courseCode} (${newSlot.day})`);
  };

  const updateScheduleSlot = (id, updated) => {
    setData((prev) => ({
      ...prev,
      academic: {
        ...prev.academic,
        schedules: sortScheduleSlots(
          prev.academic.schedules.map((s) =>
            s.id === id ? { ...s, ...updated } : s
          )
        )
      }
    }));
    showToast('Class schedule updated');
  };

  const deleteScheduleSlot = (id) => {
    setData((prev) => ({
      ...prev,
      academic: {
        ...prev.academic,
        schedules: prev.academic.schedules.filter((s) => s.id !== id)
      }
    }));
    showToast('Class removed from schedule');
  };

  // --- Course Resources ---
  const addAcademicResource = (res) => {
    const newRes = {
      id: 'res-' + Date.now(),
      title: res.title?.trim() || 'Untitled Resource',
      courseCode: res.courseCode?.trim() || 'General',
      type: res.type || 'link',
      url: res.url?.trim() || '',
      notes: res.notes?.trim() || ''
    };
    setData((prev) => ({
      ...prev,
      academic: {
        ...prev.academic,
        resources: [newRes, ...prev.academic.resources]
      }
    }));
    showToast(`Resource added: ${newRes.title}`);
  };

  const deleteAcademicResource = (id) => {
    setData((prev) => ({
      ...prev,
      academic: {
        ...prev.academic,
        resources: prev.academic.resources.filter((r) => r.id !== id)
      }
    }));
    showToast('Resource removed');
  };

  // --- Courses ---
  const addCourse = (course) => {
    const newCourse = {
      id: 'c-' + Date.now(),
      code: course.code,
      name: course.name,
      professor: course.professor || '',
      credits: parseInt(course.credits, 10) || 3,
      grade: course.grade || 'A',
      progress: parseInt(course.progress, 10) || 75,
      room: course.room || 'Room TBD',
      schedule: course.schedule || 'TBD'
    };
    setData((prev) => ({
      ...prev,
      academic: {
        ...prev.academic,
        courses: [...prev.academic.courses, newCourse]
      }
    }));
    showToast(`Course enrolled: ${newCourse.code}`);
  };

  const deleteCourse = (id) => {
    setData((prev) => ({
      ...prev,
      academic: {
        ...prev.academic,
        courses: prev.academic.courses.filter((c) => c.id !== id)
      }
    }));
    showToast('Course removed');
  };

  // --- Notes ---
  const addNote = (note) => {
    const newNote = {
      id: 'n-' + Date.now(),
      title: note.title,
      courseCode: note.courseCode || 'General',
      content: note.content || '',
      pinned: !!note.pinned,
      date: new Date().toISOString().split('T')[0],
      tags: note.tags ? (Array.isArray(note.tags) ? note.tags : note.tags.split(',').map((s) => s.trim())) : []
    };
    setData((prev) => ({
      ...prev,
      academic: {
        ...prev.academic,
        notes: [newNote, ...prev.academic.notes]
      }
    }));
    showToast(`Study note saved`);
  };

  const togglePinNote = (id) => {
    setData((prev) => ({
      ...prev,
      academic: {
        ...prev.academic,
        notes: prev.academic.notes.map((n) => (n.id === id ? { ...n, pinned: !n.pinned } : n))
      }
    }));
  };

  const deleteNote = (id) => {
    setData((prev) => ({
      ...prev,
      academic: {
        ...prev.academic,
        notes: prev.academic.notes.filter((n) => n.id !== id)
      }
    }));
    showToast('Note deleted');
  };

  // --- Reminders ---
  const addReminder = (rem) => {
    const newRem = {
      id: 'rem-' + Date.now(),
      title: rem.title,
      datetime: rem.datetime || new Date().toLocaleString(),
      priority: rem.priority || 'medium',
      completed: false
    };
    setData((prev) => {
      const updated = {
        ...prev,
        organization: {
          ...prev.organization,
          reminders: [newRem, ...prev.organization.reminders]
        }
      };
      if (nativeNotifStatus === 'granted') {
        setTimeout(() => checkAndDispatchDeadlineNotifications(updated, (view) => setActiveView(view)), 80);
      }
      return updated;
    });
    showToast(`Reminder scheduled: ${newRem.title}`);
  };

  const toggleReminder = (id) => {
    setData((prev) => ({
      ...prev,
      organization: {
        ...prev.organization,
        reminders: prev.organization.reminders.map((r) =>
          r.id === id ? { ...r, completed: !r.completed } : r
        )
      }
    }));
  };

  const deleteReminder = (id) => {
    setData((prev) => ({
      ...prev,
      organization: {
        ...prev.organization,
        reminders: prev.organization.reminders.filter((r) => r.id !== id)
      }
    }));
    showToast('Reminder deleted');
  };

  // --- Vault Accounts ---
  const addVaultAccount = (acc) => {
    const newAcc = {
      id: 'acc-vault-' + Date.now(),
      service: acc.service,
      category: acc.category || 'General',
      username: acc.username || '',
      email: acc.email || '',
      password: acc.password || '••••••••••••',
      twoFactorEnabled: acc.twoFactorEnabled === 'true' || acc.twoFactorEnabled === true,
      url: acc.url || '',
      notes: acc.notes || '',
      updatedAt: new Date().toISOString().split('T')[0]
    };
    setData((prev) => ({
      ...prev,
      personalAccounts: [newAcc, ...prev.personalAccounts]
    }));
    showToast(`Account saved to vault: ${newAcc.service}`);
  };

  const deleteVaultAccount = (id) => {
    setData((prev) => ({
      ...prev,
      personalAccounts: prev.personalAccounts.filter((a) => a.id !== id)
    }));
    showToast('Vault account removed');
  };

  const addAccountCategory = (categoryName) => {
    const trimmed = (categoryName || '').trim();
    if (!trimmed) return;
    setData((prev) => {
      const existing = prev.accountCategories || ['Academic', 'Finance', 'Dev', 'Design', 'Social', 'Entertainment', 'General'];
      if (existing.some((c) => c.toLowerCase() === trimmed.toLowerCase())) {
        showToast(`Category "${trimmed}" already exists`);
        return prev;
      }
      showToast(`Added category: ${trimmed}`);
      return {
        ...prev,
        accountCategories: [...existing, trimmed]
      };
    });
  };

  const removeAccountCategory = (categoryName) => {
    setData((prev) => {
      const existing = prev.accountCategories || ['Academic', 'Finance', 'Dev', 'Design', 'Social', 'Entertainment', 'General'];
      const updated = existing.filter((c) => c.toLowerCase() !== categoryName.toLowerCase());
      
      const fallbackCat = updated[0] || 'General';
      const updatedAccounts = (prev.personalAccounts || []).map((acc) =>
        acc.category?.toLowerCase() === categoryName.toLowerCase()
          ? { ...acc, category: fallbackCat }
          : acc
      );

      showToast(`Removed category: ${categoryName}`);
      return {
        ...prev,
        accountCategories: updated.length > 0 ? updated : ['General'],
        personalAccounts: updatedAccounts
      };
    });
  };

  // --- Reset & Backup ---
  const resetToDemo = () => {
    setData(initialDashboardData);
    showToast('Reset dashboard to default demo data');
  };

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `amils_dashboard_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    showToast('Exported backup file');
  };

  const importJSON = (jsonData) => {
    try {
      const parsed = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
      setData({ ...initialDashboardData, ...parsed });
      showToast('Imported dashboard data successfully');
    } catch (err) {
      showToast('Error importing JSON data');
    }
  };

  const updateProfile = (updates) => {
    setData((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        ...updates
      }
    }));
    showToast('Profile preferences saved!');
  };

  const setWeatherLocation = (newCity) => {
    const updated = getWeatherForCity(newCity);
    setData((prev) => ({
      ...prev,
      settings: { ...prev.settings, weather: updated }
    }));
    showToast(`Weather location updated: ${updated.city}`);
  };

  const cycleWeather = () => {
    const presetKeys = Object.keys(PHILIPPINES_WEATHER_PRESETS);
    const currentCity = data.settings?.weather?.city || 'Manila, Philippines';
    const currentIdx = presetKeys.findIndex((k) => k === currentCity);
    const nextKey = presetKeys[(currentIdx + 1) % presetKeys.length];
    setWeatherLocation(nextKey);
  };

  return (
    <DashboardContext.Provider
      value={{
        data,
        activeView,
        setActiveView,
        activeModal,
        setActiveModal,
        isCalendarOpen,
        setIsCalendarOpen,
        toggleCalendar: () => setIsCalendarOpen((prev) => !prev),
        searchQuery,
        setSearchQuery,
        toasts,
        showToast,
        cycleTheme,
        setTheme,
        updateProfile,
        cycleWeather,
        setWeatherLocation,
        PHILIPPINES_WEATHER_PRESETS,
        addTransaction,
        deleteTransaction,
        addFinancialAccount,
        deleteFinancialAccount,
        addSubscription,
        toggleSubscription,
        deleteSubscription,
        addGoal,
        updateGoalFunds,
        deleteGoal,
        addBill,
        toggleBillPaid,
        deleteBill,
        addTask,
        toggleTask,
        deleteTask,
        addAssignment,
        toggleAssignment,
        updateAssignmentStatus,
        deleteAssignment,
        addScheduleSlot,
        updateScheduleSlot,
        deleteScheduleSlot,
        addAcademicResource,
        deleteAcademicResource,
        addCourse,
        deleteCourse,
        addNote,
        togglePinNote,
        deleteNote,
        addReminder,
        toggleReminder,
        deleteReminder,
        addVaultAccount,
        deleteVaultAccount,
        addAccountCategory,
        removeAccountCategory,
        academicTab,
        setAcademicTab,
        nativeNotifStatus,
        enableNativeNotifications,
        testNativeNotification,
        resetToDemo,
        exportJSON,
        importJSON
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) throw new Error('useDashboard must be used within DashboardProvider');
  return context;
}
