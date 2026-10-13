import React, { useState } from 'react';
import {
  TrendingUp,
  AlertTriangle,
  Calendar,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Info
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area
} from 'recharts';
import { useHospital } from '../context/HospitalContext';
import { HISTORICAL_7_DAYS } from '../data/seedData';
import { generateHospitalForecast } from '../utils/forecasting';

export const ForecastPage: React.FC = () => {
  const { forecast: sevenDayForecast, wards, beds } = useHospital();
  const [horizon, setHorizon] = useState<'7' | '14'>('7');
  const forecast = horizon === '14'
    ? generateHospitalForecast(beds, wards, HISTORICAL_7_DAYS, 14)
    : sevenDayForecast;

  const totalBeds = forecast.totalHospitalBeds;
  const peakOccupancyRate = totalBeds > 0
    ? Number(((forecast.peakOccupancyValue / totalBeds) * 100).toFixed(1))
    : 0;
  const averageOccupancyRate = forecast.forecastDays.length > 0
    ? Number((forecast.forecastDays.reduce((total, day) => total + day.occupancyRate, 0) / forecast.forecastDays.length).toFixed(1))
    : forecast.currentOccupancyRate;
  const netPredictedFlow = forecast.forecastDays.reduce(
    (total, day) => total + day.expectedAdmissions - day.expectedDischarges,
    0
  );
  const wardsNeedingSpace = forecast.wardForecasts.filter(ward => ward.additionalBedsNeeded > 0);

  // Chart data from forecast engine
  const lineChartData = forecast.forecastDays.map(f => ({
    date: f.dateLabel,
    dayName: f.dayLabel,
    Occupancy: f.predictedOccupancy,
    Admissions: f.expectedAdmissions,
    Discharges: f.expectedDischarges,
    OccupancyRate: f.occupancyRate,
    ICUDemand: f.icuDemand,
    CapacityLimit: totalBeds
  }));

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <TrendingUp className="w-7 h-7 text-indigo-600" />
            <span>{horizon}-Day Bed Capacity & Occupancy Forecast</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Predictive modeling calculating day-of-week seasonality, admission surges, and ward-specific strain indices.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setHorizon('7')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              horizon === '7' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            7-Day Model
          </button>
          <button
            onClick={() => setHorizon('14')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              horizon === '14' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            14-Day Outlook
          </button>
        </div>
      </div>

      {/* High-Level Forecast KPI Banners */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4.5 border border-slate-100 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Peak Occupancy Projected</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900">{forecast.peakOccupancyValue} Beds</span>
            <span className="text-xs font-bold text-rose-600">({peakOccupancyRate}%)</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Projected on {forecast.peakOccupancyDay || 'No forecast available'}</p>
        </div>

        <div className="bg-white rounded-2xl p-4.5 border border-slate-100 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Average Expected Occupancy</span>
          <div className="mt-2">
            <span className="text-2xl font-extrabold text-slate-900">{averageOccupancyRate}%</span>
            <p className="text-[11px] text-slate-400 mt-1">~{Math.round((averageOccupancyRate / 100) * totalBeds)} beds occupied daily</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4.5 border border-slate-100 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Predicted Net Flow</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-indigo-600">
              {netPredictedFlow > 0 ? '+' : ''}{netPredictedFlow} Beds
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">{horizon}-Day Net Admission Inflow</p>
        </div>

        <div className="bg-white rounded-2xl p-4.5 border border-slate-100 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Critical Ward Strain</span>
          <div className="mt-2 flex items-center gap-1.5">
            <span className="text-lg font-extrabold text-amber-600">ICU {forecast.icuStrainRisk} · Emergency {forecast.emergencyStrainRisk}</span>
          </div>
          <p className="text-[11px] text-amber-600 font-semibold mt-1">Current capacity strain assessment</p>
        </div>
      </div>

      {/* Main Predictive Chart */}
      <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-extrabold text-sm text-slate-900">Hospital Total Occupancy Projection</h3>
            <p className="text-xs text-slate-500">Predicted active beds vs. total {totalBeds} bed facility capacity</p>
          </div>
        </div>

        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={lineChartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="colorOccupancy" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366F1" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
              <XAxis dataKey="dayName" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
              <YAxis domain={[180, 340]} tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontSize: '12px' }} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Area type="monotone" dataKey="Occupancy" stroke="#6366F1" strokeWidth={3} fillOpacity={1} fill="url(#colorOccupancy)" />
              <Line type="monotone" dataKey="CapacityLimit" stroke="#EF4444" strokeDasharray="5 5" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Day-by-Day Forecast Breakdown */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100">
          <h3 className="font-bold text-sm text-slate-900">Daily Forecast Breakdown & Strain Indices</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50/80 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-3 px-4">Forecast Date</th>
                <th className="py-3 px-4">Expected Inflow (Admissions)</th>
                <th className="py-3 px-4">Expected Outflow (Discharges)</th>
                <th className="py-3 px-4">Projected Occupied Beds</th>
                <th className="py-3 px-4">Occupancy Rate</th>
                <th className="py-3 px-4">Risk Severity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {forecast.forecastDays.map((d, i) => {
                const isHigh = d.status === 'CRITICAL';
                const isModerate = d.status === 'ELEVATED';

                return (
                  <tr key={`${d.dayIndex}-${d.dateLabel}`} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {d.dayLabel}, {d.dateLabel}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-blue-600">+{d.expectedAdmissions} patients</td>
                    <td className="py-3.5 px-4 font-semibold text-emerald-600">-{d.expectedDischarges} discharges</td>
                    <td className="py-3.5 px-4 font-extrabold text-slate-900">{d.predictedOccupancy} / {totalBeds}</td>
                    <td className="py-3.5 px-4 font-bold">{d.occupancyRate}%</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-md ${
                        isHigh ? 'bg-rose-100 text-rose-800' : isModerate ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {isHigh ? 'HIGH STRAIN' : isModerate ? 'MODERATE STRAIN' : 'NORMAL'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-600" />
              Ward-wise {horizon}-Day Bed Space Forecast
            </h3>
            <p className="text-xs text-slate-500 mt-1">Projected occupied beds by ward and day, with extra capacity needed at each ward's peak.</p>
          </div>
          <span className="text-xs text-slate-500">Ward demand is distributed by current occupied-bed share.</span>
        </div>

        {wardsNeedingSpace.length > 0 && (
          <div className="mx-5 mt-4 p-3 rounded-lg border border-rose-200 bg-rose-50 text-xs text-rose-800">
            <span className="font-bold">Additional space projected: </span>
            {wardsNeedingSpace.map(ward => `${ward.wardName} needs ${ward.additionalBedsNeeded} bed${ward.additionalBedsNeeded === 1 ? '' : 's'} by ${ward.peakOccupancyDate}`).join('; ')}.
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full min-w-max text-left text-xs text-slate-600">
            <thead className="bg-slate-50/80 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-3 px-4 sticky left-0 bg-slate-50">Ward</th>
                <th className="py-3 px-4">Current Occupied</th>
                {forecast.forecastDays.map(day => (
                  <th key={day.dayIndex} className="py-3 px-3 text-center">
                    <span className="block">{day.dayLabel}</span>
                    <span className="block normal-case font-medium text-slate-400">{day.dateLabel}</span>
                  </th>
                ))}
                <th className="py-3 px-4">Peak Occupancy</th>
                <th className="py-3 px-4">Additional Beds Needed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {forecast.wardForecasts.map(ward => (
                <tr key={ward.wardId} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 sticky left-0 bg-white">
                    <span className="block font-bold text-slate-900">{ward.wardName}</span>
                    <span className="text-[10px] text-slate-400">{ward.code}</span>
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-700">{ward.currentOccupied} / {ward.totalBeds}</td>
                  {forecast.forecastDays.map((day, index) => {
                    const occupied = ward.dailyOccupancy[index] ?? ward.currentOccupied;
                    const overCapacity = occupied > ward.totalBeds;
                    const nearCapacity = !overCapacity && ward.totalBeds > 0 && occupied / ward.totalBeds >= 0.9;
                    return (
                      <td
                        key={day.dayIndex}
                        className={`py-3 px-3 text-center font-bold ${
                          overCapacity ? 'bg-rose-50 text-rose-700' : nearCapacity ? 'bg-amber-50 text-amber-700' : 'text-slate-700'
                        }`}
                      >
                        {occupied} / {ward.totalBeds}
                      </td>
                    );
                  })}
                  <td className="py-3 px-4 font-bold text-slate-900">
                    {ward.peakPredictedOccupancy} / {ward.totalBeds}
                    <span className="block text-[10px] font-medium text-slate-400">{ward.peakOccupancyDate}</span>
                  </td>
                  <td className="py-3 px-4">
                    {ward.additionalBedsNeeded > 0 ? (
                      <span className="font-extrabold text-rose-700">{ward.additionalBedsNeeded} bed{ward.additionalBedsNeeded === 1 ? '' : 's'}</span>
                    ) : (
                      <span className="text-emerald-700">Within capacity</span>
                    )}
                  </td>
                </tr>
              ))}
              {forecast.wardForecasts.length === 0 && (
                <tr>
                  <td colSpan={forecast.forecastDays.length + 4} className="py-8 text-center text-slate-500">
                    Ward forecasts are unavailable because there is not enough historical data.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
