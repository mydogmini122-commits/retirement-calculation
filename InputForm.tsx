
import React, { useState, useEffect } from 'react';
import { UserInputs, Gender } from './types';
import { DollarSign, Activity, PiggyBank, AlertCircle, TrendingUp, User, UserCheck, Percent } from 'lucide-react';

interface InputFormProps {
  inputs: UserInputs;
  setInputs: React.Dispatch<React.SetStateAction<UserInputs>>;
  onCalculate: () => void;
  isLoading: boolean;
}

const InputForm: React.FC<InputFormProps> = ({ inputs, setInputs, onCalculate, isLoading }) => {
  const [countdown, setCountdown] = useState(0);
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    let timer: number;
    if (isLoading) {
      setCountdown(10);
      timer = window.setInterval(() => {
        setCountdown((prev) => (prev > 1 ? prev - 1 : 1));
      }, 1000);
    }
    return () => { if (timer) clearInterval(timer); };
  }, [isLoading]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: false }));
    setInputs(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  const handleGenderChange = (gender: Gender) => {
    setInputs(prev => ({ ...prev, gender }));
  };

  const validateAndSubmit = () => {
    const newErrors: Record<string, boolean> = {};
    if (!inputs.currentAge || inputs.currentAge <= 0) newErrors.currentAge = true;
    if (!inputs.retirementAge || inputs.retirementAge <= inputs.currentAge) newErrors.retirementAge = true;
    if (inputs.monthlySavings === undefined || inputs.monthlySavings < 0) newErrors.monthlySavings = true;
    
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) onCalculate();
  };

  const toChineseCurrency = (num: number) => {
    if (!num) return "0 元";
    if (num < 10000) return num + " 元";
    const yi = Math.floor(num / 100000000);
    const wan = Math.floor((num % 100000000) / 10000);
    return `${yi > 0 ? yi + '億' : ''}${wan > 0 ? wan + '萬' : ''} 元`;
  };

  const labelClass = "block text-lg font-bold text-slate-800 mb-2";
  const inputClass = "block w-full px-4 py-4 bg-white border border-slate-200 rounded-xl text-xl focus:ring-4 focus:ring-amber-100 focus:border-amber-500 outline-none transition-all font-black shadow-sm";
  const subLabelClass = "block text-sm font-bold text-slate-500 mb-1";

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-8 border border-slate-100 relative overflow-hidden sticky top-24">
      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-slate-900 via-amber-500 to-slate-900"></div>
      
      <h2 className="text-3xl font-black text-slate-900 mb-8 flex items-center border-b pb-6">
        <Activity className="w-10 h-10 mr-4 text-amber-500" /> 財務參數
      </h2>
      
      <div className="space-y-6">
        {/* Gender Selection */}
        <div>
          <label className={labelClass}>性別</label>
          <div className="grid grid-cols-2 gap-3">
            {(['男', '女'] as Gender[]).map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => handleGenderChange(g)}
                className={`py-3 px-2 rounded-xl border-2 font-black transition-all flex items-center justify-center gap-2 ${
                  inputs.gender === g
                    ? 'border-amber-500 bg-amber-50 text-amber-700 shadow-inner'
                    : 'border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-200'
                }`}
              >
                {inputs.gender === g ? <UserCheck className="w-5 h-5" /> : <User className="w-5 h-5" />}
                {g}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>目前年齡</label>
            <input type="number" name="currentAge" value={inputs.currentAge || ''} onChange={handleChange} className={inputClass} placeholder="30" />
            {errors.currentAge && <p className="text-rose-500 text-xs mt-1 font-bold">請輸入有效年齡</p>}
          </div>
          <div>
            <label className={labelClass}>預估退休年齡</label>
            <input type="number" name="retirementAge" value={inputs.retirementAge || ''} onChange={handleChange} className={inputClass} placeholder="60" />
            {errors.retirementAge && <p className="text-rose-500 text-xs mt-1 font-bold">須大於目前年齡</p>}
          </div>
        </div>

        {/* Market Hypotheses Section - Moved Up & More Visible */}
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Percent className="w-5 h-5 text-amber-600" />
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">市場預估假設</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={subLabelClass}>預估每年通膨率 (%)</label>
              <input type="number" name="inflationRate" value={inputs.inflationRate} onChange={handleChange} step="0.1" className={`${inputClass} !py-2 !text-lg text-center`} />
            </div>
            <div>
              <label className={subLabelClass}>預估每年獲利率 (%)</label>
              <input type="number" name="investmentReturnRate" value={inputs.investmentReturnRate} onChange={handleChange} step="0.1" className={`${inputClass} !py-2 !text-lg text-center`} />
            </div>
          </div>
          <div>
            <label className={subLabelClass}>退休後每年獲利率 (%)</label>
            <input type="number" name="postRetirementReturnRate" value={inputs.postRetirementReturnRate} onChange={handleChange} step="0.1" className={`${inputClass} !py-2 !text-lg text-center`} />
          </div>
        </div>

        <div>
          <label className={labelClass}>目前總資產 (TWD)</label>
          <div className="relative group">
            <DollarSign className="absolute left-4 top-5 h-6 w-6 text-slate-400 group-focus-within:text-amber-500" />
            <input type="number" name="currentSavings" value={inputs.currentSavings || ''} onChange={handleChange} className={`${inputClass} pl-12`} />
          </div>
          <p className="mt-2 text-right text-amber-600 font-bold">{toChineseCurrency(inputs.currentSavings)}</p>
        </div>

        <div>
          <label className={labelClass}>每月投資金額</label>
          <div className="relative group">
            <PiggyBank className="absolute left-4 top-5 h-6 w-6 text-slate-400 group-focus-within:text-amber-500" />
            <input type="number" name="monthlySavings" value={inputs.monthlySavings || ''} onChange={handleChange} className={`${inputClass} pl-12`} />
          </div>
          <p className="mt-2 text-right text-amber-600 font-bold">{toChineseCurrency(inputs.monthlySavings)}</p>
        </div>

        <div className="pt-2">
          <label className={labelClass}>退休後月開銷</label>
          <input type="number" name="monthlyExpensesCurrent" value={inputs.monthlyExpensesCurrent} onChange={handleChange} className={inputClass} />
        </div>

        <button
          onClick={validateAndSubmit}
          disabled={isLoading}
          className={`w-full py-6 text-2xl font-black rounded-xl text-black transition-all transform active:scale-95 shadow-xl flex items-center justify-center gap-3 ${
            isLoading ? 'bg-slate-200 cursor-not-allowed text-slate-400' : 'bg-amber-400 hover:bg-amber-300 hover:-translate-y-1'
          }`}
        >
          {isLoading ? (
            <>分析中 ({countdown}s)...</>
          ) : (
            <>開始深度試算 <TrendingUp className="w-6 h-6" /></>
          )}
        </button>
      </div>
    </div>
  );
};

export default InputForm;
