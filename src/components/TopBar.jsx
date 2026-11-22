import React, { useState, useMemo } from 'react';
import { Bell, Calendar, CheckCircle2, Clock, AlertCircle, BellRing } from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';

export default function TopBar() {
  const {
    toggleCalendar,
    setActiveView,
    data,
    showToast,
    nativeNotifStatus,
    enableNativeNotifications
  } = useDashboard();

  const [isNotifOpen, setIsNotifOpen] = useState(false);

  // Dynamically derive notifications from real data
  const notifications = useMemo(() => {
    const list = [];
    const currency = data.settings?.currency || '₱';

    // Unpaid bills
    (data.finance?.bills || []).filter((b) => !b.isPaid).forEach((b) => {
      list.push({
        id: `notif-bill-${b.id}`,
        type: 'bill',
        title: 'Upcoming Bill',
        message: `${b.title} (${currency}${Number(b.amount || 0).toFixed(2)}) due ${b.dueDate || 'soon'}`,
        time: b.dueDate || 'Upcoming',
        view: 'finance',
        urgent: true
      });
    });

    // High priority pending assignments
    (data.academic?.assignments || []).filter((a) => a.status !== 'completed' && a.priority === 'high').forEach((a) => {
      list.push({
        id: `notif-asg-${a.id}`,
        type: 'academic',
        title: 'Assignment Deadline',
        message: `${a.courseCode ? a.courseCode + ': ' : ''}${a.title} due ${a.dueDate || 'soon'}`,
        time: a.dueDate || 'Upcoming',
        view: 'academic',
        urgent: true
      });
    });

    // High priority pending tasks
    (data.organization?.tasks || []).filter((t) => !t.completed && t.priority === 'high').forEach((t) => {
      list.push({
        id: `notif-task-${t.id}`,
        type: 'task',
        title: 'Priority Task',
        message: `${t.title}${t.dueDate ? ' due ' + t.dueDate : ''}${t.dueTime ? ' at ' + t.dueTime : ''}`,
        time: t.dueTime ? `${t.dueDate} ${t.dueTime}` : (t.dueDate || 'Pending'),
        view: 'home',
        urgent: false
      });
    });

    // Pending reminders
    (data.organization?.reminders || []).filter((r) => !r.completed).forEach((r) => {
      list.push({
        id: `notif-rem-${r.id}`,
        type: 'reminder',
        title: 'Priority Reminder',
        message: `${r.title} (${r.datetime ? r.datetime.replace('T', ' ') : 'Scheduled'})`,
        time: r.datetime ? r.datetime.replace('T', ' ') : 'Scheduled',
        view: 'home',
        urgent: r.priority === 'high'
      });
    });

    return list;
  }, [data.finance?.bills, data.academic?.assignments, data.organization?.tasks, data.organization?.reminders, data.settings?.currency]);

  const [unreadCount, setUnreadCount] = useState(notifications.length);

  const handleMarkAllRead = () => {
    setUnreadCount(0);
    showToast('All notifications marked as read');
  };

  const handleNotificationClick = (view) => {
    setIsNotifOpen(false);
    setActiveView(view);
  };

  return (
    <header className="top-bar">
      <div />
      {/* Right side: Notifications & Calendar Drawer Trigger */}
      <div className="top-actions-group" style={{ position: 'relative' }}>
        {/* Calendar Side Drawer Trigger */}
        <button
          className="icon-btn-round"
          onClick={toggleCalendar}
          title="Open Calendar & Deadlines"
          aria-label="Open Calendar"
        >
          <Calendar size={18} />
        </button>

        {/* Notifications Button */}
        <button
          className="icon-btn-round"
          onClick={() => setIsNotifOpen(!isNotifOpen)}
          title="Notifications"
          aria-label="View Notifications"
        >
          <Bell size={18} />
          {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
        </button>

        {/* Interactive Notifications Popover Menu */}
        {isNotifOpen && (
          <div className="notifications-popover">
            <div className="notif-popover-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Bell size={16} color="var(--accent-primary)" />
                <span style={{ fontWeight: 700, fontSize: '14.5px' }}>Notifications</span>
                {unreadCount > 0 && (
                  <span className="widget-counter" style={{ padding: '2px 7px', fontSize: '10px' }}>
                    {unreadCount} new
                  </span>
                )}
              </div>
              {unreadCount > 0 && (
                <button
                  className="notif-mark-read-btn"
                  onClick={handleMarkAllRead}
                  title="Mark all as read"
                >
                  Mark read
                </button>
              )}
            </div>

            {/* Native OS Notifications Banner / Status Bar */}
            <div className="notif-os-bar">
              {nativeNotifStatus === 'granted' ? (
                <div className="notif-os-status">
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: '#10b981', fontWeight: 600 }}>
                    <CheckCircle2 size={13} /> Native OS Alerts Active
                  </span>
                </div>
              ) : (
                <div className="notif-os-banner">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                    <BellRing size={14} color="var(--accent-primary)" />
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-main)' }}>Enable OS Notifications</span>
                      <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Alerts for tasks due today</span>
                    </div>
                  </div>
                  <button className="notif-os-btn" onClick={enableNativeNotifications}>
                    Enable
                  </button>
                </div>
              )}
            </div>

            <div className="notif-list">
              {notifications.length === 0 ? (
                <div style={{ padding: '28px 18px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '12.5px' }}>
                  No pending alerts or deadlines
                </div>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    className="notif-item"
                    onClick={() => handleNotificationClick(n.view)}
                  >
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                      <div
                        style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          background: n.urgent ? '#e11d48' : '#6366f1',
                          marginTop: '5px',
                          flexShrink: 0
                        }}
                      />
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <span className="notif-title">{n.title}</span>
                        <span className="notif-msg">{n.message}</span>
                        <span className="notif-time">{n.time}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="notif-footer">
              <button
                className="notif-footer-btn"
                onClick={() => {
                  setIsNotifOpen(false);
                  toggleCalendar();
                }}
              >
                View Full Deadlines Calendar →
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
