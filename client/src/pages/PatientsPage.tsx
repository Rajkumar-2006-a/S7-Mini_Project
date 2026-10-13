import React, { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  Plus,
  Eye,
  Activity,
  ArrowLeftRight,
  CreditCard,
  QrCode,
  Calendar,
  Phone,
  FileText,
  Clock,
  Heart,
  ShieldCheck,
  CheckCircle2,
  UserPlus,
  BedDouble,
  X,
  AlertCircle,
  Building2,
  Stethoscope,
  Sparkles
} from 'lucide-react';
import { useHospital } from '../context/HospitalContext';
import { Patient, VitalsRecord, DiagnosticReport, PaymentMethod } from '../types';

export const PatientsPage: React.FC = () => {
  const {
    patients,
    beds,
    wards,
    doctors,
    vitals,
    diagnosticReports,
    transfers,
    addVitalsRecord,
    addTreatmentNote,
    setActiveTab,
    setSelectedPatientForTransferId,
    registerAndAdmitPatient
  } = useHospital();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ADMITTED' | 'REGISTERED' | 'DISCHARGED'>('ALL');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showQRModal, setShowQRModal] = useState<Patient | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // New Patient Form State
  const [formName, setFormName] = useState('');
  const [formTamilName, setFormTamilName] = useState('');
  const [formAge, setFormAge] = useState(38);
  const [formGender, setFormGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [formDob, setFormDob] = useState('1988-06-12');
  const [formBloodGroup, setFormBloodGroup] = useState('B+ Positive');
  const [formPhone, setFormPhone] = useState('+91 9');
  const [formAddress, setFormAddress] = useState('Chidambaram, Tamil Nadu');
  const [formEmergName, setFormEmergName] = useState('');
  const [formEmergRel, setFormEmergRel] = useState('Spouse');
  const [formEmergPhone, setFormEmergPhone] = useState('');
  const [formReason, setFormReason] = useState('');
  const [formDiagnosis, setFormDiagnosis] = useState('');

  // Immediate Bed Admission fields
  const [admitImmediately, setAdmitImmediately] = useState(true);
  const [selectedWardId, setSelectedWardId] = useState('w-gm');
  const [selectedBedId, setSelectedBedId] = useState('');
  const [selectedDoctorId, setSelectedDoctorId] = useState('DOC-01');
  const [expectedStayDays, setExpectedStayDays] = useState(4);
  const [depositAmount, setDepositAmount] = useState(10000);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');
  const [admissionNotes, setAdmissionNotes] = useState('Direct in-patient clinical admission.');

  // Feedback states
  const [addFeedback, setAddFeedback] = useState<{ success: boolean; message: string } | null>(null);
  const [printSuccessMsg, setPrintSuccessMsg] = useState<string | null>(null);

  // Available beds in selected ward
  const availableBedsInWard = beds.filter(b => b.wardId === selectedWardId && b.status === 'AVAILABLE');

  // Quick Preset Helper for Rapid Patient Additions
  const applyPreset = (preset: 'emergency' | 'maternity' | 'cardiac' | 'pediatric') => {
    if (preset === 'emergency') {
      setFormName('Vijay Anand');
      setFormTamilName('விஜய் ஆனந்த்');
      setFormAge(36);
      setFormGender('Male');
      setFormDob('1990-04-12');
      setFormBloodGroup('O+ Positive');
      setFormPhone('+91 98402 99182');
      setFormAddress('24, South Car Street, Chidambaram, Tamil Nadu');
      setFormEmergName('Anandhi V.');
      setFormEmergRel('Spouse');
      setFormEmergPhone('+91 98402 99183');
      setFormReason('Severe abdominal trauma post-accident with dizziness');
      setFormDiagnosis('Blunt Abdominal Injury & Suspected Splenic Contusion');
      setAdmitImmediately(true);
      setSelectedWardId('w-em');
      setSelectedDoctorId('DOC-03');
      setDepositAmount(15000);
      setExpectedStayDays(3);
    } else if (preset === 'maternity') {
      setFormName('Sangeetha Murugan');
      setFormTamilName('சங்கீதா முருகன்');
      setFormAge(28);
      setFormGender('Female');
      setFormDob('1998-02-18');
      setFormBloodGroup('B+ Positive');
      setFormPhone('+91 97891 22334');
      setFormAddress('15, West Sannathi Street, Vadalur, Tamil Nadu');
      setFormEmergName('Murugan K.');
      setFormEmergRel('Spouse');
      setFormEmergPhone('+91 97891 22335');
      setFormReason('Labor pains at 39 weeks gestation & membrane rupture');
      setFormDiagnosis('Active Phase Labor, Gravida 2 Para 1');
      setAdmitImmediately(true);
      setSelectedWardId('w-mat');
      setSelectedDoctorId('DOC-07');
      setDepositAmount(20000);
      setExpectedStayDays(3);
    } else if (preset === 'cardiac') {
      setFormName('Sivakumar Ramalingam');
      setFormTamilName('சிவகுமார் ராமலிங்கம்');
      setFormAge(61);
      setFormGender('Male');
      setFormDob('1965-08-04');
      setFormBloodGroup('A+ Positive');
      setFormPhone('+91 94433 77889');
      setFormAddress('42, Gandhiji Road, Bhuvanagiri, Tamil Nadu');
      setFormEmergName('Ramalingam S.');
      setFormEmergRel('Son');
      setFormEmergPhone('+91 94433 77890');
      setFormReason('Crushing retrosternal chest pain radiating to jaw and diaphoresis');
      setFormDiagnosis('Acute Anterior Wall STEMI - Immediate CCU Care');
      setAdmitImmediately(true);
      setSelectedWardId('w-icu');
      setSelectedDoctorId('DOC-04');
      setDepositAmount(25000);
      setExpectedStayDays(5);
    } else if (preset === 'pediatric') {
      setFormName('Baby Kaviya (Child)');
      setFormTamilName('காவியா');
      setFormAge(6);
      setFormGender('Female');
      setFormDob('2020-05-10');
      setFormBloodGroup('O+ Positive');
      setFormPhone('+91 98421 11223');
      setFormAddress('10, College Quarters, Annamalai Nagar, Chidambaram');
      setFormEmergName('Karthik N.');
      setFormEmergRel('Parent');
      setFormEmergPhone('+91 98421 11223');
      setFormReason('Continuous high pyrexia, dehydration, and persistent coughing');
      setFormDiagnosis('Acute Lobar Pneumonia with febrile dehydration');
      setAdmitImmediately(true);
      setSelectedWardId('w-ped');
      setSelectedDoctorId('DOC-05');
      setDepositAmount(12000);
      setExpectedStayDays(4);
    }
    setSelectedBedId('');
  };

  const handleCreatePatientSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formPhone.trim()) {
      setAddFeedback({ success: false, message: 'Please enter patient name and contact telephone.' });
      return;
    }

    if (admitImmediately && !selectedBedId) {
      setAddFeedback({ success: false, message: 'Please select an AVAILABLE bed for immediate admission, or uncheck immediate admission.' });
      return;
    }

    const res = registerAndAdmitPatient({
      patientData: {
        name: formName.trim(),
        tamilName: formTamilName.trim() || undefined,
        age: Number(formAge),
        dob: formDob,
        gender: formGender,
        phone: formPhone.trim(),
        bloodGroup: formBloodGroup,
        address: formAddress.trim(),
        nationality: 'Indian',
        emergencyContact: {
          name: formEmergName.trim() || 'Family Guardian',
          relationship: formEmergRel,
          phone: formEmergPhone.trim() || formPhone.trim()
        },
        reasonForVisit: formReason.trim() || 'Inpatient admission & clinical management',
        diagnosis: formDiagnosis.trim() || undefined
      },
      admitImmediately,
      admissionData: admitImmediately ? {
        wardId: selectedWardId,
        bedId: selectedBedId,
        doctorId: selectedDoctorId,
        expectedStayDays: Number(expectedStayDays),
        deposit: Number(depositAmount),
        admissionNotes: admissionNotes.trim(),
        diagnosis: formDiagnosis.trim() || formReason.trim() || 'Clinical evaluation & management',
        paymentMethod
      } : undefined
    });

    if (res.success) {
      setAddFeedback({ success: true, message: res.message });
      setSelectedPatient(res.patient);
      // Reset form
      setFormName('');
      setFormTamilName('');
      setFormReason('');
      setFormDiagnosis('');
      setSelectedBedId('');
      setTimeout(() => {
        setShowAddModal(false);
        setAddFeedback(null);
      }, 1800);
    } else {
      setAddFeedback({ success: false, message: res.message });
    }
  };

  // New Vitals state inside patient modal
  const [newTemp, setNewTemp] = useState(98.6);
  const [newBpSys, setNewBpSys] = useState(120);
  const [newBpDia, setNewBpDia] = useState(80);
  const [newHR, setNewHR] = useState(74);
  const [newSpO2, setNewSpO2] = useState(98);
  const [newVitalsNotes, setNewVitalsNotes] = useState('Patient resting comfortably; stable vital telemetry.');

  // New Treatment Note
  const [treatmentNoteText, setTreatmentNoteText] = useState('');

  const filteredPatients = patients.filter(p => {
    if (statusFilter !== 'ALL' && p.status !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q) || (p.tamilName && p.tamilName.includes(q));
      const matchId = p.id.toLowerCase().includes(q);
      const matchPhone = p.phone.includes(q);
      const matchDiagnosis = p.diagnosis?.toLowerCase().includes(q);
      if (!matchName && !matchId && !matchPhone && !matchDiagnosis) return false;
    }
    return true;
  });

  const handleRecordVitals = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient) return;

    addVitalsRecord({
      patientId: selectedPatient.id,
      patientName: selectedPatient.name,
      nurseName: 'Selvi M. (RN)',
      temperature: Number(newTemp),
      bpSystolic: Number(newBpSys),
      bpDiastolic: Number(newBpDia),
      heartRate: Number(newHR),
      respiratoryRate: 18,
      spO2: Number(newSpO2),
      recordedAt: new Date().toISOString(),
      notes: newVitalsNotes
    });

    setNewVitalsNotes('Vitals updated successfully.');
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient || !treatmentNoteText.trim()) return;

    addTreatmentNote(selectedPatient.id, treatmentNoteText.trim(), 'Dr. S. Karthikeyan');
    setTreatmentNoteText('');
  };

  const patientVitalsHistory = selectedPatient
    ? vitals.filter(v => v.patientId === selectedPatient.id)
    : [];

  const patientReports = selectedPatient
    ? diagnosticReports.filter(r => r.patientId === selectedPatient.id)
    : [];

  const patientTransfers = selectedPatient
    ? transfers.filter(t => t.patientId === selectedPatient.id)
    : [];

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Users className="w-7 h-7 text-blue-600" />
            <span>Patient Records & Clinical Directory</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Complete demographic details, bed assignments, longitudinal vitals telemetry, treatment notes, and QR identity.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              setAddFeedback(null);
              setShowAddModal(true);
            }}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black shadow-md hover:shadow-lg transition-all flex items-center gap-2 active:scale-95"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ Add New Patient</span>
          </button>
          <button
            onClick={() => setActiveTab('Admissions')}
            className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <BedDouble className="w-4 h-4 text-slate-500" />
            <span>Bed Admissions</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by patient name, Tamil script, ID, phone..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:border-blue-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          {(['ALL', 'ADMITTED', 'REGISTERED', 'DISCHARGED'] as const).map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                statusFilter === st
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st === 'ALL' ? 'All Records' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Patient Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50/80 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-3 px-4">Patient Profile</th>
                <th className="py-3 px-4">Contact & Location</th>
                <th className="py-3 px-4">Current Ward / Bed</th>
                <th className="py-3 px-4">Attending Doctor</th>
                <th className="py-3 px-4">Diagnosis</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredPatients.map(p => (
                <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4">
                    <button
                      type="button"
                      onClick={() => setSelectedPatient(p)}
                      className="flex items-center gap-2.5 text-left hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-blue-200 rounded-lg"
                      title="Open patient records"
                    >
                      <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-800 font-extrabold text-xs flex items-center justify-center">
                        {p.name.charAt(0)}
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 block">{p.name}</span>
                        <span className="text-[11px] text-slate-400 font-mono">{p.id} • {p.age}y • {p.gender}</span>
                        {p.tamilName && (
                          <span className="text-[10px] text-indigo-600 font-tamil block">{p.tamilName}</span>
                        )}
                      </div>
                    </button>
                  </td>

                  <td className="py-3.5 px-4">
                    <p className="font-semibold text-slate-800">{p.phone}</p>
                    <span className="text-[10px] text-slate-400 block truncate max-w-xs">{p.address || 'Tamil Nadu'}</span>
                  </td>

                  <td className="py-3.5 px-4">
                    {p.currentBedNumber ? (
                      <div>
                        <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-bold text-[11px] border border-blue-200">
                          {p.currentBedNumber}
                        </span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">{p.currentWardName}</span>
                      </div>
                    ) : (
                      <span className="text-slate-400 italic">No Bed Assigned</span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 font-semibold text-slate-800">
                    {p.doctorName || 'Not Assigned'}
                  </td>

                  <td className="py-3.5 px-4 max-w-xs truncate text-slate-700 font-medium">
                    {p.diagnosis || 'Under Evaluation'}
                  </td>

                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md uppercase ${
                      p.status === 'ADMITTED'
                        ? 'bg-blue-100 text-blue-800'
                        : p.status === 'REGISTERED'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {p.status}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {p.status === 'ADMITTED' && (
                        <button
                          onClick={() => {
                            setSelectedPatientForTransferId(p.id);
                            setActiveTab('Transfers');
                          }}
                          className="px-2.5 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg text-xs font-bold transition-all flex items-center gap-1"
                          title="Transfer Patient to another Ward/Bed"
                        >
                          <ArrowLeftRight className="w-3.5 h-3.5" />
                          <span>Transfer</span>
                        </button>
                      )}

                      <button
                        onClick={() => setSelectedPatient(p)}
                        className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-bold transition-all flex items-center gap-1"
                        title="Open Clinical Chart"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Chart</span>
                      </button>

                      <button
                        onClick={() => setShowQRModal(p)}
                        className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-all flex items-center gap-1"
                        title="Print QR Identification"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                        <span>QR</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Patient Medical Chart Modal */}
      {selectedPatient && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-extrabold text-slate-900">{selectedPatient.name}</h3>
                  {selectedPatient.tamilName && (
                    <span className="text-sm font-tamil text-indigo-600">({selectedPatient.tamilName})</span>
                  )}
                  <span className="px-2.5 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs font-bold uppercase">
                    {selectedPatient.status}
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-mono mt-0.5">
                  ID: {selectedPatient.id} • {selectedPatient.age} yrs • {selectedPatient.gender} • Blood: {selectedPatient.bloodGroup}
                </p>
              </div>

              <button
                onClick={() => setSelectedPatient(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            {/* In-Patient Bed & Doctor Banner */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs mb-6">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Current Bed</span>
                <span className="font-extrabold text-slate-900">{selectedPatient.currentBedNumber || 'Not in Bed'}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Ward Location</span>
                <span className="font-bold text-slate-800">{selectedPatient.currentWardName || 'N/A'}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Consultant Doctor</span>
                <span className="font-bold text-slate-800">{selectedPatient.doctorName || 'Assigned Consultant'}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Outstanding Bill</span>
                <span className="font-extrabold text-rose-600">₹ {selectedPatient.outstandingBalance.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Vitals Telemetry History */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-rose-500" />
                  <span>Vitals Telemetry</span>
                </h4>
              </div>

              {patientVitalsHistory.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No vital logs recorded yet.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {patientVitalsHistory.map((v, i) => (
                    <div key={i} className="p-3 bg-white border border-slate-200 rounded-xl text-xs space-y-1">
                      <div className="flex items-center justify-between font-bold">
                        <span className="text-slate-800">BP: {v.bpSystolic}/{v.bpDiastolic} mmHg</span>
                        <span className="text-rose-600">HR: {v.heartRate} bpm</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-500 text-[11px]">
                        <span>Temp: {v.temperature}°F</span>
                        <span className="font-bold text-emerald-600">SpO2: {v.spO2}%</span>
                      </div>
                      <p className="text-[10px] text-slate-400 italic">{v.notes || 'Routine nurse telemetry'}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Record Fresh Vitals form */}
              <form onSubmit={handleRecordVitals} className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100 space-y-3">
                <span className="text-xs font-bold text-blue-900 block">Record New Vitals (Nurse Station)</span>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                  <div>
                    <label className="text-[10px] font-bold text-slate-600 block">Temp (°F)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={newTemp}
                      onChange={e => setNewTemp(Number(e.target.value))}
                      className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-600 block">BP Sys</label>
                    <input
                      type="number"
                      value={newBpSys}
                      onChange={e => setNewBpSys(Number(e.target.value))}
                      className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-600 block">BP Dia</label>
                    <input
                      type="number"
                      value={newBpDia}
                      onChange={e => setNewBpDia(Number(e.target.value))}
                      className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-600 block">Heart Rate</label>
                    <input
                      type="number"
                      value={newHR}
                      onChange={e => setNewHR(Number(e.target.value))}
                      className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-600 block">SpO2 %</label>
                    <input
                      type="number"
                      value={newSpO2}
                      onChange={e => setNewSpO2(Number(e.target.value))}
                      className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-xs"
                >
                  Save Vitals Telemetry
                </button>
              </form>

              {/* Clinical Treatment Notes */}
              <div className="pt-3 border-t border-slate-100">
                <h4 className="font-bold text-sm text-slate-900 mb-2">Doctor's Clinical Notes</h4>
                <div className="space-y-2 mb-3">
                  {selectedPatient.treatmentNotes && selectedPatient.treatmentNotes.length > 0 ? (
                    selectedPatient.treatmentNotes.map((note, idx) => (
                      <div key={idx} className="p-2.5 bg-slate-50 rounded-xl text-xs text-slate-700 border border-slate-100">
                        <p>{note}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400 italic">No notes added yet.</p>
                  )}
                </div>

                <form onSubmit={handleAddNote} className="flex gap-2">
                  <input
                    type="text"
                    value={treatmentNoteText}
                    onChange={e => setTreatmentNoteText(e.target.value)}
                    placeholder="Add clinical observation or prescription note..."
                    className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs"
                  >
                    Add Note
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* QR Code Printable Card Modal */}
      {showQRModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 text-center animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <span className="text-xs font-extrabold text-blue-700 uppercase tracking-wide">MedTrack QR Badge</span>
              <button
                onClick={() => setShowQRModal(null)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center text-xs font-bold"
              >
                ✕
              </button>
            </div>

            {/* Generated Visual QR Code Matrix */}
            <div className="p-4 bg-slate-900 rounded-2xl inline-block shadow-inner mb-3">
              <div className="w-36 h-36 bg-white p-2 rounded-xl flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-full h-full text-slate-900 fill-current">
                  <rect x="0" y="0" width="30" height="30" />
                  <rect x="5" y="5" width="20" height="20" fill="white" />
                  <rect x="10" y="10" width="10" height="10" />
                  <rect x="70" y="0" width="30" height="30" />
                  <rect x="75" y="5" width="20" height="20" fill="white" />
                  <rect x="80" y="10" width="10" height="10" />
                  <rect x="0" y="70" width="30" height="30" />
                  <rect x="5" y="75" width="20" height="20" fill="white" />
                  <rect x="10" y="80" width="10" height="10" />
                  <rect x="40" y="10" width="10" height="10" />
                  <rect x="55" y="10" width="10" height="10" />
                  <rect x="40" y="40" width="20" height="20" />
                  <rect x="70" y="40" width="10" height="10" />
                  <rect x="40" y="70" width="10" height="20" />
                  <rect x="70" y="70" width="20" height="10" />
                </svg>
              </div>
            </div>

            <h3 className="font-extrabold text-base text-slate-900">{showQRModal.name}</h3>
            {showQRModal.tamilName && (
              <p className="text-xs font-tamil text-indigo-600 font-semibold">{showQRModal.tamilName}</p>
            )}
            <p className="text-xs text-slate-500 font-mono mt-1">{showQRModal.id}</p>
            <p className="text-xs font-bold text-blue-700 mt-1">
              Bed: {showQRModal.currentBedNumber || 'Not In Bed'} ({showQRModal.currentWardName || 'Outpatient'})
            </p>

            {printSuccessMsg ? (
              <div className="mt-4 p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl font-bold flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{printSuccessMsg}</span>
              </div>
            ) : (
              <button
                onClick={() => {
                  setPrintSuccessMsg(`Thermal wristband sent to printer for ${showQRModal.name}!`);
                  setTimeout(() => {
                    setPrintSuccessMsg(null);
                    setShowQRModal(null);
                  }, 2000);
                }}
                className="w-full mt-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md transition-all active:scale-95"
              >
                Print Wristband Badge
              </button>
            )}
          </div>
        </div>
      )}

      {/* New Patient Addition Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-7 max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-100 my-6 animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">New Patient Addition</h3>
                  <p className="text-xs text-slate-500">
                    Register demographics, medical triage profile, and assign direct in-patient bed.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-mono font-bold">
                  Next ID: P{1000 + patients.length + 1}
                </span>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Quick Template Presets for Instant Addition */}
            <div className="mt-4 p-3 bg-slate-50 rounded-2xl border border-slate-100 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>Quick-Fill Case Templates:</span>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => applyPreset('emergency')}
                  className="px-2.5 py-1 bg-white hover:bg-rose-50 text-rose-700 border border-slate-200 hover:border-rose-300 rounded-lg text-[11px] font-bold shadow-2xs transition-colors"
                >
                  Emergency Trauma
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset('maternity')}
                  className="px-2.5 py-1 bg-white hover:bg-pink-50 text-pink-700 border border-slate-200 hover:border-pink-300 rounded-lg text-[11px] font-bold shadow-2xs transition-colors"
                >
                  Maternity Delivery
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset('cardiac')}
                  className="px-2.5 py-1 bg-white hover:bg-red-50 text-red-700 border border-slate-200 hover:border-red-300 rounded-lg text-[11px] font-bold shadow-2xs transition-colors"
                >
                  Cardiac ICU
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset('pediatric')}
                  className="px-2.5 py-1 bg-white hover:bg-emerald-50 text-emerald-700 border border-slate-200 hover:border-emerald-300 rounded-lg text-[11px] font-bold shadow-2xs transition-colors"
                >
                  Paediatric
                </button>
              </div>
            </div>

            {/* Notification Banner */}
            {addFeedback && (
              <div
                className={`mt-4 p-3 rounded-2xl text-xs font-bold flex items-center gap-2 ${
                  addFeedback.success
                    ? 'bg-emerald-50 border border-emerald-200 text-emerald-900'
                    : 'bg-rose-50 border border-rose-200 text-rose-900'
                }`}
              >
                {addFeedback.success ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                )}
                <span>{addFeedback.message}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleCreatePatientSubmit} className="mt-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Full Legal Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={e => setFormName(e.target.value)}
                    placeholder="e.g. Senthil Nathan R."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:border-blue-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tamil Script Name <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={formTamilName}
                    onChange={e => setFormTamilName(e.target.value)}
                    placeholder="e.g. செந்தில்நாதன்"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:border-blue-500 font-tamil font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Age *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    max={120}
                    value={formAge}
                    onChange={e => setFormAge(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:border-blue-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Gender *</label>
                  <select
                    value={formGender}
                    onChange={e => setFormGender(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:border-blue-500 font-medium"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={formDob}
                    onChange={e => setFormDob(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:border-blue-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Blood Group</label>
                  <select
                    value={formBloodGroup}
                    onChange={e => setFormBloodGroup(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:border-blue-500 font-medium"
                  >
                    <option value="A+ Positive">A+ Positive</option>
                    <option value="A- Negative">A- Negative</option>
                    <option value="B+ Positive">B+ Positive</option>
                    <option value="B- Negative">B- Negative</option>
                    <option value="O+ Positive">O+ Positive</option>
                    <option value="O- Negative">O- Negative</option>
                    <option value="AB+ Positive">AB+ Positive</option>
                    <option value="AB- Negative">AB- Negative</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Primary Contact Mobile *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formPhone}
                    onChange={e => setFormPhone(e.target.value)}
                    placeholder="+91 94431 00000"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:border-blue-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Residential Address
                  </label>
                  <input
                    type="text"
                    value={formAddress}
                    onChange={e => setFormAddress(e.target.value)}
                    placeholder="Street, City, District"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:border-blue-500 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Emergency Contact Name
                  </label>
                  <input
                    type="text"
                    value={formEmergName}
                    onChange={e => setFormEmergName(e.target.value)}
                    placeholder="Next of Kin / Relative"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:border-blue-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Relationship</label>
                  <select
                    value={formEmergRel}
                    onChange={e => setFormEmergRel(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:border-blue-500 font-medium"
                  >
                    <option value="Spouse">Spouse</option>
                    <option value="Parent">Parent</option>
                    <option value="Child">Child</option>
                    <option value="Sibling">Sibling</option>
                    <option value="Guardian">Guardian</option>
                    <option value="Relative">Relative</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Emergency Phone</label>
                  <input
                    type="tel"
                    value={formEmergPhone}
                    onChange={e => setFormEmergPhone(e.target.value)}
                    placeholder="+91 9..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:border-blue-500 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Reason for Visit / Primary Symptoms *
                  </label>
                  <input
                    type="text"
                    required
                    value={formReason}
                    onChange={e => setFormReason(e.target.value)}
                    placeholder="e.g. Acute chest discomfort and shortness of breath"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:border-blue-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Provisional Clinical Diagnosis
                  </label>
                  <input
                    type="text"
                    value={formDiagnosis}
                    onChange={e => setFormDiagnosis(e.target.value)}
                    placeholder="e.g. Acute Coronary Evaluation / Rule out NSTEMI"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:border-blue-500 font-medium"
                  />
                </div>
              </div>

              {/* Immediate Bed Admission Section */}
              <div className="mt-4 pt-4 border-t border-slate-200">
                <div className="flex items-center justify-between mb-3 bg-blue-50/60 p-3 rounded-2xl border border-blue-100">
                  <div className="flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      id="admitCheck"
                      checked={admitImmediately}
                      onChange={e => setAdmitImmediately(e.target.checked)}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                    />
                    <label htmlFor="admitCheck" className="text-xs font-extrabold text-blue-900 cursor-pointer">
                      Admit Patient Immediately to Hospital Bed
                    </label>
                  </div>
                  <span className="text-[11px] font-semibold text-blue-700">
                    {admitImmediately ? 'Active Bed Allocation Enabled' : 'Outpatient Registration Only'}
                  </span>
                </div>

                {admitImmediately && (
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3.5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Select Target Ward *
                        </label>
                        <select
                          value={selectedWardId}
                          onChange={e => {
                            setSelectedWardId(e.target.value);
                            setSelectedBedId('');
                          }}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none font-medium"
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
                          Select Available Bed *
                        </label>
                        {availableBedsInWard.length === 0 ? (
                          <div className="p-2 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl text-xs font-bold flex items-center gap-1.5">
                            <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                            <span>No available bed in this ward.</span>
                          </div>
                        ) : (
                          <select
                            required={admitImmediately}
                            value={selectedBedId}
                            onChange={e => setSelectedBedId(e.target.value)}
                            className="w-full px-3 py-2 bg-emerald-50 border border-emerald-300 text-emerald-950 font-bold rounded-xl text-xs outline-none"
                          >
                            <option value="">-- Choose Available Bed --</option>
                            {availableBedsInWard.map(b => (
                              <option key={b.id} value={b.id}>
                                Bed {b.number} (Floor {b.floor}) - AVAILABLE
                              </option>
                            ))}
                          </select>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Attending Consultant Doctor
                        </label>
                        <select
                          value={selectedDoctorId}
                          onChange={e => setSelectedDoctorId(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none font-medium"
                        >
                          {doctors.map(d => (
                            <option key={d.id} value={d.id}>
                              {d.name} ({d.specialization.split('/')[0]})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Expected Stay (Days)
                        </label>
                        <input
                          type="number"
                          min={1}
                          max={90}
                          value={expectedStayDays}
                          onChange={e => setExpectedStayDays(Number(e.target.value))}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none font-medium"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Initial Deposit (₹)
                        </label>
                        <input
                          type="number"
                          min={0}
                          step={500}
                          value={depositAmount}
                          onChange={e => setDepositAmount(Number(e.target.value))}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none font-medium"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Deposit Payment Mode
                        </label>
                        <select
                          value={paymentMethod}
                          onChange={e => setPaymentMethod(e.target.value as any)}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none font-medium"
                        >
                          <option value="UPI">UPI (GPay / PhonePe / QR)</option>
                          <option value="CASH">Cash Counter</option>
                          <option value="CARD">Credit / Debit Card</option>
                          <option value="OTHER">Insurance TPA / Corporate</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Admission Notes
                        </label>
                        <input
                          type="text"
                          value={admissionNotes}
                          onChange={e => setAdmissionNotes(e.target.value)}
                          placeholder="e.g. Admitted via casualty triage"
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none font-medium"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Form Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black shadow-md hover:shadow-lg transition-all flex items-center gap-2 active:scale-95"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>{admitImmediately ? 'Save & Admit to Bed' : 'Register Patient'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
