import React, { useState } from 'react';
import {
  Users,
  Stethoscope,
  Activity,
  ArrowLeftRight,
  FileText,
  AlertCircle,
  Plus,
  Eye,
  CheckCircle2,
  Calendar,
  Sparkles,
  ClipboardList,
  Heart
} from 'lucide-react';
import { useHospital } from '../context/HospitalContext';
import { Patient, DiagnosticRequest } from '../types';

interface DoctorDashboardProps {
  onSelectPatient?: (patient: Patient) => void;
  onRequestDiagnostic?: (patient: Patient) => void;
  onTransferPatient?: (patient: Patient) => void;
}

export const DoctorDashboard: React.FC<DoctorDashboardProps> = ({
  onSelectPatient,
  onRequestDiagnostic,
  onTransferPatient
}) => {
  const { patients, diagnosticRequests, diagnosticReports, transfers, vitals, setActiveTab } = useHospital();

  const [filter, setFilter] = useState<'ALL' | 'ICU' | 'CRITICAL'>('ALL');

  const myPatients = patients.filter(p => p.status === 'ADMITTED');
  const pendingScans = diagnosticRequests.filter(r => r.status !== 'REPORTED' && r.status !== 'CANCELLED');
  const availableReports = diagnosticReports.slice(0, 4);

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-900 to-slate-900 text-white rounded-2xl p-6 shadow-md border border-indigo-800/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/30 text-indigo-300 border border-indigo-400/20">
              Doctor Command Center
            </span>
            <span className="text-xs text-slate-400">Dr. S. Karthikeyan • General Medicine & ICU</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">Clinical Care & Patient Rounds</h1>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Review live vitals, order X-Ray/CT/MRI scans, recommend inter-ward transfers to ICU, and authorize patient discharge approvals.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('Diagnostics')}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5"
          >
            <Activity className="w-4 h-4" />
            <span>Order Scan</span>
          </button>
          <button
            onClick={() => setActiveTab('Transfers')}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl border border-slate-700 transition-all flex items-center gap-1.5"
          >
            <ArrowLeftRight className="w-4 h-4" />
            <span>Transfer to ICU</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">My Patients</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-extrabold text-slate-900">{myPatients.length}</span>
            <p className="text-[11px] text-slate-400 mt-0.5">Under Clinical Care</p>
          </div>
        </div>

        <div 
          onClick={() => setActiveTab('Beds', 'w-icu')}
          className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs cursor-pointer hover:border-rose-200 hover:shadow-xs transition-all"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">ICU Patients</span>
            <Activity className="w-4 h-4 text-rose-600" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-extrabold text-slate-900">
              {myPatients.filter(p => p.currentWardName?.includes('ICU')).length}
            </span>
            <p className="text-[11px] text-rose-500 font-medium mt-0.5">High Vigilance • View ICU Beds</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Pending Scans</span>
            <ClipboardList className="w-4 h-4 text-amber-600" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-extrabold text-slate-900">{pendingScans.length}</span>
            <p className="text-[11px] text-amber-600 font-medium mt-0.5">Awaiting Radiology</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Reports Ready</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-extrabold text-slate-900">{availableReports.length}</span>
            <p className="text-[11px] text-emerald-600 font-medium mt-0.5">Ready for Review</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Active Transfers</span>
            <ArrowLeftRight className="w-4 h-4 text-purple-600" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-extrabold text-slate-900">{transfers.length}</span>
            <p className="text-[11px] text-slate-400 mt-0.5">Inter-Ward History</p>
          </div>
        </div>
      </div>

      {/* Patient List Grid */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-sm text-slate-900">Current In-Patients Under Care</h3>
            <p className="text-xs text-slate-500">Real-time medical status, assigned bed numbers, and instant clinical actions</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilter('ALL')}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
                filter === 'ALL' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Wards
            </button>
            <button
              onClick={() => setFilter('ICU')}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
                filter === 'ICU' ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              ICU Only
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50/80 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-3 px-4">Patient Info</th>
                <th className="py-3 px-4">Ward & Bed</th>
                <th className="py-3 px-4">Primary Diagnosis</th>
                <th className="py-3 px-4">Admission Date</th>
                <th className="py-3 px-4">Latest Vitals</th>
                <th className="py-3 px-4 text-right">Clinical Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {myPatients
                .filter(p => filter === 'ALL' || (filter === 'ICU' && p.currentWardName?.includes('ICU')))
                .map(patient => {
                  const patientVitals = vitals.find(v => v.patientId === patient.id);
                  const isICU = patient.currentWardName?.includes('ICU');

                  return (
                    <tr key={patient.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                            isICU ? 'bg-rose-100 text-rose-700' : 'bg-blue-100 text-blue-700'
                          }`}>
                            {patient.name.charAt(0)}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 block">{patient.name}</span>
                            <span className="text-[11px] text-slate-400">{patient.id} • {patient.age}y • {patient.gender}</span>
                            {patient.tamilName && (
                              <span className="text-[10px] text-indigo-600 ml-1 font-tamil">({patient.tamilName})</span>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          <span className={`px-2 py-0.5 rounded-md font-bold text-[11px] ${
                            isICU ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {patient.currentBedNumber || 'Bed Assigned'}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 block mt-0.5">{patient.currentWardName}</span>
                      </td>

                      <td className="py-3.5 px-4 max-w-xs">
                        <span className="font-medium text-slate-800 line-clamp-2">{patient.diagnosis || 'Under Evaluation'}</span>
                      </td>

                      <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                        {new Date(patient.admissionDate || patient.createdAt).toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: 'short'
                        })}
                      </td>

                      <td className="py-3.5 px-4">
                        {patientVitals ? (
                          <div className="text-[11px] space-y-0.5">
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-slate-800">BP: {patientVitals.bpSystolic}/{patientVitals.bpDiastolic}</span>
                              <span className="text-slate-400">|</span>
                              <span className="font-bold text-rose-600">HR: {patientVitals.heartRate}</span>
                            </div>
                            <span className="text-slate-500 text-[10px]">SpO2: {patientVitals.spO2}% • Temp: {patientVitals.temperature}°F</span>
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-400 italic">Vitals pending</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              if (onSelectPatient) onSelectPatient(patient);
                              else setActiveTab('Patients');
                            }}
                            className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-bold transition-all flex items-center gap-1"
                            title="Open Patient Medical Chart"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Chart</span>
                          </button>

                          <button
                            onClick={() => {
                              if (onRequestDiagnostic) onRequestDiagnostic(patient);
                              else setActiveTab('Diagnostics');
                            }}
                            className="px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-bold transition-all flex items-center gap-1"
                            title="Order Diagnostic Scan"
                          >
                            <Activity className="w-3.5 h-3.5" />
                            <span>Scan</span>
                          </button>

                          <button
                            onClick={() => {
                              if (onTransferPatient) onTransferPatient(patient);
                              else setActiveTab('Transfers');
                            }}
                            className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-lg text-xs font-bold transition-all flex items-center gap-1"
                            title="Recommend Inter-Ward Transfer"
                          >
                            <ArrowLeftRight className="w-3.5 h-3.5" />
                            <span>Transfer</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Diagnostic Reports Review & Pending Scans Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Reports Ready for Review */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Radiology Reports Published</h3>
              <p className="text-xs text-slate-400">Official findings by Radiodiagnosis Specialist</p>
            </div>
            <button
              onClick={() => setActiveTab('Diagnostics')}
              className="text-xs font-semibold text-blue-600 hover:underline"
            >
              All Reports →
            </button>
          </div>

          <div className="space-y-3">
            {diagnosticReports.map(report => (
              <div key={report.id} className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-100">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-bold rounded-md uppercase">
                      {report.scanType}
                    </span>
                    <span className="font-bold text-xs text-slate-800">{report.patientName}</span>
                  </div>
                  <span className="text-[10px] text-slate-400">
                    {new Date(report.reportDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-xs text-slate-700 font-semibold mt-1">Impression:</p>
                <p className="text-xs text-slate-600 line-clamp-2 whitespace-pre-line">{report.impression}</p>
                <div className="mt-2 text-[10px] text-slate-400 flex items-center justify-between">
                  <span>Reported by: {report.radiologistName}</span>
                  <span className="font-bold text-emerald-600">Status: {report.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Diagnostic Scan Requests */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Active Diagnostic Requests</h3>
              <p className="text-xs text-slate-400">Imaging schedule queue across X-Ray, CT, & MRI rooms</p>
            </div>
            <button
              onClick={() => setActiveTab('Diagnostics')}
              className="text-xs font-semibold text-blue-600 hover:underline"
            >
              Manage Scans →
            </button>
          </div>

          <div className="space-y-3">
            {pendingScans.map(scan => (
              <div key={scan.id} className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-100 flex items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-800">{scan.patientName}</span>
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md ${
                      scan.priority === 'STAT' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {scan.priority}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">{scan.scanType} • {scan.clinicalReason}</p>
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    Room: {scan.assignedRoomName || 'Room Assignment Pending'}
                  </span>
                </div>

                <span className={`px-2.5 py-1 text-[11px] font-bold rounded-xl shrink-0 ${
                  scan.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700 animate-pulse' : 'bg-slate-200 text-slate-700'
                }`}>
                  {scan.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
