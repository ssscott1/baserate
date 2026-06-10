import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Button } from '../ui/Button';
import { Input, Select } from '../ui/Input';
import { Toggle } from '../ui/Toggle';
import { LoadingState } from '../ui/Spinner';
import { Tick } from '../ui/Tick';
import { mockCall } from '../../utils/mock';

function SubStepBar({ steps, current }) {
  return (
    <div className="flex items-center gap-1.5 mb-8 overflow-x-auto pb-1">
      {steps.map((s, i) => (
        <div key={s} className="flex items-center gap-1.5 shrink-0">
          <div className="px-3 py-1 rounded-lg text-[11px] font-semibold transition-all"
            style={{
              background: i === current ? '#1d1d1f' : i < current ? '#eef7f3' : '#f5f5f7',
              color: i === current ? 'white' : i < current ? '#007a5a' : '#adadb3',
            }}>
            {s}
          </div>
          {i < steps.length - 1 && <span className="text-[#d1d1d6] text-xs">›</span>}
        </div>
      ))}
    </div>
  );
}

function STitle({ title, sub }) {
  return (
    <div className="mb-7">
      <h2 className="text-[28px] font-bold text-[#1d1d1f] tracking-tight mb-2" style={{ letterSpacing: '-0.02em' }}>{title}</h2>
      {sub && <p className="text-[15px] text-[#6e6e73] leading-relaxed">{sub}</p>}
    </div>
  );
}

function CreateAccount({ onNext }) {
  const { state, dispatch } = useApp();
  const { application } = state;
  const [otpMode, setOtpMode] = useState(false);
  const [otp, setOtp] = useState('');
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const update = data => dispatch({ type: 'UPDATE_APPLICATION', data });
  const canSend = application.firstName && application.lastName && application.email && application.phone;

  const sendOtp = async () => {
    setSending(true);
    await mockCall(800, 1500);
    setSending(false); setOtpMode(true);
    dispatch({ type: 'ADD_LOG', actor: 'System', message: `OTP sent to ${application.phone}` });
  };
  const verifyOtp = async () => {
    if (otp.length < 6) return;
    setVerifying(true);
    await mockCall(800, 1400);
    setVerifying(false);
    dispatch({ type: 'UPDATE_APPLICATION', data: { otpVerified: true } });
    dispatch({ type: 'ADD_LOG', actor: 'System', message: 'Phone number verified via OTP' });
    onNext();
  };

  return (
    <div className="flex flex-col gap-6">
      <STitle title="Create your account" sub="We'll keep your application secure." />
      <div className="grid grid-cols-2 gap-4">
        <Input label="First name" value={application.firstName} onChange={v => update({ firstName: v })} placeholder="Alex" />
        <Input label="Last name" value={application.lastName} onChange={v => update({ lastName: v })} placeholder="Chen" />
      </div>
      <Input label="Email address" value={application.email} onChange={v => update({ email: v })} type="email" placeholder="alex@example.com" />
      <Input label="Mobile number" value={application.phone} onChange={v => update({ phone: v })} type="tel" placeholder="0412 345 678" />
      {!otpMode && (
        <Button onClick={sendOtp} disabled={!canSend || sending} size="lg" className="w-full">
          {sending ? 'Sending code…' : 'Send verification code →'}
        </Button>
      )}
      {otpMode && !application.otpVerified && (
        <div className="animate-fade-up bg-[#eef7f3] border border-[#d1ede4] rounded-2xl p-6">
          <p className="font-semibold text-[#1d1d1f] mb-1">Enter your verification code</p>
          <p className="text-sm text-[#6e6e73] mb-5">Sent to {application.phone}. Demo — enter any 6 digits.</p>
          <Input value={otp} onChange={setOtp} placeholder="000000" />
          <Button onClick={verifyOtp} disabled={otp.length < 6 || verifying} size="lg" className="w-full mt-4">
            {verifying ? 'Verifying…' : 'Verify code →'}
          </Button>
        </div>
      )}
    </div>
  );
}

function CreditGuide({ onNext }) {
  const { dispatch } = useApp();
  return (
    <div className="flex flex-col gap-6">
      <STitle title="Credit Guide" sub="Required by law. Please read before continuing." />
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-[rgba(0,0,0,0.06)]">
          <p className="font-bold text-[#1d1d1f] text-[17px]">Baserate Financial Services Pty Ltd</p>
          <p className="text-sm text-[#86868b] mt-0.5">ACL [000000] · ABN [00 000 000 000]</p>
        </div>
        {[
          { title: 'Who we are', body: 'Baserate acts as a credit intermediary. We assess your financial situation and match you to the most suitable lender from our accredited panel. We are required to act in your best interests.' },
          { title: 'How we are paid', body: 'We are paid a volume-based fee by the lender we place your loan with. We do not charge you a broker fee. We do not receive commission based on rate or loan size — we have no incentive to push you to a higher rate.' },
          { title: 'Best Interests Duty', body: 'As a credit licensee, we have a statutory duty to act in your best interests when providing credit assistance. We recommend the product most suited to your needs, not the product that pays us more.' },
          { title: 'Complaints & AFCA', body: 'Contact us first at complaints@baserate.com.au. If unresolved within 30 days, you may escalate to AFCA at afca.org.au or 1800 931 678. Free to use.' },
        ].map((s, i, arr) => (
          <div key={s.title} className={`px-6 py-5 ${i < arr.length - 1 ? 'border-b border-[rgba(0,0,0,0.06)]' : ''}`}>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#86868b] mb-2">{s.title}</p>
            <p className="text-[15px] text-[#6e6e73] leading-relaxed">{s.body}</p>
          </div>
        ))}
      </div>
      <Button onClick={() => { dispatch({ type: 'ADD_LOG', actor: 'Applicant', message: 'Credit Guide acknowledged' }); onNext(); }} size="lg" className="w-full">
        I acknowledge this Credit Guide →
      </Button>
    </div>
  );
}

function PrivacyConsent({ onNext }) {
  const { dispatch } = useApp();
  const [consented, setConsented] = useState(false);
  return (
    <div className="flex flex-col gap-6">
      <STitle title="Privacy consent" sub="This is a separate consent — not bundled with your Credit Guide." />
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <p className="text-[15px] text-[#6e6e73] leading-relaxed mb-7">
          We collect your personal information to assess your creditworthiness, verify your identity, and provide credit assistance. Your information may be shared with our accredited lender panel, credit reporting bodies (Equifax, Experian), identity verification services (DVS), and government agencies as required by AML/CTF law. Data stored securely in Australia. Full Privacy Policy at baserate.com.au/privacy.
        </p>
        <Toggle checked={consented} onChange={setConsented}
          label="I consent to Baserate collecting, using and disclosing my personal information as described above"
          required
        />
      </div>
      <Button onClick={() => { dispatch({ type: 'ADD_LOG', actor: 'Applicant', message: 'Privacy consent given' }); onNext(); }} disabled={!consented} size="lg" className="w-full">
        Continue →
      </Button>
    </div>
  );
}

function Requirements({ onNext }) {
  const { state, dispatch } = useApp();
  const { application, quote } = state;
  const [features, setFeatures] = useState([]);
  const update = data => dispatch({ type: 'UPDATE_APPLICATION', data });
  const FEATURES = ['Fixed repayments', 'No ongoing fees', 'Early payout option', 'Redraw facility', 'Offset account'];
  const toggle = f => { const n = features.includes(f) ? features.filter(x => x !== f) : [...features, f]; setFeatures(n); update({ features: n }); };

  return (
    <div className="flex flex-col gap-7">
      <STitle title="Requirements & objectives" sub="Helps us identify the most suitable product for your situation." />
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-[#86868b] mb-4">Loan summary</p>
        <div className="grid grid-cols-2 gap-4">
          {[['Purpose', `${(quote.purpose || 'personal')} vehicle`], ['Amount', `$${quote.loanAmount?.toLocaleString()}`], ['Term', `${quote.term} months`], ['Sale type', 'Licensed dealer only']].map(([k, v]) => (
            <div key={k}><p className="text-xs text-[#86868b]">{k}</p><p className="font-mono font-semibold text-[#1d1d1f] text-[15px]">{v}</p></div>
          ))}
        </div>
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-[#86868b] mb-4">Features that matter to you</p>
        <div className="flex flex-col gap-2">
          {FEATURES.map(f => (
            <label key={f} className="flex items-center gap-3 p-4 rounded-xl bg-white shadow-sm cursor-pointer transition-all border"
              style={{ borderColor: features.includes(f) ? '#d1ede4' : 'rgba(0,0,0,0)', background: features.includes(f) ? '#eef7f3' : 'white' }}>
              <input type="checkbox" checked={features.includes(f)} onChange={() => toggle(f)} className="w-4 h-4 accent-[#007a5a]" />
              <span className="text-[15px] text-[#1d1d1f]">{f}</span>
            </label>
          ))}
        </div>
      </div>
      <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col gap-5">
        <Toggle checked={application.balloon} onChange={v => update({ balloon: v })} label="Balloon / residual payment" description="A lump sum at end of term — lowers monthly repayments" />
        <div className="border-t border-[rgba(0,0,0,0.06)] pt-5">
          <Toggle checked={application.earlyPayout} onChange={v => update({ earlyPayout: v })} label="May need to payout early" description="We'll filter lenders with no early-payout fee" />
        </div>
      </div>
      <Button onClick={() => { dispatch({ type: 'ADD_LOG', actor: 'Applicant', message: 'Requirements and objectives submitted' }); onNext(); }} size="lg" className="w-full">
        Continue to identity verification →
      </Button>
    </div>
  );
}

function IDVerification({ onNext }) {
  const { dispatch } = useApp();
  const [phase, setPhase] = useState('upload');
  const [progress, setProgress] = useState(0);

  const handleUpload = async () => {
    setPhase('scanning');
    dispatch({ type: 'ADD_LOG', actor: 'System', message: 'Licence image uploaded — running DVS check' });
    let p = 0;
    const iv = setInterval(() => { p += 10; setProgress(Math.min(p, 92)); if (p >= 92) clearInterval(iv); }, 160);
    await mockCall(1400, 2000);
    clearInterval(iv); setProgress(100);
    await new Promise(r => setTimeout(r, 400));
    setPhase('selfie');
  };

  const handleSelfie = async () => {
    setPhase('verifying');
    dispatch({ type: 'ADD_LOG', actor: 'System', message: 'Liveness check initiated' });
    await mockCall(1800, 2500);
    setPhase('done');
    dispatch({ type: 'UPDATE_APPLICATION', data: { idVerified: true } });
    dispatch({ type: 'ADD_LOG', actor: 'System', message: 'Identity verified — DVS match confirmed, liveness passed' });
  };

  if (phase === 'scanning') return (
    <div className="flex flex-col gap-6">
      <STitle title="Scanning your licence…" />
      <div className="bg-white rounded-2xl shadow-sm p-8">
        <div className="aspect-video bg-[#f5f5f7] rounded-xl mb-6 flex items-center justify-center">
          <span className="text-6xl">🪪</span>
        </div>
        <div className="h-[3px] bg-[#e5e5e7] rounded-full overflow-hidden mb-3">
          <div className="h-full bg-[#1d1d1f] rounded-full transition-all duration-150" style={{ width: `${progress}%` }} />
        </div>
        <p className="text-sm text-[#86868b] text-center">Verifying against DVS…</p>
      </div>
    </div>
  );

  if (phase === 'selfie') return (
    <div className="flex flex-col gap-6 animate-fade-up">
      <STitle title="Liveness check" sub="A quick selfie to confirm you're the licence holder." />
      <div className="bg-white rounded-2xl shadow-sm p-10 flex flex-col items-center gap-6">
        <div className="w-36 h-36 rounded-full border-2 border-[rgba(0,0,0,0.1)] flex items-center justify-center bg-[#f5f5f7]">
          <span className="text-6xl">🤳</span>
        </div>
        <div className="text-center">
          <p className="font-semibold text-[#1d1d1f] mb-1">Position your face in the circle</p>
          <p className="text-sm text-[#86868b]">Simulated camera — demo mode</p>
        </div>
        <Button onClick={handleSelfie} size="lg" className="w-full max-w-xs">Take selfie & verify →</Button>
      </div>
    </div>
  );

  if (phase === 'verifying') return <LoadingState message="Verifying your identity…" submessage="Checking against the Document Verification Service (DVS)" />;

  if (phase === 'done') return (
    <div className="flex flex-col gap-6 animate-fade-up">
      <div className="flex items-center gap-4 p-6 bg-[#eef7f3] border border-[#d1ede4] rounded-2xl">
        <Tick size={32} />
        <div><p className="font-semibold text-[#1d1d1f]">Identity verified</p><p className="text-sm text-[#6e6e73]">DVS match confirmed · Liveness passed</p></div>
      </div>
      <Button onClick={onNext} size="lg" className="w-full">Continue →</Button>
    </div>
  );

  return (
    <div className="flex flex-col gap-6">
      <STitle title="Verify your identity" sub="We'll read your details from your licence and check them against the DVS." />
      <div className="bg-white rounded-2xl shadow-sm p-10 flex flex-col items-center gap-5 text-center border-2 border-dashed border-[rgba(0,0,0,0.08)]">
        <span className="text-6xl">🪪</span>
        <div>
          <p className="font-semibold text-[#1d1d1f] mb-1">Photo of your driver's licence</p>
          <p className="text-sm text-[#86868b]">Australian licence · front side</p>
        </div>
        <Button onClick={handleUpload} variant="secondary">Upload licence photo</Button>
        <p className="text-xs text-[#adadb3]">Demo: tap to simulate</p>
      </div>
    </div>
  );
}

function ConfirmDetails({ onFinish }) {
  const { state, dispatch } = useApp();
  const { application } = state;
  const [confirmed, setConfirmed] = useState(false);
  const fields = [
    { label: 'Full name', value: `${application.firstName || 'Alex'} ${application.lastName || 'Chen'}` },
    { label: 'Date of birth', value: application.dob },
    { label: 'Address', value: application.address },
    { label: 'Licence number', value: application.licenceNumber },
    { label: 'Licence expiry', value: application.licenceExpiry },
    { label: 'Residency', value: application.residency },
  ];
  return (
    <div className="flex flex-col gap-6">
      <STitle title="Confirm your details" sub="Pre-filled from your licence scan — please check everything is correct." />
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {fields.map((f, i) => (
          <div key={f.label} className={`flex justify-between items-center px-6 py-4 ${i < fields.length - 1 ? 'border-b border-[rgba(0,0,0,0.06)]' : ''}`}>
            <span className="text-sm text-[#86868b]">{f.label}</span>
            <span className="text-[15px] font-mono font-semibold text-[#1d1d1f]">{f.value}</span>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <Toggle checked={confirmed} onChange={setConfirmed} label="I confirm these details are correct and current" required />
      </div>
      <Button onClick={() => { dispatch({ type: 'ADD_LOG', actor: 'Applicant', message: 'Identity details confirmed as correct' }); onFinish(); }} disabled={!confirmed} size="lg" className="w-full">
        Continue to finances →
      </Button>
    </div>
  );
}

export function Step2Application() {
  const { dispatch } = useApp();
  const [subStep, setSubStep] = useState(0);
  const next = () => setSubStep(s => s + 1);
  const SUBSTEPS = [
    { label: 'Account',      component: <CreateAccount onNext={next} /> },
    { label: 'Credit Guide', component: <CreditGuide onNext={next} /> },
    { label: 'Privacy',      component: <PrivacyConsent onNext={next} /> },
    { label: 'Requirements', component: <Requirements onNext={next} /> },
    { label: 'Verify ID',    component: <IDVerification onNext={next} /> },
    { label: 'Confirm',      component: <ConfirmDetails onFinish={() => dispatch({ type: 'SET_STEP', step: 2 })} /> },
  ];
  return (
    <div className="max-w-2xl mx-auto px-6 pb-24 pt-8">
      <SubStepBar steps={SUBSTEPS.map(s => s.label)} current={subStep} />
      <div className="animate-fade-up" key={subStep}>{SUBSTEPS[subStep].component}</div>
    </div>
  );
}
