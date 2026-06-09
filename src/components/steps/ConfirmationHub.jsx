import { useApp } from '../../context/AppContext';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { formatCurrency, formatRate, calcMonthly } from '../../utils/mock';

export function ConfirmationHub() {
  const { state, dispatch } = useApp();
  const { quote, approval, docs, activityLog } = state;
  const monthly = calcMonthly(quote.loanAmount, approval.approvedRate || 6.49, quote.term);

  return (
    <div className="max-w-2xl mx-auto px-4 pb-16 pt-8">
      {/* Hero */}
      <div className="text-center mb-8 animate-fade-up">
        <div className="w-24 h-24 rounded-full bg-[#00b894]/10 border-2 border-[#00b894]/30 flex items-center justify-center mx-auto mb-5">
          <span className="text-5xl">🎉</span>
        </div>
        <h1 className="font-serif text-4xl font-semibold text-[#0d1b2a] mb-2">You're settled.</h1>
        <p className="text-[#5a6a7a]">Your loan is active and the dealer has been paid directly.</p>
      </div>

      {/* Approved terms */}
      <Card variant="navy" className="p-6 mb-5 animate-fade-up delay-100">
        <p className="text-xs font-semibold uppercase tracking-wider text-[#5a6a7a] mb-4">Your loan terms</p>
        <div className="grid grid-cols-2 gap-4 text-center mb-5">
          <div>
            <p className="text-xs text-[#5a6a7a] mb-1">Rate</p>
            <p className="font-mono text-3xl font-bold text-[#00b894]">{formatRate(approval.approvedRate || 6.49)}</p>
          </div>
          <div>
            <p className="text-xs text-[#5a6a7a] mb-1">Monthly repayment</p>
            <p className="font-mono text-3xl font-bold text-white">{formatCurrency(monthly)}</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 text-center pt-4 border-t border-white/10">
          {[['Amount', formatCurrency(quote.loanAmount)], ['Term', `${quote.term} months`], ['Lender', 'Plenti Auto']].map(([k, v]) => (
            <div key={k}><p className="text-xs text-[#5a6a7a]">{k}</p><p className="font-mono font-semibold text-white text-sm">{v}</p></div>
          ))}
        </div>
      </Card>

      {/* Repayment schedule */}
      <Card className="p-5 mb-5 animate-fade-up delay-200">
        <p className="text-sm font-semibold text-[#0d1b2a] mb-3">Repayment schedule (first 6 months)</p>
        <div className="grid grid-cols-4 pb-2 mb-1 border-b border-[#f0f0f0]">
          <span className="text-xs text-[#5a6a7a]">Month</span>
          <span className="text-xs text-[#5a6a7a] text-center">Repayment</span>
          <span className="text-xs text-[#e17055] text-center">Interest</span>
          <span className="text-xs text-[#00b894] text-right">Principal</span>
        </div>
        <div className="divide-y divide-[#f8f4ef]">
          {Array.from({ length: 6 }, (_, i) => {
            const r = (approval.approvedRate || 6.49) / 100 / 12;
            let balance = quote.loanAmount;
            for (let m = 0; m < i; m++) {
              const int = balance * r;
              balance = balance - (monthly - int);
            }
            const interest = Math.round(balance * r);
            const principal = monthly - interest;
            return (
              <div key={i} className="grid grid-cols-4 py-2 text-xs">
                <span className="font-medium text-[#5a6a7a]">{i + 1}</span>
                <span className="font-mono text-center text-[#0d1b2a]">{formatCurrency(monthly)}</span>
                <span className="font-mono text-center text-[#e17055]">-{formatCurrency(interest)}</span>
                <span className="font-mono text-right text-[#00b894]">-{formatCurrency(principal)}</span>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Audit trail */}
      <Card className="p-5 mb-5 animate-fade-up delay-300">
        <p className="text-sm font-semibold text-[#0d1b2a] mb-4">Audit trail</p>
        <div className="relative">
          <div className="absolute left-2.5 top-0 bottom-0 w-0.5 bg-[#ede8e1]" />
          {[...activityLog].reverse().map((entry) => (
            <div key={entry.id} className="flex gap-4 pb-4 last:pb-0">
              <div className={`w-5 h-5 rounded-full border-2 shrink-0 mt-0.5 z-10 ${entry.actor === 'System' ? 'border-[#00b894] bg-[#00b894]/10' : entry.actor === 'Financier' ? 'border-[#0d1b2a] bg-[#0d1b2a]/10' : 'border-[#5a6a7a] bg-white'}`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                  <span className={`text-xs font-semibold ${entry.actor === 'System' ? 'text-[#00b894]' : entry.actor === 'Financier' ? 'text-[#0d1b2a]' : 'text-[#5a6a7a]'}`}>{entry.actor}</span>
                  <span className="text-xs font-mono text-[#b0c4d8]">{entry.timestamp}</span>
                </div>
                <p className="text-xs text-[#0d1b2a] leading-relaxed">{entry.action}</p>
              </div>
            </div>
          ))}
          {activityLog.length === 0 && <p className="text-xs text-[#5a6a7a] pl-8">No events recorded yet.</p>}
        </div>
      </Card>

      {/* What happens next */}
      <Card className="p-5 mb-5 animate-fade-up delay-400">
        <p className="text-sm font-semibold text-[#0d1b2a] mb-3">What happens next</p>
        <div className="flex flex-col gap-3 text-sm text-[#5a6a7a]">
          <div className="flex items-start gap-3"><span className="text-[#00b894] shrink-0 font-semibold">1.</span><p>Your first repayment will be debited on the date shown in your contract. Check your email for the full loan schedule.</p></div>
          <div className="flex items-start gap-3"><span className="text-[#00b894] shrink-0 font-semibold">2.</span><p>The dealer has been notified of payment. You can collect your vehicle — bring your signed handover documents.</p></div>
          <div className="flex items-start gap-3"><span className="text-[#00b894] shrink-0 font-semibold">3.</span><p>Plenti Auto will register a security interest on the PPSR within 5 business days of settlement.</p></div>
        </div>
      </Card>

      {/* Hardship & complaints */}
      <Card variant="cream" className="p-5 mb-6 animate-fade-up delay-500">
        <p className="text-xs font-semibold text-[#5a6a7a] uppercase tracking-wider mb-3">Important contacts</p>
        <div className="flex flex-col gap-4 text-xs text-[#5a6a7a]">
          <div><p className="font-semibold text-[#0d1b2a] mb-1">Financial hardship</p><p>If you're struggling to meet repayments, contact Plenti immediately at hardship@plenti.com.au or 1300 660 000. Waiting makes it harder. Hardship programs are available.</p></div>
          <div><p className="font-semibold text-[#0d1b2a] mb-1">Complaints</p><p>Baserate: complaints@baserate.com.au · Plenti: complaints@plenti.com.au</p><p className="mt-1 font-semibold text-[#0d1b2a]">AFCA (Australian Financial Complaints Authority)</p><p>afca.org.au · 1800 931 678 · Free to use, no legal representation needed.</p></div>
        </div>
      </Card>

      <Button onClick={() => dispatch({ type: 'RESET' })} variant="secondary" size="lg" className="w-full">
        Start a new demo
      </Button>
    </div>
  );
}
