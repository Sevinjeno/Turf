export interface AdminState {
  admin: any;
  loading: boolean;
  error: string | null;
  name: string; // Optional field for admin name
}

export interface LoginCredentials {
  email: string;
  password: string;
}