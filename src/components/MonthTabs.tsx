interface MonthTabsProps {
  months: string[];
  activeMonth: string;
  onSelect: (month: string) => void;
  onCreate: () => void;
}

function MonthTabs({ months, activeMonth, onSelect, onCreate }: MonthTabsProps) {
  return (
    <div className="month-controls">
      {months.map((month) => (
        <button
          key={month}
          className={`tab${month === activeMonth ? ' active' : ''}`}
          onClick={() => onSelect(month)}
          type="button"
        >
          {month}
        </button>
      ))}
      <button className="tab new" onClick={onCreate} type="button">
        + New
      </button>
    </div>
  );
}

export default MonthTabs;
