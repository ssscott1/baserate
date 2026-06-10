import { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Button } from '../ui/Button';
import { Input, Select } from '../ui/Input';
import { Toggle } from '../ui/Toggle';
import { LoadingState } from '../ui/Spinner';
import { Tick, StatusRow } from '../ui/Tick';
import { MOCK_DEALERS, formatCurrency, formatRate, calcMonthly, mockCall } from '../../utils/mock';
import { WizardLayout } from '../WizardLayout';

function STitle({ title, sub }) {
  return (
    <div className="mb-7">
      <h2 className="text-[28px] font-bold text-[#1d1d1f] tracking-tight mb-2" style={{ letterSpacing: '-0.02em' }}>{title}</h2>
      {sub && <p className="text-[15px] text-[#6e6e73] leading-relaxed">{sub}</p>}
    </div>
  );
}

function CreditProposal({ onNext }) {
  const { state, dispatch } = useApp();
  const { quote, approval } = state;
  const [acked, setAcked] = useState(false);
  const monthly = calcMonthly(quote.loanAmount, approval.approvedRate || 6.49, quote.term);

  const rows = [
    ['Proposed lender', 'Plenti Auto'],
    ['Loan amount', formatCurrency(quote.loanAmount)],
    ['Interest rate', formatRate(approval.approvedRate || 6.49)],
    ['Comparison rate', formatRate(6.82)],
    ['Term', `${quote.term} months`],
    ['Monthly repayment', formatCurrency(monthly)],
    ['Establishment fee', '$395'],
    ['Monthly fee', 'Nil'],
    ['Early payout fee', 'Nil'],
  ];

  return (
    <div className="flex flex-col gap-6">
      <STitle title="Credit Proposal Disclosure" sub="Review the proposed credit arrangement before signing." />
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="grid grid-cols-2">
          {rows.map(([k, v], i) => (
            <div key={k} className="px-5 py-4 flex flex-col gap-0.5 border-b border-r border-[rgba(0,0,0,0.06)]">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#86868b]">{k}</span>
              <span className="font-mono text-[15px] font-semibold text-[#1d1d1f]">{v}</span>
            </div>
          ))}
        </div>
        <div className="px-6 py-5 bg-[#f5f5f7] border-t border-[rgba(0,0,0,0.06)]">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#86868b] mb-2">How Baserate is paid</p>
          <p className="text-sm text-[#6e6e73] leading-relaxed">
            Baserate receives a volume-based fee from Plenti Auto. This is not a commission based on rate or loan size, and does not affect the rate offered to you.
          </p>
        </div>
      </div>
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <Toggle checked={acked} onChange={setAcked} label="I acknowledge I have received and read this Credit Proposal Disclosure" required />
      </div>
      <Button onClick={() => { dispatch({ type: 'ADD_LOG', actor: 'Applicant', message: 'Credit Proposal Disclosure acknowledged' }); onNext(); }} disabled={!acked} size="lg" className="w-full">
        Continue to contract →
      </Button>
    </div>
  );
}

function ContractDocuments({ onNext }) {
  const { dispatch } = useApp();
  const [viewed, setViewed] = useState(false);
  const [drawing, setDrawing] = useState(false);
  const [signing, setSigning] = useState(false);
  const [signed, setSigned] = useState(false);
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPos, setLastPos] = useState(null);

  const getPos = (e, canvas) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const cx = e.touches ? e.touches[0].clientX : e.clientX;
    const cy = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: (cx - rect.left) * scaleX, y: (cy - rect.top) * scaleY };
  };
  const startDraw = (e) => { e.preventDefault(); setIsDrawing(true); setLastPos(getPos(e, canvasRef.current)); };
  const draw = (e) => {
    if (!isDrawing) return; e.preventDefault();
    const canvas = canvasRef.current; const ctx = canvas.getContext('2d');
    const pos = getPos(e, canvas);
    ctx.beginPath(); ctx.moveTo(lastPos.x, lastPos.y); ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = '#1d1d1f'; ctx.lineWidth = 2; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.stroke(); setLastPos(pos);
  };
  const endDraw = () => setIsDrawing(false);

  const doSign = async () => {
    setSigning(true);
    await mockCall(1000, 1500);
    setSigning(false); setSigned(true);
    const ts = new Date().toLocaleString('en-AU');
    dispatch({ type: 'UPDATE_DOCS', data: { signed: true, contractViewed: true, signatureTimestamp: ts } });
    dispatch({ type: 'ADD_LOG', actor: 'Applicant', message: `Credit contract e-signed at ${ts}` });
  };

  if (signing) return <LoadingState message="Processing your signature…" submessage="Timestamping and securing your signed document" />;

  if (signed) return (
    <div className="flex flex-col gap-6 animate-fade-up">
      <div className="flex items-center gap-3 p-5 bg-[#eef7f3] border border-[#d1ede4] rounded-2xl">
        <Tick size={28} />
        <div><p className="font-semibold text-[#1d1d1f]">Documents signed</p><p className="text-sm text-[#86868b]">Timestamped and secured</p></div>
      </div>
      <Button onClick={onNext} size="lg" className="w-full">Continue to dealer details →</Button>
    </div>
  );

  return (
    <div className="flex flex-col gap-6">
      <STitle title="Contract documents" sub="You must view the contract before signing." />
      {!viewed ? (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-[rgba(0,0,0,0.06)] bg-[#f5f5f7]">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#86868b]">Precontractual Statement — Consumer Credit Contract</p>
          </div>
          <div className="p-6 font-mono text-xs text-[#6e6e73] leading-relaxed max-h-56 overflow-y-auto space-y-2">
            <p><span className="text-[#86868b]">Lender:</span> Plenti RE Limited ACN 636 651 150</p>
            <p><span className="text-[#86868b]">Annual Percentage Rate:</span> 6.49% p.a. (fixed)</p>
            <p><span className="text-[#86868b]">Establishment Fee:</span> $395 (capitalised)</p>
            <p><span className="text-[#86868b]">Monthly Account Fee:</span> Nil</p>
            <p><span className="text-[#86868b]">Early termination fee:</span> Nil</p>
            <p className="pt-2 text-[#1d1d1f] font-semibold">Your obligations</p>
            <p>You must make repayments on the dates specified. Default may result in repossession of the vehicle and a listing on your credit file.</p>
            <p className="pt-2 text-[#1d1d1f] font-semibold">Hardship</p>
            <p>If you experience financial hardship, contact Plenti at hardship@plenti.com.au or 1300 660 000 before missing a payment.</p>
            <p className="pt-2 text-[#1d1d1f] font-semibold">Complaints</p>
            <p>AFCA membership: 12345. Contact: complaints@plenti.com.au or afca.org.au / 1800 931 678.</p>
          </div>
          <div className="p-5 bg-[#f5f5f7] border-t border-[rgba(0,0,0,0.06)]">
            <Button onClick={() => setViewed(true)} variant="secondary" className="w-full">I have read this document</Button>
          </div>
        </div>
      ) : (
        <div className="animate-fade-up bg-white rounded-2xl shadow-sm p-6">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#86868b] mb-5">Sign the contract</p>
          {!drawing ? (
            <div className="flex flex-col gap-3">
              <Button onClick={() => setDrawing(true)} variant="secondary" className="w-full">✍  Draw my signature</Button>
              <Button onClick={doSign} className="w-full">✓ Tap to sign</Button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <p className="text-sm text-[#86868b]">Draw your signature below</p>
              <canvas
                ref={canvasRef} width={600} height={140}
                className="w-full h-28 rounded-xl touch-none border border-[rgba(0,0,0,0.1)]"
                style={{ background: '#f5f5f7', cursor: 'crosshair' }}
                onMouseDown={startDraw} onMouseMove={draw} onMouseUp={endDraw} onMouseLeave={endDraw}
                onTouchStart={startDraw} onTouchMove={draw} onTouchEnd={endDraw}
              />
              <div className="grid grid-cols-2 gap-3">
                <Button variant="secondary" onClick={() => { const c = canvasRef.current; c.getContext('2d').clearRect(0, 0, c.width, c.height); }}>Clear</Button>
                <Button onClick={doSign}>Confirm →</Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function DealerVehicle({ onNext }) {
  const { dispatch } = useApp();
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [addNew, setAddNew] = useState(false);
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [vin, setVin] = useState('');
  const filtered = MOCK_DEALERS.filter(d => d.name.toLowerCase().includes(search.toLowerCase()));
  const canContinue = selected && make && model && vin.length >= 6;

  return (
    <div className="flex flex-col gap-6">
      <STitle title="Dealer & vehicle" sub="Licensed dealers only — private sales are not eligible." />

      <div className="flex items-start gap-3 p-5 bg-[#fdf0ef] border border-[#fad5d2] rounded-2xl">
        <span className="text-[#c0392b] text-sm shrink-0 mt-0.5">⚠</span>
        <div>
          <p className="text-sm font-semibold text-[#c0392b] mb-0.5">Licensed dealer only</p>
          <p className="text-sm text-[#6e6e73]">Only available for purchases from a licensed motor dealer. Private sales cannot be funded through Baserate.</p>
        </div>
      </div>

      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#86868b] mb-3">Select dealer</p>
        <Input placeholder="Search by dealer name…" value={search} onChange={setSearch} />
        <div className="mt-3 flex flex-col gap-2 max-h-56 overflow-y-auto">
          {filtered.map(d => (
            <button key={d.id}
              onClick={() => { setSelected(d); dispatch({ type: 'UPDATE_DOCS', data: { dealerName: d.name, dealerABN: d.abn, dealerLicence: d.licence } }); }}
              className="flex justify-between items-center p-4 rounded-xl text-left transition-all w-full border"
              style={{
                background: selected?.id === d.id ? '#eef7f3' : 'white',
                borderColor: selected?.id === d.id ? '#d1ede4' : 'rgba(0,0,0,0.08)',
              }}
            >
              <div>
                <p className="text-[15px] font-medium text-[#1d1d1f]">{d.name}</p>
                <p className="text-xs text-[#86868b]">ABN {d.abn} · Licence {d.licence}</p>
              </div>
              {selected?.id === d.id && <Tick size={16} />}
            </button>
          ))}
          <button onClick={() => setAddNew(v => !v)}
            className="p-4 rounded-xl text-[#86868b] text-sm text-center w-full transition-all border-2 border-dashed border-[rgba(0,0,0,0.08)] bg-transparent hover:bg-white">
            + Add new dealer
          </button>
        </div>
        {addNew && (
          <div className="mt-4 flex flex-col gap-4 animate-fade-up">
            <Input label="Dealer legal name" placeholder="Smith's Auto Group Pty Ltd" />
            <Input label="ABN" placeholder="61 004 073 150" />
            <Input label="Dealer licence number" placeholder="MD99999" />
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Input label="Make" value={make} onChange={setMake} placeholder="Toyota" />
        <Input label="Model" value={model} onChange={setModel} placeholder="Camry" />
        <Input label="Year" value={year} onChange={setYear} placeholder="2024" />
      </div>
      <Input label="VIN" value={vin} onChange={setVin} placeholder="1HGBH41JXMN109186" helper="17-character Vehicle Identification Number — found on compliance plate" />

      <Button
        onClick={() => {
          dispatch({ type: 'UPDATE_DOCS', data: { vehicleMake: make, vehicleModel: model, vehicleVIN: vin } });
          dispatch({ type: 'ADD_LOG', actor: 'Applicant', message: `Dealer nominated: ${selected?.name} · Vehicle: ${make} ${model} ${year}` });
          onNext();
        }}
        disabled={!canContinue} size="lg" className="w-full"
      >
        Continue to invoice approval →
      </Button>
    </div>
  );
}

function InvoiceApproval({ onNext }) {
  const { state, dispatch } = useApp();
  const { quote, approval, docs } = state;
  const [confirmed, setConfirmed] = useState(false);
  const monthly = calcMonthly(quote.loanAmount, approval.approvedRate || 6.49, quote.term);

  return (
    <div className="flex flex-col gap-6">
      <STitle title="Approve the dealer invoice" sub="Confirm the final amount before settlement proceeds." />

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="flex justify-between items-start px-6 py-5 border-b border-[rgba(0,0,0,0.06)] bg-[#f5f5f7]">
          <div>
            <p className="font-bold text-[#1d1d1f]">{docs.dealerName || 'Sydney City Toyota'}</p>
            <p className="text-xs text-[#86868b]">ABN {docs.dealerABN || '61 004 073 150'}</p>
            <p className="text-xs text-[#adadb3] font-mono">INV-{String(Date.now()).slice(-5)}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-[#86868b] uppercase tracking-wider">Invoice date</p>
            <p className="text-sm font-mono text-[#6e6e73]">{new Date().toLocaleDateString('en-AU')}</p>
          </div>
        </div>
        <div className="px-6 py-4 border-b border-[rgba(0,0,0,0.06)]">
          <div className="flex justify-between mb-1">
            <span className="text-[15px] text-[#6e6e73]">{docs.vehicleMake || 'Toyota'} {docs.vehicleModel || 'Camry'} {new Date().getFullYear()}</span>
            <span className="font-mono font-semibold text-[#1d1d1f]">{formatCurrency(quote.loanAmount)}</span>
          </div>
          {docs.vehicleVIN && <p className="text-xs font-mono text-[#adadb3]">VIN: {docs.vehicleVIN}</p>}
        </div>
        <div className="flex justify-between items-center px-6 py-4 border-b border-[rgba(0,0,0,0.06)]">
          <span className="font-semibold text-[#1d1d1f]">Total payable</span>
          <span className="font-mono text-xl font-bold text-[#1d1d1f]">{formatCurrency(quote.loanAmount)}</span>
        </div>
        <div className="px-6 py-4 bg-[#f5f5f7]">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#86868b] mb-1.5">Payment will be sent to</p>
          <p className="text-[15px] font-medium text-[#1d1d1f]">{docs.dealerName || 'Sydney City Toyota'} — Operating Account</p>
          <p className="font-mono text-sm text-[#86868b]">BSB 063-012 · Acct 1234 5678</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6">
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#86868b] mb-4">Your final loan terms</p>
        <div className="grid grid-cols-2 gap-4">
          {[['Loan amount', formatCurrency(quote.loanAmount)], ['Term', `${quote.term} months`], ['Rate', formatRate(approval.approvedRate || 6.49)], ['Monthly', formatCurrency(monthly)], ['Balloon', 'Nil'], ['First repayment', '30 days post-settlement']].map(([k, v]) => (
            <div key={k}>
              <p className="text-[10px] text-[#86868b] uppercase tracking-wider">{k}</p>
              <p className="font-mono font-semibold text-[#1d1d1f] text-sm">{v}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6">
        <Toggle checked={confirmed} onChange={setConfirmed} label="I approve this invoice amount, terms, and authorise direct payment to the dealer" required />
      </div>
      <Button
        onClick={() => {
          dispatch({ type: 'UPDATE_DOCS', data: { invoiceAmount: quote.loanAmount, invoiceApproved: true } });
          dispatch({ type: 'ADD_LOG', actor: 'Applicant', message: `Invoice approved — ${formatCurrency(quote.loanAmount)} direct payment authorised` });
          onNext();
        }}
        disabled={!confirmed} size="lg" className="w-full"
      >
        Approve & send to financier →
      </Button>
    </div>
  );
}

function SettlementChecklist() {
  const { state, dispatch } = useApp();
  const { demoOutcome, docs } = state;
  const [checks, setChecks] = useState([
    { id: 'send', label: 'Sending to financier for documentation', detail: null, status: 'waiting' },
    { id: 'dealer', label: 'Financier verifying dealer', detail: null, status: 'waiting' },
    { id: 'fraud', label: 'Running fraud controls', detail: null, status: 'waiting' },
    { id: 'ppsr', label: 'Running PPSR check', detail: null, status: 'waiting' },
    { id: 'pay', label: 'Financier paying dealer directly', detail: null, status: 'waiting' },
  ]);
  const [done, setDone] = useState(false);
  const [fraudHeld, setFraudHeld] = useState(false);
  const [started, setStarted] = useState(false);

  const update = (id, status, detail = null) =>
    setChecks(prev => prev.map(c => c.id === id ? { ...c, status, detail } : c));

  const run = async () => {
    setStarted(true);
    update('send', 'pending');
    await mockCall(1000, 1500);
    update('send', 'success', 'Documentation package sent to Plenti Auto');
    dispatch({ type: 'ADD_LOG', actor: 'Financier', message: 'Documentation received for assessment' });

    update('dealer', 'pending');
    await mockCall(1000, 1600);
    update('dealer', 'success', `${docs.dealerName || 'Sydney City Toyota'} independently verified — licence current`);
    dispatch({ type: 'ADD_LOG', actor: 'Financier', message: 'Dealer independently verified' });

    update('fraud', 'pending');
    await mockCall(1200, 1800);
    if (demoOutcome === 'fraud') {
      update('fraud', 'warning', 'Bank account details changed since last verification');
      setFraudHeld(true);
      dispatch({ type: 'ADD_LOG', actor: 'System', message: 'FRAUD HOLD — bank account details changed. Payment stopped.' });
      return;
    }
    update('fraud', 'success', 'Payee verified · No account change · No duplicate · VIN matches · Amount in range');
    dispatch({ type: 'ADD_LOG', actor: 'System', message: 'Fraud controls passed — all checks clear' });

    update('ppsr', 'pending');
    await mockCall(800, 1200);
    update('ppsr', 'success', `No existing security interests — VIN ${docs.vehicleVIN || 'provided'}`);
    dispatch({ type: 'ADD_LOG', actor: 'System', message: 'PPSR clear — no existing security interests' });

    update('pay', 'pending');
    await mockCall(1200, 2000);
    const ref = `PLT${String(Date.now()).slice(-8)}`;
    update('pay', 'success', `Payment reference: ${ref}`);
    dispatch({ type: 'ADD_LOG', actor: 'Financier', message: `Dealer paid directly — ref ${ref}` });
    dispatch({ type: 'ADD_LOG', actor: 'System', message: 'Settlement complete — loan active' });
    setDone(true);
  };

  return (
    <div className="flex flex-col gap-6">
      <STitle title="Settlement in progress" sub="Financier is verifying everything and paying the dealer directly." />

      <div className="bg-white rounded-2xl shadow-sm p-6">
        {checks.map(c => <StatusRow key={c.id} status={c.status} label={c.label} detail={c.detail} />)}
      </div>

      {fraudHeld && (
        <div className="animate-fade-up p-6 bg-[#fdf0ef] border border-[#fad5d2] rounded-2xl">
          <p className="font-bold text-[#c0392b] mb-2">⚠ Held for manual review</p>
          <p className="text-[15px] text-[#6e6e73] leading-relaxed">
            Bank account details for this dealer have changed since the last verified payment.
            The payment has been stopped pending investigation.
            Our fraud team will contact you within 2 hours. Reference: FRD-{String(Date.now()).slice(-6)}.
          </p>
        </div>
      )}

      {!started && <Button onClick={run} size="lg" className="w-full">Begin settlement →</Button>}
      {done && (
        <div className="animate-fade-up">
          <Button onClick={() => dispatch({ type: 'SET_STEP', step: 5 })} size="lg" className="w-full">View confirmation →</Button>
        </div>
      )}
    </div>
  );
}

export function Step5Settlement() {
  const [subStep, setSubStep] = useState(0);
  const next = () => setSubStep(s => s + 1);
  const SUBSTEPS = [
    { label: 'Credit Proposal', component: <CreditProposal onNext={next} /> },
    { label: 'Sign Contract', component: <ContractDocuments onNext={next} /> },
    { label: 'Dealer & Vehicle', component: <DealerVehicle onNext={next} /> },
    { label: 'Invoice', component: <InvoiceApproval onNext={next} /> },
    { label: 'Settlement', component: <SettlementChecklist /> },
  ];
  return (
    <WizardLayout title="Documents & settlement" steps={SUBSTEPS.map(s => s.label)} current={subStep}>
      {SUBSTEPS[subStep].component}
    </WizardLayout>
  );
}
