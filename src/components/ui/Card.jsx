export function Card({ children, className = '', variant = 'default' }) {
  const variants = {
    default: 'bg-white rounded-2xl shadow-sm border border-[#ede8e1]',
    navy: 'bg-[#0d1b2a] rounded-2xl text-white',
    teal: 'bg-[#00b894]/10 rounded-2xl border border-[#00b894]/30',
    coral: 'bg-[#e17055]/10 rounded-2xl border border-[#e17055]/30',
    cream: 'bg-[#f8f4ef] rounded-2xl border border-[#ede8e1]',
  };
  return (
    <div className={`${variants[variant]} ${className}`}>
      {children}
    </div>
  );
}
