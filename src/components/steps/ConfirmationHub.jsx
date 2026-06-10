import { useApp } from '../../context/AppContext';
import { Button } from '../ui/Button';
import { formatCurrency, formatRate, calcMonthly } from '../../utils/mock';

export function ConfirmationHub() {
  const { state, dispatch } = useApp();
  const { quote, approval, activityLog } = state;
  const monthly = calcMonthly(quote.loanAmount, approval.approvedRate || 6.49, quote.term);

  return (
    <div className="max-w-6xl mx-auto px-8 pb-24 pt-14">

      {/* Hero */}
      <div className="mb-12 animate-fade-up flex items-end justify-between gap-8 flex-wrap">
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#eef7f3] border border-[#d1ede4] mb-6">
            <div className="w-1.5 h-1.5 rounded-full bg-[#007a5a]" />
            <span className="text-sm font-semibold text-[#007a5a]">Loan active</span>
          </div>
          <h1 className="text-[56px] font-bold text-[#1d1d1f] leading-[1.04] mb-4" style={{ letterSpacing: '-0.03em' }}>
            You're <span className="text-[#007a5a]">settled.</span>
          </h1>
          <p className="text-[17px] text-[#6e6e73] leading-relaxed">Loan is active. The dealer has been paid directly.</p>
        </div>
        <Button onClick={() => dispatch({ type: 'RESET' })} variant="secondary" size="md">
          ↺ Start a new demo
        </Button>
      </div>

      <div className="grid lg:grid-cols-[1fr_400px] gap-8 items-start">

        {/* ---- Left column ---- */}
        <div className="flex flex-col gap-6">

          {/* Loan terms card */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden animate-fade-up delay-100">
            <div className="px-7 py-5 border-b border-[rgba(0,0,0,0.06)] bg-[#f5f5f7]">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#86868b]">Your loan terms</p>
            </div>
            <div className="grid grid-cols-2 divide-x divide-[rgba(0,0,0,0.06)] border-b border-[rgba(0,0,0,0.06)]">
              <div className="px-7 py-7">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#86868b] mb-2">Rate</p>
                <p className="font-mono text-4xl font-black text-[#007a5a]">{formatRate(approval.approvedRate || 6.49)}</p>
              </div>
              <div className="px-7 py-7">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#86868b] mb-2">Monthly repayment</p>
                <p className="font-mono text-4xl font-black text-[#1d1d1f]">{formatCurrency(monthly)}</p>
              </div>
            </div>
            <div className="grid grid-cols-3 px-7 py-5 bg-[#f5f5f7]">
              {[['Amount', formatCurrency(quote.loanAmount)], ['Term', `${quote.term} months`], ['Lender', 'Plenti Auto']].map(([k, v]) => (
                <div key={k}>
                  <p className="text-[10px] text-[#86868b] uppercase tracking-wider">{k}</p>
                  <p className="font-mono font-semibold text-[#1d1d1f] text-sm">{v}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Repayment schedule */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden animate-fade-up delay-200">
            <div className="px-7 py-4 border-b border-[rgba(0,0,0,0.06)] bg-[#f5f5f7]">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#86868b]">Repayment schedule — first 6 months</p>
            </div>
            <div className="grid grid-cols-4 px-7 py-3 border-b border-[rgba(0,0,0,0.06)]">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#adadb3]">Month</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#adadb3] text-center">Payment</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#c0392b]/60 text-center">Interest</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#007a5a]/70 text-right">Principal</span>
            </div>
            {Array.from({ length: 6 }, (_, i) => {
              const r = (approval.approvedRate || 6.49) / 100 / 12;
              let balance = quote.loanAmount;
              for (let m = 0; m < i; m++) { const int = balance * r; balance = balance - (monthly - int); }
              const interest = Math.round(balance * r);
              const principal = monthly - interest;
              return (
                <div key={i} className="grid grid-cols-4 px-7 py-3 text-[13px] border-b border-[rgba(0,0,0,0.04)] last:border-0">
                  <span className="font-mono text-[#86868b]">{i + 1}</span>
                  <span className="font-mono font-medium text-[#1d1d1f] text-center">{formatCurrency(monthly)}</span>
                  <span className="font-mono text-[#c0392b]/80 text-center">-{formatCurrency(interest)}</span>
                  <span className="font-mono text-[#007a5a]/80 text-right">-{formatCurrency(principal)}</span>
                </div>
              );
            })}
          </div>

          {/* What happens next */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden animate-fade-up delay-300">
            <div className="px-7 py-4 border-b border-[rgba(0,0,0,0.06)] bg-[#f5f5f7]">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#86868b]">What happens next</p>
            </div>
            <div className="p-7 flex flex-col gap-5">
              {[
                ['01', "Your first repayment will be debited on the date shown in your contract. Check your email for the full loan schedule."],
                ['02', "The dealer has been notified of payment. You can collect your vehicle — bring your signed handover documents."],
                ['03', "Plenti Auto will register a security interest on the PPSR within 5 business days of settlement."],
              ].map(([n, t]) => (
                <div key={n} className="flex items-start gap-4">
                  <span className="font-mono text-xs font-bold shrink-0 mt-0.5 text-[#007a5a]">{n}</span>
                  <p className="text-[15px] text-[#6e6e73] leading-relaxed">{t}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Important contacts */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden animate-fade-up delay-400">
            <div className="px-7 py-4 border-b border-[rgba(0,0,0,0.06)] bg-[#f5f5f7]">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#86868b]">Important contacts</p>
            </div>
            <div className="p-7 grid sm:grid-cols-2 gap-7">
              <div>
                <p className="text-sm font-bold text-[#1d1d1f] mb-1.5">Financial hardship</p>
                <p className="text-sm text-[#6e6e73] leading-relaxed">
                  If you're struggling to meet repayments, contact Plenti immediately at{' '}
                  <span className="text-[#1d1d1f] font-medium">hardship@plenti.com.au</span> or{' '}
                  <span className="text-[#1d1d1f] font-medium">1300 660 000</span>. Hardship programs are available.
                </p>
              </div>
              <div>
                <p className="text-sm font-bold text-[#1d1d1f] mb-1.5">Complaints & AFCA</p>
                <p className="text-sm text-[#6e6e73] leading-relaxed">
                  Baserate: <span className="text-[#1d1d1f] font-medium">complaints@baserate.com.au</span><br />
                  Plenti: <span className="text-[#1d1d1f] font-medium">complaints@plenti.com.au</span><br />
                  <span className="font-bold text-[#1d1d1f]">AFCA:</span>{' '}
                  <span className="text-[#1d1d1f] font-medium">afca.org.au · 1800 931 678</span> — free to use.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ---- Right column: audit trail ---- */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden animate-fade-up delay-200 lg:sticky lg:top-8">
          <div className="px-7 py-4 border-b border-[rgba(0,0,0,0.06)] bg-[#f5f5f7]">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#86868b]">Audit trail</p>
          </div>
          <div className="p-7 max-h-[70vh] overflow-y-auto">
            <div className="relative">
              <div className="absolute left-2 top-0 bottom-0 w-px bg-[rgba(0,0,0,0.06)]" />
              {[...activityLog].reverse().map((entry) => (
                <div key={entry.id} className="flex gap-4 pb-5 last:pb-0">
                  <div className="w-4 h-4 rounded-full shrink-0 mt-0.5 z-10 border"
                    style={{
                      background: entry.actor === 'System' ? '#eef7f3' : '#f5f5f7',
                      borderColor: entry.actor === 'System' ? '#d1ede4' : 'rgba(0,0,0,0.1)',
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      <span className="text-[11px] font-bold"
                        style={{ color: entry.actor === 'System' ? '#007a5a' : entry.actor === 'Financier' ? '#6e6e73' : '#86868b' }}>
                        {entry.actor}
                      </span>
                      <span className="text-[10px] font-mono text-[#adadb3]">{entry.timestamp}</span>
                    </div>
                    <p className="text-xs text-[#6e6e73] leading-relaxed">{entry.action}</p>
                  </div>
                </div>
              ))}
              {activityLog.length === 0 && <p className="text-xs text-[#adadb3] pl-8">No events recorded.</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
