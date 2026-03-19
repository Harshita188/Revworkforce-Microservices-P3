export interface User {
  id: number;
  email: string;
  name: string;
  role: string;
  managerId?: number;
}

export interface AuthResponse {
  token: string;
  email: string;
  role: string;
  tokenType: string;
}

export interface Employee {
  id: number;
  userId: number;
  name: string;
  phone: string;
  departmentId: number;
  designationId: number;
  status: string;
  joiningDate: string;
}
