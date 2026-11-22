import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown } from 'lucide-react';

export function parseTimeString(timeStr) {
  if (!timeStr) return { hour: '10', minute: '00', period: 'AM' };

  const str = String(timeStr).trim();
  const match = str.match(/^(\d{1,2}):(\d{2})(?::\d{2})?\s*(AM|PM)?$/i);
  if (match) {
    let h = parseInt(match[1], 10);
    const m = match[2];
    let period = match[3] ? match[3].toUpperCase() : null;

    if (!period) {
      if (h >= 12) {
        period = 'PM';
        if (h > 12) h -= 12;
      } else {
        period = 'AM';
        if (h === 0) h = 12;
      }
    }
    return {
      hour: String(h).padStart(2, '0'),
      minute: m,
      period: period || 'AM'
    };
  }
  return { hour: '10', minute: '00', period: 'AM' };
}

export function formatTimeObject({ hour, minute, period }) {
  return `${hour}:${minute} ${period}`;
}

export function to24HourTime(timeStr) {
  if (!timeStr) return '';
  const { hour, minute, period } = parseTimeString(timeStr);
  let h = parseInt(hour, 10);
  if (period === 'PM' && h < 12) h += 12;
  if (period === 'AM' && h === 12) h = 0;
  return `${String(h).padStart(2, '0')}:${minute}`;
}

export function timeStringToMinutes(timeStr) {
  if (!timeStr) return 0;
  const { hour, minute, period } = parseTimeString(timeStr);
  let h = parseInt(hour, 10);
  const m = parseInt(minute, 10) || 0;
  if (period === 'PM' && h < 12) h += 12;
  if (period === 'AM' && h === 12) h = 0;
  return h * 60 + m;
}

export function compareScheduleTimes(a, b) {
  const minA = timeStringToMinutes(a?.startTime);
  const minB = timeStringToMinutes(b?.startTime);
  if (minA !== minB) return minA - minB;

  const endA = timeStringToMinutes(a?.endTime);
  const endB = timeStringToMinutes(b?.endTime);
  if (endA !== endB) return endA - endB;

  return (a?.courseCode || '').localeCompare(b?.courseCode || '');
}

const DAY_ORDER = { Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6, Sun: 7 };

export function sortScheduleSlots(slots) {
  if (!Array.isArray(slots)) return [];
  return [...slots].sort((a, b) => {
    const dayA = DAY_ORDER[a?.day] || 99;
    const dayB = DAY_ORDER[b?.day] || 99;
    if (dayA !== dayB) return dayA - dayB;
    return compareScheduleTimes(a, b);
  });
}

function CustomTimeDropdown({ value, options, onChange, label }) {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 58 });
  const triggerRef = useRef(null);
  const listRef = useRef(null);

  const updatePosition = useCallback(() => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + 5,
        left: rect.left,
        width: Math.max(rect.width, 58)
      });
    }
  }, []);

  const toggleOpen = () => {
    if (!isOpen) {
      updatePosition();
    }
    setIsOpen((prev) => !prev);
  };

  useEffect(() => {
    if (!isOpen) return;

    updatePosition();

    function handleClickOutside(e) {
      if (
        triggerRef.current &&
        !triggerRef.current.contains(e.target) &&
        listRef.current &&
        !listRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    }

    function handleScrollOrResize() {
      updatePosition();
    }

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', handleScrollOrResize, true);
    window.addEventListener('resize', handleScrollOrResize);

    const timer = setTimeout(() => {
      if (listRef.current) {
        const activeItem = listRef.current.querySelector('.time-dropdown-item.active');
        if (activeItem) {
          activeItem.scrollIntoView({ block: 'nearest' });
        }
      }
    }, 10);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScrollOrResize, true);
      window.removeEventListener('resize', handleScrollOrResize);
    };
  }, [isOpen, updatePosition]);

  return (
    <div className="time-dropdown-container">
      <button
        ref={triggerRef}
        type="button"
        className={`time-select-trigger ${isOpen ? 'active' : ''}`}
        onClick={toggleOpen}
        aria-label={label}
        aria-expanded={isOpen}
      >
        <span>{value}</span>
        <ChevronDown size={11} className={`time-chevron ${isOpen ? 'open' : ''}`} />
      </button>

      {isOpen &&
        createPortal(
          <div
            className="time-dropdown-menu time-dropdown-portal"
            ref={listRef}
            style={{
              position: 'fixed',
              top: `${coords.top}px`,
              left: `${coords.left}px`,
              width: `${coords.width}px`,
              zIndex: 99999
            }}
          >
            {options.map((opt) => (
              <button
                key={opt}
                type="button"
                className={`time-dropdown-item ${opt === value ? 'active' : ''}`}
                onClick={() => {
                  onChange(opt);
                  setIsOpen(false);
                }}
              >
                {opt}
              </button>
            ))}
          </div>,
          document.body
        )}
    </div>
  );
}

export default function TimePicker({ value, onChange, label }) {
  const { hour, minute, period } = parseTimeString(value);

  const update = (newHour, newMinute, newPeriod) => {
    onChange(
      formatTimeObject({
        hour: newHour !== undefined ? newHour : hour,
        minute: newMinute !== undefined ? newMinute : minute,
        period: newPeriod !== undefined ? newPeriod : period
      })
    );
  };

  const hours = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
  const minutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));

  return (
    <div className="custom-time-picker-wrap">
      {label && <label className="form-label">{label}</label>}
      <div className="time-picker-controls">
        <CustomTimeDropdown
          value={hour}
          options={hours}
          onChange={(val) => update(val, undefined, undefined)}
          label="Hour"
        />
        <span className="time-colon">:</span>
        <CustomTimeDropdown
          value={minute}
          options={minutes}
          onChange={(val) => update(undefined, val, undefined)}
          label="Minute"
        />
        <div className="time-period-segmented" role="group" aria-label="AM / PM Selector">
          <button
            type="button"
            className={`time-period-btn ${period === 'AM' ? 'active' : ''}`}
            onClick={() => update(undefined, undefined, 'AM')}
            title="Set to AM (Morning)"
          >
            AM
          </button>
          <button
            type="button"
            className={`time-period-btn ${period === 'PM' ? 'active' : ''}`}
            onClick={() => update(undefined, undefined, 'PM')}
            title="Set to PM (Afternoon/Evening)"
          >
            PM
          </button>
        </div>
      </div>
    </div>
  );
}
