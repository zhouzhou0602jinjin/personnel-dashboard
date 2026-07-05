import { Building2, Network, LayoutDashboard } from 'lucide-react';
import Header from '@/components/Header';
import Section from '@/components/Section';
import AnalysisPanel from '@/components/AnalysisPanel';
import MultiTrendChart from '@/components/MultiTrendChart';
import HeadcountRankChart from '@/components/HeadcountRankChart';
import StructurePieChart from '@/components/StructurePieChart';
import NetChangeChart from '@/components/NetChangeChart';
import SummaryTable from '@/components/SummaryTable';
import {
  getDataset,
  getUpdateDate,
  calcAnalysisSummary,
} from '@/utils/data-loader';

export default function Home() {
  const dataset = getDataset();
  const updateDate = getUpdateDate();

  const companySummary = calcAnalysisSummary(
    dataset.organizations,
    dataset.companyTotal[dataset.companyTotal.length - 1],
  );

  const zxwSummary = calcAnalysisSummary(
    dataset.zxwSubDepartments,
    dataset.zxwSubTotal[dataset.zxwSubTotal.length - 1],
  );

  const latestMonth = dataset.companyTotal[dataset.companyTotal.length - 1]?.month ?? '最新月';

  return (
    <div className="min-h-screen bg-slate-50">
      <Header updateDate={updateDate} />

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6 space-y-10">
        {/* 顶部概览卡片 */}
        <Section
          title="整体概览"
          subtitle="公司人员整体规模与变动情况"
          icon={<LayoutDashboard size={20} className="text-sky-600" />}
          accentColor="sky"
        >
          <AnalysisPanel summary={companySummary} monthLabel={latestMonth} accentColor="sky" />
        </Section>

        {/* ===================== 第一部分：公司总计 ===================== */}
        <Section
          title="第一部分 · 公司整体数据"
          subtitle={`共 ${dataset.organizations.length} 个一级组织 · ${latestMonth}数据`}
          icon={<Building2 size={20} className="text-sky-600" />}
          accentColor="sky"
        >
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <MultiTrendChart departments={dataset.organizations} title="各一级组织人数变化趋势" />
              <HeadcountRankChart departments={dataset.organizations} title="各一级组织在职人数排行" />
            </div>

            <StructurePieChart
              departments={dataset.organizations}
              totalData={dataset.companyTotal[dataset.companyTotal.length - 1]}
              title="各组织人数占比"
            />

            <NetChangeChart departments={dataset.organizations} title="各一级组织净变动排行" />

            <SummaryTable
              departments={dataset.organizations}
              totalMonthly={dataset.companyTotal}
              totalLabel="公司总计"
            />
          </div>
        </Section>

        {/* ===================== 第二部分：中小微事业群细分 ===================== */}
        <Section
          title="第二部分 · 中小微事业群细分数据"
          subtitle={`共 ${dataset.zxwSubDepartments.length} 个二级部门 · ${latestMonth}数据`}
          icon={<Network size={20} className="text-emerald-600" />}
          accentColor="emerald"
        >
          <div className="space-y-6">
            <AnalysisPanel summary={zxwSummary} monthLabel={latestMonth} accentColor="emerald" />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <MultiTrendChart departments={dataset.zxwSubDepartments} title="各二级部门人数变化趋势" />
              <HeadcountRankChart departments={dataset.zxwSubDepartments} title="各二级部门在职人数排行" />
            </div>

            <StructurePieChart
              departments={dataset.zxwSubDepartments}
              totalData={dataset.zxwSubTotal[dataset.zxwSubTotal.length - 1]}
              title="各部门人数占比"
            />

            <NetChangeChart departments={dataset.zxwSubDepartments} title="各二级部门净变动排行" />

            <SummaryTable
              departments={dataset.zxwSubDepartments}
              totalMonthly={dataset.zxwSubTotal}
              totalLabel="中小微事业群合计"
            />
          </div>
        </Section>

        <footer className="text-center text-sm text-slate-400 py-6 border-t border-slate-200">
          <p>人员信息变动统计看板 · 每周五更新数据</p>
        </footer>
      </main>
    </div>
  );
}
