import { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Input, Select } from '../ui/Input';
import { Toggle } from '../ui/Toggle';
import { LoadingState } from '../ui/Spinner';
import { Tick, StatusRow } from '../ui/Tick';
import { MOCK_DEALERS, formatCurrency, formatRate, calcMonthly, mockCall } from '../../utils/mock';

function CreditProposal({ onNext }) {
  const { state, dispatch } = useApp();
  const { quote, approval } = state;
  const [acked, setAcked] = useState(false);
  const monthly = calcMonthly(quote.loanAmount, approval.approvedRate || 6.49, quote.term);

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="font-serif text-2xl font-semibold text-[#0d1b2a] mb-1">Credit Proposal Disclosure</h2>
        <p className="text-sm text-[#5a6a7a]">Review the proposed credit arrangement before signing.</p>
      </div>
      <Card className="p-5">
        <div className="grid grid-cols-2 gap-3 mb-4">
          {[
            ['Proposed lender', 'Plenti Auto'],
            ['Loan amount', formatCurrency(quote.loanAmount)],
            ['Interest rate', formatRate(approval.approvedRate || 6.49)],
            ['Comparison rate', formatRate(6.82)],
            ['Term', `${quote.term} months`],
            ['Monthly repayment', formatCurrency(monthly)],
            ['Establishment fee', '$395'],
            ['Monthly fee', 'Nil'],
            ['Early payout fee', 'Nil'],
          ].map(([k, v]) => (
            <div key={k} className="flex flex-col">
              <span className="text-xs text-[#5a6a7a]">{k}</span>
              <span className="font-mono text-sm font-semibold text-[#0d1b2a]">{v}</span>
            </div>
          ))}
        </div>
        <div className="border-t border-[#f0f0f0] pt-4">
          <p className="text-xs font-semibold text-[#5a6a7a] mb-2">How Baserate is paid</p>
          <p className="text-xs text-[#5a6a7a] leading-relaxed">
            Baserate receives a volume-based fee from Plenti Auto. This is not a commission based on rate or loan size,
            and does not affect the rate offered to you.
          </p>
        </div>
      </Card>
      <Toggle
        checked={acked}
        onChange={setAcked}
        label="I acknowledge I have received and read this Credit Proposal Disclosure"
        required
      />
      <Button
        onClick={() => {
          dispatch({ type: 'ADD_LOG', actor: 'Applicant', message: 'Credit Proposal Disclosure acknowledged' });
          onNext();
        }}
        disabled={!acked}
        size="lg"
        className="w-full"
      >
        Continue to contract
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
    if (!isDrawing) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const pos = getPos(e, canvas);
    ctx.beginPath(); ctx.moveTo(lastPos.x, lastPos.y); ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = '#0d1b2a'; ctx.lineWidth = 2.5; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
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

  if (signing) return <LoadingState message="Processing your signature..." submessage="Timestamping and securing your signed document" />;

  if (signed) return (
    <div className="flex flex-col gap-5 animate-fade-up">
      <div className="flex items-center gap-3 p-4 bg-[#00b894]/10 border border-[#00b894]/30 rounded-2xl">
        <Tick size={28} />
        <div><p className="font-semibold text-[#0d1b2a]">Documents signed</p><p className="text-xs text-[#5a6a7a]">Timestamped and secured</p></div>
      </div>
      <Button onClick={onNext} size="lg" className="w-full">Continue to dealer details</Button>
    </div>
  );

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="font-serif text-2xl font-semibold text-[#0d1b2a] mb-1">Contract documents</h2>
        <p className="text-sm text-[#5a6a7a]">You must view the contract before signing.</p>
      </div>
      {!viewed ? (
        <Card className="p-5 border-2 border-[#ede8e1]">
          <div className="bg-[#f8f4ef] rounded-xl p-4 mb-4 font-mono text-xs text-[#5a6a7a] leading-relaxed max-h-52 overflow-y-auto">
            <p className="font-bold text-[#0d1b2a] mb-2 text-sm">CONSUMER CREDIT CONTRACT — PRECONTRACTUAL STATEMENT</p>
            <p className="mb-1"><strong>Lender:</strong> Plenti RE Limited ACN 636 651 150</p>
            <p className="mb-1"><strong>Annual Percentage Rate:</strong> 6.49% p.a. (fixed)</p>
            <p className="mb-1"><strong>Establishment Fee:</strong> $395 (capitalised)</p>
            <p className="mb-1"><strong>Monthly Account Fee:</strong> Nil</p>
            <p className="mb-3"><strong>Early termination fee:</strong> Nil</p>
            <p className="font-bold text-[#0d1b2a] mb-1">Your obligations</p>
            <p className="mb-2">You must make repayments on the dates specified. Default may result in repossession of the vehicle and a listing on your credit file.</p>
            <p className="font-bold text-[#0d1b2a] mb-1">Hardship</p>
            <p className="mb-2">If you experience financial hardship, contact Plenti at hardship@plenti.com.au or 1300 660 000.</p>
            <p className="font-bold text-[#0d1b2a] mb-1">Complaints</p>
            <p>AFCA membership: 12345. Contact: complaints@plenti.com.au or afca.org.au.</p>
          </div>
          <Button onClick={() => setViewed(true)} variant="secondary" className="w-full">I have read this document</Button>
        </Card>
      ) : (
        <div className="animate-fade-up flex flex-col gap-4">
          <Card className="p-5">
            <p className="text-sm font-semibold text-[#0d1b2a] mb-4">Sign the contract</p>
            {!drawing ? (
              <div className="flex flex-col gap-3">
                <Button onClick={() => setDrawing(true)} variant="secondary" className="w-full">Draw my signature</Button>
                <Button onClick={doSign} className="w-full">Tap to sign (use full name as signature)</Button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <p className="text-xs text-[#5a6a7a]">Draw your signature below</p>
                <canvas ref={canvasRef} width={600} height={140}
                  className="w-full h-28 border-2 border-dashed border-[#0d1b2a]/30 rounded-xl bg-white touch-none"
                  style={{ cursor: 'crosshair' }}
                  onMouseDown={startDraw} onMouseMove={draw} onMouseUp={endDraw} onMouseLeave={endDraw}
                  onTouchStart={startDraw} onTouchMove={draw} onTouchEnd={endDraw}
                />
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="secondary" onClick={() => { const c = canvasRef.current; c.getContext('2d').clearRect(0,0,c.width,c.height); }}>Clear</Button>
                  <Button onClick={doSign}>Confirm</Button>
                </div>
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}

function DealerVehicle({ onNext }) {
  const { dispatch } = useApp();
  const [dealerSearch, setDealerSearch] = useState('');
  const [selectedDealer, setSelectedDealer] = useState(null);
  const [addNew, setAddNew] = useState(false);
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [vin, setVin] = useState('');

  const filtered = MOCK_DEALERS.filter(d => d.name.toLowerCase().includes(dealerSearch.toLowerCase()));
  const canContinue = selectedDealer && make && model && vin.length >= 6;

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="font-serif text-2xl font-semibold text-[#0d1b2a] mb-1">Dealer & vehicle</h2>
        <p className="text-sm text-[#5a6a7a]">Licensed dealers only — private sales are not eligible.</p>
      </div>
      <Card variant="coral" className="p-4">
        <p className="text-sm font-semibold text-[#e17055] mb-1">Licensed dealer only</p>
        <p className="text-xs text-[#5a6a7a]">This facility is only available for purchases from a licensed motor dealer. Private sales cannot be funded through Baserate.</p>
      </Card>
      <div>
        <p className="text-sm font-semibold text-[#0d1b2a] mb-3">Select dealer</p>
        <Input placeholder="Search by dealer name..." value={dealerSearch} onChange={setDealerSearch} />
        <div className="mt-2 flex flex-col gap-1.5 max-h-52 overflow-y-auto">
          {filtered.map(d => (
            <button key={d.id}
              onClick={() => { setSelectedDealer(d); dispatch({ type: 'UPDATE_DOCS', data: { dealerName: d.name, dealerABN: d.abn, dealerLicence: d.licence } }); }}
              className={`flex justify-between items-center p-3 rounded-xl border-2 text-left transition-all w-full ${selectedDealer?.id === d.id ? 'border-[#00b894] bg-[#00b894]/5' : 'border-[#ede8e1] bg-white hover:border-[#b0c4d8]'}`}
            >
              <div><p className="text-sm font-medium text-[#0d1b2a]">{d.name}</p><p className="text-xs text-[#5a6a7a]">ABN {d.abn} · Licence {d.licence}</p></div>
              {selectedDealer?.id === d.id && <Tick size={18} />}
            </button>
          ))}
          <button onClick={() => setAddNew(v => !v)} className="p-3 rounded-xl border-2 border-dashed border-[#ede8e1] text-[#5a6a7a] text-sm hover:border-[#b0c4d8] text-center w-full transition-colors">+ Add new dealer</button>
        </div>
        {addNew && (
          <div className="mt-3 flex flex-col gap-3 animate-fade-up">
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
      <Input label="VIN" value={vin} onChange={setVin} placeholder="1HGBH41JXMN109186" helper="17-character Vehicle Identification Number — found on compliance plate or dashboard" />
      <Button
        onClick={() => {
          dispatch({ type: 'UPDATE_DOCS', data: { vehicleMake: make, vehicleModel: model, vehicleVIN: vin } });
          dispatch({ type: 'ADD_LOG', actor: 'Applicant', message: `Dealer nominated: ${selectedDealer?.name} · Vehicle: ${make} ${model} ${year}` });
          onNext();
        }}
        disabled={!canContinue} size="lg" className="w-full"
      >Continue to invoice approval</Button>
    </div>
  );
}

function InvoiceApproval({ onNext }) {
  const { state, dispatch } = useApp();
  const { quote, approval, docs } = state;
  const [confirmed, setConfirmed] = useState(false);
  const monthly = calcMonthly(quote.loanAmount, approval.approvedRate || 6.49, quote.term);

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="font-serif text-2xl font-semibold text-[#0d1b2a] mb-1">Approve the dealer invoice</h2>
        <p className="text-sm text-[#5a6a7a]">Confirm the final amount before settlement proceeds.</p>
      </div>
      <Card className="p-5 border-2 border-[#ede8e1]">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="font-bold text-[#0d1b2a]">{docs.dealerName || 'Sydney City Toyota'}</p>
            <p className="text-xs text-[#5a6a7a]">ABN {docs.dealerABN || '61 004 073 150'}</p>
            <p className="text-xs text-[#5a6a7a]">INV-{String(Date.now()).slice(-5)}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-[#5a6a7a]">Invoice date</p>
            <p className="text-sm font-mono">{new Date().toLocaleDateString('en-AU')}</p>
          </div>
        </div>
        <div className="border-t border-[#f0f0f0] pt-4 mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-[#5a6a7a]">{docs.vehicleMake || 'Toyota'} {docs.vehicleModel || 'Camry'} {new Date().getFullYear()}</span>
            <span className="font-mono font-medium">{formatCurrency(quote.loanAmount)}</span>
          </div>
          {docs.vehicleVIN && <p className="text-xs text-[#5a6a7a]">VIN: {docs.vehicleVIN}</p>}
        </div>
        <div className="flex justify-between font-bold text-base border-t border-[#f0f0f0] pt-3">
          <span>Total payable</span><span className="font-mono">{formatCurrency(quote.loanAmount)}</span>
        </div>
        <div className="mt-4 bg-[#f8f4ef] rounded-xl p-3">
          <p className="text-xs text-[#5a6a7a] mb-1">Payment will be sent to</p>
          <p className="text-sm font-medium text-[#0d1b2a]">{docs.dealerName || 'Sydney City Toyota'} — Operating Account</p>
          <p className="font-mono text-sm text-[#5a6a7a]">BSB 063-012 · Acct 1234 5678</p>
        </div>
      </Card>
      <Card className="p-4">
        <p className="text-xs font-semibold text-[#5a6a7a] uppercase tracking-wider mb-3">Your final loan terms</p>
        <div className="grid grid-cols-2 gap-3 text-sm">
          {[['Loan amount', formatCurrency(quote.loanAmount)], ['Term', `${quote.term} months`], ['Rate', formatRate(approval.approvedRate || 6.49)], ['Monthly', formatCurrency(monthly)], ['Balloon', 'Nil'], ['First repayment', '30 days post-settlement']].map(([k, v]) => (
            <div key={k}><p className="text-xs text-[#5a6a7a]">{k}</p><p className="font-mono font-semibold text-[#0d1b2a] text-sm">{v}</p></div>
          ))}
        </div>
      </Card>
      <Toggle checked={confirmed} onChange={setConfirmed} label="I approve this invoice amount, terms, and authorise direct payment to the dealer" required />
      <Button onClick={() => { dispatch({ type: 'UPDATE_DOCS', data: { invoiceAmount: quote.loanAmount, invoiceApproved: true } }); dispatch({ type: 'ADD_LOG', actor: 'Applicant', message: `Invoice approved — ${formatCurrency(quote.loanAmount)} direct payment authorised` }); onNext(); }} disabled={!confirmed} size="lg" className="w-full">Approve & send to financier</Button>
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

  const updateCheck = (id, status, detail = null) =>
    setChecks(prev => prev.map(c => c.id === id ? { ...c, status, detail } : c));

  const runSettlement = async () => {
    setStarted(true);
    updateCheck('send', 'pending');
    await mockCall(1000, 1500);
    updateCheck('send', 'success', 'Documentation package sent to Plenti Auto');
    dispatch({ type: 'ADD_LOG', actor: 'Financier', message: 'Documentation received for assessment' });

    updateCheck('dealer', 'pending');
    await mockCall(1000, 1600);
    updateCheck('dealer', 'success', `${docs.dealerName || 'Sydney City Toyota'} independently verified — licence current`);
    dispatch({ type: 'ADD_LOG', actor: 'Financier', message: 'Dealer independently verified by financier' });

    updateCheck('fraud', 'pending');
    await mockCall(1200, 1800);
    if (demoOutcome === 'fraud') {
      updateCheck('fraud', 'warning', 'Bank account details changed since last verification');
      setFraudHeld(true);
      dispatch({ type: 'ADD_LOG', actor: 'System', message: 'FRAUD HOLD — bank account details changed. Payment stopped.' });
      return;
    }
    updateCheck('fraud', 'success', 'Payee verified · No account change · No duplicate · VIN matches · Amount in range');
    dispatch({ type: 'ADD_LOG', actor: 'System', message: 'Fraud controls passed — all checks clear' });

    updateCheck('ppsr', 'pending');
    await mockCall(800, 1200);
    updateCheck('ppsr', 'success', `No existing security interests registered on VIN ${docs.vehicleVIN || 'provided'}`);
    dispatch({ type: 'ADD_LOG', actor: 'System', message: 'PPSR clear — no existing security interests' });

    updateCheck('pay', 'pending');
    await mockCall(1200, 2000);
    const payRef = `PLT${String(Date.now()).slice(-8)}`;
    updateCheck('pay', 'success', `Payment reference: ${payRef}`);
    dispatch({ type: 'ADD_LOG', actor: 'Financier', message: `Dealer paid directly — payment reference ${payRef}` });
    dispatch({ type: 'ADD_LOG', actor: 'System', message: 'Settlement complete — loan active' });
    setDone(true);
  };

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="font-serif text-2xl font-semibold text-[#0d1b2a] mb-1">Settlement in progress</h2>
        <p className="text-sm text-[#5a6a7a]">The financier is verifying everything and paying the dealer directly.</p>
      </div>
      <Card className="p-5">
        {checks.map(c => <StatusRow key={c.id} status={c.status} label={c.label} detail={c.detail} />)}
      </Card>
      {fraudHeld && (
        <div className="animate-fade-up p-5 bg-[#e17055]/10 border-2 border-[#e17055]/40 rounded-2xl">
          <p className="font-bold text-[#e17055] mb-2">Held for manual review</p>
          <p className="text-sm text-[#5a6a7a] leading-relaxed">Bank account details for this dealer have changed since the last verified payment. The payment has been stopped pending investigation. Our fraud team will contact you within 2 hours. Reference: FRD-{String(Date.now()).slice(-6)}.</p>
        </div>
      )}
      {!started && <Button onClick={runSettlement} size="lg" className="w-full">Begin settlement</Button>}
      {done && (
        <div className="animate-fade-up">
          <Button onClick={() => dispatch({ type: 'SET_STEP', step: 5 })} size="lg" className="w-full">View confirmation</Button>
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
    <div className="max-w-2xl mx-auto px-4 pb-16 pt-6">
      <div className="flex items-center gap-1.5 mb-6 overflow-x-auto pb-1">
        {SUBSTEPS.map((s, i) => (
          <div key={s.label} className="flex items-center gap-1.5 shrink-0">
            <div className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${i === subStep ? 'bg-[#0d1b2a] text-white' : i < subStep ? 'bg-[#00b894] text-white' : 'bg-[#ede8e1] text-[#5a6a7a]'}`}>{s.label}</div>
            {i < SUBSTEPS.length - 1 && <span className="text-[#ede8e1]">›</span>}
          </div>
        ))}
      </div>
      <div className="animate-fade-up" key={subStep}>{SUBSTEPS[subStep].component}</div>
    </div>
  );
}
