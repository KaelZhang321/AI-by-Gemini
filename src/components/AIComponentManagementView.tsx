import React, { useState } from 'react';
import { 
  User, 
  Users, 
  Stethoscope, 
  Wallet, 
  ClipboardList, 
  Activity, 
  Network,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Eye
} from 'lucide-react';

interface AIComponentManagementViewProps {
  setCurrentPage: (page: any) => void;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
}

// --- Mock Data for Cards ---

export const basicInfo = {
  name: '张三', gender: '女', age: 52,
  idCard: '11010519730921XXXX', ethnicity: '汉族', birthDate: '1973-09-21',
  phone: '13800138000', erpPhone: '无', smartButlerPhone: '13900139000',
  maritalStatus: '已婚已育', bookingCode: '无', oldOrderCode: 'ORD-2023-001',
  erpCode: 'ERP-8899', regAddress: '无', regLocation: '无',
  currentAddress: '无'
};

export const salesTeam = {
  storeName: '北京国贸中心店', storeType: '直营', storePresident: '王建国',
  mainTeacher: '李华', mainTeacherPhone: '13700000001',
  branchName: '华北分公司', branchManager: '赵强', branchManagerPhone: '13700000002',
  regionName: '北方大区', regionPresident: '孙伟', regionPresidentPhone: '13700000003'
};

export const medicalTeam = {
  attendingDoc: '陈医生', attendingPhone: '13600000001',
  residentDoc: '林医生', residentPhone: '13600000002',
  tjManager: '王健管', tjPhone: '13600000003',
  hnManager: '李健管', hnPhone: '13600000004',
  cqManager: '张健管', cqPhone: '13600000005'
};

export const assetInfo = {
  totalBalance: '2,053,540',
  availableBalance: '2,043,360',
  frozenBalance: '0',
  pendingRecovery: '446,880',
  consumedBalance: '2,053,540',
  remainingQuantity: '16'
};

export const treatmentRecords = [
  { id: 1, time: '2024-03-09 10:11:27', name: '口腔CT检查', delivered: '是', amount: '¥ 2,800', fullyDelivered: '是' },
  { id: 2, time: '2024-01-21 14:26:53', name: '骨密度检查(双能X射线-首例)', delivered: '是', amount: '¥ 500,000', fullyDelivered: '是' },
  { id: 3, time: '2024-01-17 09:55:13', name: '鸡尾酒静推1号', delivered: '是', amount: '¥ 2,980', fullyDelivered: '是' },
  { id: 4, time: '2023-12-31 15:10:05', name: '骨密度检查(双能X射线)', delivered: '是', amount: '¥ 3,000,000', fullyDelivered: '否' },
  { id: 5, time: '2023-12-24 10:04:17', name: '洁牙', delivered: '是', amount: '¥ 560', fullyDelivered: '是' },
];

// --- Card Components ---

const CardHeader = ({ title, icon: Icon }: { title: string, icon: any }) => (
  <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-700/50">
    <div className="flex items-center space-x-2">
      <div className="w-1.5 h-4 bg-blue-500 rounded-full"></div>
      <h3 className="font-bold text-slate-800 dark:text-slate-200">{title}</h3>
    </div>
    <Icon className="w-4 h-4 text-slate-400" />
  </div>
);

const InfoItem = ({ label, value }: { label: string, value: string | number }) => (
  <div className="flex flex-col space-y-1">
    <span className="text-[10px] text-slate-500 dark:text-slate-400">{label}</span>
    <span className="text-xs font-medium text-slate-800 dark:text-slate-200 truncate" title={String(value)}>{value}</span>
  </div>
);

export const BasicInfoCard = ({ hideHeader = false }: { hideHeader?: boolean }) => (
  <div className={`bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-200 dark:border-slate-700 h-full ${hideHeader ? 'border-none shadow-none p-0' : ''}`}>
    {!hideHeader && <CardHeader title="基本信息" icon={User} />}
    <div className="grid grid-cols-3 gap-y-4 gap-x-2">
      <InfoItem label="姓名" value={basicInfo.name} />
      <InfoItem label="性别" value={basicInfo.gender} />
      <InfoItem label="年龄" value={basicInfo.age} />
      <InfoItem label="居民身份证" value={basicInfo.idCard} />
      <InfoItem label="民族" value={basicInfo.ethnicity} />
      <InfoItem label="出生日期" value={basicInfo.birthDate} />
      <InfoItem label="客户联系电话" value={basicInfo.phone} />
      <InfoItem label="注册(ERP)电话" value={basicInfo.erpPhone} />
      <InfoItem label="智能管家电话" value={basicInfo.smartButlerPhone} />
      <InfoItem label="婚姻状况" value={basicInfo.maritalStatus} />
      <InfoItem label="预约系统编码" value={basicInfo.bookingCode} />
      <InfoItem label="老订单系统编码" value={basicInfo.oldOrderCode} />
    </div>
  </div>
);

export const SalesTeamCard = ({ hideHeader = false }: { hideHeader?: boolean }) => (
  <div className={`bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-200 dark:border-slate-700 h-full ${hideHeader ? 'border-none shadow-none p-0' : ''}`}>
    {!hideHeader && <CardHeader title="营销团队信息" icon={Users} />}
    <div className="grid grid-cols-3 gap-y-4 gap-x-2">
      <InfoItem label="店铺名称" value={salesTeam.storeName} />
      <InfoItem label="店铺类型" value={salesTeam.storeType} />
      <InfoItem label="店铺总裁" value={salesTeam.storePresident} />
      <InfoItem label="主市场老师" value={salesTeam.mainTeacher} />
      <InfoItem label="主市场老师电话" value={salesTeam.mainTeacherPhone} />
      <div className="col-span-1"></div>
      <InfoItem label="所属分总名称" value={salesTeam.branchName} />
      <InfoItem label="分总姓名" value={salesTeam.branchManager} />
      <InfoItem label="分总电话" value={salesTeam.branchManagerPhone} />
      <InfoItem label="所属大区名称" value={salesTeam.regionName} />
      <InfoItem label="大区总裁" value={salesTeam.regionPresident} />
      <InfoItem label="大区总裁电话" value={salesTeam.regionPresidentPhone} />
    </div>
  </div>
);

export const MedicalTeamCard = ({ hideHeader = false }: { hideHeader?: boolean }) => (
  <div className={`bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-200 dark:border-slate-700 h-full ${hideHeader ? 'border-none shadow-none p-0' : ''}`}>
    {!hideHeader && <CardHeader title="治疗服务团队信息" icon={Stethoscope} />}
    <div className="grid grid-cols-2 gap-y-4 gap-x-4">
      <InfoItem label="主诊医生" value={medicalTeam.attendingDoc} />
      <InfoItem label="主诊联系电话" value={medicalTeam.attendingPhone} />
      <InfoItem label="主治医生" value={medicalTeam.residentDoc} />
      <InfoItem label="主治联系电话" value={medicalTeam.residentPhone} />
      <InfoItem label="天津健管师" value={medicalTeam.tjManager} />
      <InfoItem label="天津健管电话" value={medicalTeam.tjPhone} />
      <InfoItem label="海南健管师" value={medicalTeam.hnManager} />
      <InfoItem label="海南健管电话" value={medicalTeam.hnPhone} />
    </div>
  </div>
);

export const AssetCard = ({ hideHeader = false }: { hideHeader?: boolean }) => (
  <div className={`bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-200 dark:border-slate-700 h-full ${hideHeader ? 'border-none shadow-none p-0' : ''}`}>
    {!hideHeader && <CardHeader title="客户资产概览" icon={Wallet} />}
    <div className="grid grid-cols-3 gap-4">
      <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-xl">
        <div className="text-[10px] text-blue-600 dark:text-blue-400 mb-1">医疗项目金总余额</div>
        <div className="text-lg font-bold text-blue-700 dark:text-blue-300">{assetInfo.totalBalance}</div>
      </div>
      <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-xl">
        <div className="text-[10px] text-green-600 dark:text-green-400 mb-1">可用医疗项目金余额</div>
        <div className="text-lg font-bold text-green-700 dark:text-blue-300">{assetInfo.availableBalance}</div>
      </div>
      <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl">
        <div className="text-[10px] text-slate-500 dark:text-slate-400 mb-1">已冻结医疗项目金</div>
        <div className="text-lg font-bold text-slate-700 dark:text-slate-300">{assetInfo.frozenBalance}</div>
      </div>
      <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-xl">
        <div className="text-[10px] text-orange-600 dark:text-orange-400 mb-1">待收回医疗项目金余额</div>
        <div className="text-lg font-bold text-orange-700 dark:text-orange-300">{assetInfo.pendingRecovery}</div>
      </div>
      <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-xl">
        <div className="text-[10px] text-purple-600 dark:text-purple-400 mb-1">消耗医疗项目金余额</div>
        <div className="text-lg font-bold text-purple-700 dark:text-purple-300">{assetInfo.consumedBalance}</div>
      </div>
      <div className="bg-cyan-50 dark:bg-cyan-900/20 p-3 rounded-xl">
        <div className="text-[10px] text-cyan-600 dark:text-cyan-400 mb-1">医疗项目剩余数量</div>
        <div className="text-lg font-bold text-cyan-700 dark:text-cyan-300">{assetInfo.remainingQuantity}</div>
      </div>
    </div>
  </div>
);

export const TreatmentRecordsCard = ({ hideHeader = false }: { hideHeader?: boolean }) => (
  <div className={`bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-200 dark:border-slate-700 col-span-full h-full ${hideHeader ? 'border-none shadow-none p-0' : ''}`}>
    {!hideHeader && <CardHeader title="治疗规划记录" icon={ClipboardList} />}
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs">
        <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400">
          <tr>
            <th className="p-2 rounded-tl-lg">序号</th>
            <th className="p-2">创建时间</th>
            <th className="p-2">治疗项目名称</th>
            <th className="p-2">是否有交付</th>
            <th className="p-2">方案金额(元)</th>
            <th className="p-2 rounded-tr-lg">是否全部交付</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
          {treatmentRecords.map((record) => (
            <tr key={record.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
              <td className="p-2 text-slate-500">{record.id}</td>
              <td className="p-2 text-slate-700 dark:text-slate-300">{record.time}</td>
              <td className="p-2 font-medium text-slate-800 dark:text-slate-200">{record.name}</td>
              <td className="p-2 text-slate-600 dark:text-slate-400">{record.delivered}</td>
              <td className="p-2 text-slate-600 dark:text-slate-400">{record.amount}</td>
              <td className="p-2">
                <span className={`px-2 py-0.5 rounded-full text-[10px] ${record.fullyDelivered === '是' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>
                  {record.fullyDelivered}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export const HealthServicesCard = ({ hideHeader = false }: { hideHeader?: boolean }) => (
  <div className={`bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-200 dark:border-slate-700 h-full ${hideHeader ? 'border-none shadow-none p-0' : ''}`}>
    {!hideHeader && <CardHeader title="健康服务与体征" icon={Activity} />}
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
        <span>2025-05</span>
        <span>2025-11</span>
        <span>2026-04</span>
      </div>
      <div className="relative h-16 w-full">
        {/* Timeline Line */}
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-100 dark:bg-slate-700 -translate-y-1/2"></div>
        {/* Dots */}
        {[10, 30, 50, 70, 90].map((pos, i) => (
          <div key={i} className="absolute top-1/2 w-3 h-3 rounded-full bg-blue-400 border-2 border-white dark:border-slate-800 -translate-y-1/2 -translate-x-1/2" style={{ left: `${pos}%` }}></div>
        ))}
        {[20, 60, 80].map((pos, i) => (
          <div key={i} className="absolute top-1/2 w-3 h-3 rounded-full bg-green-400 border-2 border-white dark:border-slate-800 -translate-y-1/2 -translate-x-1/2" style={{ left: `${pos}%` }}></div>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-100 dark:border-slate-700/50">
        <InfoItem label="血型" value="O型" />
        <InfoItem label="过敏史" value="无" />
        <InfoItem label="手术史" value="无" />
        <InfoItem label="既往史" value="无" />
        <InfoItem label="健康危险因素" value="入睡时间比较晚，睡眠不足" />
        <InfoItem label="家族遗传史" value="无" />
      </div>
    </div>
  </div>
);

export const FamilyRelationsCard = ({ hideHeader = false }: { hideHeader?: boolean }) => (
  <div className={`bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-200 dark:border-slate-700 h-full ${hideHeader ? 'border-none shadow-none p-0' : ''}`}>
    {!hideHeader && <CardHeader title="家庭关系图谱" icon={Network} />}
    <div className="h-48 bg-slate-50 dark:bg-slate-800/50 rounded-xl flex items-center justify-center relative overflow-hidden">
      {/* Simplified Network Graph Visualization */}
      <div className="absolute w-16 h-16 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-sm z-10">
        家庭关系
      </div>
      
      {/* Nodes */}
      <div className="absolute top-4 left-1/4 w-10 h-10 bg-white dark:bg-slate-700 rounded-full border border-slate-200 dark:border-slate-600 flex items-center justify-center text-[10px] text-slate-600 dark:text-slate-300 shadow-sm">史世鹤</div>
      <div className="absolute top-8 right-1/4 w-10 h-10 bg-white dark:bg-slate-700 rounded-full border border-slate-200 dark:border-slate-600 flex items-center justify-center text-[10px] text-slate-600 dark:text-slate-300 shadow-sm">柴月亮</div>
      <div className="absolute bottom-8 left-1/3 w-10 h-10 bg-white dark:bg-slate-700 rounded-full border border-slate-200 dark:border-slate-600 flex items-center justify-center text-[10px] text-slate-600 dark:text-slate-300 shadow-sm">李宁宁</div>
      <div className="absolute bottom-4 right-1/3 w-10 h-10 bg-white dark:bg-slate-700 rounded-full border border-slate-200 dark:border-slate-600 flex items-center justify-center text-[10px] text-slate-600 dark:text-slate-300 shadow-sm">段延秋</div>
      
      {/* Lines (SVG) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <line x1="50%" y1="50%" x2="25%" y2="20%" stroke="currentColor" className="text-slate-200 dark:text-slate-600" strokeWidth="1.5" />
        <line x1="50%" y1="50%" x2="75%" y2="30%" stroke="currentColor" className="text-slate-200 dark:text-slate-600" strokeWidth="1.5" />
        <line x1="50%" y1="50%" x2="33%" y2="80%" stroke="currentColor" className="text-slate-200 dark:text-slate-600" strokeWidth="1.5" />
        <line x1="50%" y1="50%" x2="66%" y2="85%" stroke="currentColor" className="text-slate-200 dark:text-slate-600" strokeWidth="1.5" />
      </svg>
    </div>
  </div>
);


export const AIComponentManagementView: React.FC<AIComponentManagementViewProps> = ({ setCurrentPage, isDarkMode, setIsDarkMode }) => {
  const [activeTab, setActiveTab] = useState('cards');

  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white transition-colors duration-300">AI组件管理</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 transition-colors duration-300">管理和配置系统中的各类AI组件与业务卡片</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="搜索组件..." 
              className="pl-9 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-sm focus:ring-2 focus:ring-blue-500 outline-none w-64 text-slate-900 dark:text-white placeholder-slate-400 transition-colors duration-300"
            />
          </div>
          <button className="p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors duration-300">
            <Filter className="w-4 h-4 text-slate-600 dark:text-slate-300" />
          </button>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="flex space-x-1 bg-slate-100 dark:bg-slate-800/50 p-1 rounded-xl w-fit">
        <button 
          onClick={() => setActiveTab('cards')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'cards' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
        >
          业务卡片库 (7)
        </button>
        <button 
          onClick={() => setActiveTab('models')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'models' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
        >
          AI模型配置
        </button>
        <button 
          onClick={() => setActiveTab('prompts')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'prompts' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
        >
          提示词模板
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pb-6 pr-2">
        {activeTab === 'cards' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <BasicInfoCard />
            <SalesTeamCard />
            <MedicalTeamCard />
            <AssetCard />
            <HealthServicesCard />
            <FamilyRelationsCard />
            <TreatmentRecordsCard />
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center bg-white/40 dark:bg-slate-900/40 rounded-3xl border border-dashed border-slate-200 dark:border-slate-700">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-400 mb-4">
              <MoreHorizontal className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">模块开发中</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">该功能模块正在紧张开发中，敬请期待。</p>
          </div>
        )}
      </div>
    </div>
  );
};
