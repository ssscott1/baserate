export function Toggle({ checked, onChange, label, description, required }) {
  return (
    <label className="flex items-start gap-4 cursor-pointer">
      <button
        type="button" role="switch" aria-checked={checked}
        onClick={() => onChange && onChange(!checked)}
        className="relative shrink-0 w-11 h-6 rounded-full transition-colors duration-200 mt-0.5 focus:outline-none"
        style={{ background: checked ? '#1d1d1f' : '#d1d1d6' }}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${checked ? 'translate-x-5' : 'translate-x-0'}`}
        />
      </button>
      <div className="flex-1">
        <p className="text-[15px] font-medium text-[#1d1d1f] leading-snug">
          {label}{required && <span className="text-[#c0392b] ml-1">*</span>}
        </p>
        {description && <p className="text-sm text-[#86868b] mt-0.5 leading-relaxed">{description}</p>}
      </div>
    </label>
  );
}
