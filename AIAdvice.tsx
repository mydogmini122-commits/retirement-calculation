
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as PieTooltip, Legend } from 'recharts';
import { AIAdviceResponse } from './types';
import { ShieldCheck, Target, TrendingUp, CheckCircle, Info, Quote, Headphones, ExternalLink } from 'lucide-react';

interface AIAdviceProps {
  advice: AIAdviceResponse;
  isAchievable: boolean;
}

const AIAdvice: React.FC<AIAdviceProps> = ({ advice, isAchievable }) => {
  return (
    <div className="space-y-12 animate-fade-in-up">
      
      {/* SECTION: Humorous Diagnosis */}
      <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 border border-slate-100 relative overflow-hidden">
        <Quote className="absolute top-4 right-6 w-24 h-24 text-slate-100 opacity-20 rotate-180" />
        
        <div className="mb-8 relative z-10">
          <h3 className="text-2xl font-black text-slate-900 flex items-center mb-4">
            <ShieldCheck className="w-10 h-10 mr-3 text-rose-500" />
            毒舌博士的財富診斷
          </h3>
          <span className="inline-block px-4 py-1.5 bg-slate-900 text-white text-xs rounded-full font-black uppercase tracking-widest shadow-lg">
             風險等級：{advice.riskAnalysis}
          </span>
        </div>
        
        <div className="mb-10 relative">
          <div className="bg-rose-50 rounded-tr-3xl rounded-br-3xl rounded-bl-3xl p-8 border border-rose-100 shadow-sm">
            <p className="text-rose-900 leading-relaxed text-2xl font-black italic">
              "{advice.summary}"
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div>
            <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center">
              <CheckCircle className="w-4 h-4 mr-2" /> 毒舌行動方針
            </h4>
            <ul className="space-y-4">
              {advice.actionableSteps.map((step, idx) => (
                <li key={idx} className="flex items-start group">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold mr-3 mt-1 group-hover:bg-rose-500 transition-colors">
                    {idx + 1}
                  </span>
                  <span className="text-slate-700 text-lg font-bold">{step}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center">
              <TrendingUp className="w-4 h-4 mr-2" /> 增加收入 (被動)
            </h4>
            <ul className="space-y-4">
              {advice.passiveIncomeSuggestions.map((step, idx) => (
                <li key={idx} className="flex items-start group">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-xs font-bold mr-3 mt-1 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                    $
                  </span>
                  <span className="text-slate-700 text-lg font-bold">{step}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* PODCAST CTA FOR FUNDING GAP */}
      {!isAchievable && (
        <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl shadow-xl p-8 border-2 border-amber-200 flex flex-col md:flex-row items-center gap-8 animate-pulse">
          <div className="w-20 h-20 bg-amber-500 rounded-2xl flex items-center justify-center shadow-lg transform -rotate-3 shrink-0">
            <Headphones className="text-white w-10 h-10" />
          </div>
          <div className="flex-grow text-center md:text-left">
            <h3 className="text-2xl font-black text-slate-900 mb-2">目標尚未達成？別灰心！</h3>
            <p className="text-slate-600 text-lg font-bold mb-4">
              缺口大到讓你心慌？建議立即收聽 <span className="text-amber-600 font-black">1968 退休倒計時</span>，聽聽專業建議如何補救你的退休金！
            </p>
            <a 
              href="https://open.firstory.me/user/retirement1968/episodes" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 text-amber-400 rounded-xl font-black text-xl hover:bg-slate-800 transition-all shadow-lg group"
            >
              請按下，立即連結節目 <ExternalLink className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      )}

      {/* SECTION: Asset Allocation Visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center">
          <h3 className="text-xl font-black text-slate-900 mb-8 self-start flex items-center">
            <Target className="w-6 h-6 mr-3 text-amber-500" />
            推薦投資配置比例
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={advice.allocation}
                  cx="50%" cy="50%"
                  innerRadius={70} outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {advice.allocation.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <PieTooltip contentStyle={{ borderRadius: '12px', border: 'none', fontWeight: 'bold' }} />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
          <div className="px-8 py-6 border-b bg-slate-50">
            <h3 className="text-lg font-black text-slate-900 flex items-center uppercase tracking-wider">
              <Info className="w-5 h-5 mr-2 text-slate-400" /> 配置詳情
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-black text-slate-400 uppercase tracking-widest">
                  <th className="px-8 py-4">資產</th>
                  <th className="px-8 py-4 text-center">比例</th>
                  <th className="px-8 py-4">預期特性</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {advice.allocation.map((item, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="px-8 py-5">
                      <div className="flex items-center">
                        <span className="w-3 h-3 rounded-full mr-3" style={{ backgroundColor: item.color }}></span>
                        <span className="font-bold text-slate-900">{item.name}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-center font-black text-slate-900">{item.value}%</td>
                    <td className="px-8 py-5 text-sm text-slate-500 font-medium italic">{item.risk}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAdvice;
