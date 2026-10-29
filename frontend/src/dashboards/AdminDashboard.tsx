import React, { useState } from 'react';
import {
  BedDouble,
  Users,
  Activity,
  Sparkles,
  Wrench,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  UserPlus,
  LogOut,
  ArrowLeftRight,
  CreditCard,
  CheckCircle2,
  ChevronRight,
  Filter
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LineChart,
  Line,
  CartesianGrid
} from 'recharts';
import { useHospital } from '../context/HospitalContext';
import { HospitalHeroBanner } from '../components/layout/HospitalHeroBanner';
import { CapacityAlertBanner } from '../components/layout/CapacityAlertBanner';
import { HISTORICAL_7_DAYS } from '../data/seedData';

export const AdminDashboard: React.FC = () => {
  const { beds, wards, admissions, transfers, payments, cleaningLogs, setActiveTab, forecast } = useHospital();

  const [wardFilter, setWardFilter] = useState<string>('All Wards');
  const [trendRange, setTrendRange] = useState<string>('Last 7 Days');
  const [revenueRange, setRevenueRange] = useState<string>('Last 30 Days');

  // Exact metrics computed live from real bed states
  const totalBeds = beds.length || 320;
  const occupiedBeds = beds.filter(b => b.status === 'OCCUPIED').length;
  const availableBeds = beds.filter(b => b.status === 'AVAILABLE').length;
  const cleaningBeds = beds.filter(b => b.status === 'CLEANING_REQUIRED' || b.status === 'CLEANING_IN_PROGRESS').length;
  const maintenanceBeds = beds.filter(b => b.status === 'MAINTENANCE').length;

  const icuWard = wards.find(w => w.code === 'ICU');
  const icuAvailable = icuWard ? icuWard.availableBeds : 2;

  const occupancyRate = totalBeds > 0 ? ((occupiedBeds / totalBeds) * 100).toFixed(1) : '76.9';

  // Donut Chart Data (Strictly Allowed Bed Statuses Only)
  const donutData = [
    { name: 'Occupied', value: occupiedBeds, color: '#3B82F6' },
    { name: 'Available', value: availableBeds, color: '#10B981' },
    { name: 'Cleaning', value: cleaningBeds, color: '#F97316' },
    { name: 'Maintenance', value: maintenanceBeds, color: '#94A3B8' },
  ];

  // Ward-wise bar chart data (live reactivity to transfers, admissions, discharges)
  const wardBarData = (wards.length > 0 ? wards.slice(0, 7) : []).map(w => ({
    name: w.code,
    occupied: w.occupiedBeds,
    available: w.availableBeds
  }));

  // 7-day Line Chart Data for Admissions vs Discharges
  const trendLineData = HISTORICAL_7_DAYS.map(h => ({
    day: h.day,
    Admissions: h.admissions,
    Discharges: h.discharges
  }));

  // Revenue 30-day simulated trend blocks
  const revenueChartData = [
    { day: '1', rev: 35 }, { day: '3', rev: 42 }, { day: '5', rev: 28 }, { day: '7', rev: 55 },
    { day: '9', rev: 48 }, { day: '11', rev: 62 }, { day: '13', rev: 39 }, { day: '15', rev: 58 },
    { day: '17', rev: 72 }, { day: '19', rev: 65 }, { day: '21', rev: 80 }, { day: '23', rev: 74 },
    { day: '25', rev: 88 }, { day: '27', rev: 92 }, { day: '29', rev: 95 }, { day: '30', rev: 110 }
  ];

  // 7-Day Bed Forecast Line Data matching screenshot (Actual vs Forecast)
  const forecastLineData = [
    { day: 'Mon', actual: 232, forecast: null },
    { day: 'Tue', actual: 238, forecast: null },
    { day: 'Wed', actual: 245, forecast: 245 },
    { day: 'Thu', actual: null, forecast: 252 },
    { day: 'Fri', actual: null, forecast: 258 },
    { day: 'Sat', actual: null, forecast: 266 },
    { day: 'Sun', actual: null, forecast: 272 },
  ];

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      {/* Top Welcome Hero Banner matching screenshot */}
      <HospitalHeroBanner />

      {/* 6 Top Key KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Total Beds */}
        <div 
          onClick={() => setActiveTab('Beds', 'ALL')}
          className="bg-white rounded-2xl p-4.5 border border-slate-100 shadow-xs flex flex-col justify-between cursor-pointer hover:border-blue-200 hover:shadow-xs transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Beds</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <BedDouble className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-extrabold text-slate-900 tracking-tight">{totalBeds}</span>
            <p className="text-[11px] text-slate-400 mt-0.5">Capacity across 14 Wards</p>
          </div>
        </div>

        {/* Occupied Beds */}
        <div 
          onClick={() => setActiveTab('Beds', 'ALL')}
          className="bg-white rounded-2xl p-4.5 border border-slate-100 shadow-xs flex flex-col justify-between cursor-pointer hover:border-rose-200 hover:shadow-xs transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Occupied Beds</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-slate-900 tracking-tight">{occupiedBeds}</span>
              <span className="text-[11px] font-bold text-rose-600 flex items-center">
                ↑ 12%
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">{occupancyRate}% Overall Occupancy</p>
          </div>
        </div>

        {/* Available Beds */}
        <div 
          onClick={() => setActiveTab('Beds', 'ALL')}
          className="bg-white rounded-2xl p-4.5 border border-slate-100 shadow-xs flex flex-col justify-between cursor-pointer hover:border-emerald-200 hover:shadow-xs transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Available Beds</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <BedDouble className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-slate-900 tracking-tight">{availableBeds}</span>
              <span className="text-[11px] font-bold text-emerald-600 flex items-center">
                ↑ 5%
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">Ready for Admission</p>
          </div>
        </div>

        {/* ICU Beds Available */}
        <div 
          onClick={() => setActiveTab('Beds', 'w-icu')}
          className="bg-white rounded-2xl p-4.5 border border-slate-100 shadow-xs flex flex-col justify-between cursor-pointer hover:border-amber-300 hover:shadow-xs transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">ICU Beds Available</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-slate-900 tracking-tight">{icuAvailable}</span>
              <span className="text-[11px] font-bold text-rose-600 flex items-center">
                ↓ 2%
              </span>
            </div>
            <p className="text-[11px] text-amber-600 font-semibold mt-0.5">High Strain Alert</p>
          </div>
        </div>

        {/* Under Cleaning */}
        <div 
          onClick={() => setActiveTab('Beds', 'ALL')}
          className="bg-white rounded-2xl p-4.5 border border-slate-100 shadow-xs flex flex-col justify-between cursor-pointer hover:border-orange-200 hover:shadow-xs transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Under Cleaning</span>
            <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-extrabold text-slate-900 tracking-tight">{cleaningBeds}</span>
            <p className="text-[11px] text-slate-400 mt-0.5">Sanitation Active</p>
          </div>
        </div>

        {/* Under Maintenance */}
        <div 
          onClick={() => setActiveTab('Beds', 'ALL')}
          className="bg-white rounded-2xl p-4.5 border border-slate-100 shadow-xs flex flex-col justify-between cursor-pointer hover:border-slate-300 hover:shadow-xs transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Under Maintenance</span>
            <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
              <Wrench className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-extrabold text-slate-900 tracking-tight">{maintenanceBeds}</span>
            <p className="text-[11px] text-slate-400 mt-0.5">Engineering Servicing</p>
          </div>
        </div>
      </div>

      {/* Middle Grid: Bed Occupancy Donut, Ward Availability Bars, Today's Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 1. Bed Occupancy Donut (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-5 border border-slate-100 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-sm text-slate-800">Bed Occupancy</h3>
            <select
              value={wardFilter}
              onChange={(e) => setWardFilter(e.target.value)}
              className="text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 outline-none"
            >
              <option value="All Wards">All Wards</option>
              <option value="General">General Medicine</option>
              <option value="ICU">ICU Critical Care</option>
              <option value="Emergency">Emergency</option>
            </select>
          </div>

          <div className="relative h-56 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={donutData}
                  cx="50%"
                  cy="50%"
                  innerRadius={62}
                  outerRadius={84}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {donutData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [`${value} Beds`, 'Status']}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Donut Center text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-extrabold text-slate-900 tracking-tight">{occupancyRate}%</span>
              <span className="text-[11px] font-semibold text-slate-400">Occupied</span>
            </div>
          </div>

          {/* Legend Items */}
          <div className="grid grid-cols-2 gap-2 mt-2 pt-3 border-t border-slate-100 text-xs">
            <div className="flex items-center justify-between p-1.5 rounded-lg bg-slate-50/70">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <span className="text-slate-600 font-medium">Occupied</span>
              </div>
              <span className="font-bold text-slate-900">{occupiedBeds}</span>
            </div>

            <div className="flex items-center justify-between p-1.5 rounded-lg bg-slate-50/70">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-slate-600 font-medium">Available</span>
              </div>
              <span className="font-bold text-slate-900">{availableBeds}</span>
            </div>

            <div className="flex items-center justify-between p-1.5 rounded-lg bg-slate-50/70">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                <span className="text-slate-600 font-medium">Cleaning</span>
              </div>
              <span className="font-bold text-slate-900">{cleaningBeds}</span>
            </div>

            <div className="flex items-center justify-between p-1.5 rounded-lg bg-slate-50/70">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                <span className="text-slate-600 font-medium">Maintenance</span>
              </div>
              <span className="font-bold text-slate-900">{maintenanceBeds}</span>
            </div>
          </div>
        </div>

        {/* 2. Ward-wise Availability Bar Chart (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-5 border border-slate-100 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-sm text-slate-800">Ward-wise Availability</h3>
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-xs bg-blue-500" />
                <span className="text-slate-500 text-[11px]">Occupied</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-xs bg-emerald-500" />
                <span className="text-slate-500 text-[11px]">Available</span>
              </div>
            </div>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={wardBarData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontSize: '12px' }}
                />
                <Bar dataKey="occupied" fill="#3B82F6" radius={[4, 4, 0, 0]} stackId="a" />
                <Bar dataKey="available" fill="#10B981" radius={[4, 4, 0, 0]} stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3. Today's Activity Feed (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-5 border border-slate-100 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-sm text-slate-800">Today's Activity</h3>
            <button
              onClick={() => setActiveTab('Audit Logs')}
              className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
            >
              View all <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5 flex-1 justify-center flex flex-col">
            {/* New Admissions */}
            <div className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <UserPlus className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold text-slate-700">New Admissions</span>
              </div>
              <span className="text-sm font-extrabold text-slate-900">12</span>
            </div>

            {/* Discharges */}
            <div className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <LogOut className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold text-slate-700">Discharges</span>
              </div>
              <span className="text-sm font-extrabold text-slate-900">8</span>
            </div>

            {/* Patient Transfers */}
            <div className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                  <ArrowLeftRight className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold text-slate-700">Patient Transfers</span>
              </div>
              <span className="text-sm font-extrabold text-slate-900">3</span>
            </div>

            {/* Payments Received */}
            <div className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                  <CreditCard className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold text-slate-700">Payments Received</span>
              </div>
              <span className="text-sm font-extrabold text-slate-900">6</span>
            </div>

            {/* Beds Cleaned */}
            <div className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold text-slate-700">Beds Cleaned</span>
              </div>
              <span className="text-sm font-extrabold text-slate-900">4</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Grid: Admission & Discharge Trend, Revenue Overview, 7-Day Bed Forecast */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 1. Admission & Discharge Trend (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-5 border border-slate-100 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-sm text-slate-800">Admission & Discharge Trend</h3>
            <select
              value={trendRange}
              onChange={(e) => setTrendRange(e.target.value)}
              className="text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 outline-none"
            >
              <option value="Last 7 Days">Last 7 Days</option>
              <option value="Last 30 Days">Last 30 Days</option>
            </select>
          </div>

          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendLineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontSize: '12px' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Line type="monotone" dataKey="Admissions" stroke="#3B82F6" strokeWidth={2.5} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="Discharges" stroke="#10B981" strokeWidth={2.5} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2. Revenue Overview (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-5 border border-slate-100 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-sm text-slate-800">Revenue Overview</h3>
            <select
              value={revenueRange}
              onChange={(e) => setRevenueRange(e.target.value)}
              className="text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 outline-none"
            >
              <option value="Last 30 Days">Last 30 Days</option>
              <option value="This Month">This Month</option>
            </select>
          </div>

          <div className="mb-3">
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-extrabold text-slate-900">₹ 12,48,000</span>
              <span className="text-xs font-bold text-emerald-600 flex items-center">
                ↑ 18%
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Total Monthly Revenue Collected</p>
          </div>

          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueChartData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <Bar dataKey="rev" fill="#A7F3D0" hoverFill="#10B981" radius={[3, 3, 0, 0]} />
                <Tooltip
                  formatter={(val: number) => [`₹ ${(val * 15000).toLocaleString('en-IN')}`, 'Daily Revenue']}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontSize: '11px' }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3. 7-Day Bed Forecast (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-5 border border-slate-100 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-sm text-slate-800">7-Day Bed Forecast</h3>
            <button
              onClick={() => setActiveTab('Forecast')}
              className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
            >
              View details <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center justify-between text-xs mb-2">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-[11px] text-slate-500">
                <span className="w-2 h-2 rounded-full bg-blue-500" /> Actual
              </span>
              <span className="flex items-center gap-1 text-[11px] text-indigo-500 font-medium">
                <span className="w-2.5 h-0.5 bg-indigo-500 border border-indigo-500 border-dashed" /> Forecast
              </span>
            </div>
            <div className="px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-[11px] font-bold">
              Estimated <span className="text-slate-900 font-extrabold">{forecast.forecastDays[6]?.predictedOccupancy || 272} beds</span>
            </div>
          </div>

          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={forecastLineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
                <YAxis domain={[100, 300]} tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontSize: '12px' }} />
                <Line type="monotone" dataKey="actual" stroke="#3B82F6" strokeWidth={2.5} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="forecast" stroke="#818CF8" strokeDasharray="4 4" strokeWidth={2.5} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ICU Capacity Alert Banner matching screenshot */}
      <CapacityAlertBanner />
    </div>
  );
};
