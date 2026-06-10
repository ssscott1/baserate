import { AppProvider, useApp } from './context/AppContext';
import { ProgressBar } from './components/ProgressBar';
import { DemoControls } from './components/DemoControls';
import { Step1Quote } from './components/steps/Step1Quote';
import { Step2Application } from './components/steps/Step2Application';
import { Step3Financial } from './components/steps/Step3Financial';
import { Step4Approval } from './components/steps/Step4Approval';
import { Step5Settlement } from './components/steps/Step5Settlement';
import { ConfirmationHub } from './components/steps/ConfirmationHub';

const STEPS = [Step1Quote, Step2Application, Step3Financial, Step4Approval, Step5Settlement, ConfirmationHub];

function AppInner() {
  const { state } = useApp();
  const StepComponent = STEPS[Math.min(state.currentStep, 5)] || Step1Quote;

  return (
    <div className="min-h-screen" style={{ background: '#f5f5f7' }}>
      <ProgressBar />
      <main>
        <StepComponent key={state.currentStep} />
      </main>
      <DemoControls />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppInner />
    </AppProvider>
  );
}
