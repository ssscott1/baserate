export function Button({ children, onClick, variant = 'primary', disabled, className = '', type = 'button', size = 'md' }) {
  const base = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-150 cursor-pointer select-none tracking-tight';
  const sizes = { sm: 'px-4 py-2 text-sm', md: 'px-5 py-3 text-[15px]', lg: 'px-6 py-4 text-base' };
  const variants = {
    primary:   'bg-[#1d1d1f] text-white hover:bg-[#3a3a3c] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed',
    secondary: 'bg-white text-[#1d1d1f] border border-[rgba(0,0,0,0.12)] hover:bg-[#f5f5f7] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed',
    ghost:     'text-[#1d1d1f] hover:bg-[rgba(0,0,0,0.05)] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed',
    accent:    'bg-[#007a5a] text-white hover:bg-[#006147] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed',
    danger:    'bg-[#c0392b] text-white hover:bg-[#a93226] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed',
    navy:      'bg-[#1d1d1f] text-white hover:bg-[#3a3a3c] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed',
  };
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`${base} ${sizes[size]} ${variants[variant] ?? variants.primary} ${className}`}>
      {children}
    </button>
  );
}
