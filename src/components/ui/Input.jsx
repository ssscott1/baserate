export function Input({ label, value, onChange, type = 'text', placeholder, helper, prefix, suffix, error, className = '' }) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && <label className="text-sm font-medium text-[#0d1b2a]">{label}</label>}
      <div className="relative flex items-center">
        {prefix && (
          <span className="absolute left-3.5 text-[#5a6a7a] text-sm font-mono select-none">{prefix}</span>
        )}
        <input
          type={type}
          value={value}
          onChange={e => onChange && onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full border-2 rounded-xl py-3 text-[#0d1b2a] placeholder:text-[#b0bec5] focus:outline-none focus:border-[#00b894] transition-colors text-base
            ${prefix ? 'pl-9' : 'pl-4'}
            ${suffix ? 'pr-16' : 'pr-4'}
            ${error ? 'border-[#e17055] bg-[#e17055]/5' : 'border-[#ede8e1] bg-white hover:border-[#b0c4d8]'}
          `}
        />
        {suffix && (
          <span className="absolute right-3.5 text-[#5a6a7a] text-sm select-none">{suffix}</span>
        )}
      </div>
      {helper && <p className="text-xs text-[#5a6a7a]">{helper}</p>}
      {error && <p className="text-xs text-[#e17055]">{error}</p>}
    </div>
  );
}

export function Select({ label, value, onChange, options, className = '' }) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && <label className="text-sm font-medium text-[#0d1b2a]">{label}</label>}
      <select
        value={value}
        onChange={e => onChange && onChange(e.target.value)}
        className="w-full border-2 border-[#ede8e1] rounded-xl px-4 py-3 text-[#0d1b2a] bg-white focus:outline-none focus:border-[#00b894] transition-colors text-base hover:border-[#b0c4d8] cursor-pointer"
      >
        <option value="">Select…</option>
        {options.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}
