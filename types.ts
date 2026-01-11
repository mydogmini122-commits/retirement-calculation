
export enum RiskProfile {
  CONSERVATIVE = '保守型',
  MODERATE = '穩健型',
  AGGRESSIVE = '積極型'
}

export type Gender = '男' | '女';

export interface UserInputs {
  currentAge: number;
  gender: Gender;
  retirementAge: number;
  currentSavings: number;
  monthlySavings: number;
  monthlyExpensesCurrent: number;
  inflationRate: number;
  investmentReturnRate: number;
  postRetirementReturnRate: number;
  lifeExpectancy: number;
}

export interface CalculationResult {
  totalNeeded: number;
  monthlyNeededFuture: number;
  gap: number;
  isAchievable: boolean;
  savingsAtRetirement: number;
  additionalMonthlySavingsNeeded: number;
  yearsToFreedom: number;
  yearlyData: Array<{
    age: number;
    savings: number;
    target: number;
  }>;
}

export interface AssetAllocationItem {
  name: string;
  value: number;
  color: string;
  description?: string;
  risk: string; 
  expectedReturn: string; 
  riskDetail: string;
  historicalPerformance: string;
}

export interface AIAdviceResponse {
  summary: string;
  allocation: AssetAllocationItem[];
  actionableSteps: string[];
  riskAnalysis: string;
  passiveIncomeSuggestions: string[];
  // Fix: Added optional professional fields to support dual-persona analysis and avoid TS errors
  professionalAnalysis?: string;
  professionalSuggestions?: string[];
}
