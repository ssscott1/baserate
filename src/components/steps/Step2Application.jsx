import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Input, Select } from '../ui/Input';
import { Toggle } from '../ui/Toggle';
import { LoadingState } from '../ui/Spinner';
import { Tick } from '../ui/Tick';
import { mockCall } from '../../utils/mock';

function SubStepBar({ steps, current }) {
  return (
    <div className="flex items-center gap-1.5 mb-7 overflow-x-auto pb-1 scrollbar-hide">
      {steps.map((s, i) => (
        <div key={s} className="flex items-center gap-1.5 shrink-0">
          <div
            className="px-3 py-1 rounded-lg text-[11px] font-semibold transition-all"
            style={{
              background: i === current ? 'rgba(0,229,160,0.12)' : i < current ? 'rgba(255,255,255,0.06)' : 'transparent',
              color: i === current ? '#00e5a0' : i < current ? '#9898b0' : '#3a3a50',
              border: i === current ? '1px solid rgba(0,229,160,0.25)' : '1px solid transparent',
            }}
          >
            {s}
          </div>
          {i < steps.length - 1 && <span className="text-[#2a2a3a] text-xs">›</span>}
        </div>
      ))}
    </div>
  );
}

function SectionTitle({ title, sub }) {
  return (
    <div className="mb-5">
      <h2 className="text-2xl font-bold text-[#f0f0f6] tracking-tight mb-1">{title}</h2>
      {sub && <p className="text-sm text-[#9898b0]">{sub}</p>}
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

  const sendOtp = async () => {
    setSending(true);
    await mockCall(800, 1500);
    setSending(false);
    setOtpMode(true);
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

  const canSend = application.firstName && application.lastName && application.email && application.phone;

  return (
    <div className="flex flex-col gap-5">
      <SectionTitle title="Create your account" sub="We'll keep your application secure." />
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
        <div className="animate-fade-up rounded-xl p-5" style={{ background: 'rgba(0,229,160,0.05)', border: '1px solid rgba(0,229,160,0.2)' }}>
          <p className="text-sm font-semibold text-[#f0f0f6] mb-1">Enter your verification code</p>
          <p className="text-xs text-[#5c5c72] mb-4">Sent to {application.phone}. Demo — enter any 6 digits.</p>
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
    <div className="flex flex-col gap-5">
      <SectionTitle title="Credit Guide" sub="Required by law. Please read before continuing." />
      <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="px-5 py-4" style={{ background: '#0e0e18', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <p className="font-bold text-[#f0f0f6]">Baserate Financial Services Pty Ltd</p>
          <p className="text-sm text-[#5c5c72]">ACL [000000] · ABN [00 000 000 000]</p>
        </div>
        {[
          { title: 'Who we are', body: 'Baserate acts as a credit intermediary. We assess your financial situation and match you to the most suitable lender from our accredited panel. We are required to act in your best interests.' },
          { title: 'How we are paid', body: 'We are paid a volume-based fee by the lender we place your loan with. We do not charge you a broker fee. We do not receive commission based on rate or loan size — we have no incentive to push you to a higher rate.' },
          { title: 'Best Interests Duty', body: 'As a credit licensee, we have a statutory duty to act in your best interests when providing credit assistance. We recommend the product most suited to your needs, not the product that pays us more.' },
          { title: 'Complaints & AFCA', body: 'Contact us first at complaints@baserate.com.au. If unresolved within 30 days, you may escalate to AFCA (Australian Financial Complaints Authority) at afca.org.au or 1800 931 678. Free to use.' },
        ].map(s => (
          <div key={s.title} className="px-5 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: '#0a0a12' }}>
            <p className="text-xs font-bold uppercase tracking-widest text-[#5c5c72] mb-1.5">{s.title}</p>
            <p className="text-sm text-[#9898b0] leading-relaxed">{s.body}</p>
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
    <div className="flex flex-col gap-5">
      <SectionTitle title="Privacy consent" sub="This is separate from your Credit Guide acknowledgement." />
      <div className="rounded-xl p-5" style={{ background: '#0e0e18', border: '1px solid rgba(255,255,255,0.08)' }}>
        <p className="text-sm text-[#9898b0] leading-relaxed mb-5">
          We collect your personal information to assess your creditworthiness, verify your identity, and provide credit assistance. Your information may be shared with: our accredited lender panel, credit reporting bodies (Equifax, Experian), identity verification services (DVS), and government agencies as required by AML/CTF law. Data stored securely in Australia. Full Privacy Policy at baserate.com.au/privacy.
        </p>
        <Toggle
          checked={consented}
          onChange={setConsented}
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
  const toggleFeature = f => {
    const next = features.includes(f) ? features.filter(x => x !== f) : [...features, f];
    setFeatures(next);
    update({ features: next });
  };
  return (
    <div className="flex flex-col gap-5">
      <SectionTitle title="Requirements & objectives" sub="Helps us identify the most suitable product for your situation." />
      <div className="rounded-xl p-4" style={{ background: '#0e0e18', border: '1px solid rgba(255,255,255,0.08)' }}>
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#5c5c72] mb-3">Loan summary</p>
        <div className="grid grid-cols-2 gap-3">
          {[['Purpose', (quote.purpose || 'personal') + ' vehicle'], ['Amount', `$${quote.loanAmount?.toLocaleString()}`], ['Term', `${quote.term} months`], ['Dealer purchase', 'Licensed only']].map(([k, v]) => (
            <div key={k}><p className="text-xs text-[#5c5c72]">{k}</p><p className="font-mono font-semibold text-[#f0f0f6] text-sm">{v}</p></div>
          ))}
        </div>
      </div>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#5c5c72] mb-3">Features that matter to you</p>
        <div className="flex flex-col gap-2">
          {FEATURES.map(f => (
            <label key={f} className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all"
              style={{ background: features.includes(f) ? 'rgba(0,229,160,0.06)' : 'rgba(255,255,255,0.03)', border: features.includes(f) ? '1px solid rgba(0,229,160,0.3)' : '1px solid rgba(255,255,255,0.07)' }}>
              <input type="checkbox" checked={features.includes(f)} onChange={() => toggleFeature(f)} className="w-4 h-4 accent-[#00e5a0]" />
              <span className="text-sm text-[#f0f0f6]">{f}</span>
            </label>
          ))}
        </div>
      </div>
      <Toggle checked={application.balloon} onChange={v => update({ balloon: v })} label="Balloon / residual payment" description="A lump sum at end of term — lowers monthly repayments" />
      <Toggle checked={application.earlyPayout} onChange={v => update({ earlyPayout: v })} label="May need to payout early" description="We'll filter for suitable lenders" />
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
    await new Promise(r => setTimeout(r, 300));
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
    <div className="flex flex-col gap-5">
      <SectionTitle title="Scanning your licence…" />
      <div className="rounded-xl p-6" style={{ background: '#0a0a12', border: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="aspect-video rounded-xl mb-4 flex items-center justify-center relative overflow-hidden" style={{ background: '#141421' }}>
          <div className="absolute inset-x-0 h-0.5 animate-bounce" style={{ background: 'linear-gradient(90deg, transparent, #00e5a0, transparent)', top: `${progress}%`, boxShadow: '0 0 12px rgba(0,229,160,0.6)' }} />
          <span className="text-5xl">🪪</span>
        </div>
        <div className="h-0.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
          <div className="h-full rounded-full transition-all duration-150" style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #00e5a0, #00c88a)', boxShadow: '0 0 8px rgba(0,229,160,0.5)' }} />
        </div>
        <p className="text-xs text-[#5c5c72] mt-2 text-center">Verifying against DVS…</p>
      </div>
    </div>
  );

  if (phase === 'selfie') return (
    <div className="flex flex-col gap-5 animate-fade-up">
      <SectionTitle title="Liveness check" sub="Quick selfie to confirm you're the licence holder." />
      <div className="rounded-2xl p-8 flex flex-col items-center gap-5" style={{ background: '#0a0a12', border: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="w-36 h-36 rounded-full flex items-center justify-center" style={{ border: '2px solid rgba(0,229,160,0.4)', boxShadow: '0 0 24px rgba(0,229,160,0.15)' }}>
          <span className="text-6xl">🤳</span>
        </div>
        <div className="text-center">
          <p className="font-semibold text-[#f0f0f6] mb-1">Position your face in the circle</p>
          <p className="text-xs text-[#5c5c72]">Simulated camera — demo mode</p>
        </div>
        <Button onClick={handleSelfie} size="lg" className="w-full max-w-xs">Take selfie & verify →</Button>
      </div>
    </div>
  );

  if (phase === 'verifying') return <LoadingState message="Verifying your identity…" submessage="Checking against Document Verification Service (DVS)" />;

  if (phase === 'done') return (
    <div className="flex flex-col gap-5 animate-fade-up">
      <div className="flex items-center gap-4 p-5 rounded-xl" style={{ background: 'rgba(0,229,160,0.07)', border: '1px solid rgba(0,229,160,0.25)' }}>
        <Tick size={32} />
        <div><p className="font-semibold text-[#f0f0f6]">Identity verified</p><p className="text-sm text-[#5c5c72]">DVS match confirmed · Liveness passed</p></div>
      </div>
      <Button onClick={onNext} size="lg" className="w-full">Continue →</Button>
    </div>
  );

  return (
    <div className="flex flex-col gap-5">
      <SectionTitle title="Verify your identity" sub="We'll read your details from your licence and check against DVS." />
      <div className="rounded-xl p-8 flex flex-col items-center gap-4 text-center" style={{ background: '#0a0a12', border: '2px dashed rgba(255,255,255,0.08)' }}>
        <span className="text-5xl">🪪</span>
        <div>
          <p className="font-semibold text-[#f0f0f6] mb-1">Photo of your driver's licence</p>
          <p className="text-sm text-[#5c5c72]">Australian licence — front side</p>
        </div>
        <Button onClick={handleUpload} variant="secondary">Upload licence photo</Button>
        <p className="text-xs text-[#3a3a50]">Demo: tap to simulate upload</p>
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
    <div className="flex flex-col gap-5">
      <SectionTitle title="Confirm your details" sub="Pre-filled from your licence scan — please check everything is correct." />
      <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
        {fields.map((f, i) => (
          <div key={f.label} className="flex justify-between items-center px-5 py-3.5" style={{ borderBottom: i < fields.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none', background: '#0e0e18' }}>
            <span className="text-sm text-[#5c5c72]">{f.label}</span>
            <span className="text-sm font-mono font-medium text-[#f0f0f6]">{f.value}</span>
          </div>
        ))}
      </div>
      <Toggle checked={confirmed} onChange={setConfirmed} label="I confirm these details are correct and current" required />
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
    { label: 'Account', component: <CreateAccount onNext={next} /> },
    { label: 'Credit Guide', component: <CreditGuide onNext={next} /> },
    { label: 'Privacy', component: <PrivacyConsent onNext={next} /> },
    { label: 'Requirements', component: <Requirements onNext={next} /> },
    { label: 'Verify ID', component: <IDVerification onNext={next} /> },
    { label: 'Confirm', component: <ConfirmDetails onFinish={() => dispatch({ type: 'SET_STEP', step: 2 })} /> },
  ];
  return (
    <div className="max-w-2xl mx-auto px-5 pb-20 pt-6">
      <SubStepBar steps={SUBSTEPS.map(s => s.label)} current={subStep} />
      <div className="animate-fade-up" key={subStep}>{SUBSTEPS[subStep].component}</div>
    </div>
  );
}
