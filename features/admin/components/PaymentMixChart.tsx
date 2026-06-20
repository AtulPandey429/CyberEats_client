'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { CHART_COLORS, ChartPanel, chartAxisStyle, chartTooltipStyle } from './ChartPanel';

interface PaymentMixChartProps {
  byAsset: Record<string, number>;
  byProvider: Record<string, number>;
  successRate: number;
  loading?: boolean;
}

export function PaymentMixChart({ byAsset, byProvider, successRate, loading }: PaymentMixChartProps) {
  const data = [
    ...Object.entries(byAsset).map(([name, count]) => ({ name, count })),
    ...Object.entries(byProvider).map(([name, count]) => ({
      name: name === 'gem' ? 'Gem' : 'Freighter',
      count,
    })),
  ];
  const empty = !loading && data.length === 0;

  return (
    <ChartPanel
      title="Payment mix"
      subtitle={`Success rate: ${(successRate * 100).toFixed(1)}%`}
      loading={loading}
      empty={empty}
    >
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} layout="vertical" margin={{ top: 4, right: 16, left: 8, bottom: 0 }}>
          <CartesianGrid stroke="var(--chart-grid)" strokeDasharray="3 3" horizontal={false} />
          <XAxis type="number" tick={chartAxisStyle} axisLine={false} tickLine={false} allowDecimals={false} />
          <YAxis
            type="category"
            dataKey="name"
            tick={chartAxisStyle}
            axisLine={false}
            tickLine={false}
            width={72}
          />
          <Tooltip contentStyle={chartTooltipStyle} />
          <Bar dataKey="count" fill={CHART_COLORS.violet} radius={[0, 4, 4, 0]} maxBarSize={24} />
        </BarChart>
      </ResponsiveContainer>
    </ChartPanel>
  );
}
