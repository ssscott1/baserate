import { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Button } from '../ui/Button';
import { Input, Select } from '../ui/Input';
import { Disclaimer } from '../ui/Disclaimer';
import { calcBaseRate, calcMonthly, dealerEffectiveRate, calcRateGap, formatCurrency, formatRate } from '../../utils/mock';

function Slider({ label, value, onChange, min, max, step = 1, format }) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-between items-baseline">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#86868b]">{label}</span>
        <span className="font-mono text-base font-bold text-[#1d1d1f] tabular-nums">{format(value)}</span>
      </div>
      <div className="relative py-2">
        <div className="absolute top-1/2 -translate-y-1/2 h-[2px] w-full rounded-full bg-[#e5e5e7]" />
        <div className="absolute top-1/2 -translate-y-1/2 h-[2px] rounded-full bg-[#1d1d1f]" style={{ width: `${pct}%` }} />
        <input type="range" min={min} max={max} step={step} value={value}
          onChange={e => onChange(Number(e.target.value))}
          className="relative w-full" style={{ background: 'transparent' }}
        />
      </div>
      <div className="flex justify-between text-[11px] font-mono text-[#adadb3] tabular-nums">
        <span>{format(min)}</span><span>{format(max)}</span>
      </div>
    </div>
  );
}

export function Step1Quote() {
  const { state, dispatch } = useApp();
  const { quote } = state;
  const [baseRate, setBaseRate] = useState(6.49);
  const [monthly, setMonthly] = useState(0);
  const [dealerMonthly, setDealerMonthly] = useState(0);
  const [savings, setSavings] = useState(0);

  useEffect(() => {
    const br = calcBaseRate(quote.loanAmount, quote.term, quote.income || 95000, quote.expenses || 28000);
    setBaseRate(br);
    setMonthly(calcMonthly(quote.loanAmount, br, quote.term));
    setDealerMonthly(calcMonthly(quote.loanAmount, dealerEffectiveRate(br), quote.term));
    setSavings(calcRateGap(quote.loanAmount, quote.term, br));
  }, [quote.loanAmount, quote.term, quote.income, quote.expenses]);

  const updateQ = data => dispatch({ type: 'UPDATE_QUOTE', data });
  const proceed = () => {
    dispatch({ type: 'SET_STEP', step: 1 });
    dispatch({ type: 'ADD_LOG', actor: 'Applicant', message: `Indicative quote — ${formatCurrency(quote.loanAmount)} / ${quote.term} months / indicative base rate ${formatRate(baseRate)}` });
  };

  return (
    <div className="max-w-6xl mx-auto px-8 pb-24 pt-14">

      {/* Hero */}
      <div className="mb-14 animate-fade-up max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#007a5a] mb-4">Car Finance, Direct</p>
        <h1 className="text-[56px] font-bold text-[#1d1d1f] leading-[1.04] mb-5" style={{ letterSpacing: '-0.03em' }}>
          Know your base rate.
        </h1>
        <p className="text-[19px] text-[#6e6e73] leading-relaxed max-w-xl">
          Direct to financier. No dealer markup, no broker commission, no hidden fees.
        </p>
      </div>

      <div className="grid lg:grid-cols-[1fr_420px] gap-10 items-start">

        {/* ---- Left: form ---- */}
        <div className="flex flex-col gap-8">

          {/* Purpose */}
          <div className="animate-fade-up delay-100">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#86868b] mb-4">Is this car for personal or business use?</p>
            <div className="grid grid-cols-2 gap-4">
              {['personal', 'business'].map(p => (
                <button key={p} onClick={() => updateQ({ purpose: p })}
                  className="p-6 rounded-2xl text-left transition-all border"
                  style={{
                    background: quote.purpose === p ? '#eef7f3' : 'white',
                    borderColor: quote.purpose === p ? '#d1ede4' : 'rgba(0,0,0,0.09)',
                  }}
                >
                  <p className="font-semibold text-base capitalize mb-1" style={{ color: quote.purpose === p ? '#007a5a' : '#1d1d1f' }}>{p}</p>
                  <p className="text-sm text-[#86868b]">{p === 'personal' ? 'Everyday personal use' : 'Primarily income-producing'}</p>
                </button>
              ))}
            </div>
          </div>

          {/* ABN */}
          {quote.purpose === 'business' && (
            <div className="animate-fade-up bg-white rounded-2xl p-7 shadow-sm">
              <label className="flex items-center gap-3 cursor-pointer mb-4">
                <input type="checkbox" checked={quote.hasABN} onChange={e => updateQ({ hasABN: e.target.checked })} className="w-4 h-4 accent-[#007a5a]" />
                <span className="text-[15px] font-medium text-[#1d1d1f]">Applying with my ABN</span>
              </label>
              {quote.hasABN && <Input label="ABN" value={quote.abn} onChange={v => updateQ({ abn: v })} placeholder="61 004 073 150" />}
            </div>
          )}

          {/* Loan details */}
          <div className="bg-white rounded-2xl p-8 shadow-sm animate-fade-up delay-200">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#86868b] mb-8">Loan details</p>
            <div className="flex flex-col gap-9">
              <Slider label="Loan amount" value={quote.loanAmount} onChange={v => updateQ({ loanAmount: v })} min={5000} max={150000} step={1000} format={formatCurrency} />
              <Slider label="Loan term" value={quote.term} onChange={v => updateQ({ term: v })} min={12} max={84} step={12} format={v => `${v} months`} />
              <Select label="Vehicle type" value={quote.vehicleType} onChange={v => updateQ({ vehicleType: v })}
                options={[
                  { value: 'passenger', label: 'Passenger car' },
                  { value: 'suv', label: 'SUV / 4WD' },
                  { value: 'ute', label: 'Ute / Commercial' },
                  { value: 'ev', label: 'Electric vehicle' },
                  { value: 'luxury', label: 'Luxury vehicle' },
                ]}
              />
            </div>
          </div>

          {/* Income */}
          <div className="bg-white rounded-2xl p-8 shadow-sm animate-fade-up delay-300">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#86868b] mb-1">Rough income & expenses</p>
            <p className="text-sm text-[#adadb3] mb-6">Indicative only — verified figures come later</p>
            <div className="grid grid-cols-2 gap-5">
              <Input label="Annual income" value={quote.income} onChange={v => updateQ({ income: Number(v) || 0 })} type="number" prefix="$" placeholder="95,000" />
              <Input label="Annual expenses" value={quote.expenses} onChange={v => updateQ({ expenses: Number(v) || 0 })} type="number" prefix="$" placeholder="28,000" />
            </div>
          </div>

          <Disclaimer>
            Indicative only — not an offer of credit or a guarantee of approval. Comparison rate {formatRate(dealerEffectiveRate(baseRate))} based on a {formatCurrency(quote.loanAmount)} loan over {quote.term} months. Different terms and amounts will result in different comparison rates. Fees and charges apply. ACL [number].
          </Disclaimer>
        </div>

        {/* ---- Right: live quote, sticky ---- */}
        <div className="lg:sticky lg:top-24 animate-fade-up delay-200">
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="px-7 pt-6 pb-5 border-b border-[rgba(0,0,0,0.06)]">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#86868b]">Your indicative quote</p>
            </div>

            <div className="px-7 py-6 border-b border-[rgba(0,0,0,0.06)]">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#007a5a] mb-2">Your base rate</p>
              <p className="font-mono text-[56px] font-bold text-[#007a5a] leading-none tabular-nums mb-1">
                {baseRate.toFixed(2)}<span className="text-3xl font-semibold">%</span>
              </p>
              <p className="text-xs text-[#86868b]">p.a. — Baserate direct</p>
            </div>

            <div className="grid grid-cols-2 divide-x divide-[rgba(0,0,0,0.06)] border-b border-[rgba(0,0,0,0.06)]">
              <div className="px-7 py-5">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[#86868b] mb-1.5">Your monthly</p>
                <p className="font-mono text-xl font-bold text-[#1d1d1f] tabular-nums">{formatCurrency(monthly)}</p>
              </div>
              <div className="px-7 py-5">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[#c0392b] mb-1.5">Dealer rate {dealerEffectiveRate(baseRate).toFixed(2)}%</p>
                <p className="font-mono text-xl font-bold text-[#adadb3] tabular-nums line-through decoration-[#c0392b]/40">{formatCurrency(dealerMonthly)}</p>
              </div>
            </div>

            <div className="px-7 py-6 bg-[#f5f5f7] border-b border-[rgba(0,0,0,0.06)]">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#86868b] mb-2">Potential saving over loan life</p>
              <p className="font-mono text-[44px] font-bold text-[#1d1d1f] tabular-nums leading-none" style={{ letterSpacing: '-0.02em' }}>{formatCurrency(savings)}</p>
              <p className="text-xs text-[#adadb3] mt-2">vs. typical dealer markup · {quote.term}-month term · indicative only</p>
            </div>

            <div className="p-7">
              <Button onClick={proceed} disabled={!quote.purpose} size="lg" className="w-full">
                Continue to full application →
              </Button>
              {!quote.purpose && <p className="text-sm text-center text-[#adadb3] mt-3">Select personal or business use to continue</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
