import { useEffect, useState, useCallback } from "react";

type ToastType = "success" | "error" | "info";

type ToastItem = {
  id: number;
  type: ToastType;
  message: string;
};

let _addToast: ((t: Omit<ToastItem, "id">) => void) | null = null;
let _id = 0;

export const toast = {
  success: (message: string) => _addToast?.({ type: "success", message }),
  error: (message: string) => _addToast?.({ type: "error", message }),
  info: (message: string) => _addToast?.({ type: "info", message }),
};

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = useCallback((t: Omit<ToastItem, "id">) => {
    const id = ++_id;
    setToasts((prev) => [...prev, { ...t, id }]);
    setTimeout(() => setToasts((prev) => prev.filter((x) => x.id !== id)), 3500);
  }, []);

  useEffect(() => {
    _addToast = addToast;
    return () => { _addToast = null; };
  }, [addToast]);

  const styles: Record<ToastType, string> = {
    success: "bg-green-50 border-green-400 text-green-800",
    error: "bg-red-50 border-red-400 text-red-800",
    info: "bg-blue-50 border-blue-400 text-blue-800",
  };

  const icons: Record<ToastType, string> = {
    success: "✓",
    error: "✕",
    info: "ℹ",
  };

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`flex items-start gap-2 px-4 py-3 border-l-4 shadow-md rounded-r text-sm
                      animate-in slide-in-from-right duration-200 ${styles[t.type]}`}
        >
          <span className="font-bold shrink-0">{icons[t.type]}</span>
          <p>{t.message}</p>
        </div>
      ))}
    </div>
  );
}
