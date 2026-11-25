import { useEffect } from 'react';
import { useToast } from '../toast';

/** Тост с кнопкой «Вернуть» (отмена действия в течение 5 секунд). */
export default function Toast() {
  const toast = useToast((s) => s.toast);
  const dismiss = useToast((s) => s.dismiss);

  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(dismiss, 5000);
    return () => window.clearTimeout(id);
  }, [toast, dismiss]);

  if (!toast) return null;

  return (
    <div className="toast">
      <span>{toast.message}</span>
      {toast.onUndo ? (
        <button
          onClick={() => {
            toast.onUndo?.();
            dismiss();
          }}
        >
          Вернуть
        </button>
      ) : null}
    </div>
  );
}
