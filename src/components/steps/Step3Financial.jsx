import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Button } from '../ui/Button';
import { Input, Select } from '../ui/Input';
import { Toggle } from '../ui/Toggle';
import { LoadingState } from '../ui/Spinner';
import { Tick, StatusRow } from '../ui/Tick';
import { mockCall, formatCurrency } from '../../utils/mock';
import { WizardLayout } from '../WizardLayout';

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

function STitle({ title, sub }) {
  return (
    <div className="mb-7">
      <h2 className="text-[28px] font-bold text-[#1d1d1f] tracking-tight mb-2" style={{ letterSpacing: '-0.02em' }}>{title}</h2>
      {sub && <p className="text-[15px] text-[#6e6e73] leading-relaxed">{sub}</p>}
    </div>
  );
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
    <div className="flex flex-col gap-6">
      <STitle title="Connect your bank" sub="Government-regulated Consumer Data Right (CDR) — read-only, time-limited." />
      <div className="bg-[#eef7f3] border border-[#d1ede4] rounded-2xl p-6">
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#007a5a] mb-4">Your CDR consent</p>
        {['Read-only access to 90 days of transactions', 'Access expires in 24 hours — revocable any time', 'Used only for this credit assessment', 'Regulated under the Consumer Data Right Act 2019'].map(t => (
          <div key={t} className="flex items-start gap-2.5 mb-2.5">
            <span className="text-[#007a5a] shrink-0 text-sm mt-0.5">✓</span>
            <p className="text-[15px] text-[#6e6e73]">{t}</p>
          </div>
        ))}
        <div className="mt-5">
          <Select label="Select your bank" value={selectedBank} onChange={setSelectedBank} options={banks.map(b => ({ value: b, label: b }))} />
        </div>
      </div>
      <Button onClick={() => setPhase('login')} disabled={!selectedBank} size="lg" className="w-full">Connect securely →</Button>
      <button onClick={onManual} className="text-sm text-[#86868b] hover:text-[#6e6e73] text-center transition-colors">Enter details manually instead</button>
    </div>
  );

  if (phase === 'login') return (
    <div className="flex flex-col gap-6 animate-fade-up">
      <STitle title={selectedBank} sub="Demo bank login — enter anything to proceed." />
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center gap-2 mb-5 p-3 rounded-xl bg-[#eef7f3] border border-[#d1ede4]">
          <span className="text-[#007a5a] text-sm">🔒</span>
          <p className="text-sm text-[#6e6e73]">Secure connection via Open Banking CDR</p>
        </div>
        <div className="flex flex-col gap-4">
          <Input label="Customer ID" value={loginUser} onChange={setLoginUser} placeholder="Enter your customer ID" />
          <Input label="Password" value={loginPass} onChange={setLoginPass} type="password" placeholder="••••••••" />
        </div>
        <Button onClick={doConnect} disabled={!loginUser || !loginPass} size="lg" className="w-full mt-5">Log in & authorise →</Button>
      </div>
    </div>
  );

  if (phase === 'retrieving') return <LoadingState message="Retrieving your transactions…" submessage="Categorising 90 days of data via Open Banking CDR" />;

  return (
    <div className="flex flex-col gap-6 animate-fade-up">
      <div className="flex items-center gap-3 p-5 bg-[#eef7f3] border border-[#d1ede4] rounded-2xl">
        <Tick size={24} />
        <div><p className="font-semibold text-[#1d1d1f]">Bank connected</p><p className="text-sm text-[#86868b]">{selectedBank} · 90 days retrieved</p></div>
      </div>
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="grid grid-cols-3 divide-x divide-[rgba(0,0,0,0.06)] border-b border-[rgba(0,0,0,0.06)]">
          {[['Monthly income', formatCurrency(MOCK_BANK_DATA.income), '#007a5a'], ['Monthly expenses', formatCurrency(MOCK_BANK_DATA.expenses), '#1d1d1f'], ['Existing debts', formatCurrency(MOCK_BANK_DATA.existingDebts), '#c0392b']].map(([k, v, c]) => (
            <div key={k} className="p-4 text-center">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#86868b] mb-1">{k}</p>
              <p className="font-mono text-lg font-bold" style={{ color: c }}>{v}</p>
            </div>
          ))}
        </div>
        <div className="p-5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#86868b] mb-4">Categorised transactions</p>
          {MOCK_BANK_DATA.categories.map((c, i, arr) => (
            <div key={c.name} className={`flex justify-between py-3 text-sm ${i < arr.length - 1 ? 'border-b border-[rgba(0,0,0,0.06)]' : ''}`}>
              <span className="text-[#6e6e73]">{c.name}</span>
              <span className="font-mono font-medium" style={{ color: c.type === 'income' ? '#007a5a' : c.type === 'debt' ? '#c0392b' : '#1d1d1f' }}>
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
    <div className="flex flex-col gap-6 animate-fade-up">
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#fef3e2] border border-[#f59e0b]/30 self-start">
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#b45309]">Manually verified</span>
      </div>
      <STitle title="Manual income entry" sub="Application will be badged as manually verified — processing may take longer." />
      <div className="grid grid-cols-2 gap-4">
        <Input label="Annual income" value={income} onChange={setIncome} prefix="$" type="number" placeholder="95,000" />
        <Input label="Annual expenses" value={expenses} onChange={setExpenses} prefix="$" type="number" placeholder="28,000" />
      </div>
      <div className="bg-white rounded-2xl shadow-sm p-8 flex flex-col items-center gap-4 text-center border-2 border-dashed border-[rgba(0,0,0,0.08)]">
        <span className="text-4xl">📄</span>
        <p className="text-[15px] font-medium text-[#1d1d1f]">Upload payslips or ATO Notice of Assessment</p>
        <button onClick={() => setUploaded(true)} className="px-4 py-2 rounded-xl text-sm font-medium transition-all border"
          style={{ background: uploaded ? '#eef7f3' : '#f5f5f7', color: uploaded ? '#007a5a' : '#6e6e73', borderColor: uploaded ? '#d1ede4' : 'rgba(0,0,0,0.08)' }}>
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
    <div className="flex flex-col gap-6">
      <STitle title="Assets & liabilities" sub="Brief financial snapshot for serviceability assessment." />
      <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col gap-5">
        <Select label="Housing situation" value={financial.housingStatus} onChange={v => update({ housingStatus: v })} options={[{ value: 'mortgage', label: 'Paying a mortgage' }, { value: 'own', label: 'Own outright' }, { value: 'rent', label: 'Renting' }, { value: 'boarding', label: 'Boarding / living with family' }]} />
        <div className="border-t border-[rgba(0,0,0,0.06)] pt-5">
          <Toggle checked={financial.hasInvestmentProperty} onChange={v => update({ hasInvestmentProperty: v })} label="I have an investment property" />
        </div>
        <div className="border-t border-[rgba(0,0,0,0.06)] pt-5 grid grid-cols-2 gap-4">
          <Input label="Savings / assets (approx.)" prefix="$" type="number" placeholder="25,000" />
          <Input label="Other debts (monthly)" prefix="$" type="number" placeholder="500" />
        </div>
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
    <div className="flex flex-col gap-6 animate-fade-up">
      <div className="p-5 bg-[#eef7f3] border border-[#d1ede4] rounded-2xl flex items-center gap-3">
        <Tick size={24} />
        <div><p className="font-semibold text-[#1d1d1f]">Credit check complete</p><p className="text-sm text-[#86868b]">Equifax score: 742 · No adverse listings</p></div>
      </div>
      <Button onClick={onNext} size="lg" className="w-full">Continue →</Button>
    </div>
  );
  return (
    <div className="flex flex-col gap-6">
      <STitle title="Credit check consent" sub="This is a hard enquiry — it will appear on your credit file." />
      <div className="bg-[#fdf0ef] border border-[#fad5d2] rounded-2xl p-5">
        <p className="text-sm font-semibold text-[#c0392b] mb-1">Hard enquiry — not a soft check</p>
        <p className="text-sm text-[#6e6e73]">Unlike the soft pre-screen we ran earlier, this will be visible to other lenders on your credit file.</p>
      </div>
      <div className="bg-white rounded-2xl shadow-sm p-6">
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
    <div className="flex flex-col gap-6">
      <STitle title="Checking your details" sub="Required AML/KYC checks before assessment." />
      <div className="bg-white rounded-2xl shadow-sm p-6">
        {statuses.map(s => <StatusRow key={s.id} status={s.status} label={s.label} />)}
      </div>
      {!started && <Button onClick={runAll} size="lg" className="w-full">Run checks →</Button>}
      {complete && (
        <div className="animate-fade-up flex flex-col gap-4">
          <div className="p-4 bg-[#eef7f3] border border-[#d1ede4] rounded-2xl text-center">
            <p className="font-semibold text-[#007a5a]">All checks passed ✓</p>
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
    <WizardLayout title="Your finances" steps={SUBSTEPS.map(s => s.label)} current={subStep}>
      {SUBSTEPS[subStep].component}
    </WizardLayout>
  );
}
