interface ProgressBarProps {
  completed: number;
  total: number;
}

function ProgressBar({ completed, total }: ProgressBarProps) {
  const ratio = total === 0 ? 0 : Math.min(100, (completed / total) * 100);

  return (
    <section className="progress-row">
      <div className="progress-track" aria-label="Progress">
        <div className="progress-fill" style={{ width: `${ratio}%` }} />
      </div>
      <span className="counter">{completed} of {total}</span>
    </section>
  );
}

export default ProgressBar;
