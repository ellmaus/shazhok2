import { create } from 'zustand';

interface ToastState {
  toast: { message: string; onUndo?: () => void } | null;
  show: (message: string, onUndo?: () => void) => void;
  dismiss: () => void;
}

/** Лёгкий глобальный тост (не сохраняется в localStorage). */
export const useToast = create<ToastState>((set) => ({
  toast: null,
  show: (message, onUndo) => set({ toast: { message, onUndo } }),
  dismiss: () => set({ toast: null }),
}));
