import { useApp } from '../context/AppContext';

const STEPS = [
  { label: 'Quote', step: 0 }, { label: 'Application', step: 1 }, { label: 'Finances', step: 2 },
  { label: 'Approval', step: 3 }, { label: 'Settlement', step: 4 }, { label: 'Confirmation', step: 5 },
];
const OUTCOMES = [
  { value: 'approved', label: 'Approved',       color: '#007a5a', bg: '#eef7f3', border: '#d1ede4' },
  { value: 'refer',    label: 'Refer to human', color: '#b45309', bg: '#fef3e2', border: '#f9d49a' },
  { value: 'fraud',    label: 'Fraud hold',     color: '#c0392b', bg: '#fdf0ef', border: '#fad5d2' },
];

export function DemoControls() {
  const { state, dispatch } = useApp();

  return (
    <>
      <button
        onClick={() => dispatch({ type: 'TOGGLE_DEMO_PANEL' })}
        className="fixed bottom-5 right-5 z-50 w-9 h-9 rounded-full bg-white border border-[rgba(0,0,0,0.1)] shadow-md flex items-center justify-center text-sm text-[#6e6e73] hover:bg-[#f5f5f7] transition-colors"
        title="Demo Controls"
      >
        {state.demoPanelOpen ? '✕' : '⚙'}
      </button>

      {state.demoPanelOpen && (
        <div className="fixed bottom-16 right-5 z-50 w-60 bg-white rounded-2xl shadow-xl border border-[rgba(0,0,0,0.08)] overflow-hidden">
          <div className="px-4 py-3 border-b border-[rgba(0,0,0,0.07)]">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#86868b]">Demo Controls</p>
          </div>

          <div className="px-4 pt-3 pb-2">
            <p className="text-[10px] font-semibold text-[#adadb3] uppercase tracking-widest mb-2">Jump to step</p>
            <div className="grid grid-cols-2 gap-1.5">
              {STEPS.map(s => (
                <button key={s.step}
                  onClick={() => { dispatch({ type: 'SET_STEP', step: s.step }); dispatch({ type: 'TOGGLE_DEMO_PANEL' }); }}
                  className="text-xs py-1.5 px-2 rounded-lg font-medium text-left transition-all"
                  style={{
                    background: state.currentStep === s.step ? '#1d1d1f' : '#f5f5f7',
                    color: state.currentStep === s.step ? 'white' : '#6e6e73',
                  }}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div className="px-4 pt-1 pb-3">
            <p className="text-[10px] font-semibold text-[#adadb3] uppercase tracking-widest mb-2">Approval outcome</p>
            {OUTCOMES.map(o => (
              <button key={o.value}
                onClick={() => dispatch({ type: 'SET_DEMO_OUTCOME', outcome: o.value })}
                className="w-full text-xs py-1.5 px-3 rounded-lg font-medium text-left mb-1.5 last:mb-0 transition-all"
                style={{
                  background: state.demoOutcome === o.value ? o.bg : 'transparent',
                  color: state.demoOutcome === o.value ? o.color : '#6e6e73',
                  border: state.demoOutcome === o.value ? `1px solid ${o.border}` : '1px solid transparent',
                }}
              >
                {o.label}
              </button>
            ))}
          </div>

          <div className="px-4 pb-4">
            <button
              onClick={() => dispatch({ type: 'RESET' })}
              className="w-full text-xs py-2 rounded-lg text-[#86868b] hover:bg-[#f5f5f7] transition-colors border border-[rgba(0,0,0,0.08)]"
            >
              ↺ Reset demo
            </button>
          </div>
        </div>
      )}
    </>
  );
}
