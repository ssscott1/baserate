export function Button({ children, onClick, variant = 'primary', disabled, className = '', type = 'button', size = 'md' }) {
  const base = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 cursor-pointer select-none tracking-tight';
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-5 py-3 text-[15px]',
    lg: 'px-6 py-3.5 text-base',
  };
  const variants = {
    primary: 'text-[#08080f] disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.97]',
    secondary: 'border border-[rgba(255,255,255,0.12)] text-[#f0f0f6] hover:bg-[rgba(255,255,255,0.06)] active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed',
    ghost: 'text-[#9898b0] hover:text-[#f0f0f6] hover:bg-[rgba(255,255,255,0.05)] active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed',
    danger: 'text-white disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.97]',
    navy: 'bg-[#1c1c2e] border border-[rgba(255,255,255,0.1)] text-[#f0f0f6] hover:bg-[#22223a] active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed',
  };
  const styles = {
    primary: {
      background: disabled ? 'rgba(0,229,160,0.3)' : 'linear-gradient(135deg, #00e5a0 0%, #00c88a 100%)',
      boxShadow: disabled ? 'none' : '0 0 24px rgba(0,229,160,0.25), 0 4px 12px rgba(0,0,0,0.3)',
    },
    danger: { background: 'linear-gradient(135deg, #ff6b6b 0%, #e04444 100%)', boxShadow: '0 4px 12px rgba(255,107,107,0.2)' },
    secondary: { background: 'rgba(255,255,255,0.04)' },
    ghost: {},
    navy: {},
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={styles[variant]}
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
