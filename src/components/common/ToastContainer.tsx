import React, { useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  return (
    <div
      aria-live="polite"
      className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  );
};

const ToastItem: React.FC<{
  toast: {
    id: string;
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
    title?: string;
    duration?: number;
  };
  onClose: () => void;
}> = ({ toast, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, toast.duration || 3500);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />;
      default:
        return <Info className="w-5 h-5 text-stone-600 shrink-0 mt-0.5" />;
    }
  };

  return (
    <div className="pointer-events-auto bg-stone-900 text-white rounded-xl p-3.5 shadow-2xl border border-stone-800 flex items-start gap-3 transition-all animate-in fade-in slide-in-from-bottom-3 duration-200">
      {getIcon()}
      <div className="flex-1 min-w-0">
        {toast.title && (
          <h5 className="text-xs font-semibold text-stone-200">{toast.title}</h5>
        )}
        <p className="text-xs text-stone-300 leading-snug">{toast.message}</p>
      </div>
      <button
        onClick={onClose}
        className="text-stone-400 hover:text-white p-0.5 transition-colors"
        aria-label="Close notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
