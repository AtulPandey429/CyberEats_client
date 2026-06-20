'use client';

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { CHART_COLORS, ChartPanel, chartTooltipStyle } from './ChartPanel';

const STATUS_COLORS: Record<string, string> = {
  PENDING: CHART_COLORS.amber,
  COOKING: CHART_COLORS.cyan,
  DELIVERING: CHART_COLORS.teal,
  DELIVERED: '#22c55e',
  CANCELLED: CHART_COLORS.rose,
};

interface OrderStatusChartProps {
  orderStatus: Record<string, number>;
  loading?: boolean;
}

export function OrderStatusChart({ orderStatus, loading }: OrderStatusChartProps) {
  const data = Object.entries(orderStatus)
    .map(([name, value]) => ({ name, value }))
    .filter((d) => d.value > 0);

  const empty = !loading && data.length === 0;

  return (
    <ChartPanel title="Order status" subtitle="Distribution in selected range" loading={loading} empty={empty}>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={85}
            paddingAngle={2}
          >
            {data.map((entry) => (
              <Cell key={entry.name} fill={STATUS_COLORS[entry.name] ?? CHART_COLORS.slate} />
            ))}
          </Pie>
          <Tooltip contentStyle={chartTooltipStyle} />
        </PieChart>
      </ResponsiveContainer>
      <ul className="mt-2 flex flex-wrap justify-center gap-3 text-xs text-muted">
        {data.map((d) => (
          <li key={d.name} className="flex items-center gap-1.5">
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ backgroundColor: STATUS_COLORS[d.name] ?? CHART_COLORS.slate }}
            />
            {d.name} ({d.value})
          </li>
        ))}
      </ul>
    </ChartPanel>
  );
}
