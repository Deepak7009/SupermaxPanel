export interface Product {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  categories: { _id: string; name: string }[];
  price: number;
  discount?: number;
  finalPrice: number;
  stock: number;
  sku: string;
  images?: string[];
  brand?: string;
  weight?: string;
  dimensions?: { length?: number; width?: number; height?: number };
  tags?: string[];
  isFeatured: boolean;
  isActive: boolean;
  actions?: string;
}

export interface FetchProductsParams {
  search?: string;
  category?: string;
  page?: number;
  limit?: number;
}

export interface ProductState {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  loading: boolean;
  error: string | null;
}
