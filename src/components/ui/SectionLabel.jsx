export default function SectionLabel({ children }) {
  return (
    <div className="mb-4">
      <p className="text-[11px] uppercase tracking-[2px] text-[var(--color-muted)]">
        {children}
      </p>
    </div>
  );
}
