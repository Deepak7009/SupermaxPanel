export interface DashboardStats {
  totalProducts: number;
  totalCategories: number;
  totalOrders: number;
  totalCustomers: number;
  totalRevenue: number;
}

export interface RecentOrder {
  _id: string;
  customerName: string;
  totalAmount: number;
}

export interface LowStockProduct {
  _id: string;
  name: string;
  stock: number;
}

export interface LatestCategory {
  _id: string;
  name: string;
}

export interface DashboardResponse {
  stats: DashboardStats;
  recentOrders: RecentOrder[];
  lowStockProducts: LowStockProduct[];
  latestCategories: LatestCategory[];
}
