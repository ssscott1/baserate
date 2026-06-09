import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Input, Select } from '../ui/Input';
import { Toggle } from '../ui/Toggle';
import { LoadingState } from '../ui/Spinner';
import { Tick } from '../ui/Tick';
import { mockCall } from '../../utils/mock';

// Sub-step 0: Account creation
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
      <div>
        <h2 className="font-serif text-2xl font-semibold text-[#0d1b2a] mb-1">Create your account</h2>
        <p className="text-sm text-[#5a6a7a]">We'll use this to keep your application secure.</p>
      </div>

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
        <div className="animate-fade-up">
          <Card className="p-5 border-2 border-[#00b894]/30 bg-[#00b894]/5">
            <p className="text-sm font-semibold text-[#0d1b2a] mb-1">Enter your verification code</p>
            <p className="text-xs text-[#5a6a7a] mb-4">We sent a 6-digit code to {application.phone}. (This is a demo — enter any 6 digits.)</p>
            <Input
              value={otp}
              onChange={setOtp}
              placeholder="000000"
              className="font-mono text-center tracking-widest text-2xl"
            />
            <Button onClick={verifyOtp} disabled={otp.length < 6 || verifying} size="lg" className="w-full mt-4">
              {verifying ? 'Verifying…' : 'Verify code →'}
            </Button>
          </Card>
        </div>
      )}
    </div>
  );
}

// Sub-step 1: Credit Guide
function CreditGuide({ onNext }) {
  const { dispatch } = useApp();

  const acknowledge = () => {
    dispatch({ type: 'UPDATE_APPLICATION', data: { creditGuideAcknowledged: true } });
    dispatch({ type: 'ADD_LOG', actor: 'Applicant', message: 'Credit Guide acknowledged' });
    onNext();
  };

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="font-serif text-2xl font-semibold text-[#0d1b2a] mb-1">Credit Guide</h2>
        <p className="text-sm text-[#5a6a7a]">Please read before continuing. Required by law.</p>
      </div>

      <Card className="p-5 border-2 border-[#ede8e1]">
        <div className="flex flex-col gap-4 text-sm text-[#0d1b2a]">
          <div className="pb-4 border-b border-[#ede8e1]">
            <p className="font-bold text-base mb-1">Baserate Financial Services Pty Ltd</p>
            <p className="text-[#5a6a7a]">Australian Credit Licence No. ACL [000000]</p>
            <p className="text-[#5a6a7a]">ABN [00 000 000 000]</p>
          </div>
          <div>
            <p className="font-semibold mb-1">Who we are</p>
            <p className="text-[#5a6a7a] leading-relaxed">Baserate acts as a credit intermediary. We assess your financial situation and match you to the most suitable lender from our accredited panel. We are required to act in your best interests.</p>
          </div>
          <div>
            <p className="font-semibold mb-1">How we are paid</p>
            <p className="text-[#5a6a7a] leading-relaxed">We are paid a volume-based fee by the lender we place your loan with. We do not charge you a broker fee. We do not receive commission based on rate or loan size — this means we have no incentive to push you to a higher rate.</p>
          </div>
          <div>
            <p className="font-semibold mb-1">Best Interests Duty</p>
            <p className="text-[#5a6a7a] leading-relaxed">As a credit licensee, we have a duty to act in your best interests when providing credit assistance. We will recommend the product most suited to your needs and objectives, not the product that pays us more.</p>
          </div>
          <div>
            <p className="font-semibold mb-1">Complaints & dispute resolution</p>
            <p className="text-[#5a6a7a] leading-relaxed">If you have a complaint, contact us first at complaints@baserate.com.au. If unresolved within 30 days, you may escalate to the Australian Financial Complaints Authority (AFCA) at www.afca.org.au or 1800 931 678. AFCA is free to you.</p>
          </div>
        </div>
      </Card>

      <Button onClick={acknowledge} size="lg" className="w-full">
        I acknowledge this Credit Guide →
      </Button>
    </div>
  );
}

// Sub-step 2: Privacy consent
function PrivacyConsent({ onNext }) {
  const { state, dispatch } = useApp();
  const [consented, setConsented] = useState(false);

  const proceed = () => {
    dispatch({ type: 'UPDATE_APPLICATION', data: { privacyConsented: true } });
    dispatch({ type: 'ADD_LOG', actor: 'Applicant', message: 'Privacy and data collection consent given' });
    onNext();
  };

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="font-serif text-2xl font-semibold text-[#0d1b2a] mb-1">Privacy consent</h2>
        <p className="text-sm text-[#5a6a7a]">This is separate from your Credit Guide acknowledgement.</p>
      </div>

      <Card className="p-5">
        <p className="text-sm text-[#5a6a7a] leading-relaxed mb-5">
          We collect your personal information to assess your creditworthiness, verify your identity, and provide you with credit assistance. Your information may be shared with: our accredited lender panel, credit reporting bodies (Equifax, Experian), identity verification services (DVS), and government agencies as required by AML/CTF law. We store your data securely in Australia. You may request access to your information at any time. Full Privacy Policy available at baserate.com.au/privacy.
        </p>
        <Toggle
          checked={consented}
          onChange={setConsented}
          label="I consent to Baserate collecting, using and disclosing my personal information as described above"
          required
        />
      </Card>

      <Button onClick={proceed} disabled={!consented} size="lg" className="w-full">
        Continue →
      </Button>
    </div>
  );
}

// Sub-step 3: Requirements & objectives
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
      <div>
        <h2 className="font-serif text-2xl font-semibold text-[#0d1b2a] mb-1">Requirements & objectives</h2>
        <p className="text-sm text-[#5a6a7a]">We use this to identify the most suitable product for your situation.</p>
      </div>

      <Card className="p-5">
        <div className="flex flex-col gap-4">
          <p className="text-sm font-semibold text-[#0d1b2a]">Loan purpose: <span className="font-normal text-[#5a6a7a] capitalize">{quote.purpose || 'personal'} vehicle purchase via licensed dealer</span></p>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#f8f4ef] rounded-lg p-3">
              <p className="text-xs text-[#5a6a7a]">Loan amount</p>
              <p className="font-mono font-semibold text-[#0d1b2a]">${quote.loanAmount?.toLocaleString()}</p>
            </div>
            <div className="bg-[#f8f4ef] rounded-lg p-3">
              <p className="text-xs text-[#5a6a7a]">Loan term</p>
              <p className="font-mono font-semibold text-[#0d1b2a]">{quote.term} months</p>
            </div>
          </div>
        </div>
      </Card>

      <div>
        <p className="text-sm font-semibold text-[#0d1b2a] mb-3">Features that matter to you</p>
        <div className="flex flex-col gap-2">
          {FEATURES.map(f => (
            <label key={f} className="flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all
              border-[#ede8e1] hover:border-[#b0c4d8]"
              style={features.includes(f) ? { borderColor: '#00b894', background: '#00b89408' } : {}}
            >
              <input
                type="checkbox"
                checked={features.includes(f)}
                onChange={() => toggleFeature(f)}
                className="w-4 h-4 accent-[#00b894]"
              />
              <span className="text-sm text-[#0d1b2a]">{f}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex gap-4">
        <Toggle
          checked={application.balloon}
          onChange={v => update({ balloon: v })}
          label="Balloon / residual payment"
          description="A lump sum at end of term — lowers monthly repayments"
        />
      </div>
      <Toggle
        checked={application.earlyPayout}
        onChange={v => update({ earlyPayout: v })}
        label="May need to payout early"
        description="Let us know so we can filter for suitable lenders"
      />

      <Button
        onClick={() => { dispatch({ type: 'ADD_LOG', actor: 'Applicant', message: 'Requirements and objectives submitted' }); onNext(); }}
        size="lg"
        className="w-full"
      >
        Continue to identity verification →
      </Button>
    </div>
  );
}

// Sub-step 4: ID verification
function IDVerification({ onNext }) {
  const { dispatch } = useApp();
  const [phase, setPhase] = useState('upload'); // upload | scanning | selfie | verifying | done
  const [progress, setProgress] = useState(0);

  const handleLicenceUpload = async () => {
    setPhase('scanning');
    dispatch({ type: 'ADD_LOG', actor: 'System', message: 'Licence image uploaded — running DVS check' });
    // Progress bar
    let p = 0;
    const interval = setInterval(() => {
      p += 12;
      setProgress(Math.min(p, 95));
      if (p >= 95) clearInterval(interval);
    }, 150);
    await mockCall(1400, 2000);
    clearInterval(interval);
    setProgress(100);
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

  if (phase === 'scanning') {
    return (
      <div className="flex flex-col gap-4">
        <h2 className="font-serif text-2xl font-semibold text-[#0d1b2a]">Scanning your licence…</h2>
        <div className="bg-white rounded-2xl p-6 border border-[#ede8e1]">
          <div className="aspect-video bg-[#f8f4ef] rounded-xl mb-4 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-1 bg-[#00b894]/30" style={{ transform: `translateY(${progress * 1.8}px)` }} />
            <div className="text-4xl">🪪</div>
          </div>
          <div className="h-2 bg-[#ede8e1] rounded-full overflow-hidden">
            <div className="h-full bg-[#00b894] transition-all duration-150 rounded-full" style={{ width: `${progress}%` }} />
          </div>
          <p className="text-xs text-[#5a6a7a] mt-2 text-center">Reading details via DVS…</p>
        </div>
      </div>
    );
  }

  if (phase === 'selfie') {
    return (
      <div className="flex flex-col gap-5 animate-fade-up">
        <div>
          <h2 className="font-serif text-2xl font-semibold text-[#0d1b2a] mb-1">Liveness check</h2>
          <p className="text-sm text-[#5a6a7a]">We need a quick selfie to confirm you're the licence holder.</p>
        </div>
        <div className="aspect-square max-w-xs mx-auto w-full bg-[#0d1b2a] rounded-2xl flex flex-col items-center justify-center gap-4">
          <div className="w-32 h-32 rounded-full border-4 border-[#00b894] border-dashed flex items-center justify-center">
            <span className="text-5xl">🤳</span>
          </div>
          <p className="text-white text-sm font-medium">Position your face in the circle</p>
          <p className="text-white/50 text-xs">(Simulated camera — demo mode)</p>
        </div>
        <Button onClick={handleSelfie} size="lg" className="w-full">
          Take selfie & verify →
        </Button>
      </div>
    );
  }

  if (phase === 'verifying') {
    return <LoadingState message="Verifying your identity…" submessage="Checking against Document Verification Service (DVS)" />;
  }

  if (phase === 'done') {
    return (
      <div className="flex flex-col gap-5 animate-fade-up">
        <div className="flex items-center gap-4 p-5 bg-[#00b894]/10 border border-[#00b894]/30 rounded-2xl">
          <Tick size={36} />
          <div>
            <p className="font-semibold text-[#0d1b2a]">Identity verified</p>
            <p className="text-sm text-[#5a6a7a]">DVS match confirmed • Liveness passed</p>
          </div>
        </div>
        <Button onClick={onNext} size="lg" className="w-full">
          Continue to confirm details →
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="font-serif text-2xl font-semibold text-[#0d1b2a] mb-1">Verify your identity</h2>
        <p className="text-sm text-[#5a6a7a]">We'll read your details from your licence and check them against the Document Verification Service.</p>
      </div>
      <div className="bg-[#f8f4ef] border-2 border-dashed border-[#ede8e1] rounded-2xl p-8 flex flex-col items-center gap-4">
        <span className="text-5xl">🪪</span>
        <div className="text-center">
          <p className="font-semibold text-[#0d1b2a]">Take a photo of your driver's licence</p>
          <p className="text-sm text-[#5a6a7a] mt-1">Australian licence only — front side</p>
        </div>
        <Button onClick={handleLicenceUpload} variant="secondary">
          Upload licence photo
        </Button>
        <p className="text-xs text-[#5a6a7a]">(Demo: tap to simulate upload)</p>
      </div>
    </div>
  );
}

// Sub-step 5: Confirm details
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
      <div>
        <h2 className="font-serif text-2xl font-semibold text-[#0d1b2a] mb-1">Confirm your details</h2>
        <p className="text-sm text-[#5a6a7a]">Pre-filled from your licence scan — please check everything is correct.</p>
      </div>

      <Card className="divide-y divide-[#f0f0f0]">
        {fields.map(f => (
          <div key={f.label} className="flex justify-between items-center px-5 py-3.5">
            <span className="text-sm text-[#5a6a7a]">{f.label}</span>
            <span className="text-sm font-medium text-[#0d1b2a] font-mono">{f.value}</span>
          </div>
        ))}
      </Card>

      <Toggle
        checked={confirmed}
        onChange={setConfirmed}
        label="I confirm these details are correct and current"
        required
      />

      <Button
        onClick={() => {
          dispatch({ type: 'ADD_LOG', actor: 'Applicant', message: 'Identity details confirmed as correct' });
          onFinish();
        }}
        disabled={!confirmed}
        size="lg"
        className="w-full"
      >
        Continue to finances →
      </Button>
    </div>
  );
}

// Main Step 2 component
export function Step2Application() {
  const { dispatch } = useApp();
  const [subStep, setSubStep] = useState(0);

  const next = () => setSubStep(s => s + 1);

  const goToFinances = () => {
    dispatch({ type: 'SET_STEP', step: 2 });
  };

  const SUBSTEPS = [
    { label: 'Account', component: <CreateAccount onNext={next} /> },
    { label: 'Credit Guide', component: <CreditGuide onNext={next} /> },
    { label: 'Privacy', component: <PrivacyConsent onNext={next} /> },
    { label: 'Requirements', component: <Requirements onNext={next} /> },
    { label: 'Verify ID', component: <IDVerification onNext={next} /> },
    { label: 'Confirm', component: <ConfirmDetails onFinish={goToFinances} /> },
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 pb-16 pt-6">
      {/* Sub-step indicator */}
      <div className="flex items-center gap-1.5 mb-6 overflow-x-auto pb-1">
        {SUBSTEPS.map((s, i) => (
          <div key={s.label} className="flex items-center gap-1.5 shrink-0">
            <div className={`px-3 py-1 rounded-full text-xs font-medium transition-all
              ${i === subStep ? 'bg-[#0d1b2a] text-white' : i < subStep ? 'bg-[#00b894] text-white' : 'bg-[#ede8e1] text-[#5a6a7a]'}
            `}>
              {s.label}
            </div>
            {i < SUBSTEPS.length - 1 && <span className="text-[#ede8e1]">›</span>}
          </div>
        ))}
      </div>

      <div className="animate-fade-up" key={subStep}>
        {SUBSTEPS[subStep].component}
      </div>
    </div>
  );
}
