import { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Input, Select } from '../ui/Input';
import { Disclaimer } from '../ui/Disclaimer';
import { calcBaseRate, calcMonthly, dealerEffectiveRate, calcRateGap, formatCurrency, formatRate } from '../../utils/mock';

function Slider({ label, value, onChange, min, max, step = 1, format }) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-between items-baseline">
        <span className="text-xs font-semibold uppercase tracking-widest text-[#5c5c72]">{label}</span>
        <span className="font-mono text-base font-bold text-[#f0f0f6]">{format(value)}</span>
      </div>
      <div className="relative">
        <div className="absolute top-1/2 -translate-y-1/2 h-px w-full rounded-full" style={{ background: 'rgba(255,255,255,0.07)' }} />
        <div
          className="absolute top-1/2 -translate-y-1/2 h-px rounded-full"
          style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #00e5a0, #00c88a)', boxShadow: '0 0 8px rgba(0,229,160,0.4)' }}
        />
        <input
          type="range" min={min} max={max} step={step} value={value}
          onChange={e => onChange(Number(e.target.value))}
          className="relative w-full"
          style={{ background: 'transparent' }}
        />
      </div>
      <div className="flex justify-between text-[11px] font-mono text-[#3a3a50]">
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
    const m = calcMonthly(quote.loanAmount, br, quote.term);
    const dr = dealerEffectiveRate(br);
    const dm = calcMonthly(quote.loanAmount, dr, quote.term);
    setBaseRate(br);
    setMonthly(m);
    setDealerMonthly(dm);
    setSavings(calcRateGap(quote.loanAmount, quote.term, br));
  }, [quote.loanAmount, quote.term, quote.income, quote.expenses]);

  const updateQ = data => dispatch({ type: 'UPDATE_QUOTE', data });
  const canContinue = !!quote.purpose;

  return (
    <div className="max-w-2xl mx-auto px-5 pb-20 pt-8">
      {/* Hero */}
      <div className="mb-10 animate-fade-up">
        <p className="text-[11px] font-bold uppercase tracking-widest text-[#00e5a0] mb-3">Car Finance, Direct</p>
        <h1
          className="text-5xl sm:text-6xl font-bold text-[#f0f0f6] leading-[1.05] tracking-tight mb-4"
          style={{ letterSpacing: '-0.03em' }}
        >
          Know your<br />
          <span style={{ color: '#00e5a0', textShadow: '0 0 40px rgba(0,229,160,0.35)' }}>base rate.</span>
        </h1>
        <p className="text-[#9898b0] text-base leading-relaxed max-w-sm">
          Direct to financier. No dealer markup. No broker commission. No surprises.
        </p>
      </div>

      {/* Purpose selector */}
      <div className="mb-6 animate-fade-up delay-100">
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#5c5c72] mb-3">Loan purpose</p>
        <div className="grid grid-cols-2 gap-3">
          {['personal', 'business'].map(p => (
            <button
              key={p}
              onClick={() => updateQ({ purpose: p })}
              className="p-4 rounded-xl text-left transition-all"
              style={{
                background: quote.purpose === p ? 'rgba(0,229,160,0.07)' : 'rgba(255,255,255,0.03)',
                border: quote.purpose === p ? '1px solid rgba(0,229,160,0.35)' : '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <p className="font-semibold text-[15px] capitalize mb-0.5"
                style={{ color: quote.purpose === p ? '#00e5a0' : '#f0f0f6' }}>
                {p}
              </p>
              <p className="text-xs text-[#5c5c72]">
                {p === 'personal' ? 'Everyday personal use' : 'Primarily income-producing'}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* ABN field */}
      {quote.purpose === 'business' && (
        <div className="mb-6 animate-fade-up rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <label className="flex items-center gap-3 cursor-pointer mb-3">
            <input type="checkbox" checked={quote.hasABN} onChange={e => updateQ({ hasABN: e.target.checked })} className="w-4 h-4 accent-[#00e5a0]" />
            <span className="text-sm font-medium text-[#f0f0f6]">Applying with my ABN</span>
          </label>
          {quote.hasABN && <Input label="ABN" value={quote.abn} onChange={v => updateQ({ abn: v })} placeholder="61 004 073 150" />}
        </div>
      )}

      {/* Loan sliders */}
      <div className="animate-fade-up delay-200 rounded-xl p-5 mb-4" style={{ background: '#0e0e18', border: '1px solid rgba(255,255,255,0.08)' }}>
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#5c5c72] mb-5">Loan details</p>
        <div className="flex flex-col gap-7">
          <Slider label="Loan amount" value={quote.loanAmount} onChange={v => updateQ({ loanAmount: v })} min={5000} max={150000} step={1000} format={v => formatCurrency(v)} />
          <Slider label="Loan term" value={quote.term} onChange={v => updateQ({ term: v })} min={12} max={84} step={12} format={v => `${v} mo`} />
          <Select
            label="Vehicle type"
            value={quote.vehicleType}
            onChange={v => updateQ({ vehicleType: v })}
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
      <div className="animate-fade-up delay-300 rounded-xl p-5 mb-6" style={{ background: '#0e0e18', border: '1px solid rgba(255,255,255,0.08)' }}>
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#5c5c72] mb-1">Rough income & expenses</p>
        <p className="text-xs text-[#3a3a50] mb-4">Indicative only — verified figures come later</p>
        <div className="grid grid-cols-2 gap-4">
          <Input label="Annual income" value={quote.income} onChange={v => updateQ({ income: Number(v) || 0 })} type="number" prefix="$" placeholder="95,000" />
          <Input label="Annual expenses" value={quote.expenses} onChange={v => updateQ({ expenses: Number(v) || 0 })} type="number" prefix="$" placeholder="28,000" />
        </div>
      </div>

      {/* Rate comparison */}
      <div className="animate-fade-up delay-400 mb-6">
        <div className="rounded-2xl overflow-hidden" style={{ background: '#0a0a12', border: '1px solid rgba(255,255,255,0.08)' }}>
          {/* Header */}
          <div className="px-5 pt-5 pb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#5c5c72]">Your indicative comparison</p>
          </div>

          {/* Two columns */}
          <div className="grid grid-cols-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            {/* Base rate */}
            <div className="px-5 py-5" style={{ borderRight: '1px solid rgba(255,255,255,0.06)' }}>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#00e5a0] mb-2">Your base rate</p>
              <p
                className="font-mono text-4xl font-bold leading-none mb-1"
                style={{ color: '#00e5a0', textShadow: '0 0 24px rgba(0,229,160,0.35)' }}
              >
                {baseRate.toFixed(2)}%
              </p>
              <p className="text-xs text-[#5c5c72] mb-4">p.a. — Baserate direct</p>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-[#5c5c72] mb-1">Monthly</p>
              <p className="font-mono text-xl font-bold text-[#f0f0f6]">{formatCurrency(monthly)}</p>
            </div>

            {/* Dealer rate */}
            <div className="px-5 py-5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#ff6b6b] mb-2">Typical dealer rate</p>
              <p className="font-mono text-4xl font-bold leading-none mb-1 text-[#ff6b6b]">
                {dealerEffectiveRate(baseRate).toFixed(2)}%
              </p>
              <p className="text-xs text-[#5c5c72] mb-4">p.a. — effective incl. markup</p>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-[#5c5c72] mb-1">Monthly</p>
              <p className="font-mono text-xl font-bold text-[#5c5c72]">{formatCurrency(dealerMonthly)}</p>
            </div>
          </div>

          {/* Savings row */}
          <div className="px-5 py-5 text-center">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#5c5c72] mb-2">Potential saving over loan life</p>
            <p
              className="font-mono text-5xl font-black tracking-tight"
              style={{ color: '#00e5a0', textShadow: '0 0 32px rgba(0,229,160,0.4)' }}
            >
              {formatCurrency(savings)}
            </p>
            <p className="text-xs text-[#3a3a50] mt-2">Based on {quote.term}-month term · indicative only</p>
          </div>
        </div>
      </div>

      <Disclaimer>
        Indicative only — not an offer of credit or a guarantee of approval. Comparison rate {formatRate(dealerEffectiveRate(baseRate))} is based on a {formatCurrency(quote.loanAmount)} loan over {quote.term} months. Different terms and amounts may result in different comparison rates. Fees and charges apply. ACL [number].
      </Disclaimer>

      <div className="mt-6">
        <Button
          onClick={() => {
            dispatch({ type: 'SET_STEP', step: 1 });
            dispatch({ type: 'ADD_LOG', actor: 'Applicant', message: `Indicative quote — ${formatCurrency(quote.loanAmount)} / ${quote.term} months / indicative base rate ${formatRate(baseRate)}` });
          }}
          disabled={!canContinue}
          size="lg"
          className="w-full"
        >
          Continue to full application →
        </Button>
        {!canContinue && <p className="text-xs text-center text-[#3a3a50] mt-2">Select personal or business use to continue</p>}
      </div>
    </div>
  );
}
