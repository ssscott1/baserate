import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Input, Select } from '../ui/Input';
import { Toggle } from '../ui/Toggle';
import { LoadingState } from '../ui/Spinner';
import { Tick, StatusRow } from '../ui/Tick';
import { mockCall, formatCurrency } from '../../utils/mock';

// Mock bank data
const MOCK_BANK_DATA = {
  income: 9150,
  expenses: 3420,
  existingDebts: 780,
  categories: [
    { name: 'Salary / wages', amount: 9150, type: 'income' },
    { name: 'Groceries', amount: 680, type: 'expense' },
    { name: 'Rent / mortgage', amount: 1800, type: 'expense' },
    { name: 'Transport', amount: 310, type: 'expense' },
    { name: 'Dining & entertainment', amount: 420, type: 'expense' },
    { name: 'Utilities', amount: 210, type: 'expense' },
    { name: 'Car loan (existing)', amount: 780, type: 'debt' },
  ],
};

function BankConnect({ onNext, onManual }) {
  const { dispatch } = useApp();
  const [phase, setPhase] = useState('consent'); // consent | login | retrieving | done

  const banks = ['Commonwealth Bank', 'ANZ', 'Westpac', 'NAB', 'Macquarie', 'ING'];
  const [selectedBank, setSelectedBank] = useState('');
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');

  const doConnect = async () => {
    setPhase('retrieving');
    dispatch({ type: 'ADD_LOG', actor: 'System', message: `CDR consent granted — connecting to ${selectedBank}` });
    await mockCall(1500, 2500);
    dispatch({ type: 'UPDATE_FINANCIAL', data: {
      bankConnected: true,
      income: MOCK_BANK_DATA.income * 12,
      expenses: MOCK_BANK_DATA.expenses * 12,
      existingDebts: MOCK_BANK_DATA.existingDebts,
    }});
    dispatch({ type: 'ADD_LOG', actor: 'System', message: 'Bank data retrieved and categorised via CDR' });
    setPhase('done');
  };

  if (phase === 'consent') return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="font-serif text-2xl font-semibold text-[#0d1b2a] mb-1">Connect your bank</h2>
        <p className="text-sm text-[#5a6a7a]">We use Consumer Data Right (CDR) — a government-regulated, secure standard.</p>
      </div>
      <Card variant="teal" className="p-5">
        <p className="text-sm font-semibold text-[#0d1b2a] mb-2">Your CDR consent</p>
        <ul className="text-sm text-[#5a6a7a] flex flex-col gap-1.5 mb-4">
          <li className="flex items-start gap-2"><span className="text-[#00b894] shrink-0">✓</span>Read-only access to 90 days of transaction data</li>
          <li className="flex items-start gap-2"><span className="text-[#00b894] shrink-0">✓</span>Access expires in 24 hours and can be revoked any time</li>
          <li className="flex items-start gap-2"><span className="text-[#00b894] shrink-0">✓</span>Used only for this credit assessment — not sold or shared</li>
          <li className="flex items-start gap-2"><span className="text-[#00b894] shrink-0">✓</span>Regulated under the Consumer Data Right Act 2019</li>
        </ul>
        <Select
          label="Select your bank"
          value={selectedBank}
          onChange={setSelectedBank}
          options={banks.map(b => ({ value: b, label: b }))}
        />
      </Card>
      <div className="flex flex-col gap-3">
        <Button onClick={() => setPhase('login')} disabled={!selectedBank} size="lg" className="w-full">
          Connect securely →
        </Button>
        <button onClick={onManual} className="text-sm text-[#5a6a7a] underline text-center hover:text-[#0d1b2a]">
          Or enter details manually instead
        </button>
      </div>
    </div>
  );

  if (phase === 'login') return (
    <div className="flex flex-col gap-5 animate-fade-up">
      <div>
        <h2 className="font-serif text-2xl font-semibold text-[#0d1b2a] mb-1">{selectedBank}</h2>
        <p className="text-sm text-[#5a6a7a]">Demo bank login — enter anything to proceed.</p>
      </div>
      <Card className="p-5 border-2 border-[#ede8e1]">
        <div className="flex items-center gap-2 mb-4 p-2 bg-[#f8f4ef] rounded-lg">
          <span className="text-[#00b894]">🔒</span>
          <p className="text-xs text-[#5a6a7a]">Secure bank connection • Powered by CDR Open Banking</p>
        </div>
        <div className="flex flex-col gap-4">
          <Input label="Customer ID" value={loginUser} onChange={setLoginUser} placeholder="Enter your customer ID" />
          <Input label="Password" value={loginPass} onChange={setLoginPass} type="password" placeholder="••••••••" />
        </div>
        <Button onClick={doConnect} disabled={!loginUser || !loginPass} size="lg" className="w-full mt-4">
          Log in & authorise →
        </Button>
      </Card>
    </div>
  );

  if (phase === 'retrieving') return (
    <LoadingState message="Retrieving and categorising your transactions…" submessage="Connecting securely via Open Banking CDR" />
  );

  // done
  return (
    <div className="flex flex-col gap-5 animate-fade-up">
      <div className="flex items-center gap-3 p-4 bg-[#00b894]/10 border border-[#00b894]/30 rounded-2xl">
        <Tick size={28} />
        <div>
          <p className="font-semibold text-[#0d1b2a] text-sm">Bank connected</p>
          <p className="text-xs text-[#5a6a7a]">{selectedBank} · 90 days of data retrieved</p>
        </div>
      </div>

      <Card className="p-5">
        <p className="text-sm font-semibold text-[#0d1b2a] mb-4">Your financial summary</p>
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-[#00b894]/5 rounded-xl p-3 text-center">
            <p className="text-xs text-[#5a6a7a]">Monthly income</p>
            <p className="font-mono font-bold text-[#00b894] text-lg">{formatCurrency(MOCK_BANK_DATA.income)}</p>
          </div>
          <div className="bg-[#f8f4ef] rounded-xl p-3 text-center">
            <p className="text-xs text-[#5a6a7a]">Monthly expenses</p>
            <p className="font-mono font-bold text-[#0d1b2a] text-lg">{formatCurrency(MOCK_BANK_DATA.expenses)}</p>
          </div>
          <div className="bg-[#e17055]/5 rounded-xl p-3 text-center">
            <p className="text-xs text-[#5a6a7a]">Existing debts</p>
            <p className="font-mono font-bold text-[#e17055] text-lg">{formatCurrency(MOCK_BANK_DATA.existingDebts)}</p>
          </div>
        </div>
        <div className="border-t border-[#f0f0f0] pt-4">
          <p className="text-xs font-semibold text-[#5a6a7a] uppercase tracking-wider mb-2">Categorised transactions</p>
          <div className="flex flex-col gap-1.5">
            {MOCK_BANK_DATA.categories.map(c => (
              <div key={c.name} className="flex justify-between text-sm">
                <span className="text-[#5a6a7a]">{c.name}</span>
                <span className={`font-mono font-medium ${c.type === 'income' ? 'text-[#00b894]' : c.type === 'debt' ? 'text-[#e17055]' : 'text-[#0d1b2a]'}`}>
                  {c.type === 'income' ? '+' : '-'}{formatCurrency(c.amount)}/mo
                </span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <Button onClick={onNext} size="lg" className="w-full">
        Looks right — continue →
      </Button>
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
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#f0a500]/10 border border-[#f0a500]/30 rounded-full mb-3">
          <span className="text-xs font-semibold text-[#f0a500]">Manually verified</span>
        </div>
        <h2 className="font-serif text-2xl font-semibold text-[#0d1b2a] mb-1">Manual income entry</h2>
        <p className="text-sm text-[#5a6a7a]">Your application will be badged as "manually verified" — processing may take longer.</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input label="Annual income" value={income} onChange={setIncome} prefix="$" type="number" placeholder="95,000" />
        <Input label="Annual expenses" value={expenses} onChange={setExpenses} prefix="$" type="number" placeholder="28,000" />
      </div>
      <div className="bg-[#f8f4ef] border-2 border-dashed border-[#ede8e1] rounded-2xl p-5 flex flex-col items-center gap-3">
        <span className="text-3xl">📄</span>
        <p className="text-sm font-medium text-[#0d1b2a]">Upload payslips or ATO notice of assessment</p>
        <button
          onClick={() => setUploaded(true)}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors
            ${uploaded ? 'bg-[#00b894] text-white' : 'bg-white border border-[#ede8e1] text-[#0d1b2a] hover:border-[#b0c4d8]'}
          `}
        >
          {uploaded ? '✓ payslip_march.pdf uploaded' : 'Upload document (demo)'}
        </button>
      </div>
      <Button
        onClick={() => {
          dispatch({ type: 'UPDATE_FINANCIAL', data: { manualEntry: true, income: Number(income) || 95000, expenses: Number(expenses) || 28000 } });
          dispatch({ type: 'ADD_LOG', actor: 'Applicant', message: 'Income entered manually — marked as manually verified' });
          onNext();
        }}
        disabled={!income || !expenses}
        size="lg" className="w-full"
      >
        Continue →
      </Button>
    </div>
  );
}

function AssetsLiabilities({ onNext }) {
  const { state, dispatch } = useApp();
  const { financial } = state;
  const update = data => dispatch({ type: 'UPDATE_FINANCIAL', data });

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="font-serif text-2xl font-semibold text-[#0d1b2a] mb-1">Assets & liabilities</h2>
        <p className="text-sm text-[#5a6a7a]">A brief financial snapshot for serviceability assessment.</p>
      </div>
      <Select
        label="Housing situation"
        value={financial.housingStatus}
        onChange={v => update({ housingStatus: v })}
        options={[
          { value: 'mortgage', label: 'Paying a mortgage' },
          { value: 'own', label: 'Own outright' },
          { value: 'rent', label: 'Renting' },
          { value: 'boarding', label: 'Boarding / living with family' },
        ]}
      />
      <Toggle
        checked={financial.hasInvestmentProperty}
        onChange={v => update({ hasInvestmentProperty: v })}
        label="I have an investment property"
      />
      <div className="grid grid-cols-2 gap-4">
        <Input label="Savings / assets (approx.)" prefix="$" type="number" placeholder="25,000" />
        <Input label="Other debts (monthly)" prefix="$" type="number" placeholder="500" />
      </div>
      <Button onClick={() => { dispatch({ type: 'ADD_LOG', actor: 'Applicant', message: 'Asset and liability statement submitted' }); onNext(); }} size="lg" className="w-full">
        Continue →
      </Button>
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
    setChecking(false);
    setDone(true);
    dispatch({ type: 'ADD_LOG', actor: 'System', message: 'Credit report retrieved — Equifax score 742, no adverse listings' });
  };

  if (checking) return <LoadingState message="Running credit check…" submessage="Submitting enquiry to Equifax Credit Bureau" />;

  if (done) return (
    <div className="flex flex-col gap-5 animate-fade-up">
      <div className="p-5 bg-[#00b894]/10 border border-[#00b894]/30 rounded-2xl flex items-center gap-3">
        <Tick size={28} />
        <div>
          <p className="font-semibold text-[#0d1b2a]">Credit check complete</p>
          <p className="text-xs text-[#5a6a7a]">Equifax score: 742 • No adverse listings</p>
        </div>
      </div>
      <Button onClick={onNext} size="lg" className="w-full">
        Continue to processing →
      </Button>
    </div>
  );

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="font-serif text-2xl font-semibold text-[#0d1b2a] mb-1">Credit check consent</h2>
        <p className="text-sm text-[#5a6a7a]">This is a hard enquiry — it will appear on your credit file. Soft pre-screening has already run.</p>
      </div>
      <Card variant="coral" className="p-5">
        <p className="text-sm font-semibold text-[#e17055] mb-1">Hard enquiry — not a soft check</p>
        <p className="text-sm text-[#5a6a7a]">Unlike the soft pre-screen we ran earlier, this will be visible to other lenders. Most applications have one credit enquiry per lender approach.</p>
      </Card>
      <Card className="p-5">
        <Toggle
          checked={consented}
          onChange={setConsented}
          label="I consent to a hard credit enquiry being made with Equifax on behalf of Baserate Financial Services Pty Ltd"
          required
        />
      </Card>
      <Button onClick={runCheck} disabled={!consented} size="lg" className="w-full">
        Run credit check →
      </Button>
    </div>
  );
}

function AMLProcessing({ onNext }) {
  const { dispatch } = useApp();
  const [statuses, setStatuses] = useState([
    { id: 'kyc', label: 'AML / KYC identity cross-check', status: 'waiting' },
    { id: 'sanction', label: 'Sanctions list screening (AUSTRAC)', status: 'waiting' },
    { id: 'fraud', label: 'Fraud score assessment', status: 'waiting' },
    { id: 'pep', label: 'PEP / adverse media check', status: 'waiting' },
  ]);
  const [complete, setComplete] = useState(false);

  const runAll = async () => {
    for (let i = 0; i < statuses.length; i++) {
      setStatuses(prev => prev.map((s, idx) => idx === i ? { ...s, status: 'pending' } : s));
      await mockCall(700, 1200);
      setStatuses(prev => prev.map((s, idx) => idx === i ? { ...s, status: 'success' } : s));
    }
    dispatch({ type: 'UPDATE_FINANCIAL', data: { amlPassed: true } });
    dispatch({ type: 'ADD_LOG', actor: 'System', message: 'AML/KYC check passed — no adverse findings' });
    setComplete(true);
  };

  const started = statuses[0].status !== 'waiting';

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="font-serif text-2xl font-semibold text-[#0d1b2a] mb-1">Checking your details</h2>
        <p className="text-sm text-[#5a6a7a]">Running required AML/KYC checks before we assess your application.</p>
      </div>
      <Card className="p-5">
        {statuses.map(s => (
          <StatusRow key={s.id} status={s.status} label={s.label} />
        ))}
      </Card>
      {!started && (
        <Button onClick={runAll} size="lg" className="w-full">
          Run checks →
        </Button>
      )}
      {complete && (
        <div className="animate-fade-up">
          <div className="p-4 bg-[#00b894]/10 border border-[#00b894]/30 rounded-xl mb-4 text-center">
            <p className="font-semibold text-[#0d1b2a]">All checks passed ✓</p>
          </div>
          <Button onClick={() => { dispatch({ type: 'SET_STEP', step: 3 }); }} size="lg" className="w-full">
            Continue to approval →
          </Button>
        </div>
      )}
    </div>
  );
}

export function Step3Financial() {
  const [subStep, setSubStep] = useState(0);
  const [mode, setMode] = useState('bank'); // bank | manual

  const next = () => setSubStep(s => s + 1);

  const bankOrManual = mode === 'bank'
    ? <BankConnect onNext={next} onManual={() => { setMode('manual'); }} />
    : <ManualEntry onNext={next} />;

  const SUBSTEPS = [
    { label: 'Bank', component: bankOrManual },
    { label: 'Assets', component: <AssetsLiabilities onNext={next} /> },
    { label: 'Credit', component: <CreditCheck onNext={next} /> },
    { label: 'AML/KYC', component: <AMLProcessing /> },
  ];

  const labels = SUBSTEPS.map(s => s.label);

  return (
    <div className="max-w-2xl mx-auto px-4 pb-16 pt-6">
      <div className="flex items-center gap-1.5 mb-6 overflow-x-auto pb-1">
        {labels.map((l, i) => (
          <div key={l} className="flex items-center gap-1.5 shrink-0">
            <div className={`px-3 py-1 rounded-full text-xs font-medium
              ${i === subStep ? 'bg-[#0d1b2a] text-white' : i < subStep ? 'bg-[#00b894] text-white' : 'bg-[#ede8e1] text-[#5a6a7a]'}
            `}>{l}</div>
            {i < labels.length - 1 && <span className="text-[#ede8e1]">›</span>}
          </div>
        ))}
      </div>
      <div className="animate-fade-up" key={subStep}>
        {SUBSTEPS[subStep].component}
      </div>
    </div>
  );
}
