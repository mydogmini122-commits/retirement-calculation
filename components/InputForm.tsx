import React, { useState, useEffect } from 'react';
import { UserInputs } from '../types';
import { DollarSign, Activity, PiggyBank, AlertCircle, Calendar, TrendingUp } from 'lucide-react';

interface InputFormProps {
  inputs: UserInputs;
  setInputs: React.Dispatch<React.SetStateAction<UserInputs>>;
  onCalculate: () => void;
  isLoading: boolean;
}

const InputForm: React.FC<InputFormProps> = ({ inputs, setInputs, onCalculate, isLoading }) => {
  const [countdown, setCountdown] = useState(0);
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  // Effect to handle countdown timer when loading starts
  useEffect(() => {
    let timer: number;
    if (isLoading) {
      setCountdown(15); // Estimated duration for Gemini API
      timer = window.setInterval(() => {
        setCountdown((prev) => (prev > 1 ? prev - 1 : 1)); // Stop at 1s if it takes longer
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isLoading]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: false }));
    }

    setInputs(prev => ({
      ...prev,
      [name]: parseFloat(value) || 0
    }));
  };

  const validateAndSubmit = () => {
    const newErrors: Record<string, boolean> = {};
    let hasError = false;

    // Validate Current Age (Max 150)
    if (!inputs.currentAge || inputs.currentAge <= 0 || inputs.currentAge > 150) {
      newErrors.currentAge = true;
      hasError = true;
    }

    // Validate Retirement Age (Max 150)
    if (!inputs.retirementAge || inputs.retirementAge <= 0 || inputs.retirementAge > 150) {
      newErrors.retirementAge = true;
      hasError = true;
    }

    // Validate Life Expectancy (Max 150)
    if (!inputs.lifeExpectancy || inputs.lifeExpectancy <= 0 || inputs.lifeExpectancy > 150) {
      newErrors.lifeExpectancy = true;
      hasError = true;
    }

    // Validate Monthly Savings
    if (inputs.monthlySavings === undefined || inputs.monthlySavings < 0) {
       newErrors.monthlySavings = true;
       hasError = true;
    }

    setErrors(newErrors);

    if (!hasError) {
      onCalculate();
    }
  };

  // Helper to format numbers into Chinese units (億, 萬)
  const toChineseCurrency = (num: number) => {
    if (!num) return "";
    if (num < 10000) return new Intl.NumberFormat('zh-TW').format(num) + " 元";
    
    const yi = Math.floor(num / 100000000);
    const remainderYi = num % 100000000;
    const wan = Math.floor(remainderYi / 10000);
    const remainderWan = remainderYi % 10000;
    
    let result = "";
    if (yi > 0) result += `${yi}億`;
    if (wan > 0) {
        result += `${wan}萬`;
    }
    if (remainderWan > 0) result += `${remainderWan}`;
    
    return result + " 元";
  };

  // Updated styles for LARGER text and better focus states
  const getInputClass = (fieldName: string) => {
    const baseClass = "block w-full px-4 py-4 bg-white border rounded-xl text-slate-900 text-lg md:text-xl transition-all duration-200 outline-none font-bold placeholder:text-slate-300 placeholder:font-normal shadow-sm";
    if (errors[fieldName]) {
      return `${baseClass} border-rose-500 focus:ring-4 focus:ring-rose-100 bg-rose-50`;
    }
    return `${baseClass} border-slate-200 focus:border-amber-500 focus:ring-4 focus:ring-amber-100 hover:border-amber-300`;
  };

  // Larger label text with distinct styling
  const labelClass = "block text-lg md:text-xl font-bold text-slate-800 mb-2.5";

  // Common classes for inputs with icons
  const iconInputClass = "block w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-xl text-slate-900 text-lg md:text-xl focus:border-amber-500 focus:ring-4 focus:ring-amber-100 hover:border-amber-300 transition-all duration-200 outline-none font-bold placeholder:text-slate-300 placeholder:font-normal shadow-sm";

  return (
    <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 p-6 md:p-8 border border-slate-100 sticky top-24 relative overflow-hidden">
      
      {/* Decorative top accent */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-slate-900 via-amber-500 to-slate-900"></div>

      <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8 flex items-center pb-6 border-b border-slate-100">
        <Activity className="w-8 h-8 md:w-10 md:h-10 mr-4 text-amber-500" />
        財務參數設定
      </h2>
      
      <div className="space-y-12">
        {/* Basic Info */}
        <div className="space-y-6">
          <div className="flex items-center mb-4">
             <div className="w-1 h-6 bg-slate-900 rounded-full mr-3"></div>
             <h3 className="text-lg font-bold text-slate-400 uppercase tracking-widest">基本資料</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>
                目前年齡 <span className="text-rose-500">*</span>
              </label>
              <div className="relative group">
                <input
                  type="number"
                  name="currentAge"
                  value={inputs.currentAge || ''}
                  onChange={handleChange}
                  placeholder="30"
                  min="1"
                  max="150"
                  className={getInputClass('currentAge')}
                />
                {errors.currentAge && (
                  <p className="text-sm text-rose-500 mt-2 flex items-center font-bold animate-pulse">
                    <AlertCircle className="w-4 h-4 mr-1" /> 
                    {inputs.currentAge > 150 ? "上限 150" : "請輸入"}
                  </p>
                )}
              </div>
            </div>
            <div>
              <label className={labelClass}>
                預計退休 <span className="text-rose-500">*</span>
              </label>
              <div className="relative group">
                <input
                  type="number"
                  name="retirementAge"
                  value={inputs.retirementAge || ''}
                  onChange={handleChange}
                  placeholder="60"
                  min="1"
                  max="150"
                  className={getInputClass('retirementAge')}
                />
                {errors.retirementAge && (
                  <p className="text-sm text-rose-500 mt-2 flex items-center font-bold animate-pulse">
                    <AlertCircle className="w-4 h-4 mr-1" /> 
                    {inputs.retirementAge > 150 ? "上限 150" : "請輸入"}
                  </p>
                )}
              </div>
            </div>
          </div>
          
           <div>
            <label className={labelClass}>預期壽命</label>
            <div className="relative">
              <input
                type="number"
                name="lifeExpectancy"
                value={inputs.lifeExpectancy || ''}
                onChange={handleChange}
                placeholder="85"
                min="1"
                max="150"
                className={getInputClass('lifeExpectancy')}
              />
              {errors.lifeExpectancy && (
                  <p className="text-sm text-rose-500 mt-2 flex items-center font-bold animate-pulse">
                    <AlertCircle className="w-4 h-4 mr-1" /> 
                    {inputs.lifeExpectancy > 150 ? "上限 150" : "請輸入"}
                  </p>
                )}
            </div>
          </div>
        </div>

        {/* Financial Info */}
        <div className="space-y-6">
          <div className="flex items-center mb-4">
             <div className="w-1 h-6 bg-amber-500 rounded-full mr-3"></div>
             <h3 className="text-lg font-bold text-slate-400 uppercase tracking-widest">資產配置</h3>
          </div>
          
          <div>
            <label className={labelClass}>目前總資產 (TWD)</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <DollarSign className="h-6 w-6 text-slate-400 group-hover:text-amber-500 transition-colors" />
              </div>
              <input
                type="number"
                name="currentSavings"
                value={inputs.currentSavings || ''}
                onChange={handleChange}
                placeholder="請輸入金額"
                step="10000"
                className={iconInputClass}
              />
            </div>
            {inputs.currentSavings > 0 && (
                <p className="mt-2 text-base md:text-lg text-amber-600 text-right font-bold tracking-wide">
                   {toChineseCurrency(inputs.currentSavings)}
                </p>
            )}
          </div>

          <div>
            <label className={labelClass}>
              每月投資金額 <span className="text-rose-500">*</span>
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <PiggyBank className={`h-6 w-6 ${errors.monthlySavings ? 'text-rose-400' : 'text-slate-400 group-hover:text-amber-500 transition-colors'}`} />
              </div>
              <input
                type="number"
                name="monthlySavings"
                value={inputs.monthlySavings || ''}
                onChange={handleChange}
                step="1000"
                placeholder="請輸入每月投資金額"
                className={`block w-full pl-12 pr-4 py-4 rounded-xl text-lg md:text-xl transition-all duration-200 outline-none font-bold placeholder:text-slate-300 placeholder:font-normal shadow-sm ${
                  errors.monthlySavings 
                    ? 'bg-rose-50 border border-rose-500 text-slate-900 focus:ring-4 focus:ring-rose-100' 
                    : 'bg-white border border-slate-200 text-slate-900 focus:border-amber-500 focus:ring-4 focus:ring-amber-100 hover:border-amber-300'
                }`}
              />
            </div>
             {errors.monthlySavings && (
                  <p className="text-sm text-rose-500 mt-2 flex items-center font-bold animate-pulse">
                    <AlertCircle className="w-5 h-5 mr-1" /> 請填寫金額
                  </p>
             )}
             {inputs.monthlySavings > 0 && (
                <p className="mt-2 text-base md:text-lg text-amber-600 text-right font-bold tracking-wide">
                   {toChineseCurrency(inputs.monthlySavings)}
                </p>
            )}
          </div>

          <div>
            <label className={labelClass}>
                退休後月開銷 (現值)
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <DollarSign className="h-6 w-6 text-slate-400 group-hover:text-amber-500 transition-colors" />
              </div>
              <input
                type="number"
                name="monthlyExpensesCurrent"
                value={inputs.monthlyExpensesCurrent}
                onChange={handleChange}
                step="1000"
                className={iconInputClass}
              />
            </div>
            <p className="mt-2 text-sm md:text-base text-slate-500 text-right font-medium">
                年開銷約 {new Intl.NumberFormat('zh-TW', { style: 'currency', currency: 'TWD', maximumFractionDigits: 0 }).format(inputs.monthlyExpensesCurrent * 12)}
            </p>
          </div>
        </div>

        {/* Rates */}
        <div className="space-y-6 pt-6 border-t border-slate-100">
           <div className="flex items-center mb-4">
             <div className="w-1 h-6 bg-slate-300 rounded-full mr-3"></div>
             <h3 className="text-lg font-bold text-slate-400 uppercase tracking-widest">市場假設 (%)</h3>
           </div>

           <div className="grid grid-cols-3 gap-4">
              <div className="relative">
                <label className="block text-sm font-bold text-slate-500 mb-2 text-center">通膨率</label>
                <input
                    type="number"
                    name="inflationRate"
                    value={inputs.inflationRate}
                    onChange={handleChange}
                    step="0.1"
                    className="block w-full px-2 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-center font-bold"
                  />
              </div>
              <div className="relative">
                <label className="block text-sm font-bold text-slate-500 mb-2 text-center">退休前投報</label>
                <input
                    type="number"
                    name="investmentReturnRate"
                    value={inputs.investmentReturnRate}
                    onChange={handleChange}
                    step="0.1"
                    className="block w-full px-2 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-center font-bold"
                  />
              </div>
              <div className="relative">
                <label className="block text-sm font-bold text-slate-500 mb-2 text-center">退休後投報</label>
                <input
                    type="number"
                    name="postRetirementReturnRate"
                    value={inputs.postRetirementReturnRate}
                    onChange={handleChange}
                    step="0.1"
                    className="block w-full px-2 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-center font-bold"
                  />
              </div>
           </div>
        </div>

      </div>

      <div className="mt-12">
        <button
          onClick={validateAndSubmit}
          disabled={isLoading}
          className={`w-full flex justify-center items-center px-6 py-6 border border-transparent text-xl font-black uppercase tracking-widest rounded-xl text-black transition-all duration-300 transform active:scale-95 ${
            isLoading 
              ? 'bg-slate-300 cursor-not-allowed text-slate-500' 
              : 'bg-amber-400 hover:bg-amber-300 shadow-xl shadow-amber-500/20 hover:shadow-amber-500/40 hover:-translate-y-1'
          }`}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-4 h-6 w-6 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              計算與生成報告 (約 {countdown} 秒)
            </>
          ) : (
            <>
              開始試算與分析
              <TrendingUp className="w-6 h-6 ml-2" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default InputForm;