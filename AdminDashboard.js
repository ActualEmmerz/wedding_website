import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

/* ── Button ─────────────────────────────────────────────────────────────── */
const variantCls = {
  primary:   'bg-[var(--stone-900)] text-[var(--stone-50)] hover:bg-[var(--stone-800)] shadow-[var(--shadow-sm)]',
  secondary: 'bg-white text-[var(--stone-800)] border border-[var(--stone-200)] hover:border-[var(--stone-300)] hover:bg-[var(--stone-50)]',
  ghost:     'bg-transparent text-[var(--stone-700)] hover:bg-[var(--stone-100)]',
  gold:      'bg-[var(--gold-400)] text-white hover:bg-[var(--gold-500)] shadow-[var(--shadow-sm)]',
  danger:    'bg-rose-600 text-white hover:bg-rose-700',
};
const sizeCls = {
  xs: 'px-3 py-1.5 text-xs gap-1.5 rounded-[var(--r-md)]',
  sm: 'px-4 py-2   text-sm gap-2   rounded-[var(--r-md)]',
  md: 'px-5 py-2.5 text-sm gap-2   rounded-[var(--r-lg)]',
  lg: 'px-7 py-3.5 text-base gap-2.5 rounded-[var(--r-xl)]',
};

export const Button = ({
  children, variant = 'primary', size = 'md',
  loading, disabled, className = '', ...rest
}) => (
  <button
    className={`
      inline-flex items-center justify-center font-medium transition-all select-none
      disabled:opacity-50 disabled:cursor-not-allowed
      ${variantCls[variant]} ${sizeCls[size]} ${className}
    `}
    disabled={disabled || loading}
    {...rest}
  >
    {loading && (
      <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
    )}
    {children}
  </button>
);

/* ── Input ──────────────────────────────────────────────────────────────── */
export const Input = ({ label, error, hint, className = '', ...rest }) => (
  <div className="flex flex-col gap-1.5">
    {label && <label className="text-sm font-medium text-[var(--stone-600)]">{label}</label>}
    <input
      className={`
        w-full px-4 py-3 rounded-[var(--r-md)] border outline-none transition-all
        bg-white text-[var(--stone-900)] placeholder-[var(--stone-400)]
        border-[var(--stone-200)] focus:border-[var(--gold-400)]
        focus:ring-2 focus:ring-[var(--gold-200)] focus:ring-opacity-60
        ${error ? 'border-rose-400 ring-2 ring-rose-100' : ''}
        ${className}
      `}
      {...rest}
    />
    {hint  && !error && <p className="text-xs text-[var(--stone-400)]">{hint}</p>}
    {error && <p className="text-xs text-rose-500">{error}</p>}
  </div>
);

/* ── Textarea ───────────────────────────────────────────────────────────── */
export const Textarea = ({ label, error, className = '', ...rest }) => (
  <div className="flex flex-col gap-1.5">
    {label && <label className="text-sm font-medium text-[var(--stone-600)]">{label}</label>}
    <textarea
      rows={4}
      className={`
        w-full px-4 py-3 rounded-[var(--r-md)] border outline-none transition-all resize-none
        bg-white text-[var(--stone-900)] placeholder-[var(--stone-400)]
        border-[var(--stone-200)] focus:border-[var(--gold-400)]
        focus:ring-2 focus:ring-[var(--gold-200)] focus:ring-opacity-60
        ${error ? 'border-rose-400' : ''}
        ${className}
      `}
      {...rest}
    />
    {error && <p className="text-xs text-rose-500">{error}</p>}
  </div>
);

/* ── Toggle ─────────────────────────────────────────────────────────────── */
export const Toggle = ({ checked, onChange, label }) => (
  <label className="flex items-center gap-3 cursor-pointer select-none group">
    <span
      onClick={() => onChange(!checked)}
      className={`
        relative inline-flex items-center w-10 h-6 rounded-full transition-colors shrink-0
        ${checked ? 'bg-[var(--stone-900)]' : 'bg-[var(--stone-300)]'}
      `}
    >
      <span className={`
        absolute w-4 h-4 bg-white rounded-full shadow transition-transform
        ${checked ? 'translate-x-5' : 'translate-x-1'}
      `} />
    </span>
    {label && <span className="text-sm text-[var(--stone-700)]">{label}</span>}
  </label>
);

/* ── Badge ──────────────────────────────────────────────────────────────── */
const bdgCls = {
  default: 'bg-[var(--stone-100)] text-[var(--stone-600)]',
  gold:    'bg-amber-50 text-amber-700',
  green:   'bg-emerald-50 text-emerald-700',
  red:     'bg-rose-50 text-rose-700',
};
export const Badge = ({ children, variant = 'default' }) => (
  <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${bdgCls[variant]}`}>
    {children}
  </span>
);

/* ── Card ───────────────────────────────────────────────────────────────── */
export const Card = ({ children, className = '', ...rest }) => (
  <div
    className={`bg-white rounded-[var(--r-xl)] shadow-[var(--shadow-md)] ${className}`}
    {...rest}
  >
    {children}
  </div>
);

/* ── Spinner ────────────────────────────────────────────────────────────── */
export const Spinner = ({ size = 32 }) => (
  <div
    className="animate-spin rounded-full border-2 border-[var(--stone-200)] border-t-[var(--gold-400)]"
    style={{ width: size, height: size }}
  />
);

/* ── Modal ──────────────────────────────────────────────────────────────── */
export const Modal = ({ open, onClose, title, children, width = 'max-w-lg' }) => {
  if (!open) return null;
  return (
    <AnimatePresence>
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: 'rgba(28,25,23,.65)', backdropFilter: 'blur(6px)' }}
      >
        <motion.div
          key="panel"
          initial={{ opacity: 0, scale: .96, y: 12 }}
          animate={{ opacity: 1, scale: 1,   y: 0 }}
          exit={{ opacity: 0, scale: .95, y: 8 }}
          transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          onClick={e => e.stopPropagation()}
          className={`relative w-full ${width}`}
        >
          <Card className="p-7">
            <div className="flex items-start justify-between mb-6">
              {title && (
                <h2 className="font-display text-2xl">{title}</h2>
              )}
              <button
                onClick={onClose}
                className="ml-auto w-8 h-8 rounded-full flex items-center justify-center text-[var(--stone-400)] hover:bg-[var(--stone-100)] hover:text-[var(--stone-700)] transition -mt-1 -mr-1"
              >
                <X size={16} />
              </button>
            </div>
            {children}
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

/* ── Empty State ────────────────────────────────────────────────────────── */
export const Empty = ({ icon: Icon, title, body, action }) => (
  <div className="flex flex-col items-center justify-center text-center py-20 px-6">
    <div className="w-16 h-16 rounded-full bg-[var(--stone-100)] flex items-center justify-center mb-5">
      <Icon size={28} className="text-[var(--stone-400)]" />
    </div>
    <h3 className="font-display text-xl mb-2">{title}</h3>
    {body && <p className="text-[var(--stone-500)] text-sm max-w-xs mb-6">{body}</p>}
    {action}
  </div>
);
