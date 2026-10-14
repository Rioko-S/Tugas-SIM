import React from 'react';
import { useApp } from '../../context/AppContext';
import { Bell, CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const NotificationToast: React.FC = () => {
  const { toasts, dismissToast, switchRole } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-2 sm:px-0">
      {toasts.map((toast) => {
        const bgColors = {
          success: 'bg-emerald-50 border-emerald-300 text-emerald-900',
          warning: 'bg-amber-50 border-amber-300 text-amber-900',
          alert: 'bg-rose-50 border-rose-300 text-rose-900',
          info: 'bg-slate-900/95 border-slate-800 text-white shadow-xl',
        };

        const iconColors = {
          success: 'text-emerald-600',
          warning: 'text-amber-600',
          alert: 'text-rose-600',
          info: 'text-amber-400',
        };

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-2xl border shadow-lg backdrop-blur-md transition-all duration-300 animate-in fade-in slide-in-from-top-4 ${bgColors[toast.type]}`}
          >
            <div className={`mt-0.5 shrink-0 ${iconColors[toast.type]}`}>
              {toast.type === 'success' && <CheckCircle2 className="w-5 h-5" />}
              {toast.type === 'warning' && <AlertCircle className="w-5 h-5" />}
              {toast.type === 'alert' && <AlertCircle className="w-5 h-5" />}
              {toast.type === 'info' && <Bell className="w-5 h-5 animate-bounce" />}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1">
                <h4 className="text-xs font-bold leading-tight line-clamp-1">{toast.title}</h4>
                <span className="text-[10px] opacity-70 shrink-0">{toast.timestamp}</span>
              </div>
              <p className="text-xs opacity-90 mt-0.5 leading-snug line-clamp-2">{toast.message}</p>

              {toast.roleTag && (
                <button
                  onClick={() => switchRole(toast.roleTag!)}
                  className="mt-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500 hover:bg-amber-600 text-white inline-flex items-center gap-1 transition-transform active:scale-95"
                >
                  Buka Tampilan {toast.roleTag === 'store_owner' ? 'Toko' : toast.roleTag === 'driver' ? 'Driver' : toast.roleTag === 'admin' ? 'Admin' : 'Owner'} &rarr;
                </button>
              )}
            </div>

            <button
              onClick={() => dismissToast(toast.id)}
              className="p-1 rounded-full opacity-60 hover:opacity-100 transition-opacity"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
