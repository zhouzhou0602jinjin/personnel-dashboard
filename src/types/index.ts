export interface MonthlyData {
  month: string;
  // 截至[月份]在职人数（月末快照）
  startCount: number;
  fullTime: number;
  intern: number;
  joinCount: number;
  leaveCount: number;
  netChange: number;
}

export interface DepartmentData {
  name: string;
  monthly: MonthlyData[];
}

export interface PersonnelDataset {
  updateDate: string;
  // 第一部分：公司总计
  companyTotal: MonthlyData[];
  organizations: DepartmentData[];
  // 第二部分：中小微事业群细分
  zxwSubTotal: MonthlyData[];
  zxwSubDepartments: DepartmentData[];
}
