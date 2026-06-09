import { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Input, Select } from '../ui/Input';
import { Disclaimer } from '../ui/Disclaimer';
import { calcBaseRate, calcMonthly, calcTotalInterest, dealerEffectiveRate, calcRateGap, formatCurrency, formatRate } from '../../utils/mock';

function Slider({ label, value, onChange, min, max, step = 1, format }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium text-[#0d1b2a]">{label}</label>
        <span className="font-mono text-sm font-semibold text-[#0d1b2a]">{format(value)}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={e => onChange(Number(e.target.value))} />
      <div className="flex justify-between text-xs text-[#b0c4d8] font-mono">
        <span>{format(min)}</span>
        <span>{format(max)}</span>
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
    const gap = calcRateGap(quote.loanAmount, quote.term, br);
    setBaseRate(br);
    setMonthly(m);
    setDealerMonthly(dm);
    setSavings(gap);
  }, [quote.loanAmount, quote.term, quote.income, quote.expenses]);

  const updateQ = data => dispatch({ type: 'UPDATE_QUOTE', data });
  const canContinue = quote.purpose;

  return (
    <div className="max-w-2xl mx-auto px-4 pb-16 pt-6">
      {/* Hero */}
      <div className="mb-8 animate-fade-up">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#00b894] mb-2">Car Finance, Direct</p>
        <h1 className="font-serif text-4xl sm:text-5xl font-semibold text-[#0d1b2a] leading-tight mb-3">
          Know your base rate.<br />Then go buy the car.
        </h1>
        <p className="text-[#5a6a7a] text-base leading-relaxed">
          We connect you directly to financiers — no dealer markup, no broker commission, no surprises.
        </p>
      </div>

      {/* Purpose */}
      <div className="mb-6 animate-fade-up delay-100">
        <p className="text-sm font-semibold text-[#0d1b2a] mb-3">Is this car mainly for personal or business use?</p>
        <div className="grid grid-cols-2 gap-3">
          {['personal', 'business'].map(p => (
            <button
              key={p}
              onClick={() => updateQ({ purpose: p })}
              className={`p-4 rounded-xl border-2 text-left transition-all cursor-pointer
                ${quote.purpose === p
                  ? 'border-[#00b894] bg-[#00b894]/5'
                  : 'border-[#ede8e1] bg-white hover:border-[#b0c4d8]'}
              `}
            >
              <p className="font-semibold text-sm capitalize text-[#0d1b2a]">{p}</p>
              <p className="text-xs text-[#5a6a7a] mt-0.5">
                {p === 'personal' ? 'For everyday personal use' : 'Primarily for income-producing activities'}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* ABN if business */}
      {quote.purpose === 'business' && (
        <Card className="p-4 mb-6 animate-fade-up">
          <div className="flex items-center gap-3 mb-3">
            <input
              type="checkbox"
              id="hasABN"
              checked={quote.hasABN}
              onChange={e => updateQ({ hasABN: e.target.checked })}
              className="w-4 h-4 accent-[#00b894] cursor-pointer"
            />
            <label htmlFor="hasABN" className="text-sm font-medium text-[#0d1b2a] cursor-pointer">I'm applying with my ABN</label>
          </div>
          {quote.hasABN && (
            <Input label="ABN" value={quote.abn} onChange={v => updateQ({ abn: v })} placeholder="61 004 073 150" />
          )}
        </Card>
      )}

      {/* Loan sliders */}
      <Card className="p-5 mb-5 animate-fade-up delay-200">
        <h2 className="font-semibold text-[#0d1b2a] mb-5">Loan details</h2>
        <div className="flex flex-col gap-6">
          <Slider
            label="Loan amount"
            value={quote.loanAmount}
            onChange={v => updateQ({ loanAmount: v })}
            min={5000}
            max={150000}
            step={1000}
            format={v => formatCurrency(v)}
          />
          <Slider
            label="Loan term"
            value={quote.term}
            onChange={v => updateQ({ term: v })}
            min={12}
            max={84}
            step={12}
            format={v => `${v} months`}
          />
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
      </Card>

      {/* Income */}
      <Card className="p-5 mb-6 animate-fade-up delay-300">
        <h2 className="font-semibold text-[#0d1b2a] mb-5">Rough income & expenses</h2>
        <p className="text-xs text-[#5a6a7a] mb-4">Used only for this indicative quote — you'll provide verified figures in the next step.</p>
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Annual income"
            value={quote.income}
            onChange={v => updateQ({ income: Number(v) || 0 })}
            type="number"
            prefix="$"
            placeholder="95,000"
          />
          <Input
            label="Annual expenses"
            value={quote.expenses}
            onChange={v => updateQ({ expenses: Number(v) || 0 })}
            type="number"
            prefix="$"
            placeholder="28,000"
          />
        </div>
      </Card>

      {/* Rate comparison hero */}
      <div className="mb-6 animate-fade-up delay-400">
        <Card variant="navy" className="p-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#5a6a7a] mb-4">Your indicative comparison</p>
          <div className="grid grid-cols-2 gap-4 mb-5">
            {/* Base rate */}
            <div className="bg-white/5 rounded-xl p-4">
              <p className="text-xs text-[#00b894] font-semibold mb-1">Your base rate</p>
              <p className="font-mono text-3xl font-semibold text-[#00b894]">{formatRate(baseRate)}</p>
              <p className="text-xs text-white/50 mt-1">Baserate direct</p>
              <div className="mt-3 border-t border-white/10 pt-3">
                <p className="text-xs text-white/60">Monthly repayment</p>
                <p className="font-mono text-xl font-semibold text-white">{formatCurrency(monthly)}</p>
              </div>
            </div>
            {/* Dealer rate */}
            <div className="bg-white/5 rounded-xl p-4">
              <p className="text-xs text-[#e17055] font-semibold mb-1">Typical dealer rate</p>
              <p className="font-mono text-3xl font-semibold text-[#e17055]">{formatRate(dealerEffectiveRate(baseRate))}</p>
              <p className="text-xs text-white/50 mt-1">Effective rate incl. markup</p>
              <div className="mt-3 border-t border-white/10 pt-3">
                <p className="text-xs text-white/60">Monthly repayment</p>
                <p className="font-mono text-xl font-semibold text-white/60">{formatCurrency(dealerMonthly)}</p>
              </div>
            </div>
          </div>

          {/* Savings banner */}
          <div className="bg-[#00b894]/20 border border-[#00b894]/30 rounded-xl p-4 text-center">
            <p className="text-xs text-[#00b894] font-semibold mb-1">Potential saving over loan life</p>
            <p className="font-mono text-4xl font-bold text-[#00b894]">{formatCurrency(savings)}</p>
            <p className="text-xs text-white/50 mt-1">
              Based on {quote.term}-month term • indicative only
            </p>
          </div>
        </Card>
      </div>

      <Disclaimer>
        Indicative only — not an offer of credit or a guarantee of approval. Comparison rate {formatRate(dealerEffectiveRate(baseRate))} is based on a {formatCurrency(quote.loanAmount)} loan over {quote.term} months. Different terms and amounts may result in different comparison rates. Fees and charges apply. ACL [number].
      </Disclaimer>

      <div className="mt-6">
        <Button
          onClick={() => {
            dispatch({ type: 'SET_STEP', step: 1 });
            dispatch({ type: 'ADD_LOG', actor: 'Applicant', message: `Indicative quote completed — ${formatCurrency(quote.loanAmount)} over ${quote.term} months at indicative base rate ${formatRate(baseRate)}` });
          }}
          disabled={!canContinue}
          size="lg"
          className="w-full"
        >
          Continue to full application →
        </Button>
        {!canContinue && (
          <p className="text-xs text-center text-[#5a6a7a] mt-2">Select personal or business use above to continue</p>
        )}
      </div>
    </div>
  );
}
