'use client';

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { TimeseriesPoint } from '../types';
import { CHART_COLORS, ChartPanel, chartAxisStyle, chartTooltipStyle } from './ChartPanel';
import { formatUsd } from '@/lib/utils';

function formatDateLabel(date: string) {
  const d = new Date(`${date}T00:00:00`);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

interface RevenueChartProps {
  data: TimeseriesPoint[];
  loading?: boolean;
}

export function RevenueChart({ data, loading }: RevenueChartProps) {
  const empty = !loading && data.every((d) => d.revenueUsd === 0);

  return (
    <ChartPanel title="Revenue" subtitle="Confirmed payments (USD)" loading={loading} empty={empty}>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={CHART_COLORS.cyan} stopOpacity={0.35} />
              <stop offset="100%" stopColor={CHART_COLORS.cyan} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="var(--chart-grid)" strokeDasharray="3 3" />
          <XAxis dataKey="date" tickFormatter={formatDateLabel} tick={chartAxisStyle} axisLine={false} tickLine={false} />
          <YAxis tick={chartAxisStyle} axisLine={false} tickLine={false} width={48} tickFormatter={(v) => `$${v}`} />
          <Tooltip
            contentStyle={chartTooltipStyle}
            labelFormatter={(label) => formatDateLabel(String(label))}
            formatter={(value) => [formatUsd(Number(value)), 'Revenue']}
          />
          <Area
            type="monotone"
            dataKey="revenueUsd"
            stroke={CHART_COLORS.cyan}
            fill="url(#revenueGrad)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartPanel>
  );
}
