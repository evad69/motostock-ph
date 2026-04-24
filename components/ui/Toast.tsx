"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type ToastTone = "success" | "error" | "info";

type ToastItem = {
  id: string;
  title: string;
  description?: string;
  tone: ToastTone;
};

type ToastContextValue = {
  pushToast: (toast: Omit<ToastItem, "id">) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

function toneClasses(tone: ToastTone) {
  if (tone === "success") {
    return "border-[rgba(10,122,82,0.28)] text-[var(--color-success)]";
  }

  if (tone === "error") {
    return "border-[rgba(180,59,47,0.28)] text-[var(--color-danger)]";
  }

  return "border-[var(--color-line)] text-[var(--color-ink)]";
}

function ToastViewport({
  toasts,
  dismissToast,
}: {
  toasts: ToastItem[];
  dismissToast: (id: string) => void;
}) {
  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[100] flex w-full max-w-sm flex-col gap-3">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto border bg-[rgba(244,240,232,0.96)] p-4 backdrop-blur ${toneClasses(
            toast.tone
          )}`}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <p className="font-mono text-xs uppercase tracking-[0.28em]">
                {toast.title}
              </p>
              {toast.description ? (
                <p className="text-sm leading-6 text-[color:var(--color-muted)]">
                  {toast.description}
                </p>
              ) : null}
            </div>
            <button
              type="button"
              className="text-xs uppercase tracking-[0.24em]"
              onClick={() => dismissToast(toast.id)}
            >
              Close
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismissToast = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const pushToast = useCallback(
    (toast: Omit<ToastItem, "id">) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      setToasts((current) => [...current, { ...toast, id }]);

      window.setTimeout(() => {
        dismissToast(id);
      }, 4000);
    },
    [dismissToast]
  );

  const value = useMemo(() => ({ pushToast }), [pushToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastViewport toasts={toasts} dismissToast={dismissToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within ToastProvider.");
  }

  return context;
}
