import { useApp } from '../context/AppContext';
import { Button } from './ui/Button';

const STEPS = [
  { label: 'Quote', step: 0 },
  { label: 'Application', step: 1 },
  { label: 'Finances', step: 2 },
  { label: 'Approval', step: 3 },
  { label: 'Settlement', step: 4 },
  { label: 'Confirmation', step: 5 },
];

const OUTCOMES = [
  { value: 'approved', label: '✓ Approved', color: '#00b894' },
  { value: 'refer', label: '⏸ Refer to Human', color: '#f0a500' },
  { value: 'fraud', label: '⚠ Fraud Hold', color: '#e17055' },
];

export function DemoControls() {
  const { state, dispatch } = useApp();

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => dispatch({ type: 'TOGGLE_DEMO_PANEL' })}
        className="fixed bottom-4 right-4 z-50 w-10 h-10 rounded-full bg-[#0d1b2a] text-white text-xs font-bold shadow-xl hover:bg-[#1a2f45] transition-colors flex items-center justify-center"
        title="Demo Controls"
      >
        {state.demoPanelOpen ? '✕' : '⚙'}
      </button>

      {/* Panel */}
      {state.demoPanelOpen && (
        <div className="fixed bottom-16 right-4 z-50 w-64 bg-[#0d1b2a] text-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="px-4 py-3 border-b border-white/10">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#5a6a7a]">Demo Controls</p>
          </div>

          {/* Jump to step */}
          <div className="px-4 pt-3 pb-2">
            <p className="text-xs text-[#5a6a7a] mb-2 uppercase tracking-wider">Jump to step</p>
            <div className="grid grid-cols-2 gap-1.5">
              {STEPS.map(s => (
                <button
                  key={s.step}
                  onClick={() => { dispatch({ type: 'SET_STEP', step: s.step }); dispatch({ type: 'TOGGLE_DEMO_PANEL' }); }}
                  className={`text-xs py-1.5 px-2 rounded-lg font-medium transition-colors text-left
                    ${state.currentStep === s.step ? 'bg-[#00b894] text-white' : 'bg-white/10 text-white/80 hover:bg-white/20'}
                  `}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Outcome */}
          <div className="px-4 pt-2 pb-3">
            <p className="text-xs text-[#5a6a7a] mb-2 uppercase tracking-wider">Approval outcome</p>
            <div className="flex flex-col gap-1">
              {OUTCOMES.map(o => (
                <button
                  key={o.value}
                  onClick={() => dispatch({ type: 'SET_DEMO_OUTCOME', outcome: o.value })}
                  className={`text-xs py-1.5 px-3 rounded-lg font-medium text-left transition-colors
                    ${state.demoOutcome === o.value ? 'text-[#0d1b2a]' : 'bg-white/10 text-white/80 hover:bg-white/20'}
                  `}
                  style={state.demoOutcome === o.value ? { backgroundColor: o.color } : {}}
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
              className="w-full text-xs py-2 px-3 rounded-lg bg-white/10 text-white/80 hover:bg-white/20 transition-colors font-medium"
            >
              ↺ Reset demo
            </button>
          </div>
        </div>
      )}
    </>
  );
}
