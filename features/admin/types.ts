export type AnalyticsRange = '7d' | '30d' | '90d';

export interface DashboardStats {
  orderCount: number;
  revenueUsd: number;
  revenueXlm: number;
  revenueXrp: number;
  activeNow: number;
  totalCustomers: number;
  totalMerchants: number;
  restaurantCount: number;
  openRestaurants: number;
  todayOrders: number;
  todayRevenueUsd: number;
  todaySignups: number;
}

export interface TimeseriesPoint {
  date: string;
  orders: number;
  revenueUsd: number;
  signups: number;
  activeUsers: number;
}

export interface AnalyticsOverview {
  range: AnalyticsRange;
  from: string;
  to: string;
  timeseries: TimeseriesPoint[];
  orderStatus: Record<string, number>;
  payments: {
    byAsset: Record<string, number>;
    byProvider: Record<string, number>;
    successRate: number;
  };
  topRestaurants: Array<{
    name: string;
    slug: string;
    orderCount: number;
    revenueUsd: number;
  }>;
}

export interface LedgerEntry {
  _id: string;
  txHash: string;
  usdEquivalent: number;
  amountCrypto: number;
  cryptoAsset: 'XLM' | 'XRP';
  walletProvider: string;
  confirmedAt?: string;
  createdAt?: string;
}

export interface LedgerMeta {
  nextCursor: string | null;
  hasMore: boolean;
}
