import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { CalculationResult } from '../types';

interface ResultChartsProps {
  data: CalculationResult;
}

const ResultCharts: React.FC<ResultChartsProps> = ({ data }) => {
  const formatMoney = (value: number) => {
    if (value >= 100000000) return `${(value / 100000000).toFixed(1)}億`;
    if (value >= 10000) return `${(value / 10000).toFixed(0)}萬`;
    return value.toString();
  };

  return (
    <div className="bg-white rounded-xl shadow-[0_20px_50px_rgba(8,_112,_184,_0.07)] p-8 border border-slate-100">
      <h3 className="text-lg font-bold text-slate-900 mb-8 flex items-center justify-between">
        <span>資產累積趨勢圖</span>
        <span className="text-xs font-normal text-slate-400 bg-slate-50 px-2 py-1 rounded border border-slate-200">Projection Analysis</span>
      </h3>
      <div className="h-[450px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data.yearlyData}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.15}/>
                <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis 
              dataKey="age" 
              tick={{ fill: '#94a3b8', fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: '#e2e8f0' }}
              dy={10}
            />
            <YAxis 
              tickFormatter={formatMoney} 
              tick={{ fill: '#94a3b8', fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              dx={-10}
            />
            <Tooltip 
              formatter={(value: number) => new Intl.NumberFormat('zh-TW', { style: 'currency', currency: 'TWD', maximumFractionDigits: 0 }).format(value)}
              labelFormatter={(label) => `${label} 歲`}
              contentStyle={{ 
                borderRadius: '8px', 
                border: 'none', 
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                fontFamily: 'Noto Sans TC, sans-serif'
              }}
            />
            <Legend verticalAlign="top" height={36} iconType="circle"/>
            <Area 
              type="monotone" 
              dataKey="savings" 
              name="預估總資產 (Net Worth)" 
              stroke="#4f46e5" 
              fillOpacity={1} 
              fill="url(#colorSavings)" 
              strokeWidth={3}
            />
            <Line 
              type="stepAfter" 
              dataKey="target" 
              name="財務自由門檻 (Target)" 
              stroke="#d97706" 
              strokeDasharray="4 4" 
              strokeWidth={2}
              dot={false}
              connectNulls={true}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <p className="text-xs text-slate-400 mt-6 text-center font-light">
        * 藍色區域顯示您的資產累積路徑，橘色虛線為維持生活品質所需的資金水位。
      </p>
    </div>
  );
};

export default ResultCharts;