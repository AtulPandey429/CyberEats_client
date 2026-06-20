'use client';

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
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

interface UserActivityChartProps {
  data: TimeseriesPoint[];
  loading?: boolean;
}

export function UserActivityChart({ data, loading }: UserActivityChartProps) {
  const empty =
    !loading && data.every((d) => d.activeUsers === 0 && d.signups === 0);

  return (
    <ChartPanel
      title="User activity"
      subtitle="Active users (sessions + orders) vs new signups"
      loading={loading}
      empty={empty}
    >
      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="var(--chart-grid)" strokeDasharray="3 3" />
          <XAxis dataKey="date" tickFormatter={formatDateLabel} tick={chartAxisStyle} axisLine={false} tickLine={false} />
          <YAxis tick={chartAxisStyle} axisLine={false} tickLine={false} width={32} allowDecimals={false} />
          <Tooltip contentStyle={chartTooltipStyle} labelFormatter={(label) => formatDateLabel(String(label))} />
          <Legend
            wrapperStyle={{ fontSize: '11px', fontFamily: 'var(--font-geist-mono)' }}
            iconType="circle"
          />
          <Line
            type="monotone"
            dataKey="activeUsers"
            name="Active users"
            stroke={CHART_COLORS.cyan}
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="signups"
            name="Signups"
            stroke={CHART_COLORS.violet}
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartPanel>
  );
}
