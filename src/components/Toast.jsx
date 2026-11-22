import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';

export default function Toast() {
  const { toasts } = useDashboard();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div key={toast.id} className="toast">
          <CheckCircle2 size={16} color="#10b981" />
          <span>{toast.message}</span>
        </div>
      ))}
    </div>
  );
}
