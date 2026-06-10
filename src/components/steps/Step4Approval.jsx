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
    <div className="max-w-3xl mx-auto px-8 pb-24 pt-14">
      <LoadingState message="Assessing your application…" submessage="Running serviceability and suitability assessment" />
      <div className="mt-8 flex flex-col gap-3 max-w-xs mx-auto">
        {['Checking debt-service ratio', 'Running lender policy matching', 'Ranking by Best Interests Duty', 'Generating Preliminary Credit Assessment'].map((t, i) => (
          <div key={t} className={`text-sm text-[#86868b] flex items-center gap-3 animate-fade-up delay-${(i+2)*100}`}>
            <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 animate-pulse bg-[#007a5a]" />
            {t}
          </div>
        ))}
      </div>
    </div>
  );

  if (demoOutcome === 'refer') return (
    <div className="max-w-3xl mx-auto px-8 pb-24 pt-14">
      <div className="text-center py-14 animate-fade-up">
        <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 bg-[#fef3e2] border border-[#f59e0b]/25">
          <span className="text-4xl">⏸</span>
        </div>
        <h2 className="text-3xl font-bold text-[#1d1d1f] tracking-tight mb-3" style={{ letterSpacing: '-0.02em' }}>Under review</h2>
        <p className="text-[#6e6e73] max-w-sm mx-auto leading-relaxed mb-10">An assessor is reviewing your application — we'll be in touch within 1 business day. No action needed right now.</p>
        <div className="bg-white rounded-2xl shadow-sm p-6 text-left max-w-sm mx-auto">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#86868b] mb-4">What happens next</p>
          {['Our assessor reviews your file in detail', 'We may contact you for additional documents', 'Outcome within 1 business day', "You'll receive email and SMS notification"].map(t => (
            <p key={t} className="text-[15px] text-[#6e6e73] mb-2">· {t}</p>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto px-8 pb-24 pt-14 animate-fade-up">
      {/* Status badge */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#eef7f3] border border-[#d1ede4] mb-5">
          <div className="w-1.5 h-1.5 rounded-full bg-[#007a5a]" />
          <span className="text-sm font-semibold text-[#007a5a]">Conditionally Approved</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold text-[#1d1d1f] tracking-tight mb-2" style={{ letterSpacing: '-0.02em' }}>
          Approved in principle
        </h2>
        <p className="text-sm text-[#86868b]">Preliminary Credit Assessment generated · No obligation at this stage</p>
      </div>

      {/* Metrics card */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-6">
        <div className="grid grid-cols-3 divide-x divide-[rgba(0,0,0,0.06)] border-b border-[rgba(0,0,0,0.06)]">
          <div className="py-7 px-5 text-center">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#86868b] mb-2">Your base rate</p>
            <p className="font-mono text-4xl font-black text-[#007a5a]">{APPROVED_RATE}%</p>
            <p className="text-xs text-[#adadb3] mt-1">p.a.</p>
          </div>
          <div className="py-7 px-5 text-center">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#86868b] mb-2">Loan amount</p>
            <p className="font-mono text-4xl font-black text-[#1d1d1f]">{formatCurrency(quote.loanAmount)}</p>
            <p className="text-xs text-[#adadb3] mt-1">{quote.term} months</p>
          </div>
          <div className="py-7 px-5 text-center">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#86868b] mb-2">Monthly</p>
            <p className="font-mono text-4xl font-black text-[#1d1d1f]">{formatCurrency(monthly)}</p>
            <p className="text-xs text-[#adadb3] mt-1">approx.</p>
          </div>
        </div>
        <div className="px-6 py-4 flex items-center justify-between bg-[#f5f5f7]">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#86868b] mb-0.5">Recommended lender</p>
            <p className="font-semibold text-[#1d1d1f]">Plenti Auto</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-[#86868b]">Comparison rate</p>
            <p className="font-mono text-sm font-semibold text-[#6e6e73]">{formatRate(6.82)}</p>
          </div>
        </div>
      </div>

      {/* Advisor toggle */}
      <button
        onClick={() => setAdvisorView(v => !v)}
        className="flex items-center gap-2 text-sm text-[#86868b] hover:text-[#6e6e73] mb-5 transition-colors"
      >
        <span className="text-xs">{advisorView ? '▼' : '▶'}</span>
        <span>{advisorView ? 'Hide' : 'View'} lender comparison (advisor view)</span>
      </button>

      {advisorView && (
        <div className="mb-6 animate-fade-up bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-[rgba(0,0,0,0.06)]">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#86868b]">Ranked by your benefit, not our commission</p>
          </div>
          {MOCK_LENDERS.map((l, i) => (
            <div key={l.id} className="px-6 py-5" style={{ background: i === 0 ? '#eef7f3' : 'white', borderBottom: i < MOCK_LENDERS.length - 1 ? '1px solid rgba(0,0,0,0.06)' : 'none' }}>
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0"
                    style={{ background: i === 0 ? '#d1ede4' : '#f5f5f7', color: i === 0 ? '#007a5a' : '#86868b' }}>
                    {i + 1}
                  </div>
                  <div>
                    <p className="font-semibold text-[#1d1d1f] text-sm">{l.name}</p>
                    <p className="text-xs text-[#86868b]">{l.rationale}</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-mono font-bold text-[#1d1d1f]">{formatRate(l.rate)}</p>
                  <p className="text-xs text-[#86868b]">comp. {formatRate(l.comparisonRate)}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[['Est. fee', formatCurrency(l.establishmentFee)], ['Monthly fee', l.monthlyFee > 0 ? formatCurrency(l.monthlyFee) : 'None'], ['Early payout', l.earlyPayout]].map(([k, v]) => (
                  <div key={k}>
                    <p className="text-[10px] text-[#adadb3] uppercase tracking-wider">{k}</p>
                    <p className="text-xs font-medium text-[#6e6e73]">{v}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <div className="px-6 py-4 bg-[#f5f5f7] border-t border-[rgba(0,0,0,0.06)]">
            <p className="text-xs text-[#adadb3]">Best Interests Duty: recommendation based on lowest total cost of credit for your profile. Preliminary Credit Assessment document generated and retained on file.</p>
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
