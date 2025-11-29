import React, { useState } from 'react';
import InputForm from './components/InputForm';
import AIAdvice from './components/AIAdvice';
import { calculateRetirement } from './utils/calculations';
import { getFinancialAdvice } from './services/geminiService';
import { UserInputs, CalculationResult, AIAdviceResponse } from './types';
import { TrendingUp, AlertCircle, CheckCircle2, Headphones, Wallet, Power, Share2, Mail, Instagram, Facebook, ArrowDownCircle } from 'lucide-react';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  
  // Default inputs
  const [inputs, setInputs] = useState<UserInputs>({
    currentAge: 0, // Set to 0 to show as empty
    retirementAge: 0, // Set to 0 to show as empty
    currentSavings: 0, // Set to 0 to show as empty
    monthlySavings: 0,
    monthlyExpensesCurrent: 40000,
    inflationRate: 2.5,
    investmentReturnRate: 6.0,
    postRetirementReturnRate: 4.0,
    lifeExpectancy: 85
  });

  const [results, setResults] = useState<CalculationResult | null>(null);
  const [aiAdvice, setAiAdvice] = useState<AIAdviceResponse | null>(null);

  const handleCalculate = async () => {
    // Basic validation
    if (inputs.currentAge <= 0 || inputs.retirementAge <= 0) {
      alert("請輸入有效的年齡與退休年齡");
      return;
    }

    setIsLoading(true);
    setResults(null);
    setAiAdvice(null);

    // 1. Perform Mathematics
    const calcResults = calculateRetirement(inputs);
    setResults(calcResults);

    // 2. Fetch AI Advice (only if math is done)
    try {
      const advice = await getFinancialAdvice(inputs, calcResults);
      setAiAdvice(advice);
    } catch (error) {
      console.error("AI Advice Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = async () => {
    if (!results) return;
    
    const shareData = {
      title: '1968 退休倒計時 | 財務自由分析',
      text: `【1968 退休倒計時】我的財務分析結果：\n💰 退休金需求: ${formatCurrency(results.totalNeeded)}\n🎯 目前狀態: ${results.isAchievable ? '可達成 🎉' : `尚有缺口 ${formatCurrency(Math.abs(results.gap))} 😱`}\n\n毒舌博士說：${aiAdvice?.summary ? aiAdvice.summary.substring(0, 60) + '...' : '快來看看你的！'}\n\n立即試算 👇`,
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(`${shareData.text}\n${shareData.url}`);
        alert('分析結果已複製到剪貼簿！');
      }
    } catch (err) {
      console.log('Share cancelled');
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('zh-TW', { style: 'currency', currency: 'TWD', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="min-h-screen pb-20 bg-slate-50 font-sans selection:bg-amber-200 selection:text-amber-900">
      {/* Header - Refactored to Professional Layout */}
      <header className="bg-[#0B1221] shadow-2xl sticky top-0 z-50 border-b border-slate-800 h-28 md:h-32 flex items-center justify-center">
        <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Logo Container */}
          <div className="flex items-center gap-5">
            {/* Icon Block */}
            <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-amber-600 to-amber-700 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-600/20 flex-shrink-0 border border-amber-500/30">
              <Wallet className="text-white w-8 h-8 md:w-9 md:h-9" strokeWidth={2} />
            </div>

            {/* Text Block */}
            <div className="flex flex-col justify-center">
              {/* Top Row */}
              <div className="flex items-baseline gap-3 mb-1.5">
                <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-none">1968</h1>
                <span className="text-lg md:text-2xl font-bold text-slate-100 tracking-wider">退休倒計時</span>
              </div>

              {/* Bottom Row */}
              <div className="flex items-center gap-3">
                <span className="bg-amber-500 text-[#0B1221] text-[10px] md:text-xs font-black px-2 py-0.5 rounded transform -skew-x-12 shadow shadow-amber-500/20 inline-block">
                  ARE YOU READY
                </span>
                <div className="h-3 w-[1px] bg-slate-600 hidden sm:block"></div>
                <span className="text-slate-500 text-[10px] md:text-[11px] font-bold tracking-[0.15em] uppercase hidden sm:block">
                  Professional Wealth Management
                </span>
              </div>
            </div>
          </div>

          {/* Social Links (Simplified for right side) */}
          <div className="flex items-center gap-3 pl-4 border-l border-slate-800/50 md:border-none md:pl-0">
             <a href="mailto:1968retirement@gmail.com" className="p-2 text-slate-400 hover:text-white transition-colors">
               <Mail className="w-5 h-5" />
             </a>
             <a 
                href="https://www.facebook.com/share/1DGYtE1ru9/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="bg-slate-800 hover:bg-amber-600 text-slate-200 hover:text-white p-2 rounded-lg transition-all duration-300"
             >
                 <Facebook className="w-5 h-5" />
             </a>
             <a href="#" className="bg-slate-800 hover:bg-amber-600 text-slate-200 hover:text-white p-2 rounded-lg transition-all duration-300 hidden md:block">
                 <Instagram className="w-5 h-5" />
             </a>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 space-y-12">
        
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in-up">
            <h2 className="text-3xl md:text-5xl font-light text-slate-900 mb-6 leading-tight tracking-tight">
              Design Your <span className="font-bold relative inline-block">
                Financial Future
                <span className="absolute bottom-1 left-0 w-full h-3 bg-amber-400/30 -z-10"></span>
              </span>
            </h2>
            <p className="text-base md:text-lg text-slate-600 font-light leading-relaxed max-w-2xl mx-auto">
              結合 AI 智慧演算，以專業視角為您量身打造退休藍圖。立即輸入數據，揭開您的財富自由密碼。
            </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Inputs */}
          <div className="xl:col-span-4 order-2 xl:order-1 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <InputForm 
              inputs={inputs} 
              setInputs={setInputs} 
              onCalculate={handleCalculate} 
              isLoading={isLoading}
            />
          </div>

          {/* Right Column: Results */}
          <div className="xl:col-span-8 order-1 xl:order-2 space-y-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            {results && (
              <div className="space-y-8">
                {/* Result Summary Cards */}
                <div className={`bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-8 border border-slate-100 overflow-hidden relative border-t-4 ${results.isAchievable ? 'border-t-emerald-500' : 'border-t-amber-500'}`}>
                  
                  {/* Background decoration */}
                  <div className={`absolute -right-20 -top-20 w-64 h-64 rounded-full opacity-5 pointer-events-none blur-3xl ${results.isAchievable ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>

                  {/* Status Header with Share Button */}
                  <div className={`mb-10 pb-6 border-b border-slate-100 flex justify-between items-start ${results.isAchievable ? 'text-emerald-800' : 'text-amber-800'}`}>
                      <div className="flex items-start flex-1">
                          <div className={`p-3 rounded-2xl mr-5 flex-shrink-0 shadow-sm ${results.isAchievable ? 'bg-emerald-100' : 'bg-amber-100'}`}>
                            {results.isAchievable ? (
                                <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                            ) : (
                                <AlertCircle className="w-8 h-8 text-amber-600" />
                            )}
                          </div>
                          
                          <div className="w-full pt-1">
                             <h3 className="font-bold text-2xl text-slate-900 tracking-tight">
                                財務自由目標：
                                <span className={results.isAchievable ? 'text-emerald-600' : 'text-amber-600'}>
                                    {results.isAchievable ? '可達成' : '需調整'}
                                </span>
                             </h3>
                             <p className="text-slate-500 text-base mt-2 leading-relaxed">
                                {results.isAchievable 
                                  ? '恭喜！您的資產累積速度足以支撐退休生活。'
                                  : '建議增加儲蓄投入或調整退休年齡以彌補缺口。'
                                }
                             </p>
                             
                             {!results.isAchievable && (
                                 <div className="mt-6 bg-amber-50/80 border border-amber-100 rounded-xl p-5 backdrop-blur-sm">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                       <div className="flex items-start">
                                          <Headphones className="w-5 h-5 text-amber-600 mr-3 flex-shrink-0 mt-0.5" />
                                          <div className="text-sm md:text-base text-amber-900 font-medium leading-relaxed">
                                             建議收聽《1968退休倒計時》<br className="hidden md:block"/>陪你打造退休好體質
                                          </div>
                                       </div>
                                       <a 
                                         href="https://open.firstory.me/user/retirement1968" 
                                         target="_blank" 
                                         rel="noopener noreferrer"
                                         className="flex items-center justify-center text-sm font-bold text-white bg-amber-500 hover:bg-amber-600 px-6 py-3 rounded-xl transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 whitespace-nowrap group md:ml-0 w-full md:w-auto"
                                       >
                                         想增加財商請按我 <Power className="w-4 h-4 ml-2 group-hover:scale-110 transition-transform" />
                                       </a>
                                    </div>
                                 </div>
                             )}
                          </div>
                      </div>

                      <button 
                        onClick={handleShare}
                        className="flex items-center gap-2 text-slate-500 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 px-4 py-2.5 rounded-xl transition-all text-sm font-bold shadow-sm ml-4 flex-shrink-0"
                        title="分享結果"
                      >
                          <Share2 className="w-4 h-4" />
                          <span className="hidden sm:inline">分享</span>
                      </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                      <div className="group">
                          <p className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-3">退休所需總資金</p>
                          <p className="text-3xl lg:text-4xl font-black text-slate-900 group-hover:text-amber-500 transition-colors">
                            {formatCurrency(results.totalNeeded)}
                          </p>
                      </div>
                      <div className="group relative">
                          <div className="absolute -left-6 top-2 bottom-2 w-[1px] bg-slate-100 hidden md:block"></div>
                          <p className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-3">預期累積資產</p>
                          <p className="text-3xl lg:text-4xl font-black text-indigo-900 group-hover:text-indigo-700 transition-colors">
                            {formatCurrency(results.savingsAtRetirement)}
                          </p>
                          <p className="text-xs text-slate-400 mt-2 font-medium bg-slate-100 inline-block px-2 py-1 rounded">
                            含月投 {formatCurrency(inputs.monthlySavings)}
                          </p>
                      </div>
                      <div className="group relative">
                          <div className="absolute -left-6 top-2 bottom-2 w-[1px] bg-slate-100 hidden md:block"></div>
                          <p className={`text-xs uppercase tracking-widest font-bold mb-3 ${results.isAchievable ? 'text-emerald-600' : 'text-rose-600'}`}>
                            {results.isAchievable ? '預估結餘 (Surplus)' : '資金缺口 (Gap)'}
                          </p>
                          <p className={`text-3xl lg:text-4xl font-black ${results.isAchievable ? 'text-emerald-600' : 'text-rose-600'}`}>
                            {formatCurrency(Math.abs(results.gap))}
                          </p>
                          {!results.isAchievable && (
                             <div className="mt-3 flex items-center text-rose-700 bg-rose-50 w-full md:w-fit px-3 py-2 rounded-lg text-xs font-bold border border-rose-100">
                                   <TrendingUp className="w-3 h-3 mr-2" />
                                   需月增投資: {formatCurrency(results.additionalMonthlySavingsNeeded)}
                             </div>
                          )}
                      </div>
                  </div>
                </div>
                
                {/* AI Advice Section - Always visible now */}
                {aiAdvice && (
                  <div className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                    <AIAdvice advice={aiAdvice} isAchievable={results.isAchievable} />
                  </div>
                )}
              </div>
            )}

            {!results && (
                <div className="h-[500px] flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-3xl bg-white/40 backdrop-blur-sm hover:bg-white/60 transition-colors duration-500 group">
                    <div className="relative mb-8">
                       <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-500 z-10 relative">
                          <Wallet className="w-10 h-10 text-slate-400 group-hover:text-amber-500 transition-colors duration-500" />
                       </div>
                       <div className="absolute inset-0 bg-amber-500 rounded-full opacity-0 group-hover:opacity-20 animate-ping"></div>
                    </div>
                    
                    <h3 className="text-xl md:text-2xl font-bold text-slate-600 mb-3">準備好規劃您的未來了嗎？</h3>
                    <p className="text-slate-500 font-light mb-8 max-w-sm text-center leading-relaxed">
                        請在左側輸入您的財務資料，阿佳與AI 毒舌博士將為您生成專屬的財富診斷報告。
                    </p>
                    
                    <div className="flex items-center gap-2 text-amber-500 font-bold text-sm uppercase tracking-widest animate-bounce">
                        <ArrowDownCircle className="w-5 h-5" />
                        Awaiting Input
                    </div>
                </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;