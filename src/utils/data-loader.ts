import personnelData from '@/data/personnel-data.json';
import type { PersonnelDataset, DepartmentData, MonthlyData } from '@/types';

export const getDataset = (): PersonnelDataset => {
  return personnelData as PersonnelDataset;
};

export const getUpdateDate = (): string => {
  return getDataset().updateDate;
};

export const getMonths = (): string[] => {
  const data = getDataset();
  if (data.companyTotal.length > 0) {
    return data.companyTotal.map(m => m.month);
  }
  return [];
};

// ===================== 第一部分：公司总计 =====================

// 一级组织名称列表（含“全部” = 公司总人数）
export const getOrganizationNames = (): string[] => {
  const data = getDataset();
  return ['全部', ...data.organizations.map(o => o.name)];
};

// 获取一级组织（或“全部”）的月度数据
export const getOrganizationData = (orgName: string): DepartmentData | null => {
  const data = getDataset();
  if (orgName === '全部') {
    return { name: '全公司', monthly: data.companyTotal };
  }
  const org = data.organizations.find(o => o.name === orgName);
  return org || null;
};

// ===================== 第二部分：中小微事业群细分 =====================

// 中小微事业群二级部门名称列表（含“全部” = 中小微事业群总人数）
export const getZxwSubDeptNames = (): string[] => {
  const data = getDataset();
  return ['全部', ...data.zxwSubDepartments.map(d => d.name)];
};

// 获取中小微二级部门（或“全部”）的月度数据
export const getZxwSubDeptData = (deptName: string): DepartmentData | null => {
  const data = getDataset();
  if (deptName === '全部') {
    return { name: '中小微事业群', monthly: data.zxwSubTotal };
  }
  const dept = data.zxwSubDepartments.find(d => d.name === deptName);
  return dept || null;
};

// ===================== 通用工具 =====================

// 获取最新月数据
export const getLatestMonthData = (data: DepartmentData | null): MonthlyData | null => {
  if (!data || data.monthly.length === 0) return null;
  return data.monthly[data.monthly.length - 1];
};

// 基于 fullTime 计算净变动
export const calcNetChangeFromFullTime = (prevMonth: MonthlyData, currMonth: MonthlyData): number => {
  return currMonth.fullTime - prevMonth.fullTime;
};

// 返回 companyTotal 最新月 startCount 减去 sjsData 最新月 startCount
export const getTotalWithoutSJS = (): number => {
  const data = getDataset();
  const companyLatest = data.companyTotal[data.companyTotal.length - 1];
  const sjsLatest = data.sjsData.monthly[data.sjsData.monthly.length - 1];
  return companyLatest.startCount - sjsLatest.startCount;
};

// ===================== 分析工具 =====================

export interface AnalysisSummary {
  totalHeadcount: number;
  totalJoin: number;
  totalLeave: number;
  totalNetChange: number;
  fullTimeCount: number;
  internCount: number;
  joinRate: string;
  leaveRate: string;
  topJoinDept: { name: string; count: number };
  topLeaveDept: { name: string; count: number };
  topGrowthDept: { name: string; count: number };
  topDeclineDept: { name: string; count: number };
  deptCount: number;
  notes: string[];
}

export const getAnalysisNotes = (month: string): string[] => {
  const data = getDataset();
  if (!data.analysisNotes) return [];
  const monthNotes = data.analysisNotes.find(n => n.month === month);
  return monthNotes?.notes || [];
};

// 计算一组部门的分析摘要
export const calcAnalysisSummary = (
  departments: DepartmentData[],
  totalData: MonthlyData,
  notes: string[] = [],
  excludeSJS: boolean = false,
): AnalysisSummary => {
  const latest = departments
    .map(d => ({ name: d.name, data: getLatestMonthData(d) }))
    .filter(d => d.data !== null) as { name: string; data: MonthlyData }[];

  const sortedByJoin = [...latest].sort((a, b) => b.data.joinCount - a.data.joinCount);
  const sortedByLeave = [...latest].sort((a, b) => b.data.leaveCount - a.data.leaveCount);
  const sortedByNet = [...latest].sort((a, b) => b.data.netChange - a.data.netChange);

  const data = getDataset();
  const sjsMonthData = data.sjsData.monthly.find(m => m.month === totalData.month);
  const sjsCount = sjsMonthData ? sjsMonthData.startCount : 0;
  const sjsFullTime = sjsMonthData ? sjsMonthData.fullTime : 0;
  const sjsIntern = sjsMonthData ? sjsMonthData.intern : 0;
  const totalHeadcount = excludeSJS ? totalData.startCount - sjsCount : totalData.startCount;
  const totalJoin = totalData.joinCount;
  const totalLeave = totalData.leaveCount;
  // 当 excludeSJS=true 时，净变动按各一级组织累加（不含 SJS）
  const totalNetChange = excludeSJS
    ? latest.reduce((sum, d) => sum + d.data.netChange, 0)
    : totalData.netChange;

  const joinRate = totalHeadcount > 0 ? ((totalJoin / totalHeadcount) * 100).toFixed(1) : '0';
  const leaveRate = totalHeadcount > 0 ? ((totalLeave / totalHeadcount) * 100).toFixed(1) : '0';

  return {
    totalHeadcount,
    totalJoin,
    totalLeave,
    totalNetChange,
    fullTimeCount: excludeSJS ? totalData.fullTime - sjsFullTime : totalData.fullTime,
    internCount: excludeSJS ? totalData.intern - sjsIntern : totalData.intern,
    joinRate,
    leaveRate,
    topJoinDept: sortedByJoin[0] ? { name: sortedByJoin[0].name, count: sortedByJoin[0].data.joinCount } : { name: '-', count: 0 },
    topLeaveDept: sortedByLeave[0] ? { name: sortedByLeave[0].name, count: sortedByLeave[0].data.leaveCount } : { name: '-', count: 0 },
    topGrowthDept: sortedByNet[0] && sortedByNet[0].data.netChange > 0
      ? { name: sortedByNet[0].name, count: sortedByNet[0].data.netChange }
      : { name: '-', count: 0 },
    topDeclineDept: sortedByNet[sortedByNet.length - 1] && sortedByNet[sortedByNet.length - 1].data.netChange < 0
      ? { name: sortedByNet[sortedByNet.length - 1].name, count: sortedByNet[sortedByNet.length - 1].data.netChange }
      : { name: '-', count: 0 },
    deptCount: departments.length,
    notes,
  };
};
