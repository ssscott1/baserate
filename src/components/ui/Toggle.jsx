export function Toggle({ checked, onChange, label, description, required }) {
  return (
    <label className="flex items-start gap-4 cursor-pointer group">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange && onChange(!checked)}
        style={{
          background: checked ? 'linear-gradient(135deg, #00e5a0 0%, #00c88a 100%)' : 'rgba(255,255,255,0.08)',
          boxShadow: checked ? '0 0 16px rgba(0,229,160,0.3)' : 'none',
          border: checked ? 'none' : '1px solid rgba(255,255,255,0.12)',
        }}
        className="relative shrink-0 w-11 h-6 rounded-full transition-all duration-300 mt-0.5"
      >
        <span
          style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.4)' }}
          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-300
            ${checked ? 'translate-x-5' : 'translate-x-0'}
          `}
        />
      </button>
      <div className="flex-1">
        <p className="text-[15px] font-medium text-[#f0f0f6] leading-snug">
          {label}
          {required && <span className="text-[#ff6b6b] ml-1">*</span>}
        </p>
        {description && <p className="text-xs text-[#5c5c72] mt-0.5 leading-relaxed">{description}</p>}
      </div>
    </label>
  );
}
