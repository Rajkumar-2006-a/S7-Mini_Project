import React, { useState } from 'react';
import {
  LogOut,
  CheckCircle2,
  AlertTriangle,
  FileText,
  CreditCard,
  User,
  Building2,
  Calendar,
  Sparkles
} from 'lucide-react';
import { useHospital } from '../context/HospitalContext';

export const DischargePage: React.FC = () => {
  const {
    patients,
    beds,
    doctors,
    discharges,
    dischargePatient,
    housekeepers,
    cleaningDelaySeconds
  } = useHospital();

  const [patientId, setPatientId] = useState('');
  const [doctorId, setDoctorId] = useState('DOC-01');
  const [summary, setSummary] = useState('Patient recovered satisfactorily with vital stability. Advised 5 days rest and follow-up in OPD.');
  const [prescriptions, setPrescriptions] = useState('Tab. Paracetamol 650mg TDS x 3 days\nTab. Pantoprazole 40mg OD AC x 7 days\nSyp. Multivitamin 10ml BD x 14 days');
  const [clearedBilling, setClearedBilling] = useState(true);
  const [autoCleanBed, setAutoCleanBed] = useState(true);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const [selectedDischargeId, setSelectedDischargeId] = useState<string | null>(null);

  const admittedPatients = patients.filter(p => p.status === 'ADMITTED');
  const selectedPatient = patients.find(p => p.id === patientId);
  const selectedDischarge = discharges.find(d => d.id === selectedDischargeId) ?? null;

  const handleDischarge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientId) {
      setResult({ success: false, message: 'Please select an admitted patient to discharge.' });
      return;
    }

    const res = dischargePatient({
      patientId,
      doctorId,
      dischargeSummary: summary.trim(),
      prescriptions: prescriptions.trim(),
      followUpDate: '2026-09-20',
      clearedBilling,
      autoCleanBed
    });

    setResult(res);
    if (res.success) {
      setPatientId('');
    }
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
          <LogOut className="w-7 h-7 text-rose-600" />
          <span>Patient Discharge Management</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Finalize physician medical summary, verify billing clearance, and release hospital beds for cleaning and new admissions.
        </p>
      </div>

      {/* Discharge Form & Instructions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-100 p-6 shadow-xs">
          <h3 className="font-extrabold text-sm text-slate-900 mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-rose-600" />
            <span>Process Patient Medical Discharge</span>
          </h3>

          <form onSubmit={handleDischarge} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Select In-Patient for Discharge *</label>
              <select
                required
                value={patientId}
                onChange={e => setPatientId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none"
              >
                <option value="">-- Choose Admitted Patient --</option>
                {admittedPatients.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.id}) - Bed: {p.currentBedNumber} (Outstanding: ₹ {p.outstandingBalance.toLocaleString('en-IN')})
                  </option>
                ))}
              </select>
            </div>

            {selectedPatient && (
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-700">Bed to be released:</span>
                  <span className="font-extrabold text-blue-900">{selectedPatient.currentBedNumber} ({selectedPatient.currentWardName})</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Billing status:</span>
                  <span className={`font-bold ${selectedPatient.outstandingBalance === 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {selectedPatient.outstandingBalance === 0 ? 'Fully Cleared' : `Pending ₹ ${selectedPatient.outstandingBalance.toLocaleString('en-IN')}`}
                  </span>
                </div>
              </div>
            )}

            <div>
              <label className="block font-bold text-slate-700 mb-1">Authorizing Doctor *</label>
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

            <div>
              <label className="block font-bold text-slate-700 mb-1">Clinical Discharge Summary *</label>
              <textarea
                rows={3}
                required
                value={summary}
                onChange={e => setSummary(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Discharge Prescriptions & Advice</label>
              <textarea
                rows={3}
                value={prescriptions}
                onChange={e => setPrescriptions(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none font-mono"
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="billClear"
                checked={clearedBilling}
                onChange={e => setClearedBilling(e.target.checked)}
                className="rounded border-slate-300 text-rose-600 focus:ring-rose-500"
              />
              <label htmlFor="billClear" className="font-bold text-slate-700 cursor-pointer">
                Confirm Bill Clearance & Pharmacy Settle
              </label>
            </div>

            <div className="flex items-start gap-2.5 p-3.5 bg-emerald-50 rounded-xl border border-emerald-200">
              <input
                type="checkbox"
                id="autoClean"
                checked={autoCleanBed}
                onChange={e => setAutoCleanBed(e.target.checked)}
                className="rounded border-emerald-400 text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer mt-0.5"
              />
              <div className="text-xs">
                <label htmlFor="autoClean" className="font-bold text-emerald-950 cursor-pointer flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Automatic Bed Cleaning</span>
                </label>
                <p className="text-[11px] text-emerald-700 mt-0.5">
                  Freed bed will be automatically assigned to an on-duty housekeeper and sanitized immediately.
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={!patientId}
              className={`w-full py-2.5 rounded-xl text-xs font-bold text-white shadow-md transition-all flex items-center justify-center gap-2 ${
                !patientId ? 'bg-slate-300 cursor-not-allowed' : 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/20'
              }`}
            >
              <LogOut className="w-4 h-4" />
              <span>Approve Discharge & Release Bed</span>
            </button>
          </form>

          {result && (
            <div className={`mt-4 p-3.5 rounded-xl text-xs font-bold flex items-center gap-2 ${
              result.success ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' : 'bg-rose-50 text-rose-900 border border-rose-200'
            }`}>
              {result.success ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertTriangle className="w-4 h-4 text-rose-600" />}
              <span>{result.message}</span>
            </div>
          )}
        </div>

        {/* Clean Status & Housekeeping Overview */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 shadow-xs border border-slate-100 flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center gap-2 text-slate-800 mb-2">
              <Building2 className="w-5 h-5 text-blue-600" />
              <h3 className="text-sm font-extrabold text-slate-900">Hospital Bed & Staff Overview</h3>
            </div>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Real-time bed availability and housekeeping readiness across wards:
            </p>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-100">
                <span className="text-[11px] font-bold text-emerald-800">Available Beds</span>
                <p className="text-2xl font-black text-emerald-700 mt-1">
                  {beds.filter(b => b.status === 'AVAILABLE').length}
                </p>
                <span className="text-[10px] text-emerald-600">Sterile & Ready</span>
              </div>

              <div className="p-3.5 bg-blue-50 rounded-xl border border-blue-100">
                <span className="text-[11px] font-bold text-blue-800">Housekeeping Staff</span>
                <p className="text-2xl font-black text-blue-700 mt-1">
                  {housekeepers.length}
                </p>
                <span className="text-[10px] text-blue-600">{housekeepers.filter(h => h.status === 'AVAILABLE').length} Available On-Duty</span>
              </div>

              <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-100">
                <span className="text-[11px] font-bold text-amber-800">Awaiting Cleaning</span>
                <p className="text-2xl font-black text-amber-700 mt-1">
                  {beds.filter(b => b.status === 'CLEANING_IN_PROGRESS' || b.status === 'CLEANING_REQUIRED').length}
                </p>
                <span className="text-[10px] text-amber-600">Beds</span>
              </div>

              <div className="p-3.5 bg-purple-50 rounded-xl border border-purple-100">
                <span className="text-[11px] font-bold text-purple-800">Discharged Today</span>
                <p className="text-2xl font-black text-purple-700 mt-1">
                  {discharges.length}
                </p>
                <span className="text-[10px] text-purple-600">Patients Released</span>
              </div>
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600">
            <span className="font-bold text-slate-800">Bed Release Protocol:</span>
            <p className="mt-1 text-[11px] text-slate-500">
              When a patient is discharged, their bed is immediately freed and handed over to the housekeeping team for sanitization so it can be re-allocated to incoming admissions.
            </p>
          </div>
        </div>
      </div>

      {/* Discharged Patients Log */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100">
          <h3 className="font-bold text-sm text-slate-900">Historical Discharges Ledger</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50/80 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-3 px-4">Discharge ID</th>
                <th className="py-3 px-4">Patient Name</th>
                <th className="py-3 px-4">Released Bed</th>
                <th className="py-3 px-4">Doctor</th>
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4">Summary</th>
                <th className="py-3 px-4">Billing</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {!discharges || discharges.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-xs text-slate-400 italic">
                    No patient discharge records found.
                  </td>
                </tr>
              ) : (
                discharges.map(d => (
                  <tr key={d.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">
                      <button
                        type="button"
                        onClick={() => setSelectedDischargeId(d.id)}
                        className="font-mono text-[11px] text-rose-700 hover:text-rose-900 font-bold underline-offset-2 hover:underline transition-colors"
                        title="View discharge details"
                      >
                        {d.id}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">{d.patientName}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-700">{d.bedNumber} ({d.wardName})</td>
                    <td className="py-3.5 px-4">{d.doctorName}</td>
                    <td className="py-3.5 px-4 text-slate-400">{new Date(d.dischargeDate).toLocaleString('en-IN')}</td>
                    <td className="py-3.5 px-4 max-w-xs truncate">{d.dischargeSummary}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-md">
                        CLEARED
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedDischarge && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900">{selectedDischarge.id}</h3>
                <p className="text-xs text-slate-500 mt-1">{selectedDischarge.patientName}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedDischargeId(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center text-lg leading-none"
                title="Close discharge details"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Patient</span>
                <p className="mt-1 font-extrabold text-slate-900">{selectedDischarge.patientName}</p>
              </div>

              <div className="p-3 rounded-xl bg-rose-50 border border-rose-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 block">Bed Released</span>
                <p className="mt-1 font-extrabold text-slate-900">{selectedDischarge.bedNumber}</p>
                <p className="text-slate-500">{selectedDischarge.wardName}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Doctor</span>
                <p className="mt-1 font-bold text-slate-900">{selectedDischarge.doctorName}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Date & Time</span>
                <p className="mt-1 font-bold text-slate-900">{new Date(selectedDischarge.dischargeDate).toLocaleString('en-IN')}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 sm:col-span-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Discharge Summary</span>
                <p className="mt-1 text-slate-800 leading-relaxed">{selectedDischarge.dischargeSummary}</p>
              </div>

              {selectedDischarge.prescriptions && (
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 sm:col-span-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Prescriptions & Advice</span>
                  <p className="mt-1 text-slate-800 leading-relaxed whitespace-pre-line">{selectedDischarge.prescriptions}</p>
                </div>
              )}

              {selectedDischarge.followUpDate && (
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 sm:col-span-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Follow-Up Date</span>
                  <p className="mt-1 font-bold text-slate-900">{new Date(selectedDischarge.followUpDate).toLocaleDateString('en-IN')}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
