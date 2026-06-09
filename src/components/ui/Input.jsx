export function Input({ label, value, onChange, type = 'text', placeholder, helper, prefix, suffix, error, className = '' }) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && <label className="text-xs font-medium text-[#9898b0] uppercase tracking-wider">{label}</label>}
      <div className="relative flex items-center">
        {prefix && (
          <span className="absolute left-3.5 text-[#5c5c72] text-sm font-mono select-none">{prefix}</span>
        )}
        <input
          type={type}
          value={value}
          onChange={e => onChange && onChange(e.target.value)}
          placeholder={placeholder}
          style={{
            background: error ? 'rgba(255,107,107,0.06)' : 'rgba(255,255,255,0.04)',
            border: `1px solid ${error ? 'rgba(255,107,107,0.4)' : 'rgba(255,255,255,0.1)'}`,
          }}
          className={`w-full rounded-xl py-3 text-[#f0f0f6] placeholder:text-[#3a3a50] focus:outline-none transition-all text-[15px] focus:border-[rgba(0,229,160,0.5)] focus:ring-0
            ${prefix ? 'pl-9' : 'pl-4'}
            ${suffix ? 'pr-16' : 'pr-4'}
          `}
          onFocus={e => { e.target.style.borderColor = error ? 'rgba(255,107,107,0.6)' : 'rgba(0,229,160,0.5)'; e.target.style.boxShadow = error ? '0 0 0 3px rgba(255,107,107,0.1)' : '0 0 0 3px rgba(0,229,160,0.1)'; }}
          onBlur={e => { e.target.style.borderColor = error ? 'rgba(255,107,107,0.4)' : 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none'; }}
        />
        {suffix && <span className="absolute right-3.5 text-[#5c5c72] text-sm select-none">{suffix}</span>}
      </div>
      {helper && <p className="text-xs text-[#5c5c72] leading-relaxed">{helper}</p>}
      {error && <p className="text-xs text-[#ff6b6b]">{error}</p>}
    </div>
  );
}

export function Select({ label, value, onChange, options, className = '' }) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && <label className="text-xs font-medium text-[#9898b0] uppercase tracking-wider">{label}</label>}
      <select
        value={value}
        onChange={e => onChange && onChange(e.target.value)}
        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
        className="w-full rounded-xl px-4 py-3 text-[#f0f0f6] focus:outline-none transition-all text-[15px] cursor-pointer appearance-none"
        onFocus={e => { e.target.style.borderColor = 'rgba(0,229,160,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(0,229,160,0.1)'; }}
        onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none'; }}
      >
        <option value="" style={{ background: '#141421' }}>Select…</option>
        {options.map(o => (
          <option key={o.value} value={o.value} style={{ background: '#141421' }}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}
