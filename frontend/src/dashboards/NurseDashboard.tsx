import React, { useState } from 'react';
import {
  HeartHandshake,
  Activity,
  Sparkles,
  Users,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Plus,
  ArrowRight,
  Stethoscope,
  ShieldAlert
} from 'lucide-react';
import { useHospital } from '../context/HospitalContext';
import { Patient, Bed } from '../types';

interface NurseDashboardProps {
  onRecordVitals?: (patient: Patient) => void;
}

export const NurseDashboard: React.FC<NurseDashboardProps> = ({ onRecordVitals }) => {
  const {
    patients,
    beds,
    vitals,
    cleaningLogs,
    startBedCleaning,
    completeBedCleaning,
    diagnosticRequests,
    setActiveTab
  } = useHospital();

  const [cleaningStaffName, setCleaningStaffName] = useState('Selvi M. (RN / Sanitation Lead)');
  const [cleaningNotes, setCleaningNotes] = useState('Hospital grade terminal disinfection completed.');
  const [activeBedModal, setActiveBedModal] = useState<Bed | null>(null);

  // Assigned ward patients
  const assignedPatients = patients.filter(p => p.status === 'ADMITTED');
  const cleaningRequiredBeds = beds.filter(b => b.status === 'CLEANING_REQUIRED');
  const cleaningInProgressBeds = beds.filter(b => b.status === 'CLEANING_IN_PROGRESS');

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-teal-900 to-slate-900 text-white rounded-2xl p-6 shadow-md border border-teal-800/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-teal-500/30 text-teal-300 border border-teal-400/20">
              Nursing & Ward Operations
            </span>
            <span className="text-xs text-slate-400">Selvi M. • Morning Shift • ICU & General</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">Ward Care & Sanitation Command</h1>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Monitor patient vital telemetry, administer bedside nursing care, track diagnostic scan movement, and verify terminal bed sanitization.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('Bed Cleaning')}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4" />
            <span>Bed Cleaning Station</span>
          </button>
          <button
            onClick={() => setActiveTab('Patients')}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl border border-slate-700 transition-all flex items-center gap-1.5"
          >
            <Users className="w-4 h-4" />
            <span>Patient Charts</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Assigned In-Patients</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-extrabold text-slate-900">{assignedPatients.length}</span>
            <p className="text-[11px] text-slate-400 mt-0.5">Active Beds Monitored</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Critical Vitals</span>
            <Activity className="w-4 h-4 text-rose-600" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-extrabold text-rose-600">2</span>
            <p className="text-[11px] text-rose-500 font-medium mt-0.5">ICU SpO2 & BP Alert</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Cleaning Required</span>
            <Sparkles className="w-4 h-4 text-orange-600" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-extrabold text-slate-900">{cleaningRequiredBeds.length}</span>
            <p className="text-[11px] text-orange-600 font-medium mt-0.5">Awaiting Housekeeping</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Cleaning In Progress</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-extrabold text-slate-900">{cleaningInProgressBeds.length}</span>
            <p className="text-[11px] text-amber-600 font-medium mt-0.5">Sanitization Underway</p>
          </div>
        </div>
      </div>

      {/* Bed Sanitation & Cleaning Queue Section */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-orange-500" />
              <span>Bed Sanitation & Cleaning Queue</span>
            </h3>
            <p className="text-xs text-slate-500">Beds freed post-discharge/transfer requiring decontamination before being marked AVAILABLE</p>
          </div>
          <span className="px-3 py-1 bg-orange-50 text-orange-700 text-xs font-bold rounded-xl border border-orange-200">
            {cleaningRequiredBeds.length + cleaningInProgressBeds.length} Beds in Sanitation Cycle
          </span>
        </div>

        {cleaningRequiredBeds.length === 0 && cleaningInProgressBeds.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-700">All Hospital Beds Sanitized</p>
            <p className="text-xs text-slate-400">No beds currently pending terminal cleaning.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Cleaning Required Cards */}
            {cleaningRequiredBeds.map(bed => (
              <div key={bed.id} className="bg-orange-50/60 rounded-xl p-4 border border-orange-200/80 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-extrabold text-sm text-slate-900">Bed {bed.number}</span>
                    <span className="px-2 py-0.5 bg-orange-200/70 text-orange-900 text-[10px] font-bold rounded-md uppercase">
                      CLEANING_REQUIRED
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-slate-700">{bed.wardName}</p>
                  <p className="text-[11px] text-slate-500 mt-1 italic">
                    {bed.notes || 'Post-discharge or post-transfer sanitization mandated'}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-orange-200/60 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-medium">Floor {bed.floor}</span>
                  <button
                    onClick={() => startBedCleaning(bed.id, cleaningStaffName)}
                    className="px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-lg shadow-xs transition-all flex items-center gap-1.5"
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>Start Cleaning</span>
                  </button>
                </div>
              </div>
            ))}

            {/* Cleaning In Progress Cards */}
            {cleaningInProgressBeds.map(bed => (
              <div key={bed.id} className="bg-amber-50/60 rounded-xl p-4 border border-amber-200/80 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-extrabold text-sm text-slate-900">Bed {bed.number}</span>
                    <span className="px-2 py-0.5 bg-amber-200 text-amber-900 text-[10px] font-bold rounded-md uppercase animate-pulse">
                      IN_PROGRESS
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-slate-700">{bed.wardName}</p>
                  <p className="text-[11px] text-slate-600 mt-1">
                    Staff: <span className="font-semibold">{bed.cleaningStaff || cleaningStaffName}</span>
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-amber-200/60 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">Terminal Disinfection</span>
                  <button
                    onClick={() => completeBedCleaning(bed.id, cleaningStaffName, cleaningNotes)}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-xs transition-all flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Mark AVAILABLE</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Patient Vitals & Nursing Observation Grid */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-slate-900">Patient Vitals & Nursing Rounds</h3>
            <p className="text-xs text-slate-500">Record hourly temperature, blood pressure, pulse oximetry, and respiratory telemetry</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50/80 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-3 px-4">Patient</th>
                <th className="py-3 px-4">Bed & Ward</th>
                <th className="py-3 px-4">Temperature</th>
                <th className="py-3 px-4">Blood Pressure</th>
                <th className="py-3 px-4">Heart Rate</th>
                <th className="py-3 px-4">SpO2 Level</th>
                <th className="py-3 px-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {assignedPatients.map(patient => {
                const patientVitals = vitals.find(v => v.patientId === patient.id);
                const isSpO2Critical = patientVitals && patientVitals.spO2 < 95;

                return (
                  <tr key={patient.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {patient.name}
                      <span className="text-[11px] text-slate-400 block font-normal">{patient.id} • {patient.gender} • {patient.age}y</span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 font-bold text-[11px]">
                        {patient.currentBedNumber || 'Bed Assigned'}
                      </span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">{patient.currentWardName}</span>
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-slate-800">
                      {patientVitals ? `${patientVitals.temperature} °F` : '98.6 °F (Est.)'}
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-slate-800">
                      {patientVitals ? `${patientVitals.bpSystolic}/${patientVitals.bpDiastolic} mmHg` : '120/80 mmHg'}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-bold text-rose-600">
                        {patientVitals ? `${patientVitals.heartRate} bpm` : '76 bpm'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded-md font-extrabold text-xs ${
                        isSpO2Critical ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {patientVitals ? `${patientVitals.spO2}%` : '98%'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => {
                          if (onRecordVitals) onRecordVitals(patient);
                          else setActiveTab('Patients');
                        }}
                        className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-bold transition-all flex items-center gap-1"
                      >
                        <Activity className="w-3.5 h-3.5" />
                        <span>Log Vitals</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
