
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { CalculationResult } from './types';

const ResultCharts: React.FC<{ data: CalculationResult }> = ({ data }) => {
  const formatMoney = (v: number) => v >= 10000 ? `${(v/10000).toFixed(0)}萬` : v.toString();

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-100">
      <h3 className="text-xl font-bold mb-6">資產累積趨勢圖</h3>
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data.yearlyData}>
            <defs>
              <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="age" />
            <YAxis tickFormatter={formatMoney} />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey="savings" name="預估資產" stroke="#4f46e5" fill="url(#colorSavings)" strokeWidth={3} />
            <Area type="stepAfter" dataKey="target" name="目標門檻" stroke="#f59e0b" fill="none" strokeDasharray="5 5" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ResultCharts;
