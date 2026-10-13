import React from 'react';
import { AlertTriangle, ArrowRight } from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';

export const CapacityAlertBanner: React.FC = () => {
  const { wards, setActiveTab } = useHospital();
  
  const icu = wards.find(w => w.code === 'ICU');
  const icuOccupied = icu ? icu.occupiedBeds : 18;
  const icuTotal = icu ? icu.totalBeds : 20;
  const icuPercent = Math.round((icuOccupied / icuTotal) * 100);

  return (
    <div className="mt-6 rounded-2xl bg-amber-50/90 border border-amber-200/80 p-4.5 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
      <div className="flex items-start sm:items-center gap-3.5">
        <div className="p-2.5 rounded-xl bg-amber-500 text-white shrink-0 shadow-sm">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-amber-950">
            ICU occupancy is at {icuPercent}% ({icuOccupied}/{icuTotal} beds)
          </h4>
          <p className="text-xs text-amber-800/90 mt-0.5">
            Consider stepping down stable post-critical patients to General Medicine or preparing emergency overflow capacity.
          </p>
        </div>
      </div>

      <button
        onClick={() => setActiveTab('Beds', 'w-icu')}
        className="self-start sm:self-center shrink-0 flex items-center gap-2 px-4 py-2 bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-bold rounded-xl transition-all border border-amber-300/60 shadow-xs"
      >
        <span>View ICU Beds</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
