export function Card({ children, className = '', variant = 'default' }) {
  const variants = {
    default:  'bg-white rounded-2xl shadow-sm',
    elevated: 'bg-white rounded-2xl shadow-md',
    accent:   'bg-[#eef7f3] rounded-2xl border border-[#d1ede4]',
    teal:     'bg-[#eef7f3] rounded-2xl border border-[#d1ede4]',
    coral:    'bg-[#fdf0ef] rounded-2xl border border-[#fad5d2]',
    amber:    'bg-[#fef3e2] rounded-2xl border border-[#f9d49a]',
    cream:    'bg-[#f5f5f7] rounded-2xl border border-[rgba(0,0,0,0.07)]',
    dark:     'bg-[#1d1d1f] rounded-2xl text-white',
    navy:     'bg-[#1d1d1f] rounded-2xl text-white',
    glass:    'bg-white/80 rounded-2xl border border-[rgba(0,0,0,0.08)] backdrop-blur',
  };
  return <div className={`${variants[variant] ?? variants.default} ${className}`}>{children}</div>;
}
