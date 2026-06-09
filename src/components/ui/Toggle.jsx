export function Toggle({ checked, onChange, label, description, required }) {
  return (
    <label className="flex items-start gap-4 cursor-pointer group">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange && onChange(!checked)}
        className={`relative shrink-0 w-12 h-6 rounded-full transition-colors duration-200 mt-0.5
          ${checked ? 'bg-[#00b894]' : 'bg-[#ede8e1]'}
        `}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200
            ${checked ? 'translate-x-6' : 'translate-x-0'}
          `}
        />
      </button>
      <div className="flex-1">
        <p className="text-sm font-medium text-[#0d1b2a] leading-snug">
          {label}
          {required && <span className="text-[#e17055] ml-1">*</span>}
        </p>
        {description && <p className="text-xs text-[#5a6a7a] mt-0.5 leading-relaxed">{description}</p>}
      </div>
    </label>
  );
}
