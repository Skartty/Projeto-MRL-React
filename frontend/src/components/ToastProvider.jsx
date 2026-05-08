import { useCallback, useMemo, useState } from "react";
import { ToastContext } from "./ToastContext";
import "../styles/feedback.css";

const TYPE_LABEL = {
  success: "Sucesso",
  error: "Erro",
  warning: "Aviso",
  info: "Info",
};

const TYPE_ICON = {
  success: "✓",
  error: "!",
  warning: "!",
  info: "i",
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback((message, options = {}) => {
    const id = globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random()}`;
    const toast = {
      id,
      message,
      type: options.type || "info",
      title: options.title,
    };

    setToasts((current) => [...current, toast]);
    window.setTimeout(() => removeToast(id), options.duration || 4200);
    return id;
  }, [removeToast]);

  const value = useMemo(() => ({ showToast, removeToast }), [showToast, removeToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toast-region" aria-live="polite" aria-relevant="additions">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast toast-${toast.type}`} role="status">
            <span className="toast-icon">{TYPE_ICON[toast.type] || TYPE_ICON.info}</span>
            <div className="toast-content">
              <strong>{toast.title || TYPE_LABEL[toast.type] || TYPE_LABEL.info}</strong>
              <p>{toast.message}</p>
            </div>
            <button className="toast-close" type="button" onClick={() => removeToast(toast.id)} aria-label="Fechar aviso">
              ×
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
