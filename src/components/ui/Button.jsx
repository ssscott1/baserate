export function Button({ children, onClick, variant = 'primary', disabled, className = '', type = 'button', size = 'md' }) {
  const base = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 cursor-pointer select-none';
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3.5 text-base',
    lg: 'px-8 py-4 text-lg',
  };
  const variants = {
    primary: 'bg-[#00b894] text-white hover:bg-[#00d4aa] active:scale-[0.98] shadow-lg shadow-[#00b894]/30 disabled:opacity-50 disabled:cursor-not-allowed',
    secondary: 'bg-white border-2 border-[#0d1b2a] text-[#0d1b2a] hover:bg-[#f8f4ef] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed',
    ghost: 'text-[#0d1b2a] hover:bg-[#ede8e1] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed',
    danger: 'bg-[#e17055] text-white hover:bg-[#ff8c69] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed',
    navy: 'bg-[#0d1b2a] text-white hover:bg-[#1a2f45] active:scale-[0.98] shadow-lg shadow-[#0d1b2a]/20 disabled:opacity-50 disabled:cursor-not-allowed',
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
