export interface User {
  _id: string;
  name: string;
  email: string;
  role: "superadmin" | "user";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FetchUsersResponse {
  success: boolean;
  users: User[];
}

export interface CreateUserResponse {
  success: boolean;
  user: User;
}

export interface ToggleUserResponse {
  success: boolean;
  user: User;
}
