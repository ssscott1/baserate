import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Button } from '../ui/Button';
import { Input, Select } from '../ui/Input';
import { Toggle } from '../ui/Toggle';
import { LoadingState } from '../ui/Spinner';
import { Tick, StatusRow } from '../ui/Tick';
import { mockCall, formatCurrency } from '../../utils/mock';

const MOCK_BANK_DATA = {
  income: 9150, expenses: 3420, existingDebts: 780,
  categories: [
    { name: 'Salary / wages', amount: 9150, type: 'income' },
    { name: 'Rent / mortgage', amount: 1800, type: 'expense' },
    { name: 'Groceries', amount: 680, type: 'expense' },
    { name: 'Dining & entertainment', amount: 420, type: 'expense' },
    { name: 'Transport', amount: 310, type: 'expense' },
    { name: 'Utilities', amount: 210, type: 'expense' },
    { name: 'Car loan (existing)', amount: 780, type: 'debt' },
  ],
};

function SubStepBar({ steps, current }) {
  return (
    <div className="flex items-center gap-1.5 mb-7 overflow-x-auto pb-1">
      {steps.map((s, i) => (
        <div key={s} className="flex items-center gap-1.5 shrink-0">
          <div className="px-3 py-1 rounded-lg text-[11px] font-semibold transition-all" style={{
            background: i === current ? 'rgba(0,229,160,0.12)' : i < current ? 'rgba(255,255,255,0.06)' : 'transparent',
            color: i === current ? '#00e5a0' : i < current ? '#9898b0' : '#3a3a50',
            border: i === current ? '1px solid rgba(0,229,160,0.25)' : '1px solid transparent',
          }}>{s}</div>
          {i < steps.length - 1 && <span className="text-[#2a2a3a] text-xs">›</span>}
        </div>
      ))}
    </div>
  );
}

function STitle({ title, sub }) {
  return <div className="mb-5"><h2 className="text-2xl font-bold text-[#f0f0f6] tracking-tight mb-1">{title}</h2>{sub && <p className="text-sm text-[#9898b0]">{sub}</p>}</div>;
}

function BankConnect({ onNext, onManual }) {
  const { dispatch } = useApp();
  const [phase, setPhase] = useState('consent');
  const [selectedBank, setSelectedBank] = useState('');
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const banks = ['Commonwealth Bank', 'ANZ', 'Westpac', 'NAB', 'Macquarie', 'ING'];

  const doConnect = async () => {
    setPhase('retrieving');
    dispatch({ type: 'ADD_LOG', actor: 'System', message: `CDR consent granted — connecting to ${selectedBank}` });
    await mockCall(1500, 2500);
    dispatch({ type: 'UPDATE_FINANCIAL', data: { bankConnected: true, income: MOCK_BANK_DATA.income * 12, expenses: MOCK_BANK_DATA.expenses * 12, existingDebts: MOCK_BANK_DATA.existingDebts } });
    dispatch({ type: 'ADD_LOG', actor: 'System', message: 'Bank data retrieved and categorised via CDR' });
    setPhase('done');
  };

  if (phase === 'consent') return (
    <div className="flex flex-col gap-5">
      <STitle title="Connect your bank" sub="Government-regulated Consumer Data Right (CDR) — read-only, time-limited." />
      <div className="rounded-xl p-5" style={{ background: 'rgba(0,229,160,0.05)', border: '1px solid rgba(0,229,160,0.18)' }}>
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#00e5a0] mb-3">Your CDR consent</p>
        {['Read-only access to 90 days of transactions', 'Access expires in 24 hours — revocable any time', 'Used only for this credit assessment', 'Regulated under the Consumer Data Right Act 2019'].map(t => (
          <div key={t} className="flex items-start gap-2 mb-2">
            <span className="text-[#00e5a0] shrink-0 text-xs mt-0.5">✓</span>
            <p className="text-sm text-[#9898b0]">{t}</p>
          </div>
        ))}
        <div className="mt-4"><Select label="Select your bank" value={selectedBank} onChange={setSelectedBank} options={banks.map(b => ({ value: b, label: b }))} /></div>
      </div>
      <Button onClick={() => setPhase('login')} disabled={!selectedBank} size="lg" className="w-full">Connect securely →</Button>
      <button onClick={onManual} className="text-sm text-[#5c5c72] hover:text-[#9898b0] text-center transition-colors">Enter details manually instead</button>
    </div>
  );

  if (phase === 'login') return (
    <div className="flex flex-col gap-5 animate-fade-up">
      <STitle title={selectedBank} sub="Demo bank login — enter anything to proceed." />
      <div className="rounded-xl p-5" style={{ background: '#0e0e18', border: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="flex items-center gap-2 mb-4 p-2.5 rounded-lg" style={{ background: 'rgba(0,229,160,0.06)', border: '1px solid rgba(0,229,160,0.15)' }}>
          <span className="text-[#00e5a0] text-sm">🔒</span>
          <p className="text-xs text-[#5c5c72]">Secure connection via Open Banking CDR</p>
        </div>
        <div className="flex flex-col gap-4">
          <Input label="Customer ID" value={loginUser} onChange={setLoginUser} placeholder="Enter your customer ID" />
          <Input label="Password" value={loginPass} onChange={setLoginPass} type="password" placeholder="••••••••" />
        </div>
        <Button onClick={doConnect} disabled={!loginUser || !loginPass} size="lg" className="w-full mt-4">Log in & authorise →</Button>
      </div>
    </div>
  );

  if (phase === 'retrieving') return <LoadingState message="Retrieving your transactions…" submessage="Categorising 90 days of data via Open Banking CDR" />;

  return (
    <div className="flex flex-col gap-5 animate-fade-up">
      <div className="flex items-center gap-3 p-4 rounded-xl" style={{ background: 'rgba(0,229,160,0.07)', border: '1px solid rgba(0,229,160,0.25)' }}>
        <Tick size={24} /><div><p className="font-semibold text-[#f0f0f6] text-sm">Bank connected</p><p className="text-xs text-[#5c5c72]">{selectedBank} · 90 days retrieved</p></div>
      </div>
      <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="grid grid-cols-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          {[['Monthly income', formatCurrency(MOCK_BANK_DATA.income), '#00e5a0'], ['Monthly expenses', formatCurrency(MOCK_BANK_DATA.expenses), '#f0f0f6'], ['Existing debts', formatCurrency(MOCK_BANK_DATA.existingDebts), '#ff6b6b']].map(([k, v, c], i) => (
            <div key={k} className="p-4 text-center" style={{ borderRight: i < 2 ? '1px solid rgba(255,255,255,0.06)' : 'none', background: '#0a0a12' }}>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#5c5c72] mb-1">{k}</p>
              <p className="font-mono text-lg font-bold" style={{ color: c }}>{v}</p>
            </div>
          ))}
        </div>
        <div className="p-4" style={{ background: '#0e0e18' }}>
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#5c5c72] mb-3">Categorised transactions</p>
          {MOCK_BANK_DATA.categories.map(c => (
            <div key={c.name} className="flex justify-between py-1.5 text-sm" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <span className="text-[#9898b0]">{c.name}</span>
              <span className="font-mono font-medium" style={{ color: c.type === 'income' ? '#00e5a0' : c.type === 'debt' ? '#ff6b6b' : '#f0f0f6' }}>
                {c.type === 'income' ? '+' : '-'}{formatCurrency(c.amount)}/mo
              </span>
            </div>
          ))}
        </div>
      </div>
      <Button onClick={onNext} size="lg" className="w-full">Looks right — continue →</Button>
    </div>
  );
}

function ManualEntry({ onNext }) {
  const { dispatch } = useApp();
  const [income, setIncome] = useState('');
  const [expenses, setExpenses] = useState('');
  const [uploaded, setUploaded] = useState(false);
  return (
    <div className="flex flex-col gap-5 animate-fade-up">
      <div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full mb-3" style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)' }}>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#f59e0b]">Manually verified</span>
        </div>
        <STitle title="Manual income entry" sub="Application will be badged as manually verified — processing may take longer." />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input label="Annual income" value={income} onChange={setIncome} prefix="$" type="number" placeholder="95,000" />
        <Input label="Annual expenses" value={expenses} onChange={setExpenses} prefix="$" type="number" placeholder="28,000" />
      </div>
      <div className="rounded-xl p-6 flex flex-col items-center gap-3 text-center" style={{ background: '#0a0a12', border: '2px dashed rgba(255,255,255,0.08)' }}>
        <span className="text-3xl">📄</span>
        <p className="text-sm font-medium text-[#f0f0f6]">Upload payslips or ATO Notice of Assessment</p>
        <button onClick={() => setUploaded(true)} className="px-4 py-2 rounded-xl text-sm font-medium transition-all" style={{ background: uploaded ? 'rgba(0,229,160,0.12)' : 'rgba(255,255,255,0.06)', color: uploaded ? '#00e5a0' : '#9898b0', border: uploaded ? '1px solid rgba(0,229,160,0.3)' : '1px solid rgba(255,255,255,0.1)' }}>
          {uploaded ? '✓ payslip_march.pdf' : 'Upload document (demo)'}
        </button>
      </div>
      <Button onClick={() => { dispatch({ type: 'UPDATE_FINANCIAL', data: { manualEntry: true, income: Number(income) || 95000, expenses: Number(expenses) || 28000 } }); dispatch({ type: 'ADD_LOG', actor: 'Applicant', message: 'Income entered manually' }); onNext(); }} disabled={!income || !expenses} size="lg" className="w-full">Continue →</Button>
    </div>
  );
}

function AssetsLiabilities({ onNext }) {
  const { state, dispatch } = useApp();
  const { financial } = state;
  const update = data => dispatch({ type: 'UPDATE_FINANCIAL', data });
  return (
    <div className="flex flex-col gap-5">
      <STitle title="Assets & liabilities" sub="Brief financial snapshot for serviceability assessment." />
      <Select label="Housing situation" value={financial.housingStatus} onChange={v => update({ housingStatus: v })} options={[{ value: 'mortgage', label: 'Paying a mortgage' }, { value: 'own', label: 'Own outright' }, { value: 'rent', label: 'Renting' }, { value: 'boarding', label: 'Boarding / living with family' }]} />
      <Toggle checked={financial.hasInvestmentProperty} onChange={v => update({ hasInvestmentProperty: v })} label="I have an investment property" />
      <div className="grid grid-cols-2 gap-4">
        <Input label="Savings / assets (approx.)" prefix="$" type="number" placeholder="25,000" />
        <Input label="Other debts (monthly)" prefix="$" type="number" placeholder="500" />
      </div>
      <Button onClick={() => { dispatch({ type: 'ADD_LOG', actor: 'Applicant', message: 'Asset and liability statement submitted' }); onNext(); }} size="lg" className="w-full">Continue →</Button>
    </div>
  );
}

function CreditCheck({ onNext }) {
  const { dispatch } = useApp();
  const [consented, setConsented] = useState(false);
  const [checking, setChecking] = useState(false);
  const [done, setDone] = useState(false);
  const runCheck = async () => {
    setChecking(true);
    dispatch({ type: 'UPDATE_FINANCIAL', data: { creditCheckConsented: true } });
    dispatch({ type: 'ADD_LOG', actor: 'System', message: 'Hard credit enquiry submitted to Equifax' });
    await mockCall(1800, 2500);
    setChecking(false); setDone(true);
    dispatch({ type: 'ADD_LOG', actor: 'System', message: 'Credit report retrieved — Equifax score 742, no adverse listings' });
  };
  if (checking) return <LoadingState message="Running credit check…" submessage="Submitting hard enquiry to Equifax Credit Bureau" />;
  if (done) return (
    <div className="flex flex-col gap-5 animate-fade-up">
      <div className="p-5 rounded-xl flex items-center gap-3" style={{ background: 'rgba(0,229,160,0.07)', border: '1px solid rgba(0,229,160,0.25)' }}>
        <Tick size={24} /><div><p className="font-semibold text-[#f0f0f6]">Credit check complete</p><p className="text-xs text-[#5c5c72]">Equifax score: 742 · No adverse listings</p></div>
      </div>
      <Button onClick={onNext} size="lg" className="w-full">Continue →</Button>
    </div>
  );
  return (
    <div className="flex flex-col gap-5">
      <STitle title="Credit check consent" sub="This is a hard enquiry — it will appear on your credit file." />
      <div className="rounded-xl p-4" style={{ background: 'rgba(255,107,107,0.06)', border: '1px solid rgba(255,107,107,0.2)' }}>
        <p className="text-sm font-semibold text-[#ff6b6b] mb-1">Hard enquiry — not a soft check</p>
        <p className="text-sm text-[#9898b0]">Unlike the soft pre-screen we ran earlier, this will be visible to other lenders on your credit file.</p>
      </div>
      <div className="rounded-xl p-5" style={{ background: '#0e0e18', border: '1px solid rgba(255,255,255,0.08)' }}>
        <Toggle checked={consented} onChange={setConsented} label="I consent to a hard credit enquiry with Equifax on behalf of Baserate Financial Services Pty Ltd" required />
      </div>
      <Button onClick={runCheck} disabled={!consented} size="lg" className="w-full">Run credit check →</Button>
    </div>
  );
}

function AMLProcessing() {
  const { dispatch } = useApp();
  const [statuses, setStatuses] = useState([
    { id: 'kyc', label: 'AML / KYC identity cross-check', status: 'waiting' },
    { id: 'sanction', label: 'Sanctions list screening (AUSTRAC)', status: 'waiting' },
    { id: 'fraud', label: 'Fraud score assessment', status: 'waiting' },
    { id: 'pep', label: 'PEP / adverse media check', status: 'waiting' },
  ]);
  const [complete, setComplete] = useState(false);
  const started = statuses[0].status !== 'waiting';

  const runAll = async () => {
    for (let i = 0; i < statuses.length; i++) {
      setStatuses(prev => prev.map((s, idx) => idx === i ? { ...s, status: 'pending' } : s));
      await mockCall(700, 1200);
      setStatuses(prev => prev.map((s, idx) => idx === i ? { ...s, status: 'success' } : s));
    }
    dispatch({ type: 'UPDATE_FINANCIAL', data: { amlPassed: true } });
    dispatch({ type: 'ADD_LOG', actor: 'System', message: 'AML/KYC passed — no adverse findings' });
    setComplete(true);
  };

  return (
    <div className="flex flex-col gap-5">
      <STitle title="Checking your details" sub="Required AML/KYC checks before assessment." />
      <div className="rounded-xl p-5" style={{ background: '#0e0e18', border: '1px solid rgba(255,255,255,0.08)' }}>
        {statuses.map(s => <StatusRow key={s.id} status={s.status} label={s.label} />)}
      </div>
      {!started && <Button onClick={runAll} size="lg" className="w-full">Run checks →</Button>}
      {complete && (
        <div className="animate-fade-up flex flex-col gap-4">
          <div className="p-4 rounded-xl text-center" style={{ background: 'rgba(0,229,160,0.07)', border: '1px solid rgba(0,229,160,0.25)' }}>
            <p className="font-semibold text-[#00e5a0]">All checks passed ✓</p>
          </div>
          <Button onClick={() => dispatch({ type: 'SET_STEP', step: 3 })} size="lg" className="w-full">Continue to approval →</Button>
        </div>
      )}
    </div>
  );
}

export function Step3Financial() {
  const [subStep, setSubStep] = useState(0);
  const [mode, setMode] = useState('bank');
  const next = () => setSubStep(s => s + 1);
  const bankOrManual = mode === 'bank' ? <BankConnect onNext={next} onManual={() => setMode('manual')} /> : <ManualEntry onNext={next} />;
  const SUBSTEPS = [
    { label: 'Bank', component: bankOrManual },
    { label: 'Assets', component: <AssetsLiabilities onNext={next} /> },
    { label: 'Credit', component: <CreditCheck onNext={next} /> },
    { label: 'AML / KYC', component: <AMLProcessing /> },
  ];
  return (
    <div className="max-w-2xl mx-auto px-5 pb-20 pt-6">
      <SubStepBar steps={SUBSTEPS.map(s => s.label)} current={subStep} />
      <div className="animate-fade-up" key={subStep}>{SUBSTEPS[subStep].component}</div>
    </div>
  );
}
