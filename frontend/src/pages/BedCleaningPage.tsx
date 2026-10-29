import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Building2,
  BedDouble,
  User,
  Users,
  AlertTriangle,
  Zap,
  Plus,
  Phone,
  Timer,
  Star,
  Search,
  Filter,
  Check
} from 'lucide-react';
import { useHospital } from '../context/HospitalContext';
import { Housekeeper } from '../types';

export const BedCleaningPage: React.FC = () => {
  const {
    beds,
    cleaningLogs,
    housekeepers,
    cleaningDelaySeconds,
    setCleaningDelaySeconds,
    autoTurnoverEnabled,
    setAutoTurnoverEnabled,
    startBedCleaning,
    completeBedCleaning,
    autoCleanAllPendingBeds,
    addHousekeeper,
    updateHousekeeperStatus,
    setActiveTab
  } = useHospital();

  const [feedback, setFeedback] = useState<{ success: boolean; message: string } | null>(null);

  // Active view tab: 'OPERATIONS' or 'ROSTER'
  const [activeSubTab, setActiveSubTab] = useState<'OPERATIONS' | 'ROSTER'>('OPERATIONS');

  // Housekeeper Modal State
  const [showAddHkModal, setShowAddHkModal] = useState(false);
  const [hkName, setHkName] = useState('');
  const [hkTamilName, setHkTamilName] = useState('');
  const [hkPhone, setHkPhone] = useState('+91 98401 220');
  const [hkShift, setHkShift] = useState<'Morning' | 'Evening' | 'Night'>('Morning');
  const [hkWard, setHkWard] = useState('ICU – Intensive Care Unit');

  // Roster Filter
  const [shiftFilter, setShiftFilter] = useState<string>('ALL');
  const [rosterSearch, setRosterSearch] = useState('');

  // Selected housekeeper for manual assignment
  const [selectedStaffByBed, setSelectedStaffByBed] = useState<Record<string, string>>({});

  // Live timer tick for countdown progress bars
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 500);
    return () => clearInterval(timer);
  }, []);

  const cleaningRequiredBeds = beds.filter(b => b.status === 'CLEANING_REQUIRED');
  const cleaningInProgressBeds = beds.filter(b => b.status === 'CLEANING_IN_PROGRESS');
  const availableBeds = beds.filter(b => b.status === 'AVAILABLE');

  const availableHousekeepers = housekeepers.filter(h => h.status === 'AVAILABLE');
  const activeHousekeepers = housekeepers.filter(h => h.status === 'CLEANING');

  const handleAutoCleanAll = () => {
    const res = autoCleanAllPendingBeds('Automated Terminal UV Sterilization Protocol');
    setFeedback(res);
    setTimeout(() => setFeedback(null), 4500);
  };

  const handleAddHousekeeperSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hkName.trim()) return;

    addHousekeeper({
      name: hkName.trim(),
      tamilName: hkTamilName.trim() || undefined,
      phone: hkPhone.trim(),
      shift: hkShift,
      assignedWard: hkWard,
      rating: 4.9,
      speedMins: 8
    });

    setFeedback({ success: true, message: `Housekeeper ${hkName} added to active roster!` });
    setShowAddHkModal(false);
    setHkName('');
    setHkTamilName('');
    setTimeout(() => setFeedback(null), 4000);
  };

  const filteredHousekeepers = housekeepers.filter(hk => {
    if (shiftFilter !== 'ALL' && hk.shift !== shiftFilter) return false;
    if (rosterSearch.trim()) {
      const q = rosterSearch.toLowerCase();
      const matchName = hk.name.toLowerCase().includes(q) || (hk.tamilName && hk.tamilName.includes(q));
      const matchWard = hk.assignedWard.toLowerCase().includes(q);
      const matchPhone = hk.phone.includes(q);
      if (!matchName && !matchWard && !matchPhone) return false;
    }
    return true;
  });

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Sparkles className="w-7 h-7 text-orange-500" />
            <span>Bed Cleaning & Housekeeping Command</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Bed sanitization management: Beds entering cleaning are paired to dedicated housekeepers and sanitized immediately.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowAddHkModal(true)}
            className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4 text-slate-500" />
            <span>+ Add Housekeeper</span>
          </button>

          <button
            onClick={handleAutoCleanAll}
            disabled={cleaningRequiredBeds.length === 0 && cleaningInProgressBeds.length === 0}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-2 ${
              cleaningRequiredBeds.length === 0 && cleaningInProgressBeds.length === 0
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20 active:scale-95'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>Auto-Clean All Beds ({cleaningRequiredBeds.length + cleaningInProgressBeds.length})</span>
          </button>
        </div>
      </div>

      {feedback && (
        <div
          className={`p-3.5 rounded-xl text-xs font-bold flex items-center gap-2 border animate-in fade-in duration-200 ${
            feedback.success ? 'bg-emerald-50 text-emerald-900 border-emerald-200' : 'bg-slate-100 text-slate-800 border-slate-200'
          }`}
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{feedback.message}</span>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4.5 border border-slate-100 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Awaiting Sanitation</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-orange-600">{cleaningRequiredBeds.length}</span>
            <span className="text-xs text-slate-400">Beds</span>
          </div>
          <p className="text-[11px] text-orange-600 font-medium mt-1">Status: CLEANING_REQUIRED</p>
        </div>

        <div className="bg-white rounded-2xl p-4.5 border border-slate-100 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Active Cleaning Underway</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-amber-600">{cleaningInProgressBeds.length}</span>
            <span className="text-xs text-slate-400">Beds</span>
          </div>
          <p className="text-[11px] text-amber-600 font-medium mt-1">
            {activeHousekeepers.length} Housekeepers Dispatched
          </p>
        </div>

        <div className="bg-white rounded-2xl p-4.5 border border-slate-100 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Housekeeping Staff Team</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-blue-600">{housekeepers.length}</span>
            <span className="text-xs text-slate-400">Housekeepers</span>
          </div>
          <p className="text-[11px] text-emerald-600 font-medium mt-1">
            {availableHousekeepers.length} On-Duty Available
          </p>
        </div>

        <div className="bg-white rounded-2xl p-4.5 border border-slate-100 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Available Sterile Ready Beds</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-emerald-600">{availableBeds.length}</span>
            <span className="text-xs text-slate-400">Beds</span>
          </div>
          <p className="text-[11px] text-emerald-600 font-medium mt-1">Ready for Incoming Patients</p>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveSubTab('OPERATIONS')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeSubTab === 'OPERATIONS'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <BedDouble className="w-4 h-4" />
          <span>Active Bed Cleaning Operations ({cleaningInProgressBeds.length + cleaningRequiredBeds.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('ROSTER')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeSubTab === 'ROSTER'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Housekeeping Team Roster ({housekeepers.length} Staff)</span>
        </button>
      </div>

      {/* TAB 1: OPERATIONS */}
      {activeSubTab === 'OPERATIONS' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Cleaning In Progress Queue with LIVE COUNTDOWN */}
            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
                    <span>Active Cleaning & Decontamination Queue</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Beds currently being serviced by dedicated housekeeping staff
                  </p>
                </div>
                <span className="px-2.5 py-0.5 bg-amber-100 text-amber-800 text-xs font-bold rounded-lg animate-pulse">
                  {cleaningInProgressBeds.length} Active Cleanings
                </span>
              </div>

              {cleaningInProgressBeds.length === 0 ? (
                <div className="text-center py-10 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-80" />
                  <p className="text-xs font-bold text-slate-700">No beds currently undergoing cleaning</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    When a patient is discharged, their bed automatically enters cleaning and is certified available.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {cleaningInProgressBeds.map(bed => {
                    return (
                      <div
                        key={bed.id}
                        className="p-4 bg-amber-50/60 rounded-xl border border-amber-200/90 shadow-2xs space-y-3"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-black text-slate-900 text-sm">Bed {bed.number}</span>
                              <span className="px-2 py-0.5 bg-white text-slate-700 rounded-md text-[10px] font-bold border border-slate-200">
                                {bed.wardName}
                              </span>
                              <span className="text-[10px] text-slate-400 font-medium">Floor {bed.floor}</span>
                            </div>

                            <p className="text-xs text-slate-700 mt-1 flex items-center gap-1.5">
                              <User className="w-3.5 h-3.5 text-blue-600" />
                              <span>
                                Assigned Housekeeper: <strong className="text-slate-900">{bed.cleaningStaff || 'On-Duty Housekeeper'}</strong>
                              </span>
                            </p>
                          </div>

                          <div className="text-right shrink-0">
                            <span className="px-2.5 py-1 bg-amber-200/80 text-amber-900 rounded-lg text-xs font-bold flex items-center gap-1.5">
                              <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                              <span>Sanitization In Progress</span>
                            </span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-between pt-1 border-t border-amber-200/60">
                          <span className="text-[11px] text-slate-500">
                            Housekeeper assigned & cleaning underway
                          </span>

                          <button
                            onClick={() => {
                              completeBedCleaning(bed.id, bed.cleaningStaff, 'Terminal sanitization completed.');
                              setFeedback({ success: true, message: `Bed ${bed.number} finished cleaning and is now AVAILABLE!` });
                              setTimeout(() => setFeedback(null), 4000);
                            }}
                            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 active:scale-95"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Mark Cleaned & Available</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Required Sanitation Queue */}
            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900">Pending Sanitation Queue</h3>
                  <p className="text-xs text-slate-400">Beds awaiting assignment or manual dispatch</p>
                </div>
                <span className="px-2.5 py-0.5 bg-orange-100 text-orange-800 text-xs font-bold rounded-lg">
                  {cleaningRequiredBeds.length} Pending
                </span>
              </div>

              {cleaningRequiredBeds.length === 0 ? (
                <div className="text-center py-10 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                  <Check className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-80" />
                  <p className="text-xs font-bold text-slate-700">No beds pending cleaning</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">All vacated beds have already been cleaned and restored.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {cleaningRequiredBeds.map(bed => {
                    const selectedHkName = selectedStaffByBed[bed.id] || (availableHousekeepers[0]?.name || 'Selvi M.');

                    return (
                      <div
                        key={bed.id}
                        className="p-4 bg-orange-50/50 rounded-xl border border-orange-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-slate-900">Bed {bed.number}</span>
                            <span className="text-xs text-slate-500 font-semibold">{bed.wardName}</span>
                            <span className="text-[10px] text-slate-400">Floor {bed.floor}</span>
                          </div>
                          <p className="text-xs text-slate-600 mt-1 italic">{bed.notes || 'Post-patient turnaround required'}</p>

                          {/* Housekeeper Selector */}
                          <div className="mt-2 flex items-center gap-2 text-xs">
                            <span className="text-slate-500 font-medium">Assign:</span>
                            <select
                              value={selectedHkName}
                              onChange={e => setSelectedStaffByBed({ ...selectedStaffByBed, [bed.id]: e.target.value })}
                              className="px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs font-semibold outline-none"
                            >
                              {housekeepers.map(h => (
                                <option key={h.id} value={h.name}>
                                  {h.name} ({h.shift} - {h.status})
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => {
                              completeBedCleaning(bed.id, selectedHkName, 'Rapid automated terminal UV decontamination certified.');
                              setFeedback({ success: true, message: `Bed ${bed.number} cleaned immediately & restored to AVAILABLE!` });
                              setTimeout(() => setFeedback(null), 4000);
                            }}
                            className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center gap-1.5"
                            title="Instantly execute automated terminal UV disinfection"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Auto Clean</span>
                          </button>

                          <button
                            onClick={() => startBedCleaning(bed.id, selectedHkName)}
                            className="px-3 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center gap-1.5"
                          >
                            <Clock className="w-3.5 h-3.5" />
                            <span>Start Cleaning</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Completed Sanitation Certificates Log */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-slate-900">Completed Sanitation Certificates Log</h3>
                <p className="text-xs text-slate-500">Official infection control and bed sanitization records</p>
              </div>
              <span className="text-xs text-slate-400 font-semibold">{cleaningLogs.length} Records</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50/80 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-100">
                  <tr>
                    <th className="py-3 px-4">Log ID</th>
                    <th className="py-3 px-4">Bed Number</th>
                    <th className="py-3 px-4">Ward</th>
                    <th className="py-3 px-4">Housekeeper Staff</th>
                    <th className="py-3 px-4">Started At</th>
                    <th className="py-3 px-4">Completed At</th>
                    <th className="py-3 px-4">Certification Notes</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {cleaningLogs.slice(0, 15).map(log => (
                    <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">{log.id}</td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">{log.bedNumber}</td>
                      <td className="py-3.5 px-4">{log.wardName}</td>
                      <td className="py-3.5 px-4 font-semibold text-slate-800">{log.staffName}</td>
                      <td className="py-3.5 px-4 text-slate-500">
                        {new Date(log.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500">
                        {log.completionTime
                          ? new Date(log.completionTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
                          : 'In progress'}
                      </td>
                      <td className="py-3.5 px-4 max-w-xs truncate">{log.notes}</td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 text-[10px] font-bold rounded-md ${
                            log.status === 'COMPLETED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: HOUSEKEEPING ROSTER */}
      {activeSubTab === 'ROSTER' && (
        <div className="space-y-6">
          {/* Roster Controls */}
          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1 max-w-md">
              <div className="relative w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={rosterSearch}
                  onChange={e => setRosterSearch(e.target.value)}
                  placeholder="Search housekeeper by name, Tamil script, ward or phone..."
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-bold">Shift:</span>
              {(['ALL', 'Morning', 'Evening', 'Night'] as const).map(shift => (
                <button
                  key={shift}
                  onClick={() => setShiftFilter(shift)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    shiftFilter === shift ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {shift}
                </button>
              ))}
            </div>
          </div>

          {/* Housekeeper Staff Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredHousekeepers.map(hk => {
              const isAvailable = hk.status === 'AVAILABLE';
              const isCleaning = hk.status === 'CLEANING';

              return (
                <div
                  key={hk.id}
                  className={`rounded-2xl p-4.5 border transition-all shadow-xs flex flex-col justify-between ${
                    isCleaning
                      ? 'bg-amber-50/50 border-amber-200'
                      : isAvailable
                      ? 'bg-white border-slate-100 hover:border-slate-200'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-2.5">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm text-white ${
                            isCleaning
                              ? 'bg-gradient-to-br from-amber-500 to-orange-600 shadow-md shadow-amber-500/20'
                              : 'bg-gradient-to-br from-blue-500 to-indigo-600 shadow-md shadow-blue-500/20'
                          }`}
                        >
                          {hk.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-extrabold text-sm text-slate-900">{hk.name}</h4>
                          {hk.tamilName && (
                            <span className="text-[11px] text-slate-400 font-medium block">{hk.tamilName}</span>
                          )}
                        </div>
                      </div>

                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase ${
                          isAvailable
                            ? 'bg-emerald-100 text-emerald-800'
                            : isCleaning
                            ? 'bg-amber-100 text-amber-800 animate-pulse'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {hk.status}
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-600 mt-3 pt-3 border-t border-slate-100">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Shift:</span>
                        <span className="font-bold text-slate-800">{hk.shift} Shift</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Assigned Ward:</span>
                        <span className="font-semibold text-slate-800 text-right truncate max-w-[150px]">{hk.assignedWard}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Telephone:</span>
                        <span className="font-mono text-slate-700">{hk.phone}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Beds Cleaned Today:</span>
                        <span className="font-extrabold text-blue-600">{hk.bedsCleanedToday} Beds</span>
                      </div>

                      {isCleaning && hk.activeBedNumber && (
                        <div className="mt-2 p-2 bg-amber-100/70 rounded-xl text-amber-900 text-[11px] font-bold flex items-center justify-between">
                          <span>Actively Servicing:</span>
                          <span>Bed {hk.activeBedNumber}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Housekeeper Actions */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      <span>{hk.rating || 4.9} Speed Rating</span>
                    </span>

                    <button
                      onClick={() => {
                        const nextStatus: Housekeeper['status'] = isAvailable ? 'ON_BREAK' : isCleaning ? 'AVAILABLE' : 'AVAILABLE';
                        updateHousekeeperStatus(hk.id, nextStatus);
                      }}
                      className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all"
                    >
                      {isAvailable ? 'Set Break' : 'Set Available'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Add Housekeeper Modal */}
      {showAddHkModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                <span>Add New Housekeeper Staff</span>
              </h3>
              <button
                onClick={() => setShowAddHkModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddHousekeeperSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Housekeeper Full Name *</label>
                <input
                  type="text"
                  required
                  value={hkName}
                  onChange={e => setHkName(e.target.value)}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:border-blue-500 font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Tamil Name (Optional)</label>
                <input
                  type="text"
                  value={hkTamilName}
                  onChange={e => setHkTamilName(e.target.value)}
                  placeholder="e.g. ரமேஷ் குமார்"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Shift</label>
                  <select
                    value={hkShift}
                    onChange={e => setHkShift(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none"
                  >
                    <option value="Morning">Morning (06:00 - 14:00)</option>
                    <option value="Evening">Evening (14:00 - 22:00)</option>
                    <option value="Night">Night (22:00 - 06:00)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Contact Phone</label>
                  <input
                    type="text"
                    required
                    value={hkPhone}
                    onChange={e => setHkPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Assigned Primary Ward</label>
                <select
                  value={hkWard}
                  onChange={e => setHkWard(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none"
                >
                  <option value="ICU – Intensive Care Unit">ICU – Intensive Care Unit</option>
                  <option value="Cardiology Ward">Cardiology Ward</option>
                  <option value="Emergency & Trauma Care">Emergency & Trauma Care</option>
                  <option value="Maternity & Obstetrics Ward">Maternity & Obstetrics Ward</option>
                  <option value="Paediatric Ward">Paediatric Ward</option>
                  <option value="General Medicine Ward">General Medicine Ward</option>
                  <option value="Orthopaedics Ward">Orthopaedics Ward</option>
                  <option value="Neurology & Stroke Unit">Neurology & Stroke Unit</option>
                  <option value="Nephrology & Dialysis Ward">Nephrology & Dialysis Ward</option>
                  <option value="Surgical Post-Op Ward">Surgical Post-Op Ward</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddHkModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md shadow-blue-600/20"
                >
                  Add to Roster
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
