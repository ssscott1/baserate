export function Card({ children, className = '', variant = 'default' }) {
  const base = 'rounded-2xl';
  const variants = {
    default: 'border border-[rgba(255,255,255,0.08)] bg-[#0e0e18]',
    elevated: 'border border-[rgba(255,255,255,0.1)] bg-[#141421]',
    glass: 'border border-[rgba(255,255,255,0.08)] backdrop-blur-xl bg-[rgba(255,255,255,0.04)]',
    accent: 'border border-[rgba(0,229,160,0.25)] bg-[rgba(0,229,160,0.05)]',
    coral: 'border border-[rgba(255,107,107,0.25)] bg-[rgba(255,107,107,0.06)]',
    amber: 'border border-[rgba(245,158,11,0.25)] bg-[rgba(245,158,11,0.06)]',
    dark: 'bg-[#0a0a12] border border-[rgba(255,255,255,0.06)]',
    navy: 'bg-[#0e0e18] border border-[rgba(255,255,255,0.08)]',
    teal: 'border border-[rgba(0,229,160,0.25)] bg-[rgba(0,229,160,0.05)]',
    cream: 'bg-[#141421] border border-[rgba(255,255,255,0.08)]',
  };
  return (
    <div className={`${base} ${variants[variant] ?? variants.default} ${className}`}>
      {children}
    </div>
  );
}
