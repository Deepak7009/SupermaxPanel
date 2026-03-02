/* ================= BASE MODEL ================= */
export interface FactoryExpense {
  _id: string;
  name: string;
  amount: number;
  entryDate: string;
  entryPerson: string;
  quantity: number;
  shopName: string;
  status: "pending" | "approved" | "rejected";
  createdAt?: string;
  updatedAt?: string;
  actions?: string;
}

/* ================= PAGINATION ================= */
export interface FactoryExpensePagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  limit: number;
}

/* ================= FETCH PARAMS ================= */
export interface FetchFactoryExpensesParams {
  page?: number;
  limit?: number;
  search?: string;
}

/* ================= FETCH RESPONSE ================= */
export interface FetchFactoryExpensesResponse {
  success: boolean;
  data: FactoryExpense[];
  pagination: FactoryExpensePagination;
}

/* ================= FETCH BY ID RESPONSE ================= */
export interface FetchFactoryExpenseByIdResponse {
  success: boolean;
  data: FactoryExpense;
}

/* ================= CREATE PAYLOAD ================= */
export interface CreateFactoryExpensePayload {
  name: string;
  amount: number;
  entryDate: string;
  entryPerson: string;
  quantity: number;
  shopName: string;
  status?: "pending" | "approved" | "rejected";
}

/* ================= CREATE RESPONSE ================= */
export interface CreateFactoryExpenseResponse {
  success: boolean;
  message: string;
  data: FactoryExpense;
}
