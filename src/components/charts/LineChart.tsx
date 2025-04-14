'use client';

import { CoinOHLC } from '@/lib/types';
import { useMemo } from 'react';
import dynamic from 'next/dynamic';

type DynamicComponent = React.ComponentType<any>;

const ResponsiveContainer = dynamic<any>(
  () => import('recharts').then((mod) => mod.ResponsiveContainer as unknown as DynamicComponent),
  { ssr: false }
);

const LineChart = dynamic<any>(
  () => import('recharts').then((mod) => mod.LineChart as unknown as DynamicComponent),
  { ssr: false }
);

const Line = dynamic<any>(
  () => import('recharts').then((mod) => mod.Line as unknown as DynamicComponent),
  { ssr: false }
);

const XAxis = dynamic<any>(
  () => import('recharts').then((mod) => mod.XAxis as unknown as DynamicComponent),
  { ssr: false }
);

const YAxis = dynamic<any>(
  () => import('recharts').then((mod) => mod.YAxis as unknown as DynamicComponent),
  { ssr: false }
);

const CartesianGrid = dynamic<any>(
  () => import('recharts').then((mod) => mod.CartesianGrid as unknown as DynamicComponent),
  { ssr: false }
);

const Tooltip = dynamic<any>(
  () => import('recharts').then((mod) => mod.Tooltip as unknown as DynamicComponent),
  { ssr: false }
);

interface PriceLineChartProps {
  data: CoinOHLC[];
  isPositive: boolean;
}

export default function PriceLineChart({ data, isPositive }: PriceLineChartProps) {
  // Transform OHLC data for LineChart
  const chartData = useMemo(() => {
    // Handle empty data
    if (!data || data.length === 0) {
      return [];
    }
    
    return data.map((item) => ({
      time: new Date(item.time).toLocaleDateString(),
      price: item.close,
    }));
  }, [data]);

  const chartColor = isPositive ? '#10b981' : '#ef4444';

  // Get min and max price values for Y-axis domain with a small buffer
  const prices = data.map(item => item.close);
  const minPrice = prices.length > 0 ? Math.min(...prices) * 0.995 : 0;
  const maxPrice = prices.length > 0 ? Math.max(...prices) * 1.005 : 100;

  // If no data, show a placeholder
  if (chartData.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-800 rounded-lg">
        <p className="text-gray-400">No chart data available</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 20, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
          <XAxis 
            dataKey="time" 
            stroke="#666" 
            tick={{ fill: '#aaa', fontSize: 12 }} 
            tickLine={{ stroke: '#444' }}
            axisLine={{ stroke: '#444' }}
          />
          <YAxis 
            domain={[minPrice, maxPrice]} 
            stroke="#666" 
            tick={{ fill: '#aaa', fontSize: 12 }} 
            tickLine={{ stroke: '#444' }}
            axisLine={{ stroke: '#444' }}
            tickFormatter={(value: { toLocaleString: () => any; }) => `$${value.toLocaleString()}`}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#222', borderColor: '#444', borderRadius: '4px' }} 
            labelStyle={{ color: '#ccc' }}
            formatter={(value: number) => [`$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}`, 'Price']}
          />
          <Line 
            type="monotone" 
            dataKey="price" 
            stroke={chartColor} 
            strokeWidth={2} 
            dot={false}
            activeDot={{ r: 6, fill: chartColor, stroke: '#222', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}