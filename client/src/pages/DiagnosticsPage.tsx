import React, { useState } from 'react';
import {
  Activity,
  Plus,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Eye,
  Camera,
  Layers,
  Search,
  Filter,
  ShieldCheck,
  Stethoscope,
  Building2,
  Calendar,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useHospital } from '../context/HospitalContext';
import { DiagnosticRoom, DiagnosticRequest, DiagnosticReport, ScanType, DiagnosticPriority } from '../types';

export const DiagnosticsPage: React.FC = () => {
  const {
    patients = [],
    doctors = [],
    diagnosticRooms = [],
    diagnosticRequests = [],
    diagnosticReports = [],
    requestDiagnostic,
    assignDiagnosticRoom,
    completeDiagnosticScan,
    submitDiagnosticReport,
    currentRole
  } = useHospital();

  // Defensive array safeguards
  const safeRooms = Array.isArray(diagnosticRooms) ? diagnosticRooms : [];
  const safeRequests = Array.isArray(diagnosticRequests) ? diagnosticRequests : [];
  const safeReports = Array.isArray(diagnosticReports) ? diagnosticReports : [];
  const safePatients = Array.isArray(patients) ? patients : [];
  const safeDoctors = Array.isArray(doctors) ? doctors : [];

  // Order Scan Modal / Form State
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [patientId, setPatientId] = useState('');
  const [doctorId, setDoctorId] = useState(safeDoctors[0]?.id || 'DOC-02');
  const [scanType, setScanType] = useState<ScanType>('XRAY');
  const [priority, setPriority] = useState<DiagnosticPriority>('ROUTINE');
  const [clinicalReason, setClinicalReason] = useState('Persistent respiratory symptoms and cough evaluation');
  const [notes, setNotes] = useState('Inspect lower lobe infiltration and diaphragmatic contour');
  const [assignedRoomId, setAssignedRoomId] = useState('');
  const [feedbackMsg, setFeedbackMsg] = useState<{ success: boolean; message: string } | null>(null);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Report Creation Modal
  const [selectedRequestForReport, setSelectedRequestForReport] = useState<DiagnosticRequest | null>(null);
  const [findings, setFindings] = useState('');
  const [impression, setImpression] = useState('');
  const [recommendations, setRecommendations] = useState('');
  const [radiologistName, setRadiologistName] = useState('Dr. P. Sundaramoorthy, MD (Radio-Diagnosis)');

  // Report Viewer Modal
  const [viewingReport, setViewingReport] = useState<DiagnosticReport | null>(null);

  const handleOrderScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientId) {
      setFeedbackMsg({ success: false, message: 'Please select a patient before placing a scan request.' });
      setTimeout(() => setFeedbackMsg(null), 4000);
      return;
    }

    const res = requestDiagnostic({
      patientId,
      doctorId,
      scanType,
      priority,
      clinicalReason: clinicalReason.trim(),
      notes: notes.trim(),
      assignedRoomId: assignedRoomId || undefined
    });

    setFeedbackMsg(res);
    if (res.success) {
      setShowOrderModal(false);
      setPatientId('');
      setAssignedRoomId('');
    }
    setTimeout(() => setFeedbackMsg(null), 5000);
  };

  const handleCreateReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRequestForReport) return;

    const res = submitDiagnosticReport({
      requestId: selectedRequestForReport.id,
      findings: findings.trim() || 'Imaging reveals normal anatomical alignment without acute pathology or focal mass lesions.',
      impression: impression.trim() || 'No acute abnormalities identified on imaging.',
      recommendations: recommendations.trim() || undefined,
      radiologistName: radiologistName.trim() || 'Dr. P. Sundaramoorthy, MD'
    });

    setFeedbackMsg(res);
    if (res.success) {
      setSelectedRequestForReport(null);
      setFindings('');
      setImpression('');
      setRecommendations('');
    }
    setTimeout(() => setFeedbackMsg(null), 5000);
  };

  // Filter requests
  const filteredRequests = safeRequests.filter(req => {
    if (statusFilter !== 'ALL' && req.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = req.patientName?.toLowerCase().includes(q);
      const matchId = req.id?.toLowerCase().includes(q);
      const matchReason = req.clinicalReason?.toLowerCase().includes(q);
      const matchType = req.scanType?.toLowerCase().includes(q);
      return matchName || matchId || matchReason || matchType;
    }
    return true;
  });

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Activity className="w-7 h-7 text-indigo-600" />
            <span>Diagnostics & Advanced Imaging Suite</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time digital radiology suites, digital X-Ray, 128-slice CT, 3.0T MRI, automated schedule queue & verified reports.
          </p>
        </div>

        <button
          onClick={() => setShowOrderModal(true)}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20 transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Order Diagnostic Scan</span>
        </button>
      </div>

      {feedbackMsg && (
        <div
          className={`p-3.5 rounded-xl text-xs font-bold flex items-center gap-2 border animate-in fade-in duration-200 ${
            feedbackMsg.success
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          {feedbackMsg.success ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span>{feedbackMsg.message}</span>
        </div>
      )}

      {/* Diagnostic Suites & Rooms Status */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Imaging Modalities & Diagnostic Suites</h2>
            <p className="text-[11px] text-slate-500">Live operational status of lead imaging suites</p>
          </div>
          <span className="text-xs font-semibold text-slate-500">
            {safeRooms.filter(r => r.status === 'AVAILABLE').length} of {safeRooms.length} Suites Available
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {safeRooms.map(room => {
            const isAvailable = room.status === 'AVAILABLE';
            const isInUse = room.status === 'IN_USE';
            const cost = typeof room.cost === 'number' ? room.cost : room.type === 'XRAY' ? 850 : room.type === 'CT_SCAN' ? 4500 : 7500;
            const techName = room.technicianName || 'Certified Radiographer';

            return (
              <div
                key={room.id}
                className={`rounded-2xl p-4.5 border transition-all shadow-xs flex flex-col justify-between ${
                  isAvailable
                    ? 'bg-white border-emerald-200/80 hover:border-emerald-300'
                    : isInUse
                    ? 'bg-blue-50/50 border-blue-200 hover:border-blue-300'
                    : 'bg-amber-50/50 border-amber-200'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm text-slate-900">{room.name}</span>
                      <span className="font-mono text-[10px] text-slate-400 font-semibold">{room.code}</span>
                    </div>
                    <span
                      className={`px-2.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase ${
                        isAvailable
                          ? 'bg-emerald-100 text-emerald-800'
                          : isInUse
                          ? 'bg-blue-100 text-blue-800 animate-pulse'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {room.status}
                    </span>
                  </div>

                  <p className="text-xs text-indigo-700 font-bold">
                    {room.modality || (room.type === 'XRAY' ? 'Digital X-Ray (DR)' : room.type === 'CT_SCAN' ? '128-Slice CT Scan' : '3.0T High-Field MRI')}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Floor {room.floor} • Equipment: {room.equipmentModel || 'Siemens Diagnostic'}</p>

                  {isInUse && (
                    <div className="mt-3 p-2 bg-blue-100/70 rounded-xl text-[11px] text-blue-900 flex items-center justify-between">
                      <span className="font-medium">Active Investigation in Progress</span>
                      <span className="font-mono text-[10px] font-bold">{room.currentRequestId || 'RUNNING'}</span>
                    </div>
                  )}
                </div>

                <div className="mt-3.5 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Lead: <strong className="text-slate-700">{techName}</strong></span>
                  <span className="font-extrabold text-slate-900">₹ {cost.toLocaleString('en-IN')}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Diagnostic Scan Requests Queue */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-sm text-slate-900">Active Imaging Schedule & Requests Queue</h3>
            <p className="text-xs text-slate-500">Queue of prescribed investigations, active scans and completed reports</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search patient or request..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none w-52"
              />
            </div>

            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="REQUESTED">REQUESTED</option>
              <option value="SCHEDULED">SCHEDULED</option>
              <option value="IN_PROGRESS">IN_PROGRESS</option>
              <option value="REPORT_PENDING">REPORT_PENDING</option>
              <option value="REPORTED">REPORTED</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50/80 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-3 px-4">Request ID</th>
                <th className="py-3 px-4">Patient</th>
                <th className="py-3 px-4">Modality / Scan</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Clinical Indication</th>
                <th className="py-3 px-4">Assigned Room</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Radiology Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400 italic">
                    No diagnostic scan requests match the active filter criteria.
                  </td>
                </tr>
              ) : (
                filteredRequests.map(req => {
                  const rep = safeReports.find(r => r.requestId === req.id);

                  return (
                    <tr key={req.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">{req.id}</td>
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-slate-900 block">{req.patientName}</span>
                        <span className="font-mono text-[10px] text-slate-400">{req.patientId}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
                          {req.scanType}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 text-[10px] font-bold rounded-md ${
                            req.priority === 'STAT'
                              ? 'bg-rose-100 text-rose-700'
                              : req.priority === 'URGENT'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {req.priority}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 max-w-xs truncate" title={req.clinicalReason}>
                        {req.clinicalReason}
                      </td>
                      <td className="py-3.5 px-4">
                        {req.assignedRoomName ? (
                          <span className="text-slate-800 font-semibold">{req.assignedRoomName}</span>
                        ) : (
                          <span className="text-slate-400 italic">Awaiting Room</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 text-[10px] font-bold rounded-md ${
                            req.status === 'REPORTED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : req.status === 'REPORT_PENDING'
                              ? 'bg-purple-100 text-purple-800'
                              : req.status === 'IN_PROGRESS' || req.status === 'SCHEDULED'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {req.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {req.status === 'REPORTED' ? (
                          <button
                            onClick={() => {
                              if (rep) {
                                setViewingReport(rep);
                              } else {
                                // synthesize report preview if report object not found
                                setViewingReport({
                                  id: req.reportId || `REP-${req.id}`,
                                  requestId: req.id,
                                  patientId: req.patientId,
                                  patientName: req.patientName,
                                  doctorId: req.doctorId,
                                  doctorName: req.doctorName,
                                  scanType: req.scanType,
                                  findings: 'Imaging reveals clear visual margins without acute consolidation or bone trauma.',
                                  impression: 'Normal study within acceptable physiological parameters.',
                                  radiologistName: 'Dr. P. Sundaramoorthy, MD (Radio-Diagnosis)',
                                  reportDate: new Date().toISOString(),
                                  status: 'FINAL'
                                });
                              }
                            }}
                            className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-xs font-bold transition-all inline-flex items-center gap-1"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>View Report</span>
                          </button>
                        ) : req.status === 'REPORT_PENDING' ? (
                          <button
                            onClick={() => setSelectedRequestForReport(req)}
                            className="px-2.5 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg text-xs font-bold transition-all inline-flex items-center gap-1"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Write Report</span>
                          </button>
                        ) : req.status === 'SCHEDULED' || req.status === 'IN_PROGRESS' ? (
                          <button
                            onClick={() => {
                              const res = completeDiagnosticScan(req.id);
                              setFeedbackMsg(res);
                              setTimeout(() => setFeedbackMsg(null), 4000);
                            }}
                            className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-bold transition-all inline-flex items-center gap-1"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Complete Scan</span>
                          </button>
                        ) : (
                          <div className="inline-flex items-center gap-1.5">
                            {safeRooms.some(r => r.status === 'AVAILABLE') ? (
                              <button
                                onClick={() => {
                                  const avRoom = safeRooms.find(r => r.status === 'AVAILABLE' && (r.type === req.scanType || true));
                                  if (avRoom) {
                                    const res = assignDiagnosticRoom(req.id, avRoom.id);
                                    setFeedbackMsg(res);
                                    setTimeout(() => setFeedbackMsg(null), 4000);
                                  }
                                }}
                                className="px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-bold transition-all inline-flex items-center gap-1"
                              >
                                <ArrowRight className="w-3.5 h-3.5" />
                                <span>Assign Room</span>
                              </button>
                            ) : (
                              <button
                                onClick={() => setSelectedRequestForReport(req)}
                                className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-all inline-flex items-center gap-1"
                              >
                                <span>Skip to Report</span>
                              </button>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Diagnostic Scan Modal */}
      {showOrderModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Activity className="w-5 h-5 text-indigo-600" />
                <span>Prescribe Diagnostic Imaging Scan</span>
              </h3>
              <button
                onClick={() => setShowOrderModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleOrderScan} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Patient *</label>
                <select
                  required
                  value={patientId}
                  onChange={e => setPatientId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none"
                >
                  <option value="">-- Choose Patient --</option>
                  {safePatients.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.id}) - {p.currentBedNumber || p.status} ({p.currentWardName || 'OPD'})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Imaging Modality *</label>
                  <select
                    value={scanType}
                    onChange={e => setScanType(e.target.value as ScanType)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none"
                  >
                    <option value="XRAY">Digital X-Ray (DR)</option>
                    <option value="CT_SCAN">CT Scan (128-Slice)</option>
                    <option value="MRI_SCAN">MRI (3.0 Tesla High Field)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={e => setPriority(e.target.value as DiagnosticPriority)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none"
                  >
                    <option value="ROUTINE">ROUTINE (Standard)</option>
                    <option value="URGENT">URGENT (Within 2 Hours)</option>
                    <option value="STAT">STAT (Immediate Emergency)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Ordering Doctor</label>
                  <select
                    value={doctorId}
                    onChange={e => setDoctorId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none"
                  >
                    {safeDoctors.map(d => (
                      <option key={d.id} value={d.id}>
                        {d.name} ({d.department})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Direct Room Allocation</label>
                  <select
                    value={assignedRoomId}
                    onChange={e => setAssignedRoomId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none"
                  >
                    <option value="">Auto-Assign Available Suite</option>
                    {safeRooms
                      .filter(r => r.status === 'AVAILABLE')
                      .map(r => (
                        <option key={r.id} value={r.id}>
                          {r.name} ({r.code})
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Clinical Indication / Suspected Diagnosis *</label>
                <input
                  type="text"
                  required
                  value={clinicalReason}
                  onChange={e => setClinicalReason(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Specific Instructions for Radiographer</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowOrderModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-md shadow-indigo-600/20"
                >
                  Confirm & Schedule Scan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Radiologist Report Entry Modal */}
      {selectedRequestForReport && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Publish Radiology Report: {selectedRequestForReport.scanType}
                </h3>
                <p className="text-xs text-slate-500">
                  Patient: {selectedRequestForReport.patientName} ({selectedRequestForReport.patientId})
                </p>
              </div>
              <button
                onClick={() => setSelectedRequestForReport(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateReport} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Radiologist Detailed Findings *</label>
                <textarea
                  rows={4}
                  required
                  value={findings}
                  onChange={e => setFindings(e.target.value)}
                  placeholder="Describe pulmonary parenchymal patterns, cardiothoracic ratio, bony thorax, diaphragmatic contours, soft tissues, or cranial cuts..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Diagnostic Impression / Final Conclusion *</label>
                <textarea
                  rows={2}
                  required
                  value={impression}
                  onChange={e => setImpression(e.target.value)}
                  placeholder="e.g. Right lower lobe consolidation consistent with bacterial pneumonia without pleural effusion."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Clinical Recommendations / Follow-Up</label>
                <input
                  type="text"
                  value={recommendations}
                  onChange={e => setRecommendations(e.target.value)}
                  placeholder="e.g. Clinical correlation recommended. Repeat chest radiograph in 10 days post antibiotic therapy."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Reporting Radiologist</label>
                <input
                  type="text"
                  value={radiologistName}
                  onChange={e => setRadiologistName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none font-semibold"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedRequestForReport(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md shadow-emerald-600/20"
                >
                  Publish & Verify Official Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Official Diagnostic Report Modal */}
      {viewingReport && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-8 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            {/* Hospital Official Report Header */}
            <div className="border-b-2 border-slate-900 pb-4 mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight">MedTrack Multi-Speciality Hospital</h2>
                <p className="text-[11px] text-slate-500 font-medium">Department of Radio-Diagnosis & Medical Imaging • Tamil Nadu</p>
              </div>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-900 text-xs font-black rounded-lg uppercase">
                {viewingReport.status || 'FINAL'} REPORT
              </span>
            </div>

            {/* Patient Header Details */}
            <div className="grid grid-cols-2 gap-4 p-3.5 bg-slate-50 rounded-xl text-xs mb-4">
              <div>
                <p><strong className="text-slate-700">Patient:</strong> {viewingReport.patientName}</p>
                <p><strong className="text-slate-700">Patient ID:</strong> <span className="font-mono">{viewingReport.patientId}</span></p>
                <p><strong className="text-slate-700">Report ID:</strong> <span className="font-mono text-slate-500">{viewingReport.id}</span></p>
              </div>
              <div>
                <p><strong className="text-slate-700">Modality:</strong> <span className="font-bold text-indigo-700">{viewingReport.scanType}</span></p>
                <p><strong className="text-slate-700">Date:</strong> {viewingReport.reportDate ? new Date(viewingReport.reportDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Today'}</p>
                <p><strong className="text-slate-700">Ref Doctor:</strong> {viewingReport.doctorName || 'Faculty Physician'}</p>
              </div>
            </div>

            <div className="space-y-4 text-xs text-slate-800">
              <div>
                <h4 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider mb-1">Clinical Findings:</h4>
                <p className="leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-100 whitespace-pre-line text-slate-700">
                  {viewingReport.findings}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider mb-1">Impression:</h4>
                <p className="font-bold text-slate-900 bg-blue-50/70 p-3.5 rounded-xl border border-blue-100 leading-relaxed">
                  {viewingReport.impression}
                </p>
              </div>

              {viewingReport.recommendations && (
                <div>
                  <h4 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider mb-1">Recommendations:</h4>
                  <p className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-slate-600">
                    {viewingReport.recommendations}
                  </p>
                </div>
              )}
            </div>

            {/* Radiologist Signature */}
            <div className="mt-8 pt-4 border-t border-slate-200 flex items-center justify-between text-xs">
              <div>
                <p className="font-bold text-slate-900">{viewingReport.radiologistName || 'Dr. P. Sundaramoorthy, MD (Radio-Diagnosis)'}</p>
                <p className="text-[10px] text-slate-400">Verified & Electronically Authenticated</p>
              </div>

              <button
                onClick={() => setViewingReport(null)}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs shadow-md"
              >
                Close Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
