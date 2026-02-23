import React, { createContext, useContext, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

const Ctx = createContext(null);

const icons = { success: CheckCircle, error: AlertCircle, info: Info };
const colors = {
  success: 'bg-[var(--sage-600)] text-white',
  error:   'bg-rose-600 text-white',
  info:    'bg-[var(--stone-800)] text-white',
};

const Toast = ({ id, message, type, onDismiss }) => {
  const Icon = icons[type] ?? Info;
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24, scale: .96 }}
      animate={{ opacity: 1, y: 0,  scale: 1 }}
      exit={{ opacity: 0, y: 16, scale: .94 }}
      className={`flex items-center gap-3 px-4 py-3 rounded-[var(--r-lg)] shadow-[var(--shadow-lg)] text-sm font-medium max-w-xs ${colors[type]}`}
    >
      <Icon size={16} className="shrink-0" />
      <span className="flex-1">{message}</span>
      <button onClick={() => onDismiss(id)} className="opacity-70 hover:opacity-100 ml-1">
        <X size={14} />
      </button>
    </motion.div>
  );
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => setToasts(p => p.filter(t => t.id !== id)), []);

  const toast = useCallback((message, type = 'info', ms = 4000) => {
    const id = Date.now() + Math.random();
    setToasts(p => [...p, { id, message, type }]);
    if (ms > 0) setTimeout(() => dismiss(id), ms);
  }, [dismiss]);

  return (
    <Ctx.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-5 right-5 z-[200] flex flex-col gap-2 items-end">
        <AnimatePresence mode="popLayout">
          {toasts.map(t => <Toast key={t.id} {...t} onDismiss={dismiss} />)}
        </AnimatePresence>
      </div>
    </Ctx.Provider>
  );
};

export const useToast = () => useContext(Ctx);
