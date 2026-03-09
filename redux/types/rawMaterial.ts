export interface RawMaterial {
  _id: string;
  shopName: string;
  materialName: string;
  quantity: number;
  buyerName: string;
  amount: number;
  date: string;
  status: "pending" | "paid";
}

export interface FetchRawMaterialsParams {
  search?: string;
  page?: number;
  limit?: number;
  status?: string;
  month?: number;
  year?: number;
}

export interface CreateRawMaterialPayload {
  shopName: string;
  materialName: string;
  quantity: number;
  buyerName: string;
  amount: number;
  date: string;
  status?: "pending" | "paid";
}