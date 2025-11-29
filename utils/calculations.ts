import { UserInputs, CalculationResult } from '../types';

export const calculateRetirement = (inputs: UserInputs): CalculationResult => {
  const {
    currentAge,
    retirementAge,
    currentSavings,
    monthlySavings,
    monthlyExpensesCurrent,
    inflationRate,
    investmentReturnRate,
    postRetirementReturnRate,
    lifeExpectancy
  } = inputs;

  const yearsToRetire = Math.max(0, retirementAge - currentAge);
  const monthsToRetire = yearsToRetire * 12;
  const retirementDuration = Math.max(0, lifeExpectancy - retirementAge);

  // 1. Calculate Future Value of Monthly Expenses at Retirement Age
  const monthlyNeededFuture = monthlyExpensesCurrent * Math.pow(1 + inflationRate / 100, yearsToRetire);

  // 2. Calculate Total Corpus Needed at Retirement
  const realRatePost = ((1 + postRetirementReturnRate / 100) / (1 + inflationRate / 100)) - 1;
  
  let totalNeeded = 0;
  
  if (Math.abs(realRatePost) < 0.0001) {
    totalNeeded = monthlyNeededFuture * 12 * retirementDuration;
  } else {
    const annualExpense = monthlyNeededFuture * 12;
    totalNeeded = annualExpense * ((1 - Math.pow(1 + realRatePost, -retirementDuration)) / realRatePost) * (1 + realRatePost);
  }

  // 3. Project Savings to Retirement Age (Lump Sum + Monthly Contributions)
  
  // 3a. FV of Current Savings (Lump Sum) - assuming annual compounding for simplicity/alignment with user input
  const fvLumpSum = currentSavings * Math.pow(1 + investmentReturnRate / 100, yearsToRetire);

  // 3b. FV of Monthly Savings (Annuity)
  // Formula: PMT * (((1 + r)^n - 1) / r)
  const monthlyRate = (investmentReturnRate / 100) / 12;
  let fvMonthlyContributions = 0;

  if (monthsToRetire > 0) {
    if (monthlyRate === 0) {
      fvMonthlyContributions = monthlySavings * monthsToRetire;
    } else {
      fvMonthlyContributions = monthlySavings * (Math.pow(1 + monthlyRate, monthsToRetire) - 1) / monthlyRate;
    }
  }

  const totalProjectedSavings = fvLumpSum + fvMonthlyContributions;

  // 4. Calculate Gap and Additional Savings Needed
  const gap = Math.max(0, totalNeeded - totalProjectedSavings);
  const isAchievable = gap <= 0;

  let additionalMonthlySavingsNeeded = 0;
  if (gap > 0 && monthsToRetire > 0) {
     if (monthlyRate === 0) {
        additionalMonthlySavingsNeeded = gap / monthsToRetire;
     } else {
        // Solve for PMT in FV = PMT * ...
        // PMT = FV * r / ((1+r)^n - 1)
        additionalMonthlySavingsNeeded = gap * monthlyRate / (Math.pow(1 + monthlyRate, monthsToRetire) - 1);
     }
  }

  // 5. Generate Chart Data
  const yearlyData = [];
  let currentSimulatedSavings = currentSavings;
  
  for (let age = currentAge; age <= lifeExpectancy; age++) {
    const yearIndex = age - currentAge;
    
    let dataPoint = {
      age,
      savings: 0,
      target: 0
    };

    if (age <= retirementAge) {
      // Accumulation Phase
      if (age === currentAge) {
        currentSimulatedSavings = currentSavings;
      } else {
        // Add annual return
        currentSimulatedSavings = currentSimulatedSavings * (1 + investmentReturnRate / 100);
        // Add annual contribution (Simplified: assuming end of year contributions or spread out)
        // To be closer to the monthly formula, we approximate:
        currentSimulatedSavings += (monthlySavings * 12) * (1 + (investmentReturnRate / 100) / 2); 
        // ^ Note: Adding half-year interest to contributions is a common simple approximation for monthly contributions
      }
      dataPoint.savings = Math.round(currentSimulatedSavings);
      
      if (age === retirementAge) {
          dataPoint.target = Math.round(totalNeeded);
      }
    } else {
      // Decumulation Phase
      const yearsInRetirement = age - retirementAge;
      const expenseThisYear = (monthlyNeededFuture * 12) * Math.pow(1 + inflationRate/100, yearsInRetirement);
      
      currentSimulatedSavings = (currentSimulatedSavings * (1 + postRetirementReturnRate / 100)) - expenseThisYear;
      dataPoint.savings = Math.round(currentSimulatedSavings);
    }
    
    yearlyData.push(dataPoint);
  }

  return {
    totalNeeded: Math.round(totalNeeded),
    monthlyNeededFuture: Math.round(monthlyNeededFuture),
    gap: Math.round(gap),
    isAchievable,
    savingsAtRetirement: Math.round(totalProjectedSavings),
    additionalMonthlySavingsNeeded: Math.round(additionalMonthlySavingsNeeded),
    yearsToFreedom: yearsToRetire,
    yearlyData
  };
};