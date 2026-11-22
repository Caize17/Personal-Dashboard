import React, { useState, useEffect, useMemo } from 'react';
import {
  CloudRain,
  Sun,
  Cloud,
  CloudSun,
  MapPin,
  Check,
  Plus,
  Wallet,
  GraduationCap,
  Calendar,
  FileText,
  Lock,
  Repeat,
  Target,
  Bell,
  Activity,
  Flame,
  TrendingUp,
  Award,
  Zap,
  CheckCircle2,
  PieChart as PieChartIcon,
  AlertCircle,
  Clock,
  Sparkles,
  Trash2
} from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';

// Dynamic phrase & quote based on current hour
const getDynamicGreeting = (hour, userName = '') => {
  const nameSuffix = userName?.trim() ? `, ${userName.trim()}` : '';
  if (hour >= 5 && hour < 12) {
    return {
      phrase: `Good morning${nameSuffix}! ☀️`,
      quote: "Every morning is a clean canvas. Fuel your ambition and focus on what moves the needle today.",
      tag: "Morning Focus 🌿",
      periodLabel: "Morning",
      periodEmoji: "🌅"
    };
  } else if (hour >= 12 && hour < 17) {
    return {
      phrase: `Good afternoon${nameSuffix}! 🌤️`,
      quote: "Small consistent efforts compound into remarkable achievements. Stay in flow and stay hydrated 💧",
      tag: "Afternoon Momentum ⚡",
      periodLabel: "Afternoon",
      periodEmoji: "☀️"
    };
  } else if (hour >= 17 && hour < 21) {
    return {
      phrase: `Good evening${nameSuffix}! 🌆`,
      quote: "Dusk brings quiet reflection. Review what you accomplished today and let your mind unwind with gratitude 🍵",
      tag: "Evening Reflection 🌇",
      periodLabel: "Evening",
      periodEmoji: "🌇"
    };
  } else {
    return {
      phrase: `Working late${nameSuffix}? 🌙`,
      quote: "Rest and recovery are just as vital as the grind. Protect your peace and recharge for tomorrow 🌌",
      tag: "Night Owl Care 💤",
      periodLabel: "Night Owl",
      periodEmoji: "🌙"
    };
  }
};

export default function HomeView() {
  const {
    data,
    cycleWeather,
    toggleTask,
    deleteTask,
    toggleReminder,
    deleteReminder,
    setActiveModal,
    setActiveView,
    searchQuery
  } = useDashboard();

  const [taskCategoryFilter, setTaskCategoryFilter] = useState('all');

  // Live ticking clock
  const [time, setTime] = useState(new Date());
  const [clockMode24, setClockMode24] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = clockMode24 ? time.getHours() : (time.getHours() % 12 || 12);
  const minutes = String(time.getMinutes()).padStart(2, '0');
  const seconds = String(time.getSeconds()).padStart(2, '0');
  const ampm = time.getHours() >= 12 ? 'PM' : 'AM';
  const timeFormatted = `${String(hours).padStart(2, '0')}:${minutes}`;
  const dateFormatted = time.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  });

  // Filtered tasks for Master To-Do List
  const filteredMasterTasks = data.organization.tasks.filter((t) => {
    if (taskCategoryFilter !== 'all' && t.category !== taskCategoryFilter) return false;
    if (
      searchQuery &&
      !t.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !t.category.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  // Dynamic time-based greeting and quote
  const currentHour = time.getHours();
  const dynamicGreeting = useMemo(
    () => getDynamicGreeting(currentHour, data.profile?.name || ''),
    [currentHour, data.profile?.name]
  );

  // Typewriter animation state for greeting phrase
  const [typedPhrase, setTypedPhrase] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    setTypedPhrase('');
    setIsTyping(true);
    let idx = 0;
    const target = dynamicGreeting.phrase;

    const interval = setInterval(() => {
      idx++;
      setTypedPhrase(target.slice(0, idx));
      if (idx >= target.length) {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 42);

    return () => clearInterval(interval);
  }, [dynamicGreeting.phrase]);

  // Task Progress Modes: 'acads' | 'org' | 'budget'
  const [gaugeMode, setGaugeMode] = useState('acads');

  // Task & Deliverable counts for Task Progress
  const totalTasks = data.organization.tasks.length;
  const completedTasks = data.organization.tasks.filter((t) => t.completed).length;
  const orgTaskRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const totalAssignments = data.academic.assignments.length;
  const completedAssignments = data.academic.assignments.filter((a) => a.status === 'completed').length;
  const acadsTaskRate = totalAssignments > 0 ? Math.round((completedAssignments / totalAssignments) * 100) : 0;
  const avgCourseProgress = Math.round(
    data.academic.courses.reduce((sum, c) => sum + c.progress, 0) / (data.academic.courses.length || 1)
  );

  const goals = data.finance.goals || [];
  const totalGoalTarget = goals.reduce((sum, g) => sum + (g.targetAmount || 0), 0);
  const totalGoalCurrent = goals.reduce((sum, g) => sum + (g.currentAmount || 0), 0);
  const budgetGoalRate = totalGoalTarget > 0 ? Math.round((totalGoalCurrent / totalGoalTarget) * 100) : 0;

  let gaugeValue = `${acadsTaskRate}%`;
  let gaugeLabel = 'Acads Done';
  let gaugeSubText = `${completedAssignments} of ${totalAssignments} completed • Course avg ${avgCourseProgress}%`;
  let gaugeOffset = 251.2 * (1 - Math.max(0.04, acadsTaskRate / 100));
  let gaugeGradient = ['#8b5cf6', '#6366f1', '#38bdf8'];

  if (gaugeMode === 'acads') {
    gaugeValue = `${acadsTaskRate}%`;
    gaugeLabel = 'Acads Done';
    gaugeSubText = `${completedAssignments} of ${totalAssignments} completed • Course avg ${avgCourseProgress}%`;
    gaugeOffset = 251.2 * (1 - Math.max(0.04, acadsTaskRate / 100));
    gaugeGradient = ['#8b5cf6', '#6366f1', '#38bdf8'];
  } else if (gaugeMode === 'org') {
    gaugeValue = `${orgTaskRate}%`;
    gaugeLabel = 'Tasks Done';
    gaugeSubText = `${completedTasks} of ${totalTasks} completed • ${totalTasks - completedTasks} pending`;
    gaugeOffset = 251.2 * (1 - Math.max(0.04, orgTaskRate / 100));
    gaugeGradient = ['#3b82f6', '#06b6d4', '#10b981'];
  } else if (gaugeMode === 'budget') {
    gaugeValue = `${budgetGoalRate}%`;
    gaugeLabel = 'Goal Funded';
    gaugeSubText = `₱${totalGoalCurrent.toLocaleString()} of ₱${totalGoalTarget.toLocaleString()} goal savings`;
    gaugeOffset = 251.2 * (1 - Math.max(0.04, budgetGoalRate / 100));
    gaugeGradient = ['#10b981', '#14b8a6', '#06b6d4'];
  }

  const pendingAssignments = data.academic.assignments.filter((a) => a.status === 'pending');
  const pendingBills = data.finance.bills.filter((b) => !b.isPaid);

  // Pending tasks: Only show uncompleted tasks.
  // When a user checks a task to complete it, it is immediately removed from the page.
  const pendingTasks = data.organization.tasks.filter((t) => !t.completed);

  // Helper to format due date for chips in mm/dd format (e.g. '10/27')
  const formatDueChipDate = (dateStr) => {
    if (!dateStr) return 'No Date';
    try {
      const parts = String(dateStr).split('-');
      if (parts.length === 3) {
        const mm = String(parts[1]).padStart(2, '0');
        const dd = String(parts[2]).slice(0, 2).padStart(2, '0');
        return `${mm}/${dd}`;
      }
      const d = new Date(dateStr);
      if (!isNaN(d.getTime())) {
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        return `${mm}/${dd}`;
      }
    } catch (e) { }
    return dateStr;
  };

  // Parse date string (YYYY-MM-DD) to millisecond timestamp for strict sorting
  const parseDueDateMs = (dateStr) => {
    if (!dateStr) return Infinity;
    try {
      if (typeof dateStr === 'string' && /^\d{4}-\d{2}-\d{2}/.test(dateStr)) {
        const parts = dateStr.split('-');
        return new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2].slice(0, 2))).getTime();
      }
      const t = new Date(dateStr).getTime();
      return isNaN(t) ? Infinity : t;
    } catch (e) {
      return Infinity;
    }
  };

  // Incoming due items: sorted with the nearer deadline at the top (ascending order)
  const incomingDue = [
    ...pendingTasks
      .filter((t) => t.dueDate)
      .map((t) => ({
        id: `task-${t.id}`,
        title: t.title,
        sub: `Task • ${t.category}`,
        dueDate: t.dueDate,
        badgeClass: t.priority === 'high' ? 'badge-urgent' : 'badge-soon',
        badgeText: formatDueChipDate(t.dueDate)
      })),
    ...pendingAssignments
      .filter((a) => a.dueDate)
      .map((a) => ({
        id: `asg-${a.id}`,
        title: a.title,
        sub: a.weight ? `${a.courseCode} • Weight ${a.weight}` : `${a.courseCode} • Academic`,
        dueDate: a.dueDate,
        badgeClass: a.priority === 'high' ? 'badge-urgent' : 'badge-soon',
        badgeText: formatDueChipDate(a.dueDate)
      })),
    ...pendingBills
      .filter((b) => b.dueDate)
      .map((b) => ({
        id: `bill-${b.id}`,
        title: b.title,
        sub: `Bill • ₱${b.amount}`,
        dueDate: b.dueDate,
        badgeClass: 'badge-urgent',
        badgeText: formatDueChipDate(b.dueDate)
      }))
  ]
    .sort((a, b) => parseDueDateMs(a.dueDate) - parseDueDateMs(b.dueDate))
    .slice(0, 5);

  const weather = data.settings.weather || {
    city: 'Manila, Philippines',
    temp: '31°',
    tempMin: '25°',
    tempMax: '33°',
    condition: 'Tropical Sun & Showers',
    icon: 'sun-rain',
    forecast: [
      { day: 'FRI', temp: '31°', low: '25°', icon: 'sun-rain' },
      { day: 'SAT', temp: '32°', low: '26°', icon: 'sun' },
      { day: 'SUN', temp: '30°', low: '25°', icon: 'rain' },
      { day: 'MON', temp: '31°', low: '25°', icon: 'cloud-sun' },
      { day: 'TUE', temp: '33°', low: '26°', icon: 'sun' },
      { day: 'WED', temp: '32°', low: '25°', icon: 'sun-rain' },
      { day: 'THU', temp: '31°', low: '24°', icon: 'sun' }
    ]
  };

  return (
    <div className="view-container">
      {/* Hero Row: Welcome Card (with Today's Weather) + Clean Live Digital Clock */}
      <div className="home-hero-row">

        {/* Welcome Card with Greeting on Left, and Today's Weather Widget on Right */}
        <div className="welcome-card">
          <div className="welcome-content-split">
            {/* Left Column: Greeting & Animated Quote */}
            <div className="welcome-left-column">
              <div className="welcome-header-row">
                <h2 className="welcome-title typing-welcome-heading">
                  <span>{typedPhrase}</span>
                  <span className={`typing-cursor ${isTyping ? 'typing' : 'blink'}`}>|</span>
                </h2>
              </div>

              {/* Animated Quote Bubble */}
              <div className="welcome-quote-container" key={dynamicGreeting.quote}>
                <div className="welcome-quote-bubble">
                  <span className="quote-mark">“</span>
                  <p className="welcome-quote-text">{dynamicGreeting.quote}</p>
                </div>
              </div>
            </div>

            {/* Right Column: Today's Weather Widget (Matching Image 1 / user reference) */}
            <div className="today-weather-widget">
              <div className="today-weather-top">
                <div className="today-weather-icon-box">
                  {weather.icon === 'rain' ? (
                    <CloudRain size={38} strokeWidth={1.8} color="#38bdf8" />
                  ) : weather.icon === 'sun' ? (
                    <Sun size={38} strokeWidth={1.8} color="#f59e0b" />
                  ) : weather.icon === 'cloud-sun' || weather.icon === 'sun-rain' ? (
                    <CloudSun size={38} strokeWidth={1.8} color="#818cf8" />
                  ) : (
                    <Cloud size={38} strokeWidth={1.8} color="#94a3b8" />
                  )}
                </div>
                <span className="today-weather-temp">{weather.temp || '31°'}</span>
              </div>
              <div className="today-weather-bottom">
                <div className="today-weather-condition">{weather.condition || 'Tropical Sun & Showers'}</div>
                <div className="today-weather-sub">
                  {weather.city || 'Manila, Philippines'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Live Digital Clock Widget (Clean, balanced, not stretched out) */}
        <div
          className="live-clock-card"
          onClick={() => setClockMode24(!clockMode24)}
          title="Click to toggle 12h/24h format"
        >
          <div className="clock-pulse-indicator">
            <span className="pulse-dot" style={{ width: '7px', height: '7px' }} />
            <span className="clock-status-live">PH TIME</span>
          </div>

          <div className="clock-time-display">
            <span>{timeFormatted}</span>
            <span className="clock-seconds">:{seconds}</span>
            {!clockMode24 && <span style={{ fontSize: '16px', marginLeft: '6px' }}>{ampm}</span>}
          </div>

          <div className="clock-date-display">{dateFormatted}</div>
        </div>
      </div>

      {/* ====================================================================
           3-COLUMN OVERVIEW GRID: Incoming Deadlines, Agenda & Routine, Progress
           ==================================================================== */}
      <div className="home-widgets-grid">
        {/* Column 1: Incoming Deadlines */}
        <div className="glass-card widget-card">
          <div className="widget-header">
            <div>
              <h3 className="widget-title">Incoming Deadlines</h3>
            </div>
            <span className="widget-counter">{incomingDue.length} active</span>
          </div>
          <div className="due-items-list" style={{ flex: 1 }}>
            {incomingDue.length === 0 ? (
              <div className="empty-tasks-placeholder">
                <CheckCircle2 size={28} color="#10b981" />
                <span className="empty-tasks-title">No upcoming deadlines!</span>
                <span className="empty-tasks-sub">All clear on bills, tasks, and coursework.</span>
              </div>
            ) : (
              incomingDue.map((item) => (
                <div key={item.id} className="due-item-card">
                  <div className="due-meta">
                    <span className="due-title">{item.title}</span>
                    <span className="due-sub">{item.sub}</span>
                  </div>
                  <span className={`due-badge ${item.badgeClass}`}>{item.badgeText}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Column 2: Today's Agenda & Routine */}
        <div className="glass-card widget-card">
          <div className="widget-header">
            <div>
              <h3 className="widget-title">Upcoming Agenda & Routine</h3>
            </div>
            <span className="widget-counter">{data.organization.scheduleEvents.length} events</span>
          </div>
          <div className="due-items-list" style={{ flex: 1 }}>
            {data.organization.scheduleEvents.length === 0 ? (
              <div className="empty-tasks-placeholder">
                <Calendar size={28} color="#6366f1" />
                <span className="empty-tasks-title">No events scheduled</span>
                <span className="empty-tasks-sub">Your schedule is clear for now.</span>
              </div>
            ) : (
              data.organization.scheduleEvents.map((evt) => (
                <div key={evt.id} className="due-item-card">
                  <div className="due-meta">
                    <span className="due-title">{evt.title}</span>
                    <span className="due-sub">
                      {evt.location} • {evt.category}
                    </span>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <span className="due-badge badge-upcoming">{evt.time}</span>
                    <div style={{ fontSize: '10.5px', color: 'var(--text-muted)', marginTop: '2px' }}>
                      {evt.date}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Column 3: Task & Goal Progress Gauge */}
        <div className="glass-card widget-card">
          <div className="widget-header">
            <div>
              <h3 className="widget-title">Progress & Goals</h3>
            </div>
            <div className="gauge-modes-selector">
              <button
                className={`gauge-tab-btn ${gaugeMode === 'acads' ? 'active' : ''}`}
                onClick={() => setGaugeMode('acads')}
              >
                Academics
              </button>
              <button
                className={`gauge-tab-btn ${gaugeMode === 'org' ? 'active' : ''}`}
                onClick={() => setGaugeMode('org')}
              >
                Tasks
              </button>
              <button
                className={`gauge-tab-btn ${gaugeMode === 'budget' ? 'active' : ''}`}
                onClick={() => setGaugeMode('budget')}
              >
                Savings
              </button>
            </div>
          </div>

          <div className="progress-widget-body">
            <div className="gauge-svg-container">
              <svg className="gauge-svg" viewBox="0 0 200 120">
                <defs>
                  <linearGradient id="gaugeGradientDynamic" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor={gaugeGradient[0]} />
                    <stop offset="50%" stopColor={gaugeGradient[1]} />
                    <stop offset="100%" stopColor={gaugeGradient[2]} />
                  </linearGradient>
                </defs>
                <path
                  d="M 20 105 A 80 80 0 0 1 180 105"
                  fill="none"
                  stroke="rgba(226, 232, 240, 0.45)"
                  strokeWidth="14"
                  strokeLinecap="round"
                />
                <path
                  d="M 20 105 A 80 80 0 0 1 180 105"
                  fill="none"
                  stroke="url(#gaugeGradientDynamic)"
                  strokeWidth="14"
                  strokeLinecap="round"
                  strokeDasharray="251.2"
                  strokeDashoffset={gaugeOffset}
                  style={{ transition: 'stroke-dashoffset 0.8s ease' }}
                />
              </svg>

              <div className="gauge-center-reading">
                <div className="gauge-number">{gaugeValue}</div>
                <div className="gauge-caption">{gaugeLabel}</div>
              </div>
            </div>

            <div className="gauge-sub-caption">
              {gaugeSubText}
            </div>
          </div>
        </div>
      </div>

      {/* ====================================================================
           TASK & REMINDER HUB (2-Column Unified Workspace)
           ==================================================================== */}
      <div className="home-org-section" style={{ marginTop: '28px' }}>
        <div className="section-headline-row" style={{ marginBottom: '16px' }}>
          <div>
            <h3 className="section-title" style={{ fontSize: '18px', fontWeight: 700 }}>
              Daily Tasks & Priority Reminders
            </h3>
          </div>
        </div>

        <div className="org-columns-grid">
          {/* Column 1: Master To-Do List */}
          <div className="glass-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
              <div>
                <h3 className="section-title" style={{ fontSize: '15.5px' }}>Master To-Do List</h3>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  {data.organization.tasks.filter((t) => !t.completed).length} open tasks
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <select
                  className="form-select"
                  style={{ width: 'auto', padding: '4px 10px', fontSize: '12px' }}
                  value={taskCategoryFilter}
                  onChange={(e) => setTaskCategoryFilter(e.target.value)}
                >
                  <option value="all">All Categories</option>
                  <option value="Academic">Academic</option>
                  <option value="Personal">Personal</option>
                  <option value="Health">Health</option>
                  <option value="Finance">Finance</option>
                </select>
                <button
                  className="btn-primary"
                  style={{ padding: '5px 12px', fontSize: '12px', gap: '5px' }}
                  onClick={() => setActiveModal('task')}
                >
                  <Plus size={14} />
                  <span>Add Task</span>
                </button>
              </div>
            </div>

            <div className="tasks-pill-list" style={{ maxHeight: '420px', overflowY: 'auto' }}>
              {filteredMasterTasks.length === 0 ? (
                <div className="empty-tasks-placeholder" style={{ padding: '30px 0' }}>
                  <CheckCircle2 size={26} color="#10b981" />
                  <span className="empty-tasks-title">No tasks found</span>
                  <span className="empty-tasks-sub">Add a task or adjust your category filter</span>
                </div>
              ) : (
                filteredMasterTasks.map((task) => (
                  <div
                    key={task.id}
                    className={`task-pill-item ${task.completed ? 'completed' : ''}`}
                    style={{ justifyContent: 'space-between' }}
                  >
                    <div
                      style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0, cursor: 'pointer' }}
                      onClick={() => toggleTask(task.id)}
                    >
                      <div className="task-checkbox-round">
                        {task.completed && <Check size={13} strokeWidth={3} />}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                        <span className="task-pill-label">{task.title}</span>
                        {(task.dueDate || task.dueTime) && (
                          <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '1px' }}>
                            <Clock size={10} />
                            {task.dueDate} {task.dueTime ? `• ${task.dueTime}` : ''}
                          </span>
                        )}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="task-pill-badge">{task.category}</span>
                      <button
                        className="vault-btn-icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteTask(task.id);
                        }}
                        title="Delete task"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Column 2: Priority Reminders */}
          <div className="glass-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
              <div>
                <h3 className="section-title" style={{ fontSize: '15.5px' }}>Priority Reminders</h3>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="widget-counter">
                  {data.organization.reminders.filter((r) => !r.completed).length} pending
                </span>
                <button
                  className="btn-secondary"
                  style={{ padding: '5px 12px', fontSize: '12px', gap: '5px' }}
                  onClick={() => setActiveModal('reminder')}
                >
                  <Bell size={14} />
                  <span>Set Alert</span>
                </button>
              </div>
            </div>

            <div className="reminders-list" style={{ maxHeight: '420px', overflowY: 'auto' }}>
              {data.organization.reminders.length === 0 ? (
                <div className="empty-tasks-placeholder" style={{ padding: '30px 0' }}>
                  <Bell size={26} color="#6366f1" />
                  <span className="empty-tasks-title">No reminders set</span>
                  <span className="empty-tasks-sub">Click "Set Alert" to add a reminder</span>
                </div>
              ) : (
                data.organization.reminders.map((rem) => (
                  <div
                    key={rem.id}
                    className={`reminder-item ${rem.completed ? 'completed' : ''}`}
                  >
                    <div
                      style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, cursor: 'pointer' }}
                      onClick={() => toggleReminder(rem.id)}
                    >
                      <div className="task-checkbox-round">
                        {rem.completed && <Check size={13} strokeWidth={3} />}
                      </div>
                      <div>
                        <div className="reminder-title" style={{ fontSize: '13.5px', fontWeight: 600 }}>
                          {rem.title}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                          {rem.datetime}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span
                        className={`due-badge ${rem.priority === 'high' ? 'badge-urgent' : 'badge-soon'}`}
                      >
                        {rem.priority}
                      </span>
                      <button
                        className="vault-btn-icon"
                        onClick={() => deleteReminder(rem.id)}
                        title="Delete reminder"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ====================================================================
           QUICK ACTIONS & WORKFLOWS
           ==================================================================== */}
      <div className="quick-launcher-section" style={{ marginTop: '28px' }}>
        <div className="section-headline-row">
          <div>
            <h3 className="section-title">Quick Actions & Workflows</h3>
          </div>
        </div>

        <div className="actions-8-grid">
          <div className="action-card-tile" onClick={() => setActiveModal('transaction')}>
            <div className="action-tile-icon" style={{ background: '#e0e7ff', color: '#4f46e5' }}>
              <Wallet size={18} />
            </div>
            <div className="action-tile-content">
              <span className="action-tile-title">Log Expense</span>
              <span className="action-tile-desc">Record food, books, or fees</span>
            </div>
          </div>

          <div className="action-card-tile" onClick={() => setActiveModal('assignment')}>
            <div className="action-tile-icon" style={{ background: '#fce7f3', color: '#db2777' }}>
              <GraduationCap size={18} />
            </div>
            <div className="action-tile-content">
              <span className="action-tile-title">Add Assignment</span>
              <span className="action-tile-desc">Track deadlines & deliverables</span>
            </div>
          </div>

          <div className="action-card-tile" onClick={() => setActiveView('academic')}>
            <div className="action-tile-icon" style={{ background: '#ede9fe', color: '#7c3aed' }}>
              <Calendar size={18} />
            </div>
            <div className="action-tile-content">
              <span className="action-tile-title">Class Timetable</span>
              <span className="action-tile-desc">View weekly lectures</span>
            </div>
          </div>

          <div className="action-card-tile" onClick={() => setActiveModal('note')}>
            <div className="action-tile-icon" style={{ background: '#fef3c7', color: '#d97706' }}>
              <FileText size={18} />
            </div>
            <div className="action-tile-content">
              <span className="action-tile-title">Study Note</span>
              <span className="action-tile-desc">Capture key concepts</span>
            </div>
          </div>

          <div className="action-card-tile" onClick={() => setActiveModal('vault-account')}>
            <div className="action-tile-icon" style={{ background: '#dbeafe', color: '#2563eb' }}>
              <Lock size={18} />
            </div>
            <div className="action-tile-content">
              <span className="action-tile-title">Save Account</span>
              <span className="action-tile-desc">Store login in secure vault</span>
            </div>
          </div>

          <div className="action-card-tile" onClick={() => setActiveModal('subscription')}>
            <div className="action-tile-icon" style={{ background: '#dcfce7', color: '#16a34a' }}>
              <Repeat size={18} />
            </div>
            <div className="action-tile-content">
              <span className="action-tile-title">Track Subscription</span>
              <span className="action-tile-desc">Spotify, ChatGPT, Cloud</span>
            </div>
          </div>

          <div className="action-card-tile" onClick={() => setActiveModal('goal')}>
            <div className="action-tile-icon" style={{ background: '#ffedd5', color: '#ea580c' }}>
              <Target size={18} />
            </div>
            <div className="action-tile-content">
              <span className="action-tile-title">Savings Goal</span>
              <span className="action-tile-desc">Emergency fund & travel</span>
            </div>
          </div>

          <div className="action-card-tile" onClick={() => setActiveModal('reminder')}>
            <div className="action-tile-icon" style={{ background: '#e0f2fe', color: '#0284c7' }}>
              <Bell size={18} />
            </div>
            <div className="action-tile-content">
              <span className="action-tile-title">Set Reminder</span>
              <span className="action-tile-desc">Time-sensitive alerts</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
