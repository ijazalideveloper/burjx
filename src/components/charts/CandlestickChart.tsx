'use client';

import { CoinOHLC } from '@/lib/types';
import { useMemo } from 'react';
import dynamic from 'next/dynamic';

type DynamicComponent = React.ComponentType<any>;

const ResponsiveContainer = dynamic<any>(
  () => import('recharts').then((mod) => mod.ResponsiveContainer as unknown as DynamicComponent),
  { ssr: false }
);

const ComposedChart = dynamic<any>(
  () => import('recharts').then((mod) => mod.ComposedChart as unknown as DynamicComponent),
  { ssr: false }
);

const Bar = dynamic<any>(
  () => import('recharts').then((mod) => mod.Bar as unknown as DynamicComponent),
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

interface CandlestickChartProps {
  data: CoinOHLC[];
  isPositive: boolean;
}

export default function CandlestickChart({ data, isPositive }: CandlestickChartProps) {
  // Transform OHLC data for the candlestick chart
  const chartData = useMemo(() => {
    // Handle empty data
    if (!data || data.length === 0) {
      return [];
    }
    
    return data.map((item) => ({
      time: new Date(item.time).toLocaleDateString(),
      open: item.open,
      high: item.high,
      low: item.low,
      close: item.close,
      // For drawing the candlestick body
      bodyTop: Math.max(item.open, item.close),
      bodyBottom: Math.min(item.open, item.close),
      isPositive: item.close >= item.open
    }));
  }, [data]);

  // Get min and max values for Y-axis domain with a small buffer
  const allValues = data.flatMap(item => [item.high, item.low]);
  const minValue = allValues.length > 0 ? Math.min(...allValues) * 0.995 : 0;
  const maxValue = allValues.length > 0 ? Math.max(...allValues) * 1.005 : 100;

  // Custom render function for the candlestick
  const renderCandlestick = (props: any) => {
    if (!props || !props.payload) {
      return null;
    }
    
    const { x, y, width, height, payload } = props;
    const { high, low, bodyTop, bodyBottom, isPositive } = payload;
    
    // Safety checks
    if (typeof x !== 'number' || typeof y !== 'function') {
      return null;
    }
    
    const candleWidth = Math.max(width * 0.5, 1);
    const wickWidth = Math.max(candleWidth / 3, 1);
    
    const centerX = x + width / 2;
    
    const wickColor = '#999';
    const bullColor = '#10b981';
    const bearColor = '#ef4444';
    const bodyColor = isPositive ? bullColor : bearColor;
    
    return (
      <g key={`candle-${x}`}>
        {/* Upper wick */}
        <line
          x1={centerX}
          y1={y(high)}
          x2={centerX}
          y2={y(bodyTop)}
          stroke={wickColor}
          strokeWidth={wickWidth}
        />
        
        {/* Lower wick */}
        <line
          x1={centerX}
          y1={y(bodyBottom)}
          x2={centerX}
          y2={y(low)}
          stroke={wickColor}
          strokeWidth={wickWidth}
        />
        
        {/* Body */}
        <rect
          x={centerX - candleWidth / 2}
          y={y(bodyTop)}
          width={candleWidth}
          height={y(bodyBottom) - y(bodyTop)}
          fill={bodyColor}
        />
      </g>
    );
  };

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
        <ComposedChart 
          data={chartData}
          margin={{ top: 5, right: 20, bottom: 20, left: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
          <XAxis 
            dataKey="time" 
            stroke="#666" 
            tick={{ fill: '#aaa', fontSize: 12 }} 
            tickLine={{ stroke: '#444' }}
            axisLine={{ stroke: '#444' }}
          />
          <YAxis 
            domain={[minValue, maxValue]} 
            stroke="#666" 
            tick={{ fill: '#aaa', fontSize: 12 }} 
            tickLine={{ stroke: '#444' }}
            axisLine={{ stroke: '#444' }}
            tickFormatter={(value: { toLocaleString: () => any; }) => `$${value.toLocaleString()}`}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#222', borderColor: '#444', borderRadius: '4px' }} 
            labelStyle={{ color: '#ccc' }}
            formatter={(value: number, name: string) => [`$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}`, name]}
          />
          <Bar
            dataKey="low" // Doesn't matter, just need a dataKey
            shape={renderCandlestick}
            isAnimationActive={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}