export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parent?: {
    _id: string;
    name: string;
  } | null;
  level: number;
  ancestors?: Array<{
    _id: string;
    name: string;
    slug: string;
  }>;
  isActive: boolean;
  actions?: string;
}

export interface FetchCategoriesResponse {
  categories: Category[];
  total: number;
  page: number;
  limit: number;
}

export interface CategoryState {
  categories: Category[];
  total: number;
  page: number;
  limit: number;
  loading: boolean;
  error: string | null;
}
