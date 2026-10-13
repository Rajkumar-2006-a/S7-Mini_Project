import React from 'react';
import {
  LayoutDashboard,
  Users,
  UserPlus,
  BedDouble,
  Building2,
  Stethoscope,
  ArrowLeftRight,
  Activity,
  CreditCard,
  LogOut,
  Sparkles,
  TrendingUp,
  BarChart3,
  FileText,
  ShieldCheck,
  Settings as SettingsIcon,
  Cross
} from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  badge?: number;
  roles?: Array<'ADMIN' | 'DOCTOR' | 'NURSE' | 'RECEPTIONIST'>;
}

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, currentRole } = useHospital();

  const navItems: NavItem[] = [
    { id: 'Dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'Patients', label: 'Patients', icon: Users, roles: ['ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST'] },
    { id: 'Admissions', label: 'Admissions', icon: UserPlus, roles: ['ADMIN', 'RECEPTIONIST', 'DOCTOR'] },
    { id: 'Beds', label: 'Beds', icon: BedDouble, roles: ['ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST'] },
    { id: 'Wards', label: 'Wards', icon: Building2, roles: ['ADMIN', 'DOCTOR', 'NURSE'] },
    { id: 'Doctors', label: 'Doctors', icon: Stethoscope, roles: ['ADMIN', 'RECEPTIONIST', 'DOCTOR'] },
    { id: 'Transfers', label: 'Transfers', icon: ArrowLeftRight, roles: ['ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST'] },
    { id: 'Diagnostics', label: 'Diagnostics & Imaging', icon: Activity, roles: ['ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST'] },
    { id: 'Billing', label: 'Billing', icon: CreditCard, roles: ['ADMIN', 'RECEPTIONIST'] },
    { id: 'Discharges', label: 'Discharges', icon: LogOut, roles: ['ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST'] },
    { id: 'Bed Cleaning', label: 'Bed Cleaning', icon: Sparkles, roles: ['ADMIN', 'NURSE', 'DOCTOR'] },
    { id: 'Forecast', label: 'Forecast', icon: TrendingUp, roles: ['ADMIN', 'DOCTOR'] },
    { id: 'Analytics', label: 'Analytics', icon: BarChart3, roles: ['ADMIN'] },
    { id: 'Reports', label: 'Reports', icon: FileText, roles: ['ADMIN', 'RECEPTIONIST'] },
    { id: 'Audit Logs', label: 'Audit Logs', icon: ShieldCheck, roles: ['ADMIN'] },
    { id: 'Settings', label: 'Settings', icon: SettingsIcon, roles: ['ADMIN'] },
  ];

  const filteredItems = navItems.filter(item => {
    if (!item.roles) return true;
    return item.roles.includes(currentRole);
  });

  return (
    <aside className="w-64 bg-[#0F172A] text-slate-300 flex flex-col shrink-0 h-screen sticky top-0 border-r border-slate-800 select-none z-30">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800/80 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20 text-white">
          <Cross className="w-6 h-6 rotate-45" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold text-lg text-white tracking-tight">MedTrack</span>
          </div>
          <p className="text-[11px] text-slate-400 font-medium">Better Care. Smarter Tomorrow.</p>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1 scrollbar-thin scrollbar-thumb-slate-800">
        {filteredItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && item.badge > 0 && (
                <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${
                  isActive ? 'bg-white text-blue-600' : 'bg-rose-500 text-white'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

    </aside>
  );
};
