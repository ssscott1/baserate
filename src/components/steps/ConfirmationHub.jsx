import { useApp } from '../../context/AppContext';
import { Button } from '../ui/Button';
import { formatCurrency, formatRate, calcMonthly } from '../../utils/mock';

export function ConfirmationHub() {
  const { state, dispatch } = useApp();
  const { quote, approval, docs, activityLog } = state;
  const monthly = calcMonthly(quote.loanAmount, approval.approvedRate || 6.49, quote.term);

  return (
    <div style={{ background: '#08080f', minHeight: '100vh' }}>
      <div className="max-w-2xl mx-auto px-5 pb-20 pt-8">

        {/* Brand mark */}
        <div className="flex items-center gap-2.5 mb-10">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #00e5a0 0%, #00c88a 100%)', boxShadow: '0 0 14px rgba(0,229,160,0.35)' }}>
            <span className="text-[#08080f] font-black text-xs">B</span>
          </div>
          <span className="font-semibold text-[#f0f0f6] text-sm tracking-tight">Baserate</span>
        </div>

        {/* Hero */}
        <div className="mb-10 animate-fade-up">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-5"
            style={{ background: 'rgba(0,229,160,0.08)', border: '1px solid rgba(0,229,160,0.2)' }}
          >
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#00e5a0', boxShadow: '0 0 6px rgba(0,229,160,0.8)' }} />
            <span className="text-xs font-semibold text-[#00e5a0]">Loan active</span>
          </div>
          <h1
            className="text-5xl sm:text-6xl font-black leading-none tracking-tight mb-3"
            style={{ letterSpacing: '-0.04em', color: '#f0f0f6' }}
          >
            You're<br />
            <span style={{ color: '#00e5a0', textShadow: '0 0 40px rgba(0,229,160,0.3)' }}>settled.</span>
          </h1>
          <p className="text-[#9898b0]">Loan is active. The dealer has been paid directly.</p>
        </div>

        {/* Loan terms */}
        <div className="rounded-2xl overflow-hidden mb-5 animate-fade-up delay-100" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="px-5 pt-5 pb-4" style={{ background: '#0a0a12', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#5c5c72]">Your loan terms</p>
          </div>
          <div className="grid grid-cols-2" style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="px-5 py-5" style={{ borderRight: '1px solid rgba(255,255,255,0.06)' }}>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#5c5c72] mb-2">Rate</p>
              <p className="font-mono text-4xl font-black" style={{ color: '#00e5a0', textShadow: '0 0 24px rgba(0,229,160,0.3)' }}>
                {formatRate(approval.approvedRate || 6.49)}
              </p>
            </div>
            <div className="px-5 py-5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#5c5c72] mb-2">Monthly repayment</p>
              <p className="font-mono text-4xl font-black text-[#f0f0f6]">{formatCurrency(monthly)}</p>
            </div>
          </div>
          <div className="grid grid-cols-3 px-5 py-4" style={{ background: '#0e0e18' }}>
            {[['Amount', formatCurrency(quote.loanAmount)], ['Term', `${quote.term} months`], ['Lender', 'Plenti Auto']].map(([k, v]) => (
              <div key={k}>
                <p className="text-[10px] text-[#5c5c72] uppercase tracking-wider">{k}</p>
                <p className="font-mono font-semibold text-[#f0f0f6] text-sm">{v}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Repayment schedule */}
        <div className="rounded-xl overflow-hidden mb-5 animate-fade-up delay-200" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="px-5 py-3" style={{ background: '#0a0a12', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#5c5c72]">Repayment schedule — first 6 months</p>
          </div>
          <div style={{ background: '#0e0e18' }}>
            <div className="grid grid-cols-4 px-5 py-2.5" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#3a3a50]">Month</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#3a3a50] text-center">Payment</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#ff6b6b]/60 text-center">Interest</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#00e5a0]/60 text-right">Principal</span>
            </div>
            {Array.from({ length: 6 }, (_, i) => {
              const r = (approval.approvedRate || 6.49) / 100 / 12;
              let balance = quote.loanAmount;
              for (let m = 0; m < i; m++) { const int = balance * r; balance = balance - (monthly - int); }
              const interest = Math.round(balance * r);
              const principal = monthly - interest;
              return (
                <div key={i} className="grid grid-cols-4 px-5 py-2.5 text-xs" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <span className="font-mono text-[#5c5c72]">{i + 1}</span>
                  <span className="font-mono font-medium text-[#f0f0f6] text-center">{formatCurrency(monthly)}</span>
                  <span className="font-mono text-[#ff6b6b]/80 text-center">-{formatCurrency(interest)}</span>
                  <span className="font-mono text-[#00e5a0]/80 text-right">-{formatCurrency(principal)}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Audit trail */}
        <div className="rounded-xl overflow-hidden mb-5 animate-fade-up delay-300" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="px-5 py-3" style={{ background: '#0a0a12', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#5c5c72]">Audit trail</p>
          </div>
          <div className="p-5" style={{ background: '#0e0e18' }}>
            <div className="relative">
              <div className="absolute left-2 top-0 bottom-0 w-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
              {[...activityLog].reverse().map((entry) => (
                <div key={entry.id} className="flex gap-4 pb-4 last:pb-0">
                  <div
                    className="w-4 h-4 rounded-full shrink-0 mt-0.5 z-10 border"
                    style={{
                      background: entry.actor === 'System' ? 'rgba(0,229,160,0.15)' : entry.actor === 'Financier' ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.05)',
                      borderColor: entry.actor === 'System' ? 'rgba(0,229,160,0.4)' : 'rgba(255,255,255,0.12)',
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      <span className="text-[11px] font-bold" style={{ color: entry.actor === 'System' ? '#00e5a0' : entry.actor === 'Financier' ? '#9898b0' : '#5c5c72' }}>
                        {entry.actor}
                      </span>
                      <span className="text-[10px] font-mono text-[#2a2a3a]">{entry.timestamp}</span>
                    </div>
                    <p className="text-xs text-[#9898b0] leading-relaxed">{entry.action}</p>
                  </div>
                </div>
              ))}
              {activityLog.length === 0 && <p className="text-xs text-[#3a3a50] pl-8">No events recorded.</p>}
            </div>
          </div>
        </div>

        {/* What happens next */}
        <div className="rounded-xl overflow-hidden mb-5 animate-fade-up delay-400" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="px-5 py-3" style={{ background: '#0a0a12', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#5c5c72]">What happens next</p>
          </div>
          <div className="p-5 flex flex-col gap-4" style={{ background: '#0e0e18' }}>
            {[
              ['01', "Your first repayment will be debited on the date shown in your contract. Check your email for the full loan schedule."],
              ['02', "The dealer has been notified of payment. You can collect your vehicle — bring your signed handover documents."],
              ['03', "Plenti Auto will register a security interest on the PPSR within 5 business days of settlement."],
            ].map(([n, t]) => (
              <div key={n} className="flex items-start gap-4">
                <span className="font-mono text-xs font-bold shrink-0 mt-0.5" style={{ color: '#00e5a0' }}>{n}</span>
                <p className="text-sm text-[#9898b0] leading-relaxed">{t}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Hardship & AFCA */}
        <div className="rounded-xl overflow-hidden mb-8 animate-fade-up delay-500" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="px-5 py-3" style={{ background: '#0a0a12', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#5c5c72]">Important contacts</p>
          </div>
          <div className="p-5 flex flex-col gap-4" style={{ background: '#0e0e18' }}>
            <div>
              <p className="text-xs font-bold text-[#f0f0f6] mb-1">Financial hardship</p>
              <p className="text-xs text-[#9898b0] leading-relaxed">
                If you're struggling to meet repayments, contact Plenti immediately at{' '}
                <span className="text-[#5c5c72]">hardship@plenti.com.au</span> or{' '}
                <span className="text-[#5c5c72]">1300 660 000</span>. Hardship programs are available.
              </p>
            </div>
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1rem' }}>
              <p className="text-xs font-bold text-[#f0f0f6] mb-1">Complaints & AFCA</p>
              <p className="text-xs text-[#9898b0] leading-relaxed">
                Baserate: <span className="text-[#5c5c72]">complaints@baserate.com.au</span><br />
                Plenti: <span className="text-[#5c5c72]">complaints@plenti.com.au</span><br />
                <span className="text-[#5c5c72] font-semibold">AFCA:</span>{' '}
                <span className="text-[#5c5c72]">afca.org.au · 1800 931 678</span> — free to use, no legal representation needed.
              </p>
            </div>
          </div>
        </div>

        <Button onClick={() => dispatch({ type: 'RESET' })} variant="secondary" size="lg" className="w-full animate-fade-up delay-600">
          ↺ Start a new demo
        </Button>
      </div>
    </div>
  );
}
