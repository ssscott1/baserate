import { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Button } from '../ui/Button';
import { LoadingState } from '../ui/Spinner';
import { Disclaimer } from '../ui/Disclaimer';
import { formatCurrency, formatRate, calcMonthly, MOCK_LENDERS, mockCall } from '../../utils/mock';

export function Step4Approval() {
  const { state, dispatch } = useApp();
  const { demoOutcome, quote } = state;
  const [phase, setPhase] = useState('assessing');
  const [advisorView, setAdvisorView] = useState(false);
  const APPROVED_RATE = 6.49;
  const monthly = calcMonthly(quote.loanAmount, APPROVED_RATE, quote.term);

  useEffect(() => {
    const run = async () => {
      await mockCall(2200, 3200);
      dispatch({ type: 'UPDATE_APPROVAL', data: { status: demoOutcome === 'refer' ? 'refer' : 'approved', approvedRate: APPROVED_RATE, approvedAmount: quote.loanAmount, monthlyRepayment: monthly, lenders: MOCK_LENDERS } });
      dispatch({ type: 'ADD_LOG', actor: 'System', message: demoOutcome === 'refer' ? 'Application referred to human assessor for review' : `Preliminary Credit Assessment complete — conditionally approved at ${formatRate(APPROVED_RATE)}` });
      setPhase('result');
    };
    run();
  }, []);

  if (phase === 'assessing') return (
    <div className="max-w-2xl mx-auto px-5 pb-20 pt-6">
      <LoadingState message="Assessing your application…" submessage="Running serviceability and suitability assessment" />
      <div className="mt-6 flex flex-col gap-2.5 max-w-xs mx-auto">
        {['Checking debt-service ratio', 'Running lender policy matching', 'Ranking by Best Interests Duty', 'Generating Preliminary Credit Assessment'].map((t, i) => (
          <div key={t} className={`text-xs text-[#5c5c72] flex items-center gap-2.5 animate-fade-up delay-${(i+2)*100}`}>
            <div className="w-1 h-1 rounded-full flex-shrink-0 animate-pulse" style={{ background: '#00e5a0', boxShadow: '0 0 6px rgba(0,229,160,0.6)' }} />
            {t}
          </div>
        ))}
      </div>
    </div>
  );

  if (demoOutcome === 'refer') return (
    <div className="max-w-2xl mx-auto px-5 pb-20 pt-6">
      <div className="text-center py-12 animate-fade-up">
        <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)' }}>
          <span className="text-4xl">⏸</span>
        </div>
        <h2 className="text-3xl font-bold text-[#f0f0f6] tracking-tight mb-3">Under review</h2>
        <p className="text-[#9898b0] max-w-sm mx-auto leading-relaxed mb-8">An assessor is reviewing your application — we'll be in touch within 1 business day. No action needed right now.</p>
        <div className="rounded-xl p-5 text-left max-w-sm mx-auto" style={{ background: '#0e0e18', border: '1px solid rgba(255,255,255,0.08)' }}>
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#5c5c72] mb-3">What happens next</p>
          {['Our assessor reviews your file in detail', 'We may contact you for additional documents', 'Outcome within 1 business day', "You'll receive email and SMS notification"].map(t => (
            <p key={t} className="text-sm text-[#9898b0] mb-1.5">· {t}</p>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto px-5 pb-20 pt-6 animate-fade-up">
      {/* Status badge */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4" style={{ background: 'rgba(0,229,160,0.08)', border: '1px solid rgba(0,229,160,0.25)' }}>
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#00e5a0', boxShadow: '0 0 6px rgba(0,229,160,0.6)' }} />
          <span className="text-sm font-semibold text-[#00e5a0]">Conditionally Approved</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold text-[#f0f0f6] tracking-tight mb-2" style={{ letterSpacing: '-0.02em' }}>
          Approved in principle
        </h2>
        <p className="text-sm text-[#5c5c72]">Preliminary Credit Assessment generated · No obligation at this stage</p>
      </div>

      {/* Metrics card */}
      <div className="rounded-2xl overflow-hidden mb-5" style={{ background: '#0a0a12', border: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="grid grid-cols-3 text-center" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="py-6 px-4" style={{ borderRight: '1px solid rgba(255,255,255,0.06)' }}>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#5c5c72] mb-2">Your base rate</p>
            <p className="font-mono text-4xl font-black" style={{ color: '#00e5a0', textShadow: '0 0 24px rgba(0,229,160,0.35)' }}>{APPROVED_RATE}%</p>
            <p className="text-xs text-[#3a3a50] mt-1">p.a.</p>
          </div>
          <div className="py-6 px-4" style={{ borderRight: '1px solid rgba(255,255,255,0.06)' }}>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#5c5c72] mb-2">Loan amount</p>
            <p className="font-mono text-4xl font-black text-[#f0f0f6]">{formatCurrency(quote.loanAmount)}</p>
            <p className="text-xs text-[#3a3a50] mt-1">{quote.term} months</p>
          </div>
          <div className="py-6 px-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#5c5c72] mb-2">Monthly</p>
            <p className="font-mono text-4xl font-black text-[#f0f0f6]">{formatCurrency(monthly)}</p>
            <p className="text-xs text-[#3a3a50] mt-1">approx.</p>
          </div>
        </div>
        <div className="px-5 py-4 flex items-center justify-between" style={{ background: '#0e0e18' }}>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#5c5c72] mb-0.5">Recommended lender</p>
            <p className="font-semibold text-[#f0f0f6]">Plenti Auto</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-[#5c5c72]">Comparison rate</p>
            <p className="font-mono text-sm font-semibold text-[#9898b0]">{formatRate(6.82)}</p>
          </div>
        </div>
      </div>

      {/* Advisor toggle */}
      <button
        onClick={() => setAdvisorView(v => !v)}
        className="flex items-center gap-2 text-sm text-[#5c5c72] hover:text-[#9898b0] mb-4 transition-colors"
      >
        <span className="text-xs">{advisorView ? '▼' : '▶'}</span>
        <span>{advisorView ? 'Hide' : 'View'} lender comparison (advisor view)</span>
      </button>

      {advisorView && (
        <div className="mb-5 animate-fade-up rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="px-5 py-3" style={{ background: '#0a0a12', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#5c5c72]">Ranked by your benefit, not our commission</p>
          </div>
          {MOCK_LENDERS.map((l, i) => (
            <div key={l.id} className="px-5 py-4" style={{ background: i === 0 ? 'rgba(0,229,160,0.04)' : '#0e0e18', borderBottom: i < MOCK_LENDERS.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0" style={{ background: i === 0 ? 'rgba(0,229,160,0.15)' : 'rgba(255,255,255,0.07)', color: i === 0 ? '#00e5a0' : '#5c5c72', border: i === 0 ? '1px solid rgba(0,229,160,0.3)' : '1px solid rgba(255,255,255,0.1)' }}>
                    {i + 1}
                  </div>
                  <div>
                    <p className="font-semibold text-[#f0f0f6] text-sm">{l.name}</p>
                    <p className="text-xs text-[#5c5c72]">{l.rationale}</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-mono font-bold text-[#f0f0f6]">{formatRate(l.rate)}</p>
                  <p className="text-xs text-[#5c5c72]">comp. {formatRate(l.comparisonRate)}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[['Est. fee', formatCurrency(l.establishmentFee)], ['Monthly fee', l.monthlyFee > 0 ? formatCurrency(l.monthlyFee) : 'None'], ['Early payout', l.earlyPayout]].map(([k, v]) => (
                  <div key={k}><p className="text-[10px] text-[#3a3a50] uppercase tracking-wider">{k}</p><p className="text-xs font-medium text-[#9898b0]">{v}</p></div>
                ))}
              </div>
            </div>
          ))}
          <div className="px-5 py-3" style={{ background: '#0a0a12', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <p className="text-xs text-[#3a3a50]">Best Interests Duty: recommendation based on lowest total cost of credit for your profile. Preliminary Credit Assessment document generated and retained on file.</p>
          </div>
        </div>
      )}

      <Disclaimer>
        Indicative approval only — not a final offer of credit. Subject to satisfactory verification of documents, vehicle details, and final lender assessment. Fees and rates may vary. ACL [number].
      </Disclaimer>

      <Button onClick={() => { dispatch({ type: 'SET_STEP', step: 4 }); dispatch({ type: 'ADD_LOG', actor: 'Applicant', message: 'Approval acknowledged — proceeding to documentation' }); }} size="lg" className="w-full mt-5">
        Review your documents →
      </Button>
    </div>
  );
}
