export function Input({ label, value, onChange, type = 'text', placeholder, helper, prefix, suffix, error, className = '' }) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && <label className="text-xs font-semibold text-[#86868b] uppercase tracking-wider">{label}</label>}
      <div className="relative flex items-center">
        {prefix && <span className="absolute left-3.5 text-[#86868b] text-sm font-mono select-none pointer-events-none">{prefix}</span>}
        <input
          type={type} value={value}
          onChange={e => onChange && onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full bg-white border rounded-xl py-3 text-[#1d1d1f] placeholder:text-[#adadb3] focus:outline-none transition-all text-[15px]
            ${prefix ? 'pl-9' : 'pl-4'} ${suffix ? 'pr-16' : 'pr-4'}
            ${error ? 'border-[#c0392b] ring-2 ring-[#c0392b]/10' : 'border-[rgba(0,0,0,0.12)] focus:border-[#1d1d1f] focus:ring-2 focus:ring-[#1d1d1f]/06'}
          `}
        />
        {suffix && <span className="absolute right-3.5 text-[#86868b] text-sm select-none pointer-events-none">{suffix}</span>}
      </div>
      {helper && <p className="text-xs text-[#86868b] leading-relaxed">{helper}</p>}
      {error && <p className="text-xs text-[#c0392b]">{error}</p>}
    </div>
  );
}

export function Select({ label, value, onChange, options, className = '' }) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && <label className="text-xs font-semibold text-[#86868b] uppercase tracking-wider">{label}</label>}
      <select
        value={value} onChange={e => onChange && onChange(e.target.value)}
        className="w-full bg-white border border-[rgba(0,0,0,0.12)] rounded-xl px-4 py-3 text-[#1d1d1f] focus:outline-none focus:border-[#1d1d1f] focus:ring-2 focus:ring-[#1d1d1f]/06 transition-all text-[15px] cursor-pointer appearance-none"
      >
        <option value="">Select…</option>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}
