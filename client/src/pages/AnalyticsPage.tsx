import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Activity,
  Users,
  Clock,
  Sparkles,
  BedDouble,
  DollarSign
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { useHospital } from '../context/HospitalContext';

export const AnalyticsPage: React.FC = () => {
  const { wards, beds, patients, payments } = useHospital();
  const [timeRange, setTimeRange] = useState('Month');

  // Ward Utilization Data
  const wardUtilizationData = wards.map(w => ({
    name: w.name.replace(' Ward', '').replace(' Department', '').slice(0, 10),
    occupancyRate: w.occupancyRate,
    occupied: w.occupiedBeds,
    total: w.totalBeds
  }));

  // Length of stay distribution
  const losData = [
    { range: '1-3 Days', count: 114, fill: '#3B82F6' },
    { range: '4-7 Days', count: 88, fill: '#10B981' },
    { range: '8-14 Days', count: 32, fill: '#F59E0B' },
    { range: '15+ Days', count: 12, fill: '#EF4444' },
  ];

  // Bed Turnaround Time (Cleaning duration in minutes)
  const turnaroundData = [
    { hour: '08:00', minutes: 28 },
    { hour: '11:00', minutes: 34 },
    { hour: '14:00', minutes: 22 },
    { hour: '17:00', minutes: 19 },
    { hour: '20:00', minutes: 25 },
    { hour: '23:00', minutes: 18 },
  ];

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <BarChart3 className="w-7 h-7 text-indigo-600" />
            <span>Hospital Executive Analytics & Operational Metrics</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            In-depth analysis of bed turnaround speeds, length of stay (LOS), ward occupancy rates, and financial yield.
          </p>
        </div>

        <select
          value={timeRange}
          onChange={e => setTimeRange(e.target.value)}
          className="text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-xl px-3 py-2 outline-none shadow-xs"
        >
          <option value="Week">This Week</option>
          <option value="Month">This Month</option>
          <option value="Quarter">This Quarter</option>
          <option value="Year">Financial Year</option>
        </select>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4.5 border border-slate-100 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Average Length of Stay (ALOS)</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900">4.2 Days</span>
            <span className="text-xs font-bold text-emerald-600">↓ 0.4d (Faster recovery)</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">NABH Benchmark: &lt; 5.0 Days</p>
        </div>

        <div className="bg-white rounded-2xl p-4.5 border border-slate-100 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Mean Bed Turnover Speed</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-emerald-600">24 Mins</span>
            <span className="text-xs font-bold text-emerald-600">↑ 12% faster</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Discharge to sterile available</p>
        </div>

        <div className="bg-white rounded-2xl p-4.5 border border-slate-100 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Bed Occupancy Index</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900">76.9%</span>
            <span className="text-xs font-bold text-blue-600">Optimal Range</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">246 of 320 beds in active use</p>
        </div>

        <div className="bg-white rounded-2xl p-4.5 border border-slate-100 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Revenue per Occupied Bed (RevPOB)</span>
          <div className="mt-2">
            <span className="text-2xl font-extrabold text-slate-900">₹ 5,073 / day</span>
            <p className="text-[11px] text-emerald-600 font-semibold mt-1">+8.4% YoY yield</p>
          </div>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ward Occupancy Rates */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs">
          <h3 className="font-extrabold text-sm text-slate-900 mb-4">Ward-wise Occupancy Utilization (%)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={wardUtilizationData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748B' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#64748B' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontSize: '11px' }} />
                <Bar dataKey="occupancyRate" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Length of Stay Distribution */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs">
          <h3 className="font-extrabold text-sm text-slate-900 mb-4">Patient Length of Stay Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={losData}
                  cx="50%"
                  cy="50%"
                  outerRadius={85}
                  dataKey="count"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                >
                  {losData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
