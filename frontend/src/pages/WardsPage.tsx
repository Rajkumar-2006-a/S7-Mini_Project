import React from 'react';
import { Building2, BedDouble, Users, Sparkles, ChevronRight } from 'lucide-react';
import { useHospital } from '../context/HospitalContext';

export const WardsPage: React.FC = () => {
  const { wards, setActiveTab } = useHospital();

  const totalBeds = wards.reduce((acc, w) => acc + w.totalBeds, 0);
  const totalOccupied = wards.reduce((acc, w) => acc + w.occupiedBeds, 0);
  const totalAvailable = wards.reduce((acc, w) => acc + w.availableBeds, 0);
  const overallOccupancyRate = totalBeds > 0 ? Math.round((totalOccupied / totalBeds) * 100) : 0;
  const highStrainWardsCount = wards.filter(w => (w.occupancyRate ?? (w.totalBeds > 0 ? Math.round((w.occupiedBeds / w.totalBeds) * 100) : 0)) >= 85).length;

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Building2 className="w-7 h-7 text-indigo-600" />
            <span>Hospital Wards & Speciality Departments</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Explore all {wards.length} clinical wards, floor directories, bed occupancy ratios, and specialized staffing.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1.5 bg-blue-50 text-blue-800 font-extrabold rounded-xl border border-blue-200">
            {overallOccupancyRate}% Facility Occupancy ({totalOccupied}/{totalBeds})
          </span>
        </div>
      </div>

      {/* Hospital Overall Capacity Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4.5 border border-slate-100 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Total Wards</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900">{wards.length}</span>
            <span className="text-xs text-slate-400">Departments</span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium mt-1">Ground to 5th Floor</p>
        </div>

        <div className="bg-white rounded-2xl p-4.5 border border-slate-100 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Total In-Patients</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-blue-600">{totalOccupied}</span>
            <span className="text-xs text-slate-400">of {totalBeds} Beds</span>
          </div>
          <p className="text-[11px] text-blue-600 font-medium mt-1">Live Occupancy ({overallOccupancyRate}%)</p>
        </div>

        <div className="bg-white rounded-2xl p-4.5 border border-slate-100 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Ready Beds Available</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-emerald-600">{totalAvailable}</span>
            <span className="text-xs text-slate-400">Available</span>
          </div>
          <p className="text-[11px] text-emerald-600 font-medium mt-1">Immediate Admission</p>
        </div>

        <div className="bg-white rounded-2xl p-4.5 border border-slate-100 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">High-Strain Wards</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className={`text-2xl font-extrabold ${highStrainWardsCount > 0 ? 'text-rose-600' : 'text-slate-900'}`}>{highStrainWardsCount}</span>
            <span className="text-xs text-slate-400">Wards ≥ 85%</span>
          </div>
          <p className="text-[11px] text-rose-500 font-medium mt-1">Priority Transfer Monitoring</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {wards.map(ward => {
          const occupancy = ward.occupancyRate ?? (ward.totalBeds > 0 ? Math.round((ward.occupiedBeds / ward.totalBeds) * 100) : 0);
          const isHighStrain = occupancy >= 85;

          return (
            <div
              key={ward.id}
              onClick={() => setActiveTab('Beds', ward.id)}
              className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-0.5 bg-slate-100 text-slate-700 font-mono font-bold text-[10px] rounded-md uppercase">
                    {ward.code} • Floor {ward.floor}
                  </span>
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md ${
                    isHighStrain ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {occupancy}% OCCUPIED
                  </span>
                </div>

                <h3 className="text-base font-extrabold text-slate-900 mt-1">{ward.name}</h3>
                <p className="text-xs text-slate-500 mt-1">{ward.description}</p>

                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-600">{ward.occupiedBeds} of {ward.totalBeds} Beds Occupied</span>
                    <span className="text-emerald-600 font-bold">{ward.availableBeds} Available</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden flex">
                    <div
                      className={`h-full ${isHighStrain ? 'bg-rose-500' : 'bg-blue-500'}`}
                      style={{ width: `${occupancy}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700">₹ {ward.costPerDay.toLocaleString('en-IN')}/day</span>
                <span className="text-blue-600 font-bold flex items-center gap-1">
                  View Beds <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
