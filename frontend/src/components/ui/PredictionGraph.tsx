import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface PredictionGraphProps {
  data: any;
  isMini?: boolean;
}

const PredictionGraph: React.FC<PredictionGraphProps> = ({ data, isMini = false }) => {
  // Generate projection data based on current population and gap
  const years = ['2024', '2025', '2026', '2027', '2028', '2029'];
  const chartData = years.map((year, i) => {
    const growthRate = 1 + (i * 0.05); // 5% annual growth
    return {
      year,
      population: Math.floor(data.population * growthRate),
      infraGap: Math.floor((data.severity * 100) * (1 + i * 0.1)), // Gap widens if no action
      capacity: Math.floor(100 - (data.severity * 100))
    };
  });

  return (
    <div className={`${isMini ? 'h-full w-full' : 'h-64 w-full mt-6'} bg-transparent rounded-xl`}>
      {!isMini && <h4 className="text-[10px] uppercase font-bold text-[var(--text-muted)] mb-4 tracking-widest">5-Year Gap Projection</h4>}
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={isMini ? { top: 5, right: 5, left: 5, bottom: 5 } : undefined}>
          <defs>
            <linearGradient id="colorGap" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ff4757" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#ff4757" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorCap" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00f5ff" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#00f5ff" stopOpacity={0}/>
            </linearGradient>
          </defs>
          {!isMini && <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />}
          {!isMini && <XAxis 
            dataKey="year" 
            stroke="rgba(255,255,255,0.3)" 
            fontSize={10}
            tickLine={false}
            axisLine={false}
          />}
          {!isMini && <YAxis 
            stroke="rgba(255,255,255,0.3)" 
            fontSize={10}
            tickLine={false}
            axisLine={false}
          />}
          {!isMini && <Tooltip 
            contentStyle={{ backgroundColor: '#0a1628', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
            itemStyle={{ fontSize: '10px', fontWeight: 'bold' }}
          />}
          <Area 
            type="monotone" 
            dataKey="infraGap" 
            name="Infrastructure Gap Index"
            stroke="#ff4757" 
            fillOpacity={1} 
            strokeWidth={isMini ? 3 : 1}
            fill="url(#colorGap)" 
          />
          <Area 
            type="monotone" 
            dataKey="capacity" 
            name="Current Service Capacity"
            stroke="#00f5ff" 
            fillOpacity={1} 
            strokeWidth={isMini ? 3 : 1}
            fill="url(#colorCap)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PredictionGraph;
