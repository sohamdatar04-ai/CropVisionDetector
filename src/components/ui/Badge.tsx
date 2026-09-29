import React from 'react'
import { cn } from '../../utils/cn'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'offline' | 'neutral' | 'earth'
  size?: 'sm' | 'md' | 'lg'
  withDot?: boolean
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'neutral',
  size = 'md',
  withDot = false,
  children,
  ...props
}) => {
  const variantStyles = {
    success: 'bg-emerald-100/80 text-emerald-800 border-emerald-300/80',
    warning: 'bg-amber-100/90 text-amber-900 border-amber-300',
    danger: 'bg-rose-100 text-rose-800 border-rose-300',
    info: 'bg-sky-100 text-sky-800 border-sky-300',
    offline: 'bg-stone-200/90 text-stone-800 border-stone-300',
    neutral: 'bg-slate-100 text-slate-700 border-slate-200',
    earth: 'bg-amber-800/10 text-amber-900 border-amber-700/30',
  }

  const dotColors = {
    success: 'bg-emerald-600',
    warning: 'bg-amber-600',
    danger: 'bg-rose-600',
    info: 'bg-sky-600',
    offline: 'bg-stone-600',
    neutral: 'bg-slate-500',
    earth: 'bg-amber-800',
  }

  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 font-medium rounded-md gap-1',
    md: 'text-xs px-2.5 py-1 font-semibold rounded-lg gap-1.5',
    lg: 'text-sm px-3.5 py-1.5 font-semibold rounded-xl gap-2',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center border tracking-wide select-none leading-none',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {withDot && (
        <span
          className={cn('inline-block rounded-full shrink-0', dotColors[variant], {
            'w-1.5 h-1.5': size === 'sm',
            'w-2 h-2': size === 'md' || size === 'lg',
          })}
        />
      )}
      {children}
    </span>
  )
}
