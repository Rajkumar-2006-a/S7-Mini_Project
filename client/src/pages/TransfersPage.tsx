import React, { useState } from 'react';
import {
  ArrowLeftRight,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Building2,
  BedDouble,
  User,
  Clock,
  FileText,
  Activity,
  ArrowRight
} from 'lucide-react';
import { useHospital } from '../context/HospitalContext';
import { TransferType } from '../types';

export const TransfersPage: React.FC = () => {
  const {
    patients,
    beds,
    wards,
    doctors,
    transfers,
    transferPatient,
    selectedPatientForTransferId
  } = useHospital();

  const admittedPatients = patients.filter(p => p.status === 'ADMITTED');

  // Transfer Form State
  const [patientId, setPatientId] = useState<string>(selectedPatientForTransferId || '');
  const [toWardId, setToWardId] = useState<string>('w-icu');
  const [toBedId, setToBedId] = useState<string>('');
  const [doctorId, setDoctorId] = useState<string>('DOC-01');
  const [transferType, setTransferType] = useState<TransferType>('EMERGENCY_ICU');
  const [reason, setReason] = useState<string>('Acute respiratory desaturation requiring intensive mechanical monitoring.');
  const [clinicalNotes, setClinicalNotes] = useState<string>('Patient hemodynamically stabilized; transferring under ICU nurse escort.');
  const [resultMessage, setResultMessage] = useState<{ success: boolean; message: string } | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedTransferId, setSelectedTransferId] = useState<string | null>(null);

  // Sync with preselected patient from BedsPage or PatientsPage
  React.useEffect(() => {
    if (selectedPatientForTransferId) {
      setPatientId(selectedPatientForTransferId);
    }
  }, [selectedPatientForTransferId]);

  // Selected Patient details
  const selectedPatient = patients.find(p => p.id === patientId);
  const currentBed = beds.find(b => b.id === selectedPatient?.currentBedId);
  const selectedTransfer = transfers.find(t => t.id === selectedTransferId) ?? null;

  // Destination available beds in selected ward
  const availableDestBeds = beds.filter(b => b.wardId === toWardId && b.status === 'AVAILABLE');

  const handleTransferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientId) {
      setResultMessage({ success: false, message: 'Please select an in-patient to transfer.' });
      return;
    }
    if (!toBedId) {
      setResultMessage({ success: false, message: 'Please select an AVAILABLE destination bed.' });
      return;
    }

    const res = transferPatient({
      patientId,
      toWardId,
      toBedId,
      doctorId,
      reason,
      transferType,
      clinicalNotes
    });

    setResultMessage(res);
    if (res.success) {
      setPatientId('');
      setToBedId('');
    }
  };

  const filteredTransfers = transfers.filter(t => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return (
      t.patientName.toLowerCase().includes(q) ||
      t.fromWardName.toLowerCase().includes(q) ||
      t.toWardName.toLowerCase().includes(q) ||
      t.fromBedNumber.toLowerCase().includes(q) ||
      t.toBedNumber.toLowerCase().includes(q) ||
      t.doctorName.toLowerCase().includes(q) ||
      t.id.toLowerCase().includes(q)
    );
  });

  const icuTransfersCount = transfers.filter(t => t.transferType === 'EMERGENCY_ICU').length;
  const stepDownCount = transfers.filter(t => t.transferType === 'STEP_DOWN').length;
  const cleaningBedsCount = beds.filter(b => b.status === 'CLEANING_REQUIRED' || b.status === 'CLEANING_IN_PROGRESS').length;

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
          <ArrowLeftRight className="w-7 h-7 text-purple-600" />
          <span>Inter-Ward Patient Transfer System</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Safely orchestrate emergency ICU escalations, post-operative step-downs, and speciality ward transfers with atomic bed status updates.
        </p>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4.5 border border-slate-100 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Transfers Completed</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900">{transfers.length}</span>
            <span className="text-xs text-slate-400">Total</span>
          </div>
          <p className="text-[11px] text-purple-600 font-medium mt-1">Audit Logged & Verified</p>
        </div>

        <div className="bg-white rounded-2xl p-4.5 border border-slate-100 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">ICU Escalations</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-rose-600">{icuTransfersCount}</span>
            <span className="text-xs text-slate-400">Cases</span>
          </div>
          <p className="text-[11px] text-rose-500 font-medium mt-1">High-Acuity Monitoring</p>
        </div>

        <div className="bg-white rounded-2xl p-4.5 border border-slate-100 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Step-Down Recoveries</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-emerald-600">{stepDownCount}</span>
            <span className="text-xs text-slate-400">Patients</span>
          </div>
          <p className="text-[11px] text-emerald-600 font-medium mt-1">Stable Convalescence</p>
        </div>

        <div className="bg-white rounded-2xl p-4.5 border border-slate-100 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Source Beds Under Cleaning</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-orange-600">{cleaningBedsCount}</span>
            <span className="text-xs text-slate-400">Turnaround</span>
          </div>
          <p className="text-[11px] text-orange-600 font-medium mt-1">Terminal Decontamination</p>
        </div>
      </div>

      {/* Transfer Form and Workflow */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Transfer Action Card (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-100 p-6 shadow-xs">
          <h2 className="font-extrabold text-sm text-slate-900 mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4 text-purple-600" />
            <span>Initiate Patient Transfer</span>
          </h2>

          <form onSubmit={handleTransferSubmit} className="space-y-4">
            {/* 1. Patient Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Select Active In-Patient *
              </label>
              <select
                value={patientId}
                onChange={e => setPatientId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:bg-white focus:border-purple-500"
              >
                <option value="">-- Choose Admitted Patient --</option>
                {admittedPatients.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.id}) - Current: {p.currentBedNumber} ({p.currentWardName})
                  </option>
                ))}
              </select>
            </div>

            {/* Current Bed vs Destination Bed Preview */}
            {selectedPatient && currentBed && (
              <div className="p-3.5 bg-purple-50/70 rounded-xl border border-purple-100 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] font-bold text-purple-600 uppercase tracking-wider block">Source Bed</span>
                  <p className="font-extrabold text-slate-800">{currentBed.number} ({currentBed.wardName})</p>
                  <p className="text-[11px] text-slate-500">Will automatically become <span className="font-bold text-orange-600">CLEANING_REQUIRED</span></p>
                </div>
                <ArrowRight className="w-5 h-5 text-purple-500 shrink-0" />
                <div className="text-right">
                  <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block">Destination Bed</span>
                  <p className="font-extrabold text-slate-800">{toBedId ? `Bed ${beds.find(b => b.id === toBedId)?.number}` : 'Select Available Bed'}</p>
                  <p className="text-[11px] text-slate-500">Will transition to <span className="font-bold text-blue-600">OCCUPIED</span></p>
                </div>
              </div>
            )}

            {/* 2. Destination Ward & Bed */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Destination Ward *
                </label>
                <select
                  value={toWardId}
                  onChange={e => {
                    setToWardId(e.target.value);
                    setToBedId('');
                  }}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none"
                >
                  {wards.map(w => (
                    <option key={w.id} value={w.id}>
                      {w.name} ({w.availableBeds} Available)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Available Bed in Destination Ward *
                </label>
                {availableDestBeds.length === 0 ? (
                  <div className="p-2 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl text-[11px] font-bold">
                    No available beds in this ward.
                  </div>
                ) : (
                  <select
                    value={toBedId}
                    onChange={e => setToBedId(e.target.value)}
                    className="w-full px-3 py-2 bg-emerald-50 border border-emerald-300 text-emerald-950 rounded-xl text-xs font-bold outline-none"
                  >
                    <option value="">-- Choose Available Bed --</option>
                    {availableDestBeds.map(b => (
                      <option key={b.id} value={b.id}>
                        Bed {b.number} (Floor {b.floor}) - AVAILABLE
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            {/* 3. Transfer Type & Doctor */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Transfer Classification</label>
                <select
                  value={transferType}
                  onChange={e => setTransferType(e.target.value as TransferType)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none"
                >
                  <option value="EMERGENCY_ICU">Emergency ICU Escalation</option>
                  <option value="STEP_DOWN">Post-Critical Step Down</option>
                  <option value="SPECIALITY">Speciality Care Relocation</option>
                  <option value="ROUTINE">Routine Ward Transfer</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Authorizing Doctor</label>
                <select
                  value={doctorId}
                  onChange={e => setDoctorId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none"
                >
                  {doctors.map(d => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.department})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 4. Reason & Clinical Escort Notes */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Clinical Reason for Transfer</label>
              <input
                type="text"
                value={reason}
                onChange={e => setReason(e.target.value)}
                placeholder="Reason for transfer"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Escort & Clinical Transition Notes</label>
              <textarea
                rows={2}
                value={clinicalNotes}
                onChange={e => setClinicalNotes(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={!patientId || !toBedId}
              className={`w-full py-2.5 rounded-xl text-xs font-bold text-white shadow-md transition-all flex items-center justify-center gap-2 ${
                !patientId || !toBedId ? 'bg-slate-300 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'
              }`}
            >
              <ArrowLeftRight className="w-4 h-4" />
              <span>Execute Inter-Ward Transfer</span>
            </button>
          </form>

          {resultMessage && (
            <div className={`mt-4 p-3.5 rounded-xl text-xs font-bold flex items-center gap-2 ${
              resultMessage.success ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' : 'bg-rose-50 text-rose-900 border border-rose-200'
            }`}>
              {resultMessage.success ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertTriangle className="w-4 h-4 text-rose-600" />}
              <span>{resultMessage.message}</span>
            </div>
          )}
        </div>

        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-100 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-indigo-600" />
              <span>Transfer Operations</span>
            </h3>
            <span className="px-2.5 py-1 text-[10px] font-bold rounded-full bg-indigo-50 text-indigo-700">Live</span>
          </div>

          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Critical Queue</span>
                <Activity className="w-3.5 h-3.5 text-rose-500" />
              </div>
              <div className="mt-2 flex items-end justify-between">
                <span className="text-2xl font-extrabold text-slate-900">{icuTransfersCount}</span>
                <span className="text-[10px] text-slate-500">High-acuity transfers</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100">
                <div className="flex items-center gap-2 text-emerald-700">
                  <BedDouble className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-bold uppercase">Available</span>
                </div>
                <p className="mt-2 text-xl font-extrabold text-emerald-800">{beds.filter(b => b.status === 'AVAILABLE').length}</p>
              </div>

              <div className="p-3 rounded-xl bg-amber-50 border border-amber-100">
                <div className="flex items-center gap-2 text-amber-700">
                  <Clock className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-bold uppercase">Cleaning</span>
                </div>
                <p className="mt-2 text-xl font-extrabold text-amber-800">{cleaningBedsCount}</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-purple-50 border border-purple-100">
              <div className="flex items-center gap-2 text-purple-700">
                <User className="w-3.5 h-3.5" />
                <span className="text-[10px] font-bold uppercase">Current Patient</span>
              </div>
              <p className="mt-2 text-sm font-extrabold text-slate-900">
                {selectedPatient ? selectedPatient.name : 'No patient selected'}
              </p>
              <p className="text-[11px] text-slate-600 mt-1">
                {selectedPatient ? `${selectedPatient.currentWardName || 'Ward pending'} • ${selectedPatient.currentBedNumber || 'No bed'}` : 'Select a patient to view transfer context.'}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-2 text-slate-700">
                <FileText className="w-3.5 h-3.5" />
                <span className="text-[10px] font-bold uppercase">Transfer Notes</span>
              </div>
              <p className="mt-2 text-[11px] text-slate-600 leading-relaxed">
                {clinicalNotes || 'No transfer notes yet. Document the clinical reason and escort details before confirming the move.'}
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Transfer History Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-sm text-slate-900">Recent Inter-Ward Transfers Log</h3>
            <p className="text-xs text-slate-500">Historical trail of all patient movements across departments</p>
          </div>
          <div className="w-full sm:w-72">
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search by patient, ward, bed, doctor..."
              className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:border-purple-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50/80 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-3 px-4">Transfer ID</th>
                <th className="py-3 px-4">Patient</th>
                <th className="py-3 px-4">From Bed / Ward</th>
                <th className="py-3 px-4">To Bed / Ward</th>
                <th className="py-3 px-4">Classification</th>
                <th className="py-3 px-4">Authorizing Doctor</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredTransfers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-xs text-slate-400 italic">
                    No matching transfers found.
                  </td>
                </tr>
              ) : (
                filteredTransfers.map(t => (
                  <tr key={t.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">
                      <button
                        type="button"
                        onClick={() => setSelectedTransferId(t.id)}
                        className="font-mono text-[11px] text-purple-700 hover:text-purple-900 font-bold underline-offset-2 hover:underline transition-colors"
                        title="View transfer details"
                      >
                        {t.id}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">{t.patientName}</td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-700">{t.fromBedNumber}</span>
                      <span className="text-[10px] text-slate-400 block">{t.fromWardName}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-purple-700">{t.toBedNumber}</span>
                      <span className="text-[10px] text-slate-400 block">{t.toWardName}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md ${
                        t.transferType === 'EMERGENCY_ICU' ? 'bg-rose-100 text-rose-700' : 'bg-purple-100 text-purple-700'
                      }`}>
                        {(t.transferType || 'ROUTINE').replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">{t.doctorName}</td>
                    <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                      {new Date(t.timestamp).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-md">
                        {t.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedTransfer && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900">Transfer {selectedTransfer.id}</h3>
                <p className="text-xs text-slate-500 mt-1">{selectedTransfer.patientName}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTransferId(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center text-lg leading-none"
                title="Close transfer details"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">From</span>
                <p className="mt-1 font-extrabold text-slate-900">{selectedTransfer.fromBedNumber}</p>
                <p className="text-slate-500">{selectedTransfer.fromWardName}</p>
              </div>

              <div className="p-3 rounded-xl bg-purple-50 border border-purple-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 block">To</span>
                <p className="mt-1 font-extrabold text-slate-900">{selectedTransfer.toBedNumber}</p>
                <p className="text-slate-500">{selectedTransfer.toWardName}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Doctor</span>
                <p className="mt-1 font-extrabold text-slate-900">{selectedTransfer.doctorName}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Status</span>
                <p className="mt-1 font-extrabold text-emerald-700">{selectedTransfer.status}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 sm:col-span-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Classification</span>
                <p className="mt-1 font-bold text-slate-900">{selectedTransfer.transferType?.replace(/_/g, ' ') || 'ROUTINE'}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 sm:col-span-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Timestamp</span>
                <p className="mt-1 font-bold text-slate-900">
                  {new Date(selectedTransfer.timestamp).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 sm:col-span-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Clinical Reason</span>
                <p className="mt-1 text-slate-800 leading-relaxed">{selectedTransfer.reason}</p>
              </div>

              {selectedTransfer.notes && (
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 sm:col-span-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Clinical Notes</span>
                  <p className="mt-1 text-slate-800 leading-relaxed">{selectedTransfer.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
