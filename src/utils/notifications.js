import { invoke } from '@tauri-apps/api/core';

export function isTauriEnvironment() {
  return typeof window !== 'undefined' && Boolean(window.__TAURI_INTERNALS__);
}

export function canUseNativeNotifications() {
  return isTauriEnvironment() || (typeof window !== 'undefined' && 'Notification' in window);
}

export function getNativeNotificationPermission() {
  if (typeof window !== 'undefined' && 'Notification' in window) {
    return Notification.permission;
  }
  return 'default';
}

export async function requestNativeNotificationPermission() {
  // 1. If running inside Tauri native desktop app
  if (isTauriEnvironment()) {
    try {
      const isGranted = await invoke('plugin:notification|is_permission_granted');
      if (isGranted) return 'granted';
      const status = await invoke('plugin:notification|request_permission');
      if (status === 'granted') {
        return 'granted';
      }
    } catch {
      // Fallback to Web Notification API below
    }
  }

  // 2. Standard Web Notification API (Browser / WebView2)
  if (typeof window !== 'undefined' && 'Notification' in window) {
    try {
      const permission = await Notification.requestPermission();
      return permission;
    } catch (err) {
      console.error('[Notifications] Failed to request permission:', err);
      return 'denied';
    }
  }

  return 'unsupported';
}

export async function sendNativeNotification(title, options = {}) {
  // 1. If running inside Tauri
  if (isTauriEnvironment()) {
    try {
      await invoke('plugin:notification|notify', {
        options: {
          title,
          body: options.body || '',
          ...options
        }
      });
      return true;
    } catch {}
  }

  // 2. Standard Web Notification API
  if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
    try {
      const notif = new Notification(title, {
        icon: '/favicon.svg',
        badge: '/favicon.svg',
        silent: false,
        ...options
      });

      notif.onclick = () => {
        try {
          window.focus();
        } catch {}
        if (typeof options.onClick === 'function') {
          options.onClick();
        }
        notif.close();
      };

      return notif;
    } catch (err) {
      console.error('[Notifications] Error sending notification:', err);
    }
  }
  return null;
}

function to24HourTime(timeStr) {
  if (!timeStr) return '';
  const str = String(timeStr).trim();
  const match = str.match(/^(\d{1,2}):(\d{2})(?::\d{2})?\s*(AM|PM)?$/i);
  if (match) {
    let h = parseInt(match[1], 10);
    const m = match[2];
    const period = match[3] ? match[3].toUpperCase() : null;
    if (period === 'PM' && h < 12) h += 12;
    if (period === 'AM' && h === 12) h = 0;
    return `${String(h).padStart(2, '0')}:${m}`;
  }
  return timeStr;
}

/**
 * Checks for tasks, reminders, assignments, and bills with deadlines
 * due now or overdue, and fires native OS notifications.
 * Runs on every interval (e.g. every 10 seconds).
 */
export function checkAndDispatchDeadlineNotifications(data, onNavigate) {
  if (!canUseNativeNotifications() || !data) {
    return;
  }
  if (!isTauriEnvironment() && typeof Notification !== 'undefined' && Notification.permission !== 'granted') {
    return;
  }

  const now = new Date();
  const nowMs = now.getTime();

  // Storage for fired notifications to avoid repeated alerts
  const STORAGE_KEY = 'amils_fired_deadline_notifications';
  let firedNotifs = {};
  try {
    firedNotifs = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch {
    firedNotifs = {};
  }

  const itemsToCheck = [];

  // 1. Organization Tasks (dueDate and optional dueTime)
  (data.organization?.tasks || []).forEach((t) => {
    if (!t.completed && (t.dueDate || t.dueTime)) {
      let targetMs = null;
      if (t.dueDate && t.dueTime) {
        const time24 = to24HourTime(t.dueTime);
        targetMs = new Date(`${t.dueDate}T${time24}:00`).getTime();
        if (isNaN(targetMs)) {
          targetMs = new Date(`${t.dueDate} ${t.dueTime}`).getTime();
        }
      } else if (t.dueDate) {
        // Due on date (check as of start of day)
        targetMs = new Date(`${t.dueDate}T00:00:00`).getTime();
      }

      itemsToCheck.push({
        id: `task-${t.id}`,
        title: t.title,
        type: 'Task',
        timeLabel: t.dueTime ? `${t.dueDate} at ${t.dueTime}` : t.dueDate,
        hasSpecificTime: Boolean(t.dueTime),
        targetMs,
        view: 'home',
        priority: t.priority || 'medium'
      });
    }
  });

  // 2. Organization Priority Reminders (datetime: YYYY-MM-DDTHH:mm)
  (data.organization?.reminders || []).forEach((r) => {
    if (!r.completed && r.datetime) {
      const targetMs = new Date(r.datetime).getTime();
      itemsToCheck.push({
        id: `rem-${r.id}`,
        title: r.title,
        type: 'Reminder',
        timeLabel: r.time ? `${r.date || ''} at ${r.time}` : new Date(r.datetime).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }),
        hasSpecificTime: true,
        targetMs,
        view: 'home',
        priority: r.priority || 'high'
      });
    }
  });

  // 3. Academic Assignments
  (data.academic?.assignments || []).forEach((a) => {
    if (a.status !== 'completed' && a.dueDate) {
      let targetMs = null;
      if (a.dueTime) {
        const time24 = to24HourTime(a.dueTime);
        targetMs = new Date(`${a.dueDate}T${time24}:00`).getTime();
      } else {
        targetMs = new Date(`${a.dueDate}T00:00:00`).getTime();
      }
      itemsToCheck.push({
        id: `asg-${a.id}`,
        title: (a.courseCode ? `${a.courseCode}: ` : '') + a.title,
        type: 'Assignment',
        timeLabel: a.dueTime ? `${a.dueDate} at ${a.dueTime}` : a.dueDate,
        hasSpecificTime: Boolean(a.dueTime),
        targetMs,
        view: 'academic',
        priority: a.priority || 'high'
      });
    }
  });

  // 4. Bills
  (data.finance?.bills || []).forEach((b) => {
    if (!b.isPaid && b.dueDate) {
      const targetMs = new Date(`${b.dueDate}T00:00:00`).getTime();
      itemsToCheck.push({
        id: `bill-${b.id}`,
        title: b.title,
        type: 'Bill',
        timeLabel: b.dueDate,
        hasSpecificTime: false,
        targetMs,
        view: 'finance',
        priority: 'high'
      });
    }
  });

  let hasUpdates = false;

  itemsToCheck.forEach((item) => {
    if (!item.targetMs || isNaN(item.targetMs)) return;

    // Has the deadline arrived or passed? (Allow window of up to 48 hours in the past)
    const isDueOrPast = nowMs >= item.targetMs && (nowMs - item.targetMs < 48 * 60 * 60 * 1000);
    // Or imminent within 30 seconds
    const isImminent = item.targetMs - nowMs <= 30000 && item.targetMs > nowMs;

    if ((isDueOrPast || isImminent) && !firedNotifs[item.id]) {
      firedNotifs[item.id] = Date.now();
      hasUpdates = true;

      const titlePrefix = item.hasSpecificTime ? '⏰ Deadline Reached' : (nowMs > item.targetMs + 86400000 ? '⚠️ Overdue' : '⏰ Due Today');

      sendNativeNotification(`${titlePrefix}: ${item.title}`, {
        body: `${item.type}: "${item.title}" is due (${item.timeLabel}) • Priority: ${item.priority.toUpperCase()}`,
        tag: `deadline-${item.id}`,
        onClick: () => {
          if (onNavigate) onNavigate(item.view);
        }
      });
    }
  });

  if (hasUpdates) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(firedNotifs));
    } catch {}
  }
}
