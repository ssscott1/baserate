import { createContext, useContext, useReducer } from 'react';

const initialState = {
  // Navigation
  currentStep: 0, // 0=quote, 1=application, 2=financial, 3=approval, 4=docs, 5=confirmation
  currentSubStep: 0,

  // Demo controls
  demoOutcome: 'approved', // 'approved' | 'refer' | 'fraud'
  demoPanelOpen: false,

  // Quote data
  quote: {
    purpose: '', // 'personal' | 'business'
    hasABN: false,
    abn: '',
    loanAmount: 35000,
    term: 60,
    vehicleType: 'passenger',
    income: 95000,
    expenses: 28000,
  },

  // Application data
  application: {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    otpVerified: false,
    creditGuideAcknowledged: false,
    privacyConsented: false,
    purpose: '',
    amount: 35000,
    term: 60,
    features: [],
    balloon: false,
    earlyPayout: false,
    idVerified: false,
    dob: '15/03/1988',
    address: '42 Harbour View Tce, Sydney NSW 2000',
    licenceNumber: 'NSW12345678',
    licenceExpiry: '03/2028',
    residency: 'Australian Citizen',
  },

  // Financial data
  financial: {
    bankConnected: false,
    manualEntry: false,
    income: 0,
    expenses: 0,
    existingDebts: 0,
    housingStatus: '',
    hasInvestmentProperty: false,
    creditCheckConsented: false,
    amlPassed: false,
  },

  // Approval data
  approval: {
    status: null, // 'pending' | 'approved' | 'refer' | 'fraud'
    approvedRate: 6.49,
    approvedAmount: 35000,
    monthlyRepayment: 677,
    lenders: [],
  },

  // Documentation
  docs: {
    creditProposalAcknowledged: false,
    contractViewed: false,
    signed: false,
    signatureTimestamp: null,
    dealerName: '',
    dealerABN: '',
    dealerLicence: '',
    vehicleMake: '',
    vehicleModel: '',
    vehicleVIN: '',
    invoiceAmount: 0,
    invoiceApproved: false,
  },

  // Activity log
  activityLog: [],
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, currentStep: action.step, currentSubStep: 0 };
    case 'SET_SUB_STEP':
      return { ...state, currentSubStep: action.subStep };
    case 'SET_DEMO_OUTCOME':
      return { ...state, demoOutcome: action.outcome };
    case 'TOGGLE_DEMO_PANEL':
      return { ...state, demoPanelOpen: !state.demoPanelOpen };
    case 'UPDATE_QUOTE':
      return { ...state, quote: { ...state.quote, ...action.data } };
    case 'UPDATE_APPLICATION':
      return { ...state, application: { ...state.application, ...action.data } };
    case 'UPDATE_FINANCIAL':
      return { ...state, financial: { ...state.financial, ...action.data } };
    case 'UPDATE_APPROVAL':
      return { ...state, approval: { ...state.approval, ...action.data } };
    case 'UPDATE_DOCS':
      return { ...state, docs: { ...state.docs, ...action.data } };
    case 'ADD_LOG':
      return {
        ...state,
        activityLog: [
          ...state.activityLog,
          {
            id: Date.now(),
            timestamp: new Date().toLocaleString('en-AU'),
            actor: action.actor || 'Applicant',
            action: action.message,
          },
        ],
      };
    case 'RESET':
      return { ...initialState, demoPanelOpen: false };
    default:
      return state;
  }
}

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
