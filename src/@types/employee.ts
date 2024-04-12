export type Employee = {
  id: string;
  email: string;
  username: string | null;
  role: "admin" | "employee" | "superadmin";
  status: "active" | "deactive";
  rate: number;
  created_at: Date;
  updated_at: Date | null;
};

export type EmployeeLogList = {
  name: string;
  size: string;
  createdAt: Date;
}[];

export interface EmployeeLog {
  id: string;
  employee_id: string;
  employee_role: string;
  message: string;
  type: "success" | "error" | "warning" | "info";
  created_at: Date;
}