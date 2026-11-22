import React, { useState, useMemo } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  X,
  Check,
  CheckCircle,
  Clock,
  Plus,
  AlertCircle,
  Bell
} from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';

export default function CalendarDrawer() {
  const {
    isCalendarOpen,
    setIsCalendarOpen,
    toggleCalendar,
    data,
    toggleTask,
    toggleAssignment,
    toggleBillPaid,
    toggleReminder,
    setActiveModal
  } = useDashboard();

  // Calendar Date State (Defaulting to real-time current date)
  const todayStr = useMemo(() => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }, []);

  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [selectedDateStr, setSelectedDateStr] = useState(() => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  });
  const [filterType, setFilterType] = useState('all'); // 'all' | 'assignments' | 'tasks' | 'bills'

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  // Aggregate all items across the app with due dates
  const allDeadlines = useMemo(() => {
    const items = [];

    // Academic Assignments
    (data.academic?.assignments || []).forEach((asg) => {
      if (asg.dueDate) {
        items.push({
          id: asg.id,
          type: 'assignment',
          title: asg.title,
          date: asg.dueDate,
          subtext: asg.weight ? `${asg.courseCode} • Weight ${asg.weight}` : `${asg.courseCode} • Academic`,
          priority: asg.priority,
          completed: asg.status === 'completed',
          color: '#8b5cf6'
        });
      }
    });

    // Organization Tasks
    (data.organization?.tasks || []).forEach((task) => {
      if (task.dueDate) {
        items.push({
          id: task.id,
          type: 'task',
          title: task.title,
          date: task.dueDate,
          subtext: task.dueTime ? `${task.category} • ${task.dueTime}` : task.category,
          priority: task.priority,
          completed: task.completed,
          color: '#3b82f6'
        });
      }
    });

    // Priority Reminders
    (data.organization?.reminders || []).forEach((rem) => {
      let remDate = rem.date;
      if (!remDate && rem.datetime) {
        if (typeof rem.datetime === 'string' && rem.datetime.includes('T')) {
          remDate = rem.datetime.split('T')[0];
        } else {
          try {
            const d = new Date(rem.datetime);
            if (!isNaN(d.getTime())) {
              const y = d.getFullYear();
              const m = String(d.getMonth() + 1).padStart(2, '0');
              const day = String(d.getDate()).padStart(2, '0');
              remDate = `${y}-${m}-${day}`;
            }
          } catch (e) {}
        }
      }

      if (remDate) {
        let timeDisplay = rem.time || '';
        if (!timeDisplay && rem.datetime && typeof rem.datetime === 'string' && rem.datetime.includes('T')) {
          timeDisplay = rem.datetime.split('T')[1];
        }
        items.push({
          id: rem.id,
          type: 'reminder',
          title: rem.title,
          date: remDate,
          subtext: timeDisplay ? `Priority Reminder • ${timeDisplay}` : 'Priority Reminder',
          priority: rem.priority || 'high',
          completed: Boolean(rem.completed),
          color: '#f59e0b'
        });
      }
    });

    // Finance Bills
    (data.finance?.bills || []).forEach((bill) => {
      if (bill.dueDate) {
        items.push({
          id: bill.id,
          type: 'bill',
          title: bill.title,
          date: bill.dueDate,
          subtext: `$${bill.amount.toFixed(2)} • ${bill.category}`,
          priority: 'high',
          completed: bill.isPaid,
          color: '#f43f5e'
        });
      }
    });

    // Schedule Events
    (data.organization?.scheduleEvents || []).forEach((evt) => {
      if (evt.date) {
        items.push({
          id: evt.id,
          type: 'event',
          title: evt.title,
          date: evt.date,
          subtext: `${evt.time} • ${evt.location}`,
          priority: 'medium',
          completed: false,
          color: '#10b981'
        });
      }
    });

    return items;
  }, [data]);

  // Total pending count
  const pendingCount = allDeadlines.filter((item) => !item.completed).length;

  // Calendar calculation
  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  // Day of week index (0 = Mon, 6 = Sun)
  const startingDay = (firstDayOfMonth.getDay() + 6) % 7;

  const prevMonthDays = new Date(currentYear, currentMonth, 0).getDate();

  const daysMatrix = [];
  // Previous month trailing days
  for (let i = startingDay - 1; i >= 0; i--) {
    daysMatrix.push({
      dayNumber: prevMonthDays - i,
      isCurrentMonth: false,
      dateStr: `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(prevMonthDays - i).padStart(2, '0')}`
    });
  }
  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    const formattedMonth = String(currentMonth + 1).padStart(2, '0');
    const formattedDay = String(i).padStart(2, '0');
    daysMatrix.push({
      dayNumber: i,
      isCurrentMonth: true,
      dateStr: `${currentYear}-${formattedMonth}-${formattedDay}`
    });
  }
  // Next month leading days to complete grid
  const remainingCells = 42 - daysMatrix.length;
  for (let i = 1; i <= remainingCells; i++) {
    const formattedNextMonth = String(currentMonth + 2).padStart(2, '0');
    const formattedDay = String(i).padStart(2, '0');
    daysMatrix.push({
      dayNumber: i,
      isCurrentMonth: false,
      dateStr: `${currentYear}-${formattedNextMonth}-${formattedDay}`
    });
  }

  // Next / Prev Month navigation
  const prevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };
  const nextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };
  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDateStr(todayStr);
  };

  // Items due on selected date
  const selectedDateItems = allDeadlines.filter((item) => {
    if (filterType !== 'all' && item.type !== filterType) return false;
    return item.date === selectedDateStr;
  });

  // Upcoming items sorted
  const upcomingItems = allDeadlines
    .filter((item) => !item.completed)
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 6);

  const handleToggleItem = (item) => {
    if (item.type === 'task') {
      toggleTask(item.id);
    } else if (item.type === 'assignment') {
      toggleAssignment(item.id);
    } else if (item.type === 'bill') {
      toggleBillPaid(item.id);
    } else if (item.type === 'reminder') {
      toggleReminder(item.id);
    }
  };

  return (
    <>
      {/* Dimmed backdrop when calendar is open */}
      <div
        className={`calendar-drawer-backdrop ${isCalendarOpen ? 'active' : ''}`}
        onClick={() => setIsCalendarOpen(false)}
        aria-hidden="true"
      />

      {/* Side Pop-Up Calendar Panel (Rounded contour matching user's image) */}
      <aside className={`calendar-drawer-panel ${isCalendarOpen ? 'active' : ''}`}>

        {/* Panel Header */}
        <div className="drawer-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="drawer-header-icon">
              <CalendarIcon size={18} />
            </div>
            <div>
              <h3 className="drawer-title">Calendar</h3>
            </div>
          </div>

          <button
            className="modal-close-btn"
            onClick={() => setIsCalendarOpen(false)}
            title="Close Panel"
          >
            <X size={18} />
          </button>
        </div>

        {/* Month Navigation Row */}
        <div className="calendar-month-controls">
          <div className="month-label-wrap">
            <span className="month-text">{monthName}</span>
            <span className="year-text">{currentYear}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button className="cal-nav-btn" onClick={goToToday} title="Go to current date">
              Today
            </button>
            <button className="cal-nav-btn icon-only" onClick={prevMonth} title="Previous Month">
              <ChevronLeft size={16} />
            </button>
            <button className="cal-nav-btn icon-only" onClick={nextMonth} title="Next Month">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* 7-Day Month Matrix */}
        <div className="calendar-grid-container">
          <div className="cal-weekdays-row">
            {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((day) => (
              <span key={day} className="cal-weekday-header">{day}</span>
            ))}
          </div>

          <div className="cal-days-grid">
            {daysMatrix.map((dayObj, index) => {
              const isSelected = dayObj.dateStr === selectedDateStr;
              const isToday = dayObj.dateStr === todayStr;

              // Deadlines on this day
              const dayDeadlines = allDeadlines.filter((item) => item.date === dayObj.dateStr);
              const hasAssignments = dayDeadlines.some((d) => d.type === 'assignment');
              const hasTasks = dayDeadlines.some((d) => d.type === 'task');
              const hasReminders = dayDeadlines.some((d) => d.type === 'reminder');
              const hasBills = dayDeadlines.some((d) => d.type === 'bill');
              const hasEvents = dayDeadlines.some((d) => d.type === 'event');

              return (
                <button
                  key={index}
                  className={`cal-day-cell ${dayObj.isCurrentMonth ? '' : 'outside-month'} ${isSelected ? 'selected' : ''
                    } ${isToday ? 'today' : ''}`}
                  onClick={() => setSelectedDateStr(dayObj.dateStr)}
                >
                  <span className="cal-day-number">{dayObj.dayNumber}</span>

                  {/* Indicators for tasks on this date */}
                  <div className="cal-indicators-row">
                    {hasAssignments && <span className="cal-dot dot-assignment" title="Assignment Due" />}
                    {hasTasks && <span className="cal-dot dot-task" title="Task Due" />}
                    {hasReminders && <span className="cal-dot dot-reminder" title="Priority Reminder" />}
                    {hasBills && <span className="cal-dot dot-bill" title="Bill Due" />}
                    {hasEvents && <span className="cal-dot dot-event" title="Event Scheduled" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="cal-legend-row">
          <span className="legend-item"><span className="cal-dot dot-assignment" /> Assignment</span>
          <span className="legend-item"><span className="cal-dot dot-task" /> Task</span>
          <span className="legend-item"><span className="cal-dot dot-reminder" /> Reminder</span>
          <span className="legend-item"><span className="cal-dot dot-bill" /> Bill</span>
          <span className="legend-item"><span className="cal-dot dot-event" /> Event</span>
        </div>

        {/* Filter Pills */}
        <div className="drawer-filter-row">
          <button
            className={`drawer-filter-btn ${filterType === 'all' ? 'active' : ''}`}
            onClick={() => setFilterType('all')}
          >
            All Items
          </button>
          <button
            className={`drawer-filter-btn ${filterType === 'reminder' ? 'active' : ''}`}
            onClick={() => setFilterType('reminder')}
          >
            Reminders
          </button>
          <button
            className={`drawer-filter-btn ${filterType === 'task' ? 'active' : ''}`}
            onClick={() => setFilterType('task')}
          >
            Tasks
          </button>
          <button
            className={`drawer-filter-btn ${filterType === 'assignment' ? 'active' : ''}`}
            onClick={() => setFilterType('assignment')}
          >
            Assignments
          </button>
          <button
            className={`drawer-filter-btn ${filterType === 'bill' ? 'active' : ''}`}
            onClick={() => setFilterType('bill')}
          >
            Bills
          </button>
        </div>

        {/* Selected Date Items List */}
        <div className="drawer-section">
          <div className="section-meta-row">
            <span className="section-date-heading">
              {new Date(selectedDateStr + 'T00:00:00').toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric'
              })}
            </span>
            <span className="section-items-badge">
              {selectedDateItems.length} {selectedDateItems.length === 1 ? 'item' : 'items'}
            </span>
          </div>

          <div className="drawer-items-list">
            {selectedDateItems.length === 0 ? (
              <div className="drawer-empty-state">
                <Clock size={20} color="var(--text-muted)" />
                <span>No deadlines on this date.</span>
              </div>
            ) : (
              selectedDateItems.map((item) => (
                <div
                  key={`${item.type}-${item.id}`}
                  className={`drawer-task-item ${item.completed ? 'completed' : ''}`}
                >
                  <button
                    className="task-checkbox-round"
                    onClick={() => handleToggleItem(item)}
                    title={item.completed ? 'Mark incomplete' : 'Mark complete'}
                  >
                    {item.completed && <Check size={12} strokeWidth={3} />}
                  </button>

                  <div className="drawer-task-info">
                    <span className="drawer-task-title">{item.title}</span>
                    <span className="drawer-task-sub">{item.subtext}</span>
                  </div>

                  <span
                    className={`due-badge ${item.priority === 'high'
                      ? 'badge-urgent'
                      : item.priority === 'medium'
                        ? 'badge-soon'
                        : 'badge-upcoming'
                      }`}
                  >
                    {item.type === 'reminder' ? 'Reminder' : item.type}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Upcoming Timeline Section */}
        <div className="drawer-section" style={{ marginTop: '14px', borderTop: '1px solid var(--glass-border-subtle)', paddingTop: '14px' }}>
          <div className="section-meta-row">
            <span className="section-date-heading" style={{ fontSize: '13px' }}>
              Upcoming Deadlines Timeline
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <button
                className="vault-btn-icon"
                onClick={() => setActiveModal('reminder')}
                title="Set Priority Reminder"
              >
                <Bell size={14} />
              </button>
              <button
                className="vault-btn-icon"
                onClick={() => setActiveModal('task')}
                title="Add New Task"
              >
                <Plus size={15} />
              </button>
            </div>
          </div>

          <div className="drawer-timeline-list">
            {upcomingItems.length === 0 ? (
              <div className="drawer-empty-state">
                <Clock size={18} color="var(--text-muted)" />
                <span>No upcoming deadlines scheduled.</span>
              </div>
            ) : (
              upcomingItems.map((item) => (
                <div
                  key={`timeline-${item.type}-${item.id}`}
                  className="drawer-timeline-card"
                  onClick={() => setSelectedDateStr(item.date)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, flex: 1, overflow: 'hidden' }}>
                    <span
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: item.color,
                        flexShrink: 0
                      }}
                    />
                    <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, flex: 1, overflow: 'hidden' }}>
                      <span className="timeline-title">{item.title}</span>
                      <span className="timeline-sub">{item.subtext}</span>
                    </div>
                  </div>

                  <span className="timeline-date">{item.date}</span>
                </div>
              ))
            )}
          </div>
        </div>

      </aside>
    </>
  );
}
