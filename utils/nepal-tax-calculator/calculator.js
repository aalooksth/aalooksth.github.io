// calculator.js

export const TAX_RATES = {
  "2082_83": {
    single: [
      { limit: 500000, rate: 0.01, isSST: true },
      { limit: 700000, rate: 0.10 },
      { limit: 1000000, rate: 0.20 },
      { limit: 2000000, rate: 0.30 },
      { limit: 5000000, rate: 0.36 },
      { limit: Infinity, rate: 0.39 }
    ],
    married: [
      { limit: 600000, rate: 0.01, isSST: true },
      { limit: 800000, rate: 0.10 },
      { limit: 1100000, rate: 0.20 },
      { limit: 2000000, rate: 0.30 },
      { limit: 5000000, rate: 0.36 },
      { limit: Infinity, rate: 0.39 }
    ]
  },
  "2083_84": {
    // FY 2083/84 budget merges single and married into a single unified schedule
    unified: [
      { limit: 1000000, rate: 0.01, isSST: true },
      { limit: 1500000, rate: 0.10 },
      { limit: 2500000, rate: 0.20 },
      { limit: 4000000, rate: 0.27 },
      { limit: Infinity, rate: 0.29 }
    ]
  }
};

export const REMOTE_AREA_DEDUCTIONS = {
  'A': 50000,
  'B': 40000,
  'C': 30000,
  'D': 20000,
  'E': 10000,
  'None': 0
};

export const LIMITS = {
  retirementMaxFraction: 1 / 3,
  retirementMaxAmount: 500000,
  lifeInsuranceMax: 40000,
  healthInsuranceMax: 20000,
  medicalExpensesCreditFraction: 0.15,
  medicalExpensesCreditMax: 1500,
  femaleTaxRebateRate: 0.10
};

/**
 * Internal helper to compute tax variables given an assessable income level.
 */
function computeTaxLiability({
  assessableIncome,
  totalRetirementContribution,
  allowedLifeInsurance,
  allowedHealthInsurance,
  allowedRemoteArea,
  slabs,
  useSSF,
  medicalExpenses,
  femaleTaxpayer,
  filingStatus,
  year
}) {
  const maxRetirementDeductionLimit = Math.min(
    assessableIncome * LIMITS.retirementMaxFraction,
    LIMITS.retirementMaxAmount
  );
  const allowedRetirementDeduction = Math.min(totalRetirementContribution, maxRetirementDeductionLimit);

  const totalOtherDeductions = allowedLifeInsurance + allowedHealthInsurance + allowedRemoteArea;
  const taxableIncome = Math.max(0, assessableIncome - allowedRetirementDeduction - totalOtherDeductions);

  let remainingTaxableIncome = taxableIncome;
  let previousLimit = 0;
  let baseTaxLiability = 0;
  const taxBreakdown = [];

  for (let i = 0; i < slabs.length; i++) {
    const slab = slabs[i];
    const slabLimit = slab.limit;
    let slabRate = slab.rate;

    // Waive 1% SST (Social Security Tax) if contributing to SSF
    if (slab.isSST && useSSF) {
      slabRate = 0.0;
    }

    const slabRangeSize = slabLimit - previousLimit;
    const incomeInThisSlab = Math.min(remainingTaxableIncome, slabRangeSize);

    if (incomeInThisSlab > 0) {
      const taxForSlab = incomeInThisSlab * slabRate;
      baseTaxLiability += taxForSlab;
      taxBreakdown.push({
        range: `${previousLimit.toLocaleString('en-NP')} - ${slabLimit === Infinity ? 'Above' : slabLimit.toLocaleString('en-NP')}`,
        income: incomeInThisSlab,
        rate: slabRate,
        tax: taxForSlab
      });
      remainingTaxableIncome -= incomeInThisSlab;
    }

    if (remainingTaxableIncome <= 0) break;
    previousLimit = slabLimit;
  }

  // Approved Medical Expenses Credit
  const rawMedicalCredit = (medicalExpenses || 0) * LIMITS.medicalExpensesCreditFraction;
  const allowedMedicalCredit = Math.min(rawMedicalCredit, LIMITS.medicalExpensesCreditMax);
  const taxAfterMedicalCredit = Math.max(0, baseTaxLiability - allowedMedicalCredit);

  // Female Tax Rebate
  let femaleRebate = 0;
  const canApplyFemaleRebate = femaleTaxpayer && (year === '2083_84' || filingStatus === 'single');
  if (canApplyFemaleRebate) {
    femaleRebate = taxAfterMedicalCredit * LIMITS.femaleTaxRebateRate;
  }
  const finalTaxLiability = Math.max(0, taxAfterMedicalCredit - femaleRebate);

  return {
    taxableIncome,
    baseTaxLiability,
    allowedMedicalCredit,
    femaleRebate,
    finalTaxLiability,
    allowedRetirementDeduction,
    taxBreakdown
  };
}

/**
 * Calculates Nepal Income Tax, Net Cash-in-Hand, and Retirement Savings.
 */
export function calculateTax({
  year, // '2082_83' or '2083_84'
  filingStatus, // 'single' or 'married'
  monthlyBasicSalary,
  monthlyAllowances,
  annualBonus,
  useSSF,
  useEPF,
  citMonthly,
  lifeInsurancePremium,
  healthInsurancePremium,
  remoteArea, // 'A', 'B', 'C', 'D', 'E', or 'None'
  femaleTaxpayer,
  medicalExpenses,
  splitBonus,
  monthlyFreelanceIncome,
  annualOtherIncome,
  modeY = false,
  depositGratuity = true
}) {
  // 1. Initial calculations
  const basicSalaryAnnual = (monthlyBasicSalary || 0) * 12;
  const bonusAnnual = annualBonus || 0;
  const freelanceAnnual = (monthlyFreelanceIncome || 0) * 12;
  const otherAnnual = annualOtherIncome || 0;

  // Gratuity Calculations (Universal)
  const gratuityMonthly = (monthlyBasicSalary || 0) * 0.0833;
  const gratuityAnnual = gratuityMonthly * 12;
  const adjustedAllowancesMonthly = Math.max(0, (monthlyAllowances || 0) - gratuityMonthly);
  const adjustedAllowancesAnnual = adjustedAllowancesMonthly * 12;

  // Allowances Annual (used in calculation)
  const allowancesAnnual = adjustedAllowancesAnnual;

  // TDS Calculations
  const freelanceTDS = freelanceAnnual * 0.15;
  const otherTDS = otherAnnual * 0.10;
  const tdsPaidSource = freelanceTDS + otherTDS;

  // SSF Contributions (11% employee, 20% employer of basic salary)
  const employeeSSFAnnual = useSSF ? basicSalaryAnnual * 0.11 : 0;
  const employerSSFAnnual = useSSF ? basicSalaryAnnual * 0.20 : 0;

  // EPF Contributions (Standard is 10% employee, 10% employer of basic salary)
  const employeeEPFAnnual = useEPF ? basicSalaryAnnual * 0.10 : 0;
  const employerEPFAnnual = useEPF ? basicSalaryAnnual * 0.10 : 0;

  // Employer Gratuity (if deposited, it is an employer retirement contribution)
  const employerGratuityAnnual = depositGratuity ? gratuityAnnual : 0;

  // CIT Contributions
  const citAnnual = (citMonthly || 0) * 12;

  // 2. Allowed other deductions (independent of income)
  const allowedLifeInsurance = Math.min(lifeInsurancePremium || 0, LIMITS.lifeInsuranceMax);
  const allowedHealthInsurance = Math.min(healthInsurancePremium || 0, LIMITS.healthInsuranceMax);
  const allowedRemoteArea = REMOTE_AREA_DEDUCTIONS[remoteArea] || 0;

  // Slabs configuration
  let slabs;
  if (year === '2082_83') {
    slabs = TAX_RATES['2082_83'][filingStatus] || TAX_RATES['2082_83']['single'];
  } else {
    slabs = TAX_RATES['2083_84']['unified'];
  }

  // 3. Compute tax WITH bonus (Actual total annual tax)
  // If depositGratuity is false, gratuity is paid in cash, so we add it to grossCashSalaryAnnual.
  // If true, it is deposited (excluded from gross cash salary).
  const cashGratuityAnnual = !depositGratuity ? gratuityAnnual : 0;
  const grossCashSalaryAnnual = basicSalaryAnnual + allowancesAnnual + cashGratuityAnnual + bonusAnnual + freelanceAnnual + otherAnnual;
  const assessableIncome = grossCashSalaryAnnual + employerSSFAnnual + employerEPFAnnual + employerGratuityAnnual;
  const totalRetirementContribution = employeeSSFAnnual + employerSSFAnnual + employeeEPFAnnual + employerEPFAnnual + citAnnual + employerGratuityAnnual;

  const resultWithBonus = computeTaxLiability({
    assessableIncome,
    totalRetirementContribution,
    allowedLifeInsurance,
    allowedHealthInsurance,
    allowedRemoteArea,
    slabs,
    useSSF,
    medicalExpenses,
    femaleTaxpayer,
    filingStatus,
    year
  });

  // 4. Compute tax WITHOUT bonus (Base tax strictly on base salary + allowances + freelance + other)
  const grossCashSalaryNoBonus = basicSalaryAnnual + allowancesAnnual + cashGratuityAnnual + freelanceAnnual + otherAnnual;
  const assessableIncomeNoBonus = grossCashSalaryNoBonus + employerSSFAnnual + employerEPFAnnual + employerGratuityAnnual;

  const resultNoBonus = computeTaxLiability({
    assessableIncome: assessableIncomeNoBonus,
    totalRetirementContribution, // retirement deposits are kept at the actual total
    allowedLifeInsurance,
    allowedHealthInsurance,
    allowedRemoteArea,
    slabs,
    useSSF,
    medicalExpenses,
    femaleTaxpayer,
    filingStatus,
    year
  });

  // 5. Final Outputs
  const finalTaxLiability = resultWithBonus.finalTaxLiability;
  const taxWithoutBonus = resultNoBonus.finalTaxLiability;

  // Net Tax Payable after TDS is credited
  const netTaxPayable = finalTaxLiability - tdsPaidSource;

  const employeeOutofPocketDeductions = employeeSSFAnnual + employeeEPFAnnual + citAnnual;
  const netCashInHandAnnual = Math.max(0, grossCashSalaryAnnual - employeeOutofPocketDeductions - finalTaxLiability);

  // Cash allowances monthly calculation for netCashInHandMonthly
  const cashAllowancesMonthly = depositGratuity ? adjustedAllowancesMonthly : (adjustedAllowancesMonthly + gratuityMonthly);

  const netCashInHandMonthly = splitBonus
    ? netCashInHandAnnual / 12
    : Math.max(0, ((monthlyBasicSalary || 0) + cashAllowancesMonthly + (monthlyFreelanceIncome || 0)) - (employeeSSFAnnual / 12 + employeeEPFAnnual / 12 + (citMonthly || 0)) - (taxWithoutBonus / 12) - (freelanceTDS / 12));

  const totalRetirementSavingsAnnual = employeeSSFAnnual + employerSSFAnnual + employeeEPFAnnual + employerEPFAnnual + citAnnual + employerGratuityAnnual;

  const costToCompany = grossCashSalaryAnnual + employerSSFAnnual + employerEPFAnnual + employerGratuityAnnual;
  const marginalTaxOnBonus = finalTaxLiability - taxWithoutBonus;
  const bonusAfterTax = Math.max(0, bonusAnnual - marginalTaxOnBonus);

  // Withdrawal Taxes for CIT KBB and CIT GFS (Gratuity)
  // KBB (Karmachari Bachat Briddhi) is contributory, withdrawal tax is 5% on the gain/interest component (assuming an average 8% yield on current year contributions)
  const citKbbInterestAnnual = citAnnual * 0.08;
  const citKbbWithdrawalTax = citKbbInterestAnnual * 0.05;

  // GFS (Gratuity Fund Scheme) withdrawal tax is 5% on the gain/interest if deposited, or 0 if paid as cash (since it is already taxed under progressive income tax in the current year)
  const gratuityInterestAnnual = depositGratuity ? gratuityAnnual * 0.08 : 0;
  const gratuityWithdrawalTax = depositGratuity ? gratuityInterestAnnual * 0.05 : 0;

  return {
    citKbbWithdrawalTax,
    gratuityWithdrawalTax,
    assessableIncome,
    costToCompany,
    marginalTaxOnBonus,
    bonusAfterTax,
    allowedRetirementDeduction: resultWithBonus.allowedRetirementDeduction,
    allowedLifeInsurance,
    allowedHealthInsurance,
    allowedRemoteArea,
    taxableIncome: resultWithBonus.taxableIncome,
    baseTaxLiability: resultWithBonus.baseTaxLiability,
    allowedMedicalCredit: resultWithBonus.allowedMedicalCredit,
    femaleRebate: resultWithBonus.femaleRebate,
    finalTaxLiability,
    taxWithoutBonus,
    netTaxPayable,
    netCashInHandAnnual,
    netCashInHandMonthly,
    totalRetirementSavingsAnnual,
    employeeSSFAnnual,
    employerSSFAnnual,
    employeeEPFAnnual,
    employerEPFAnnual,
    citAnnual,
    taxBreakdown: resultWithBonus.taxBreakdown,
    grossCashSalaryAnnual,
    employeeOutofPocketDeductions,
    freelanceAnnual,
    otherAnnual,
    freelanceTDS,
    otherTDS,
    tdsPaidSource,
    // Gratuity Outputs
    gratuityMonthly,
    gratuityAnnual,
    adjustedAllowancesMonthly,
    adjustedAllowancesAnnual
  };
}
