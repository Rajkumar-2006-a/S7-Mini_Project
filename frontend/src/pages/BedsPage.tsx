import React, { useState } from 'react';
import {
  BedDouble,
  Building2,
  Sparkles,
  Wrench,
  Users,
  CheckCircle2,
  Clock,
  ArrowRight,
  Filter,
  Search,
  ShieldCheck,
  AlertTriangle,
  Info
} from 'lucide-react';
import { useHospital } from '../context/HospitalContext';
import { Bed, BedStatus } from '../types';

export const BedsPage: React.FC = () => {
  const {
    beds,
    wards,
    startBedCleaning,
    completeBedCleaning,
    setBedMaintenance,
    restoreBedFromMaintenance,
    currentRole,
    setActiveTab,
    selectedWardFilter,
    setSelectedWardFilter,
    setSelectedPatientForTransferId
  } = useHospital();

  const [selectedWardId, setSelectedWardId] = useState<string>(selectedWardFilter || 'ALL');
  const [bedSearch, setBedSearch] = useState('');
  const [selectedBed, setSelectedBed] = useState<Bed | null>(null);
  const [maintenanceReason, setMaintenanceReason] = useState('Hydraulic bed height adjustment mechanism inspection');

  // Keep local state in sync if navigated with a specific ward filter
  React.useEffect(() => {
    if (selectedWardFilter) {
      setSelectedWardId(selectedWardFilter);
    }
  }, [selectedWardFilter]);

  const handleWardChange = (wardId: string) => {
    setSelectedWardId(wardId);
    setSelectedWardFilter(wardId);
  };

  // Filtered beds
  const filteredBeds = beds.filter(bed => {
    if (selectedWardId !== 'ALL' && bed.wardId !== selectedWardId) return false;
    const search = bedSearch.trim().toLowerCase();
    if (search && ![bed.number, bed.wardName, bed.patientName || '', bed.status.replaceAll('_', ' ')].some(value => value.toLowerCase().includes(search))) return false;
    return true;
  });

  const totalBeds = beds.length;
  const occupiedCount = beds.filter(b => b.status === 'OCCUPIED').length;
  const availableCount = beds.filter(b => b.status === 'AVAILABLE').length;
  const cleaningCount = beds.filter(b => b.status === 'CLEANING_REQUIRED' || b.status === 'CLEANING_IN_PROGRESS').length;
  const maintenanceCount = beds.filter(b => b.status === 'MAINTENANCE').length;
  const wardBedCounts = beds.reduce((counts, bed) => {
    const wardCounts = counts.get(bed.wardId) ?? { occupied: 0, available: 0, total: 0 };
    wardCounts.total += 1;
    if (bed.status === 'OCCUPIED') wardCounts.occupied += 1;
    if (bed.status === 'AVAILABLE') wardCounts.available += 1;
    counts.set(bed.wardId, wardCounts);
    return counts;
  }, new Map<string, { occupied: number; available: number; total: number }>());

  const getStatusBadge = (status: BedStatus) => {
    switch (status) {
      case 'AVAILABLE':
        return <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-extrabold rounded-md uppercase">AVAILABLE</span>;
      case 'OCCUPIED':
        return <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-extrabold rounded-md uppercase">OCCUPIED</span>;
      case 'CLEANING_REQUIRED':
        return <span className="px-2 py-0.5 bg-orange-100 text-orange-800 text-[10px] font-extrabold rounded-md uppercase">CLEANING REQUIRED</span>;
      case 'CLEANING_IN_PROGRESS':
        return <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-extrabold rounded-md uppercase animate-pulse">CLEANING IN PROGRESS</span>;
      case 'MAINTENANCE':
        return <span className="px-2 py-0.5 bg-slate-200 text-slate-700 text-[10px] font-extrabold rounded-md uppercase">MAINTENANCE</span>;
    }
  };

  const getStatusCardColor = (status: BedStatus) => {
    switch (status) {
      case 'AVAILABLE':
        return 'border-emerald-200 bg-emerald-50/40 hover:bg-emerald-50';
      case 'OCCUPIED':
        return 'border-blue-200 bg-blue-50/40 hover:bg-blue-50';
      case 'CLEANING_REQUIRED':
        return 'border-orange-200 bg-orange-50/40 hover:bg-orange-50';
      case 'CLEANING_IN_PROGRESS':
        return 'border-amber-200 bg-amber-50/40 hover:bg-amber-50';
      case 'MAINTENANCE':
        return 'border-slate-300 bg-slate-100/70 hover:bg-slate-100';
    }
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <BedDouble className="w-7 h-7 text-blue-600" />
            <span>Hospital Bed Capacity & Ward Map</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time status of all {totalBeds} beds across 14 specialized wards in Tamil Nadu facility.
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-800 border border-blue-200 rounded-lg shadow-2xs font-extrabold">
            <span>{totalBeds > 0 ? ((occupiedCount / totalBeds) * 100).toFixed(1) : 0}% Occupancy</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white border border-slate-200 rounded-lg shadow-2xs">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-slate-600 font-semibold">{availableCount} Available</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white border border-slate-200 rounded-lg shadow-2xs">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            <span className="text-slate-600 font-semibold">{occupiedCount} Occupied</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white border border-slate-200 rounded-lg shadow-2xs">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
            <span className="text-slate-600 font-semibold">{cleaningCount} Cleaning</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white border border-slate-200 rounded-lg shadow-2xs">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
            <span className="text-slate-600 font-semibold">{maintenanceCount} Maintenance</span>
          </div>
        </div>
      </div>

      <form onSubmit={event => event.preventDefault()} className="grid grid-cols-1 md:grid-cols-[minmax(240px,1fr)_minmax(240px,1fr)_auto_auto] items-end gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
        <label className="block text-xs font-semibold text-slate-600">
          Ward
          <span className="relative mt-1.5 block">
            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <select
              aria-label="Filter beds by ward"
              value={selectedWardId}
              onChange={event => handleWardChange(event.target.value)}
              className="w-full h-10 appearance-none rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-xs font-medium text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            >
              <option value="ALL">All Wards ({totalBeds} beds)</option>
              {wards.map(ward => {
                const counts = wardBedCounts.get(ward.id) ?? { occupied: 0, available: 0, total: 0 };
                const notOccupied = counts.total - counts.occupied;
                return (
                  <option key={ward.id} value={ward.id}>
                    {ward.name} | {counts.occupied} occupied | {notOccupied} not occupied | {counts.available} available | {counts.total} total
                  </option>
                );
              })}
            </select>
          </span>
        </label>

        <label className="block text-xs font-semibold text-slate-600">
          Search beds
          <span className="relative mt-1.5 block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="search"
              value={bedSearch}
              onChange={event => setBedSearch(event.target.value)}
              placeholder="Bed number, patient, or status"
              className="w-full h-10 rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </span>
        </label>

        <button
          type="button"
          onClick={() => { handleWardChange('ALL'); setBedSearch(''); }}
          disabled={selectedWardId === 'ALL' && bedSearch === ''}
          className="h-10 rounded-lg border border-slate-200 px-4 text-xs font-bold text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Clear filters
        </button>

        <span className="pb-2 text-xs font-bold text-slate-500 whitespace-nowrap">
          Showing {filteredBeds.length} of {totalBeds} beds
        </span>
      </form>

      {/* Bed Grid Visualizer */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
        {filteredBeds.map(bed => {
          return (
            <div
              key={bed.id}
              onClick={() => setSelectedBed(bed)}
              className={`rounded-2xl p-3.5 border transition-all cursor-pointer flex flex-col justify-between relative shadow-2xs ${getStatusCardColor(bed.status)}`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-extrabold text-sm text-slate-900 tracking-tight">
                    {bed.number}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400">
                    Fl.{bed.floor}
                  </span>
                </div>

                <div className="mb-2">
                  {getStatusBadge(bed.status)}
                </div>

                <p className="text-[11px] font-semibold text-slate-700 line-clamp-1">
                  {bed.wardName.replace('Ward', '').trim()}
                </p>

                {bed.status === 'OCCUPIED' && bed.patientName && (
                  <p className="text-[11px] font-bold text-blue-900 mt-1 line-clamp-1">
                    {bed.patientName}
                  </p>
                )}

                {bed.status === 'CLEANING_IN_PROGRESS' && (
                  <p className="text-[10px] font-bold text-amber-800 mt-1 line-clamp-1 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-600 shrink-0" />
                    <span className="truncate">{bed.cleaningStaff || 'Housekeeper Servicing'}</span>
                  </p>
                )}

                {bed.status === 'MAINTENANCE' && (
                  <p className="text-[10px] text-slate-500 mt-1 italic line-clamp-1">
                    {bed.notes || 'Engineering Check'}
                  </p>
                )}
              </div>

              <div className="mt-3 pt-2 border-t border-slate-200/50 flex items-center justify-between text-[10px] text-slate-400">
                <span>{bed.doctorName ? bed.doctorName.split(' ')[1] : 'Bed Ready'}</span>
                <ArrowRight className="w-3 h-3 text-slate-400" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Bed Detail Drawer / Modal */}
      {selectedBed && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                  <span>Bed {selectedBed.number}</span>
                  {getStatusBadge(selectedBed.status)}
                </h3>
                <p className="text-xs text-slate-500">{selectedBed.wardName} • Floor {selectedBed.floor}</p>
              </div>
              <button
                onClick={() => setSelectedBed(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs text-slate-700">
              {selectedBed.status === 'OCCUPIED' ? (
                <div className="p-3.5 bg-blue-50/80 rounded-2xl border border-blue-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">Current In-Patient:</span>
                    <span className="font-extrabold text-blue-900">{selectedBed.patientName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Attending Doctor:</span>
                    <span className="font-bold text-slate-800">{selectedBed.doctorName || 'Assigned Consultant'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Admission Timestamp:</span>
                    <span className="font-medium text-slate-700">
                      {selectedBed.admissionDate ? new Date(selectedBed.admissionDate).toLocaleString('en-IN') : 'Recent'}
                    </span>
                  </div>
                </div>
              ) : selectedBed.status === 'AVAILABLE' ? (
                <div className="p-3.5 bg-emerald-50/80 rounded-2xl border border-emerald-100">
                  <p className="font-bold text-emerald-900">Bed is Clean & Ready for Admission</p>
                  <p className="text-[11px] text-emerald-700 mt-0.5">
                    Terminal sanitization completed. Reception can assign this bed directly to incoming patients.
                  </p>
                </div>
              ) : (
                <div className="p-3.5 bg-amber-50/80 rounded-2xl border border-amber-100">
                  <p className="font-bold text-amber-900">Bed is Currently Unavailable for Admission</p>
                  <p className="text-[11px] text-amber-800 mt-0.5">
                    {selectedBed.notes || 'In sanitation or engineering service cycle.'}
                  </p>
                </div>
              )}

              {/* Action Buttons for Bed States */}
              <div className="space-y-2 pt-2">
                <span className="font-bold text-[11px] text-slate-400 uppercase tracking-wider block">Operational Controls</span>

                {selectedBed.status === 'CLEANING_REQUIRED' && (
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        completeBedCleaning(selectedBed.id, 'Automated Terminal UV Protocol', 'Automated rapid terminal UV decontamination certified.');
                        setSelectedBed(null);
                      }}
                      className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-2 shadow-sm"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Auto-Clean Bed (Instantly AVAILABLE)</span>
                    </button>
                    <button
                      onClick={() => {
                        startBedCleaning(selectedBed.id, 'Selvi M. (RN / Housekeeping Lead)');
                        setSelectedBed(null);
                      }}
                      className="w-full py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-2"
                    >
                      <Clock className="w-4 h-4" />
                      <span>Start Manual Cleaning</span>
                    </button>
                  </div>
                )}

                {selectedBed.status === 'CLEANING_IN_PROGRESS' && (
                  <div className="space-y-2">
                    <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs">
                      <p className="font-bold text-amber-950 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-spin" />
                        <span>Terminal Cleaning Underway</span>
                      </p>
                      <p className="text-slate-600 mt-1">
                        Assigned Housekeeper: <strong className="text-slate-900">{selectedBed.cleaningStaff || 'On-Duty Housekeeper'}</strong>
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        completeBedCleaning(selectedBed.id, selectedBed.cleaningStaff, 'Sanitization certified complete.');
                        setSelectedBed(null);
                      }}
                      className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-2 shadow-sm"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Mark Bed Cleaned & Available</span>
                    </button>
                  </div>
                )}

                {selectedBed.status === 'AVAILABLE' && (
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        setActiveTab('Admissions');
                        setSelectedBed(null);
                      }}
                      className="py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-1.5"
                    >
                      <span>Admit Patient Here</span>
                    </button>
                    <button
                      onClick={() => {
                        setBedMaintenance(selectedBed.id, maintenanceReason);
                        setSelectedBed(null);
                      }}
                      className="py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-1.5"
                    >
                      <Wrench className="w-3.5 h-3.5" />
                      <span>Set Maintenance</span>
                    </button>
                  </div>
                )}

                {selectedBed.status === 'MAINTENANCE' && (
                  <button
                    onClick={() => {
                      restoreBedFromMaintenance(selectedBed.id);
                      setSelectedBed(null);
                    }}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Maintenance Finished (Restore to AVAILABLE)</span>
                  </button>
                )}

                {selectedBed.status === 'OCCUPIED' && (
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        if (selectedBed.patientId) {
                          setSelectedPatientForTransferId(selectedBed.patientId);
                        }
                        setActiveTab('Transfers');
                        setSelectedBed(null);
                      }}
                      className="py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-1"
                    >
                      <span>Transfer Patient</span>
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab('Discharges');
                        setSelectedBed(null);
                      }}
                      className="py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-1"
                    >
                      <span>Discharge Patient</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
