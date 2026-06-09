import { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { LoadingState } from '../ui/Spinner';
import { Disclaimer } from '../ui/Disclaimer';
import { formatCurrency, formatRate, calcMonthly, MOCK_LENDERS, mockCall } from '../../utils/mock';

export function Step4Approval() {
  const { state, dispatch } = useApp();
  const { demoOutcome, quote } = state;
  const [phase, setPhase] = useState('assessing'); // assessing | result
  const [advisorView, setAdvisorView] = useState(false);

  const APPROVED_RATE = 6.49;
  const monthly = calcMonthly(quote.loanAmount, APPROVED_RATE, quote.term);

  useEffect(() => {
    const run = async () => {
      await mockCall(2000, 3000);
      dispatch({ type: 'UPDATE_APPROVAL', data: {
        status: demoOutcome === 'approved' ? 'approved' : demoOutcome === 'refer' ? 'refer' : 'approved',
        approvedRate: APPROVED_RATE,
        approvedAmount: quote.loanAmount,
        monthlyRepayment: monthly,
        lenders: MOCK_LENDERS,
      }});
      dispatch({ type: 'ADD_LOG', actor: 'System', message: demoOutcome === 'approved'
        ? `Preliminary Credit Assessment complete — conditionally approved at ${formatRate(APPROVED_RATE)}`
        : demoOutcome === 'refer' ? 'Application referred to human assessor for review'
        : `Conditionally approved at ${formatRate(APPROVED_RATE)}` });
      setPhase('result');
    };
    run();
  }, []);

  if (phase === 'assessing') {
    return (
      <div className="max-w-2xl mx-auto px-4 pb-16 pt-6">
        <LoadingState
          message="Assessing your application…"
          submessage="Running serviceability and suitability assessment"
        />
        <div className="mt-4 flex flex-col gap-2 max-w-xs mx-auto">
          {['Checking debt-service ratio', 'Running lender policy matching', 'Ranking by Best Interests Duty', 'Generating Preliminary Credit Assessment'].map((t, i) => (
            <div key={t} className={`text-xs text-[#5a6a7a] flex items-center gap-2 animate-fade-up delay-${(i+1)*100 + 200}`}>
              <div className="w-1.5 h-1.5 rounded-full bg-[#00b894] animate-pulse" />
              {t}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Refer outcome
  if (demoOutcome === 'refer') {
    return (
      <div className="max-w-2xl mx-auto px-4 pb-16 pt-6">
        <div className="text-center py-10 animate-fade-up">
          <div className="w-20 h-20 rounded-full bg-[#f0a500]/10 border-2 border-[#f0a500]/30 flex items-center justify-center mx-auto mb-5">
            <span className="text-4xl">⏸</span>
          </div>
          <h2 className="font-serif text-3xl font-semibold text-[#0d1b2a] mb-3">Under review</h2>
          <p className="text-[#5a6a7a] max-w-sm mx-auto leading-relaxed mb-6">
            An assessor is reviewing your application — we'll be in touch within 1 business day. No action needed from you right now.
          </p>
          <Card className="p-5 text-left max-w-sm mx-auto">
            <p className="text-sm font-semibold text-[#0d1b2a] mb-2">What happens next</p>
            <div className="flex flex-col gap-2 text-sm text-[#5a6a7a]">
              <p>• Our assessor reviews your file in detail</p>
              <p>• We may contact you for additional documents</p>
              <p>• Outcome within 1 business day</p>
              <p>• You'll receive an email and SMS notification</p>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // Approved
  return (
    <div className="max-w-2xl mx-auto px-4 pb-16 pt-6 animate-fade-up">
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#00b894]/10 border border-[#00b894]/30 rounded-full mb-4">
          <div className="w-2 h-2 rounded-full bg-[#00b894]" />
          <span className="text-sm font-semibold text-[#00b894]">Conditionally Approved</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-[#0d1b2a] mb-2">
          You're approved in principle
        </h2>
        <p className="text-[#5a6a7a] text-sm">Preliminary Credit Assessment generated • No obligation at this stage</p>
      </div>

      {/* Big rate display */}
      <Card variant="navy" className="p-6 mb-5">
        <div className="grid grid-cols-3 gap-4 text-center mb-4">
          <div>
            <p className="text-xs text-[#5a6a7a] mb-1">Your base rate</p>
            <p className="font-mono text-3xl font-bold text-[#00b894]">{APPROVED_RATE}%</p>
            <p className="text-xs text-white/40">p.a.</p>
          </div>
          <div className="border-x border-white/10">
            <p className="text-xs text-[#5a6a7a] mb-1">Loan amount</p>
            <p className="font-mono text-3xl font-bold text-white">{formatCurrency(quote.loanAmount)}</p>
            <p className="text-xs text-white/40">{quote.term} months</p>
          </div>
          <div>
            <p className="text-xs text-[#5a6a7a] mb-1">Monthly repayment</p>
            <p className="font-mono text-3xl font-bold text-white">{formatCurrency(monthly)}</p>
            <p className="text-xs text-white/40">approx.</p>
          </div>
        </div>
        <div className="bg-white/5 rounded-xl p-3 text-center">
          <p className="text-xs text-[#5a6a7a]">Recommended lender</p>
          <p className="font-semibold text-white">Plenti Auto</p>
          <p className="text-xs text-[#5a6a7a]">Comparison rate {formatRate(6.82)} • No ongoing fees</p>
        </div>
      </Card>

      {/* Advisor view toggle */}
      <button
        onClick={() => setAdvisorView(v => !v)}
        className="flex items-center gap-2 text-sm text-[#5a6a7a] hover:text-[#0d1b2a] mb-4 transition-colors"
      >
        <span>{advisorView ? '▼' : '▶'}</span>
        <span>{advisorView ? 'Hide' : 'View'} lender comparison (advisor view)</span>
      </button>

      {advisorView && (
        <div className="mb-5 animate-fade-up">
          <Card className="overflow-hidden">
            <div className="bg-[#0d1b2a] px-5 py-3">
              <p className="text-xs font-semibold text-[#5a6a7a] uppercase tracking-wider">Lender ranking — ranked by your benefit, not our commission</p>
            </div>
            {MOCK_LENDERS.map((l, i) => (
              <div key={l.id} className={`px-5 py-4 border-b border-[#f0f0f0] last:border-0 ${i === 0 ? 'bg-[#00b894]/5' : ''}`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold
                      ${i === 0 ? 'bg-[#00b894] text-white' : 'bg-[#ede8e1] text-[#5a6a7a]'}
                    `}>#{i+1}</div>
                    <div>
                      <p className="font-semibold text-[#0d1b2a] text-sm">{l.name}</p>
                      <p className="text-xs text-[#5a6a7a]">{l.rationale}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-mono font-bold text-[#0d1b2a]">{formatRate(l.rate)}</p>
                    <p className="text-xs text-[#5a6a7a]">comp. {formatRate(l.comparisonRate)}</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 mt-3">
                  <div className="text-xs">
                    <span className="text-[#5a6a7a]">Est. fee: </span>
                    <span className="font-medium text-[#0d1b2a]">{formatCurrency(l.establishmentFee)}</span>
                  </div>
                  <div className="text-xs">
                    <span className="text-[#5a6a7a]">Monthly: </span>
                    <span className="font-medium text-[#0d1b2a]">{l.monthlyFee > 0 ? formatCurrency(l.monthlyFee) : 'None'}</span>
                  </div>
                  <div className="text-xs">
                    <span className="text-[#5a6a7a]">Early payout: </span>
                    <span className="font-medium text-[#0d1b2a]">{l.earlyPayout}</span>
                  </div>
                </div>
              </div>
            ))}
            <div className="px-5 py-3 bg-[#f8f4ef]">
              <p className="text-xs text-[#5a6a7a]">Best Interests Duty: recommendation based on lowest total cost of credit for your profile. Preliminary Credit Assessment (PCA) document generated and retained on file.</p>
            </div>
          </Card>
        </div>
      )}

      <Disclaimer>
        Indicative approval only — not a final offer of credit. Your loan is subject to satisfactory verification of documents, vehicle details, and final lender assessment. Fees, terms and rates may vary. ACL [number].
      </Disclaimer>

      <Button
        onClick={() => {
          dispatch({ type: 'SET_STEP', step: 4 });
          dispatch({ type: 'ADD_LOG', actor: 'Applicant', message: 'Approval acknowledged — proceeding to documentation' });
        }}
        size="lg"
        className="w-full mt-5"
      >
        Review your documents →
      </Button>
    </div>
  );
}
