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
import type { TimeseriesPoint } from '../types';
import { CHART_COLORS, ChartPanel, chartAxisStyle, chartTooltipStyle } from './ChartPanel';

function formatDateLabel(date: string) {
  const d = new Date(`${date}T00:00:00`);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

interface OrdersChartProps {
  data: TimeseriesPoint[];
  loading?: boolean;
}

export function OrdersChart({ data, loading }: OrdersChartProps) {
  const empty = !loading && data.every((d) => d.orders === 0);

  return (
    <ChartPanel title="Orders" subtitle="Non-cancelled orders per day" loading={loading} empty={empty}>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="var(--chart-grid)" strokeDasharray="3 3" />
          <XAxis dataKey="date" tickFormatter={formatDateLabel} tick={chartAxisStyle} axisLine={false} tickLine={false} />
          <YAxis tick={chartAxisStyle} axisLine={false} tickLine={false} width={32} allowDecimals={false} />
          <Tooltip contentStyle={chartTooltipStyle} labelFormatter={(label) => formatDateLabel(String(label))} />
          <Bar dataKey="orders" fill={CHART_COLORS.teal} radius={[4, 4, 0, 0]} maxBarSize={32} />
        </BarChart>
      </ResponsiveContainer>
    </ChartPanel>
  );
}
