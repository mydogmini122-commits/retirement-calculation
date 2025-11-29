import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as PieTooltip, Legend } from 'recharts';
import { AIAdviceResponse } from '../types';
import { CheckCircle, Info, TrendingUp, ShieldCheck, Target, Briefcase, ArrowRight, BarChart3, Quote } from 'lucide-react';

interface AIAdviceProps {
  advice: AIAdviceResponse;
  isAchievable: boolean;
}

const AIAdvice: React.FC<AIAdviceProps> = ({ advice, isAchievable }) => {

  return (
    <div className="space-y-10">
      
      {/* --- SECTION 1: HUMOROUS DIAGNOSIS (The "Kid" Advisor) --- */}
      <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-8 md:p-10 border border-slate-100 w-full relative overflow-hidden">
        {/* Decorative background quote */}
        <Quote className="absolute top-4 right-6 w-24 h-24 text-slate-50 opacity-10 rotate-180" />

        <div className="mb-8 relative z-10">
          <h3 className="text-xl md:text-2xl font-black text-slate-900 flex items-center mb-4">
              <ShieldCheck className="w-8 h-8 mr-3 text-amber-500" />
              毒舌博士的財富診斷
          </h3>
          <span className="inline-block px-4 py-1.5 bg-slate-900 text-white text-sm rounded-full font-bold tracking-wide shadow-md">
             風險屬性：{advice.riskAnalysis}
          </span>
        </div>
        
        {/* Summary Section Bubble */}
        <div className="mb-10 relative">
            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">總體分析</h4>
            <div className="bg-slate-50 rounded-tr-3xl rounded-br-3xl rounded-bl-3xl rounded-tl-sm p-6 md:p-8 border border-slate-100 shadow-sm relative">
                <div className="absolute -top-3 left-0 w-4 h-4 bg-slate-50 border-t border-l border-slate-100 transform rotate-45"></div>
                <p className="text-slate-800 leading-loose text-xl md:text-2xl font-bold italic">
                    "{advice.summary}"
                </p>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-8 border-t border-slate-100">
            <div>
                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    該怎麼做？
                </h4>
                <ul className="space-y-5">
                    {advice.actionableSteps.map((step, idx) => (
                        <li key={idx} className="flex items-start group">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold mr-3 mt-0.5 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                                {idx + 1}
                            </span>
                            <span className="text-slate-700 text-lg md:text-xl font-medium">{step}</span>
                        </li>
                    ))}
                </ul>
            </div>

            <div>
                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  簡單增加收入的方法
                </h4>
                <ul className="space-y-5">
                    {advice.passiveIncomeSuggestions && advice.passiveIncomeSuggestions.map((step, idx) => (
                        <li key={idx} className="flex items-start group">
                             <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-xs font-bold mr-3 mt-0.5 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                                $
                            </span>
                            <span className="text-slate-700 text-lg md:text-xl font-medium">{step}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
      </div>

      {/* --- SECTION 2 & 3: ASSET ALLOCATION (Vertical Stack) --- */}
      <div className="flex flex-col gap-8 w-full">
        
        {/* Top: Chart (Investment Portfolio Advice) */}
        <div className="w-full bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-8 border border-slate-100 flex flex-col items-center justify-center">
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center self-start w-full border-b border-slate-50 pb-4">
            <Target className="w-5 h-5 mr-2 text-amber-500" />
            投資組合建議
            </h3>
            {/* Chart Container */}
            <div className="h-[220px] w-full flex justify-center -mt-4">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                <Pie
                    data={advice.allocation}
                    cx="50%"
                    cy="85%" 
                    startAngle={180}
                    endAngle={0}
                    innerRadius={70} 
                    outerRadius={110} 
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                >
                    {advice.allocation.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                    ))}
                </Pie>
                <PieTooltip 
                    contentStyle={{ 
                    borderRadius: '12px', 
                    border: 'none', 
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    backgroundColor: 'rgba(30, 41, 59, 0.95)',
                    color: '#fff',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    padding: '8px 12px'
                    }}
                    itemStyle={{ color: '#fff' }}
                />
                <Legend 
                    layout="horizontal" 
                    verticalAlign="bottom" 
                    align="center" 
                    iconType="circle"
                    wrapperStyle={{ fontSize: '13px', fontWeight: 600, bottom: 0 }}
                />
                </PieChart>
            </ResponsiveContainer>
            </div>
        </div>

        {/* Bottom: Table (The Lazy Package) */}
        <div className="w-full bg-white rounded-2xl shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100 flex flex-col">
            <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/30">
                <h3 className="text-lg font-bold text-slate-900 flex items-center">
                <Info className="w-5 h-5 mr-2 text-slate-400" />
                資產配置懶人包
                </h3>
            </div>
            <div className="overflow-x-auto flex-grow">
            <table className="min-w-full divide-y divide-slate-100">
                <thead className="bg-slate-50">
                <tr>
                    <th scope="col" className="px-6 py-4 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest">資產名稱</th>
                    <th scope="col" className="px-6 py-4 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest">比例</th>
                    <th scope="col" className="px-6 py-4 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest">賺多少 (預期)</th>
                    <th scope="col" className="px-6 py-4 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest">風險</th>
                </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-100">
                {advice.allocation.map((item, index) => (
                    <tr key={index} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-5">
                        <div className="flex items-center">
                        <span className="w-3 h-3 rounded-full mr-3 flex-shrink-0 ring-2 ring-offset-1 ring-transparent group-hover:ring-slate-200 transition-all" style={{ backgroundColor: item.color }}></span>
                        <div>
                            <div className="text-base font-bold text-slate-900">{item.name}</div>
                        </div>
                        </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                        <div className="text-base font-bold text-slate-900 bg-slate-100 px-2 py-1 rounded inline-block">{item.value}%</div>
                    </td>
                    <td className="px-6 py-5 text-sm text-slate-600 font-medium">
                        {item.expectedReturn}
                    </td>
                    <td className="px-6 py-5 text-sm text-slate-600 font-medium">
                        {item.risk}
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
        </div>
      </div>

      {/* --- SECTION 4: PROFESSIONAL ADULT VERSION (Dark Theme) --- */}
      <div className="bg-slate-950 rounded-2xl shadow-2xl shadow-slate-900/30 overflow-hidden border border-slate-800 relative group">
        
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-600 via-amber-400 to-amber-600"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        
        <div className="p-8 md:p-12 relative z-10">
            <div className="flex items-center mb-10 pb-8 border-b border-slate-800">
               <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-900/40 mr-6 transform group-hover:scale-105 transition-transform duration-500">
                  <Briefcase className="w-7 h-7 text-white" />
               </div>
               <div>
                  <h3 className="text-2xl md:text-3xl font-bold text-white tracking-wide">專業財富管理報告</h3>
                  <p className="text-amber-500/60 text-sm font-mono uppercase tracking-[0.2em] mt-2">Professional Wealth Management Report</p>
               </div>
            </div>

            <div className="space-y-12">
                <div>
                    <h4 className="text-amber-500 text-sm md:text-base font-bold uppercase tracking-widest mb-6 border-l-2 border-amber-500 pl-3">
                        財務體質深度分析
                    </h4>
                    <p className="text-slate-300 leading-8 text-lg md:text-xl font-light text-justify">
                        {advice.professionalAnalysis}
                    </p>
                </div>
                
                {/* NEW: Detailed Asset Breakdown Table for Professionals */}
                <div>
                    <h4 className="text-amber-500 text-sm md:text-base font-bold uppercase tracking-widest mb-6 flex items-center border-l-2 border-amber-500 pl-3">
                        <BarChart3 className="w-5 h-5 mr-3" />
                        資產類別深度解析
                    </h4>
                    <div className="bg-slate-900 rounded-xl overflow-hidden border border-slate-800 shadow-inner">
                       <div className="overflow-x-auto">
                           <table className="min-w-full">
                               <thead>
                                   <tr className="bg-slate-950 border-b border-slate-800">
                                       <th className="px-8 py-5 text-left text-xs font-bold text-slate-500 uppercase tracking-widest w-1/4">資產類別</th>
                                       <th className="px-8 py-5 text-left text-xs font-bold text-slate-500 uppercase tracking-widest w-1/3">歷史報酬與表現</th>
                                       <th className="px-8 py-5 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">風險屬性</th>
                                   </tr>
                               </thead>
                               <tbody className="divide-y divide-slate-800/50">
                                   {advice.allocation.map((item, idx) => (
                                       <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                                           <td className="px-8 py-6 align-top">
                                               <div className="flex items-center">
                                                    <span className="w-2 h-2 rounded-full mr-3 flex-shrink-0 shadow-[0_0_8px_rgba(255,255,255,0.5)]" style={{ backgroundColor: item.color }}></span>
                                                    <span className="text-lg font-bold text-white">{item.name}</span>
                                               </div>
                                           </td>
                                           <td className="px-8 py-6 text-lg text-slate-300 font-light leading-relaxed align-top">
                                               {item.historicalPerformance || "暫無詳細數據"}
                                           </td>
                                           <td className="px-8 py-6 text-lg text-slate-300 font-light leading-relaxed align-top">
                                               {item.riskDetail || "暫無詳細數據"}
                                           </td>
                                       </tr>
                                   ))}
                               </tbody>
                           </table>
                       </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-8 md:p-10 border border-slate-700/50 shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl"></div>
                    
                    <h4 className="text-amber-500 text-sm md:text-base font-bold uppercase tracking-widest mb-8 flex items-center">
                        <ArrowRight className="w-5 h-5 mr-3" />
                        專業配置建議與行動方針
                    </h4>
                    <ul className="space-y-6 relative z-10">
                        {advice.professionalSuggestions && advice.professionalSuggestions.map((suggestion, idx) => (
                            <li key={idx} className="flex items-start group">
                                <span className="text-amber-500 font-mono mr-5 text-xl font-bold opacity-50 group-hover:opacity-100 transition-opacity">0{idx + 1}.</span>
                                <span className="text-slate-200 text-lg md:text-xl font-light leading-relaxed group-hover:text-white transition-colors">{suggestion}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            
            <div className="mt-12 pt-8 border-t border-slate-800 text-center">
                <p className="text-slate-600 text-sm font-medium">
                    此報告基於市場現況與財務模型生成，僅供規劃參考，不構成具體投資邀約。
                </p>
            </div>
        </div>
      </div>

    </div>
  );
};

export default AIAdvice;