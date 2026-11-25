interface ProgressBarProps {
  /** Доля от 0 до 1. */
  value: number;
}

export default function ProgressBar({ value }: ProgressBarProps) {
  const pct = Math.max(0, Math.min(100, value * 100));
  return (
    <div className="progress" role="progressbar" aria-label="Прогресс">
      <div className="progress-fill" style={{ width: `${pct}%` }} />
    </div>
  );
}
