export function WizardLayout({ title, steps, current, children }) {
  return (
    <div className="max-w-6xl mx-auto px-8 pb-24 pt-12">
      <div className="grid lg:grid-cols-[260px_1fr] gap-12 items-start">

        {/* Sidebar */}
        <aside className="lg:sticky lg:top-24">
          {title && <p className="text-xs font-semibold uppercase tracking-widest text-[#86868b] mb-5 px-4">{title}</p>}
          <nav className="flex flex-col gap-1">
            {steps.map((s, i) => (
              <div key={s} className="flex items-center gap-3 px-4 py-2.5 rounded-xl transition-colors"
                style={{ background: i === current ? 'white' : 'transparent', boxShadow: i === current ? '0 1px 3px rgba(0,0,0,0.06)' : 'none' }}>
                <span
                  className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0"
                  style={{
                    background: i < current ? '#eef7f3' : i === current ? '#1d1d1f' : '#ebebed',
                    color: i < current ? '#007a5a' : i === current ? 'white' : '#adadb3',
                  }}
                >
                  {i < current ? '✓' : i + 1}
                </span>
                <span className={`text-sm font-medium ${
                  i === current ? 'text-[#1d1d1f]' : i < current ? 'text-[#007a5a]' : 'text-[#adadb3]'
                }`}>{s}</span>
              </div>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <div className="max-w-2xl w-full animate-fade-up" key={current}>
          {children}
        </div>
      </div>
    </div>
  );
}
