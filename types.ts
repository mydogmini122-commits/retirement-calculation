
export enum RiskProfile {
  CONSERVATIVE = '保守型',
  MODERATE = '穩健型',
  AGGRESSIVE = '積極型'
}

export interface UserInputs {
  currentAge: number;
  retirementAge: number;
  currentSavings: number;
  monthlySavings: number; // New field: Monthly contribution
  monthlyExpensesCurrent: number; // Current value of monthly expenses
  inflationRate: number; // Percentage
  investmentReturnRate: number; // Percentage (Pre-retirement)
  postRetirementReturnRate: number; // Percentage (Post-retirement)
  lifeExpectancy: number;
}

export interface CalculationResult {
  totalNeeded: number;
  monthlyNeededFuture: number;
  gap: number;
  isAchievable: boolean;
  savingsAtRetirement: number;
  additionalMonthlySavingsNeeded: number; // New field: Extra savings needed to close gap
  yearsToFreedom: number;
  yearlyData: Array<{
    age: number;
    savings: number;
    target: number;
  }>;
}

export interface AssetAllocationItem {
  name: string;
  value: number; // Percentage 0-100
  color: string;
  description?: string;
  
  // Simple Version (For 12yo / Lazy Package)
  risk: string; 
  expectedReturn: string; 
  
  // Professional Version (For Adult Report)
  riskDetail: string; // Detailed risk analysis (volatility, drawdown)
  historicalPerformance: string; // Historical CAGR, stats
}

export interface AIAdviceResponse {
  // Humorous / Simple Section
  summary: string;
  allocation: AssetAllocationItem[];
  actionableSteps: string[];
  riskAnalysis: string;
  passiveIncomeSuggestions: string[];
  
  // Professional / Adult Section
  professionalAnalysis: string; // Detailed macro/micro analysis
  professionalSuggestions: string[]; // Concrete, mature advice
}
