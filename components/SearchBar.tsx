"use client";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="search-bar">
      <span className="material-icons">search</span>
      <input
        type="search"
        placeholder="Search orders, customers, or phone numbers"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
      <style jsx>{`
        .search-bar {
          display: flex;
          align-items: center;
          gap: 12px;
          background: var(--color-bg-white);
          border-radius: 16px;
          padding: 12px 16px;
          box-shadow: 0 12px 24px rgba(0, 90, 156, 0.1);
        }
        input {
          border: none;
          outline: none;
          font-size: 16px;
          flex: 1;
          color: var(--color-text-primary);
        }
        input::placeholder {
          color: var(--color-text-secondary);
        }
        .material-icons {
          color: var(--color-primary);
        }
      `}</style>
    </div>
  );
}
