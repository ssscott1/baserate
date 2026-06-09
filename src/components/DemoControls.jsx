import { useApp } from '../context/AppContext';

const STEPS = [
  { label: 'Quote', step: 0 },
  { label: 'Application', step: 1 },
  { label: 'Finances', step: 2 },
  { label: 'Approval', step: 3 },
  { label: 'Settlement', step: 4 },
  { label: 'Confirmation', step: 5 },
];

const OUTCOMES = [
  { value: 'approved', label: 'Approved', color: '#00e5a0', bg: 'rgba(0,229,160,0.12)', border: 'rgba(0,229,160,0.3)' },
  { value: 'refer', label: 'Refer to human', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.3)' },
  { value: 'fraud', label: 'Fraud hold', color: '#ff6b6b', bg: 'rgba(255,107,107,0.12)', border: 'rgba(255,107,107,0.3)' },
];

export function DemoControls() {
  const { state, dispatch } = useApp();

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => dispatch({ type: 'TOGGLE_DEMO_PANEL' })}
        className="fixed bottom-5 right-5 z-50 w-9 h-9 rounded-xl flex items-center justify-center transition-all text-sm font-bold"
        style={{
          background: state.demoPanelOpen ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.07)',
          border: '1px solid rgba(255,255,255,0.12)',
          backdropFilter: 'blur(12px)',
          color: '#9898b0',
        }}
        title="Demo Controls"
      >
        {state.demoPanelOpen ? '✕' : '⚙'}
      </button>

      {/* Panel */}
      {state.demoPanelOpen && (
        <div
          className="fixed bottom-16 right-5 z-50 w-60 rounded-2xl overflow-hidden"
          style={{
            background: 'rgba(14,14,24,0.95)',
            border: '1px solid rgba(255,255,255,0.1)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
          }}
        >
          <div className="px-4 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#5c5c72]">Demo Controls</p>
          </div>

          {/* Jump to step */}
          <div className="px-4 pt-3 pb-2">
            <p className="text-[10px] text-[#3a3a50] uppercase tracking-widest mb-2 font-semibold">Jump to step</p>
            <div className="grid grid-cols-2 gap-1.5">
              {STEPS.map(s => (
                <button
                  key={s.step}
                  onClick={() => { dispatch({ type: 'SET_STEP', step: s.step }); dispatch({ type: 'TOGGLE_DEMO_PANEL' }); }}
                  className="text-xs py-1.5 px-2 rounded-lg font-medium text-left transition-all"
                  style={{
                    background: state.currentStep === s.step ? 'rgba(0,229,160,0.12)' : 'rgba(255,255,255,0.05)',
                    color: state.currentStep === s.step ? '#00e5a0' : 'rgba(255,255,255,0.6)',
                    border: state.currentStep === s.step ? '1px solid rgba(0,229,160,0.25)' : '1px solid transparent',
                  }}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Outcome */}
          <div className="px-4 pt-2 pb-3">
            <p className="text-[10px] text-[#3a3a50] uppercase tracking-widest mb-2 font-semibold">Approval outcome</p>
            <div className="flex flex-col gap-1.5">
              {OUTCOMES.map(o => (
                <button
                  key={o.value}
                  onClick={() => dispatch({ type: 'SET_DEMO_OUTCOME', outcome: o.value })}
                  className="text-xs py-1.5 px-3 rounded-lg font-medium text-left transition-all"
                  style={{
                    background: state.demoOutcome === o.value ? o.bg : 'rgba(255,255,255,0.04)',
                    color: state.demoOutcome === o.value ? o.color : 'rgba(255,255,255,0.5)',
                    border: state.demoOutcome === o.value ? `1px solid ${o.border}` : '1px solid transparent',
                  }}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>

          {/* Reset */}
          <div className="px-4 pb-4">
            <button
              onClick={() => dispatch({ type: 'RESET' })}
              className="w-full text-xs py-2 px-3 rounded-lg font-medium transition-all"
              style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              ↺ Reset demo
            </button>
          </div>
        </div>
      )}
    </>
  );
}
