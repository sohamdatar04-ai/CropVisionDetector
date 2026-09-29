import React from 'react'
import { CheckCircle2, AlertTriangle, AlertCircle, Info, WifiOff, X } from 'lucide-react'
import { cn } from '../../utils/cn'

export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'offline'

export interface ToastItem {
  id: string
  title: string
  message?: string
  type: ToastType
  duration?: number
}

interface ToastProps {
  toast: ToastItem
  onDismiss: (id: string) => void
}

export const Toast: React.FC<ToastProps> = ({ toast, onDismiss }) => {
  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />,
    error: <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />,
    info: <Info className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />,
    offline: <WifiOff className="w-5 h-5 text-stone-700 shrink-0 mt-0.5" />,
  }

  const borderStyles = {
    success: 'border-l-4 border-emerald-500 bg-white text-slate-900',
    error: 'border-l-4 border-rose-500 bg-white text-slate-900',
    warning: 'border-l-4 border-amber-500 bg-white text-slate-900',
    info: 'border-l-4 border-sky-500 bg-white text-slate-900',
    offline: 'border-l-4 border-stone-600 bg-stone-50 text-stone-900',
  }

  return (
    <div
      role="status"
      className={cn(
        'w-full max-w-sm rounded-xl p-4 shadow-lg border border-slate-200/80 flex items-start gap-3 transition-all duration-300 transform',
        borderStyles[toast.type]
      )}
    >
      {icons[toast.type]}
      <div className="flex-1 min-w-0 pr-1">
        <h4 className="text-sm font-semibold text-slate-900">{toast.title}</h4>
        {toast.message && (
          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
            {toast.message}
          </p>
        )}
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        aria-label="Close notification"
        className="w-7 h-7 inline-flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors shrink-0"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}
