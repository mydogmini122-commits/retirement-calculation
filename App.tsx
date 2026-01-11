
import React, { useState } from 'react';
import InputForm from './InputForm';
import AIAdvice from './AIAdvice';
import ResultCharts from './ResultCharts';
import { calculateRetirement } from './calculations';
import { getFinancialAdvice } from './geminiService';
import { UserInputs, CalculationResult, AIAdviceResponse } from './types';
import { Wallet, Mail, Facebook, Instagram, AlertCircle, CheckCircle2 } from 'lucide-react';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [inputs, setInputs] = useState<UserInputs>({
    currentAge: 30,
    gender: '男',
    retirementAge: 60,
    currentSavings: 1000000,
    monthlySavings: 20000,
    monthlyExpensesCurrent: 40000,
    inflationRate: 2.5,
    investmentReturnRate: 6.5,
    postRetirementReturnRate: 4.0,
    lifeExpectancy: 85
  });

  const [results, setResults] = useState<CalculationResult | null>(null);
  const [aiAdvice, setAiAdvice] = useState<AIAdviceResponse | null>(null);

  const handleCalculate = async () => {
    setIsLoading(true);
    try {
      const calcResults = calculateRetirement(inputs);
      setResults(calcResults);
      const advice = await getFinancialAdvice(inputs, calcResults);
      setAiAdvice(advice);
      
      // Scroll to results
      setTimeout(() => {
        const resultsEl = document.getElementById('results-section');
        resultsEl?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
      
    } catch (error) {
      alert("分析發生錯誤，請確認網路連線或 API Key 狀態。");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('zh-TW', { style: 'currency', currency: 'TWD', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-32">
      {/* PROFESSIONAL HEADER */}
      <header className="bg-[#0B1221] shadow-2xl sticky top-0 z-50 border-b border-slate-800 h-28 md:h-32 flex items-center">
        <div className="max-w-7xl mx-auto px-6 w-full flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="w-14 h-14 bg-amber-500 rounded-2xl flex items-center justify-center shadow-lg transform rotate-3">
              <Wallet className="text-black w-8 h-8" />
            </div>
            <div>
              <div className="flex items-baseline gap-4">
                <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter">1968</h1>
                <span className="text-xl md:text-2xl font-bold text-slate-400">退休倒計時</span>
              </div>
              <p className="text-amber-500 text-[10px] font-black uppercase tracking-[0.4em] mt-1 opacity-70">Empowering Your Freedom</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-6">
             <div className="h-10 w-px bg-slate-800"></div>
             <div className="flex items-center gap-4">
                <Mail className="w-5 h-5 text-slate-500 hover:text-white cursor-pointer transition-colors" />
                <Facebook className="w-5 h-5 text-slate-500 hover:text-white cursor-pointer transition-colors" />
                <Instagram className="w-5 h-5 text-slate-500 hover:text-white cursor-pointer transition-colors" />
             </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 mt-16 grid grid-cols-1 xl:grid-cols-12 gap-16">
        {/* LEFT: Inputs */}
        <div className="xl:col-span-4">
          <InputForm inputs={inputs} setInputs={setInputs} onCalculate={handleCalculate} isLoading={isLoading} />
        </div>

        {/* RIGHT: Results & AI Advice */}
        <div className="xl:col-span-8 space-y-12" id="results-section">
          {results ? (
            <>
              {/* STATUS CARD */}
              <div className={`bg-white rounded-2xl shadow-2xl p-10 border-t-8 ${results.isAchievable ? 'border-t-emerald-500' : 'border-t-rose-500'} animate-fade-in-up`}>
                <div className="flex items-start mb-10 pb-8 border-b border-slate-100">
                   <div className={`p-5 rounded-2xl mr-6 ${results.isAchievable ? 'bg-emerald-50' : 'bg-rose-50'}`}>
                      {results.isAchievable ? 
                        <CheckCircle2 className="w-12 h-12 text-emerald-600" /> : 
                        <AlertCircle className="w-12 h-12 text-rose-600" />
                      }
                   </div>
                   <div>
                      <h3 className="text-3xl font-black text-slate-900">
                        目標達成狀態：
                        <span className={results.isAchievable ? 'text-emerald-600 ml-2' : 'text-rose-600 ml-2'}>
                          {results.isAchievable ? '進度優於預期' : '存在資金缺口'}
                        </span>
                      </h3>
                      <p className="text-slate-500 text-lg mt-2 font-medium">
                        根據精算的財務模型，您的財富自由計畫{results.isAchievable ? '目前處於安全區位。' : '需要顯著的策略調整。'}
                      </p>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                  <div className="bg-slate-50 p-6 rounded-2xl">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">所需退休總額</p>
                    <p className="text-3xl font-black text-slate-900">{formatCurrency(results.totalNeeded)}</p>
                  </div>
                  <div className="bg-slate-50 p-6 rounded-2xl">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">預估累積資產</p>
                    <p className="text-3xl font-black text-indigo-900">{formatCurrency(results.savingsAtRetirement)}</p>
                  </div>
                  <div className={`p-6 rounded-2xl ${results.isAchievable ? 'bg-emerald-50' : 'bg-rose-50'}`}>
                    <p className={`text-xs font-black uppercase tracking-widest mb-2 ${results.isAchievable ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {results.isAchievable ? '剩餘餘額' : '資金缺口'}
                    </p>
                    <p className={`text-3xl font-black ${results.isAchievable ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {formatCurrency(Math.abs(results.gap))}
                    </p>
                  </div>
                </div>
                
                {!results.isAchievable && (
                  <div className="mt-8 p-4 bg-rose-950 text-rose-200 rounded-xl text-sm font-bold flex items-center justify-center">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    建議每月需額外儲蓄 {formatCurrency(results.additionalMonthlySavingsNeeded)} 方能達成目標。
                  </div>
                )}
              </div>

              <ResultCharts data={results} />
              
              {aiAdvice && <AIAdvice advice={aiAdvice} isAchievable={results.isAchievable} />}
            </>
          ) : (
            <div className="h-[700px] bg-white border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center text-slate-300 group hover:border-amber-200 transition-colors">
               <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-8 group-hover:bg-amber-50 transition-colors">
                  <Wallet className="w-12 h-12 text-slate-200 group-hover:text-amber-200" />
               </div>
               <h3 className="text-3xl font-black text-slate-300">請輸入財務參數</h3>
               <p className="mt-4 text-lg font-medium">填寫左側表單後，我們將為您生成深度分析報告。</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
