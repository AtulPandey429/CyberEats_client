'use client';

import { OrderStatusChart } from './OrderStatusChart';
import { OrdersChart } from './OrdersChart';
import { PaymentMixChart } from './PaymentMixChart';
import { RevenueChart } from './RevenueChart';
import { TopRestaurantsTable } from './TopRestaurantsTable';
import { UserActivityChart } from './UserActivityChart';
import type { AnalyticsOverview, TimeseriesPoint } from '../types';

interface AdminChartsProps {
  timeseries: TimeseriesPoint[];
  orderStatus: Record<string, number>;
  payments: AnalyticsOverview['payments'];
  topRestaurants: AnalyticsOverview['topRestaurants'];
  loading: boolean;
}

export default function AdminCharts({
  timeseries,
  orderStatus,
  payments,
  topRestaurants,
  loading,
}: AdminChartsProps) {
  return (
    <>
      <div className="grid gap-4 lg:grid-cols-2">
        <RevenueChart data={timeseries} loading={loading} />
        <OrderStatusChart orderStatus={orderStatus} loading={loading} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <OrdersChart data={timeseries} loading={loading} />
        <PaymentMixChart
          byAsset={payments.byAsset}
          byProvider={payments.byProvider}
          successRate={payments.successRate}
          loading={loading}
        />
      </div>

      <UserActivityChart data={timeseries} loading={loading} />

      <TopRestaurantsTable restaurants={topRestaurants} loading={loading} />
    </>
  );
}
