import React, { useState } from 'react';
import {
  UserPlus,
  BedDouble,
  CreditCard,
  Users,
  Activity,
  CheckCircle2,
  AlertCircle,
  QrCode,
  ArrowRight,
  ShieldCheck,
  Search,
  Plus
} from 'lucide-react';
import { useHospital } from '../context/HospitalContext';
import { Patient, Bed, PaymentMethod, ScanType, DiagnosticPriority } from '../types';

interface ReceptionistDashboardProps {
  onOpenAdmissionModal?: () => void;
  onOpenRegistrationModal?: () => void;
  onOpenPaymentModal?: (patient: Patient) => void;
}

export const ReceptionistDashboard: React.FC<ReceptionistDashboardProps> = ({
  onOpenAdmissionModal,
  onOpenRegistrationModal,
  onOpenPaymentModal
}) => {
  const {
    patients,
    beds,
    wards,
    doctors,
    admitPatient,
    registerPatient,
    requestDiagnostic,
    payments,
    setActiveTab
  } = useHospital();

  // Registration Form State
  const [showQuickRegister, setShowQuickRegister] = useState(false);
  const [regName, setRegName] = useState('');
  const [regTamilName, setRegTamilName] = useState('');
  const [regAge, setRegAge] = useState<number>(35);
  const [regGender, setRegGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [regPhone, setRegPhone] = useState('+91 94431 ');
  const [regBlood, setRegBlood] = useState('B+ Positive');
  const [regAddress, setRegAddress] = useState('Chidambaram, Tamil Nadu');
  const [regReason, setRegReason] = useState('');
  const [regSuccessMsg, setRegSuccessMsg] = useState('');

  // Instant Admission Form State
  const [selectedPatientId, setSelectedPatientId] = useState<string>('');
  const [selectedWardId, setSelectedWardId] = useState<string>('w-gm');
  const [selectedBedId, setSelectedBedId] = useState<string>('');
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>('DOC-02');
  const [expectedDays, setExpectedDays] = useState<number>(4);
  const [depositAmount, setDepositAmount] = useState<number>(10000);
  const [admissionDiagnosis, setAdmissionDiagnosis] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');
  const [admissionResult, setAdmissionResult] = useState<{ success: boolean; message: string } | null>(null);

  // Available beds in selected ward (Strict check: status === 'AVAILABLE')
  const availableBedsInWard = beds.filter(b => b.wardId === selectedWardId && b.status === 'AVAILABLE');
  const registeredPatients = patients.filter(p => p.status === 'REGISTERED');
  const totalAvailableBeds = beds.filter(b => b.status === 'AVAILABLE').length;

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regPhone.trim()) {
      setRegSuccessMsg('Error: Please provide patient legal name and contact number.');
      setTimeout(() => setRegSuccessMsg(''), 4000);
      return;
    }

    const newPatient = registerPatient({
      name: regName.trim(),
      tamilName: regTamilName.trim() || undefined,
      age: Number(regAge),
      dob: '1990-01-01',
      gender: regGender,
      phone: regPhone.trim(),
      bloodGroup: regBlood,
      address: regAddress.trim(),
      nationality: 'Indian',
      emergencyContact: {
        name: 'Family Member',
        relationship: 'Relative',
        phone: regPhone.trim()
      },
      reasonForVisit: regReason.trim() || 'General Consultation / Admission evaluation'
    });

    setRegSuccessMsg(`Patient ${newPatient.name} registered with ID ${newPatient.id}! Ready for bed assignment.`);
    setSelectedPatientId(newPatient.id);
    setRegName('');
    setRegReason('');
    setTimeout(() => setRegSuccessMsg(''), 6000);
  };

  const handleAdmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatientId) {
      setAdmissionResult({ success: false, message: 'Please select a registered patient.' });
      return;
    }
    if (!selectedBedId) {
      setAdmissionResult({ success: false, message: 'No suitable bed selected. Only AVAILABLE beds can be assigned.' });
      return;
    }

    const res = admitPatient({
      patientId: selectedPatientId,
      wardId: selectedWardId,
      bedId: selectedBedId,
      doctorId: selectedDoctorId,
      expectedStayDays: Number(expectedDays),
      deposit: Number(depositAmount),
      admissionNotes: 'Standard admission processed via Reception Desk.',
      diagnosis: admissionDiagnosis.trim() || 'In-patient Clinical Care & Observation',
      paymentMethod
    });

    setAdmissionResult(res);
    if (res.success) {
      setSelectedBedId('');
      setSelectedPatientId('');
      setAdmissionDiagnosis('');
    }
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-900 to-slate-900 text-white rounded-2xl p-6 shadow-md border border-blue-800/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-500/30 text-blue-300 border border-blue-400/20">
              Frontdesk & Admissions Desk
            </span>
            <span className="text-xs text-slate-400">Receptionist Lead • M. Vignesh • MedTrack Tamil Nadu</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">Patient Admissions & Frontdesk Registry</h1>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Register incoming Tamil Nadu patients, assign strictly AVAILABLE hospital beds, collect admission deposits via UPI/Cash/Card, and generate patient QR identification.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowQuickRegister(!showQuickRegister)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5"
          >
            <UserPlus className="w-4 h-4" />
            <span>{showQuickRegister ? 'Close Form' : 'Register New Patient'}</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Available Beds</span>
            <BedDouble className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-extrabold text-slate-900">{totalAvailableBeds}</span>
            <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">Ready to Assign</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Total Patients</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-extrabold text-slate-900">{patients.length}</span>
            <p className="text-[11px] text-slate-400 mt-0.5">Registered in MedTrack</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Today's Payments</span>
            <CreditCard className="w-4 h-4 text-purple-600" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-extrabold text-slate-900">{payments.length}</span>
            <p className="text-[11px] text-slate-400 mt-0.5">Deposits & Surcharges</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Active In-Patients</span>
            <Activity className="w-4 h-4 text-rose-600" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-extrabold text-slate-900">
              {patients.filter(p => p.status === 'ADMITTED').length}
            </span>
            <p className="text-[11px] text-slate-400 mt-0.5">Occupying Wards</p>
          </div>
        </div>
      </div>

      {/* Quick Registration Form Collapsible */}
      {showQuickRegister && (
        <div className="bg-white rounded-2xl border border-blue-200 p-6 shadow-sm animate-in fade-in duration-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-blue-600" />
                <span>Register New Patient (Tamil Nadu Registry)</span>
              </h3>
              <p className="text-xs text-slate-500">Create permanent hospital record with unique patient ID & secure QR identity</p>
            </div>
          </div>

          <form onSubmit={handleRegister} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={regName}
                onChange={e => setRegName(e.target.value)}
                placeholder="e.g. Saravanan M."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Tamil Script Name (Optional)</label>
              <input
                type="text"
                value={regTamilName}
                onChange={e => setRegTamilName(e.target.value)}
                placeholder="e.g. சரவணன்"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-blue-500 outline-none font-tamil"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Age & Gender *</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  min="1"
                  max="120"
                  required
                  value={regAge}
                  onChange={e => setRegAge(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none"
                />
                <select
                  value={regGender}
                  onChange={e => setRegGender(e.target.value as any)}
                  className="w-full px-2 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number (+91) *</label>
              <input
                type="text"
                required
                value={regPhone}
                onChange={e => setRegPhone(e.target.value)}
                placeholder="+91 94431 88990"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Blood Group</label>
              <select
                value={regBlood}
                onChange={e => setRegBlood(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none"
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

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Tamil Nadu Address</label>
              <input
                type="text"
                value={regAddress}
                onChange={e => setRegAddress(e.target.value)}
                placeholder="Gandhi Road, Chidambaram, TN"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">Reason for Visit / Symptoms</label>
              <input
                type="text"
                value={regReason}
                onChange={e => setRegReason(e.target.value)}
                placeholder="e.g. Acute abdominal pain, high fever, post trauma"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none"
              />
            </div>

            <div className="sm:col-span-4 flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowQuickRegister(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Save & Generate QR Identity</span>
              </button>
            </div>
          </form>

          {regSuccessMsg && (
            <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{regSuccessMsg}</span>
            </div>
          )}
        </div>
      )}

      {/* Bed Admission Workstation (Strict check: Only AVAILABLE beds can be selected) */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
              <BedDouble className="w-5 h-5 text-blue-600" />
              <span>Patient Bed Admission Workstation</span>
            </h3>
            <p className="text-xs text-slate-500">
              Select an admitted patient, choose destination ward, assign an strictly AVAILABLE bed, record doctor & initial deposit.
            </p>
          </div>
        </div>

        <form onSubmit={handleAdmit} className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Step 1: Select Patient */}
          <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200/70 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-blue-700 uppercase tracking-wide block mb-2">1. Select Patient</span>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Registered Patient *</label>
              <select
                value={selectedPatientId}
                onChange={e => setSelectedPatientId(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs outline-none focus:border-blue-500"
              >
                <option value="">-- Choose Patient --</option>
                {patients.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.id}) - {p.status === 'ADMITTED' ? `Already in ${p.currentBedNumber}` : 'Ready for Bed'}
                  </option>
                ))}
              </select>

              <div className="mt-3">
                <label className="block text-xs font-semibold text-slate-700 mb-1">Admission Diagnosis</label>
                <input
                  type="text"
                  value={admissionDiagnosis}
                  onChange={e => setAdmissionDiagnosis(e.target.value)}
                  placeholder="e.g. Acute Dengue / Post Cardiac Evaluation"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs outline-none"
                />
              </div>
            </div>
          </div>

          {/* Step 2: Select Ward & Available Bed (Zero Waiting List / Zero Reservation) */}
          <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200/70 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wide block mb-2">2. Destination Bed</span>
              
              <label className="block text-xs font-semibold text-slate-700 mb-1">Ward / Department *</label>
              <select
                value={selectedWardId}
                onChange={e => {
                  setSelectedWardId(e.target.value);
                  setSelectedBedId('');
                }}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs outline-none focus:border-blue-500"
              >
                {wards.map(w => (
                  <option key={w.id} value={w.id}>
                    {w.name} ({w.availableBeds} Available / {w.totalBeds} Total)
                  </option>
                ))}
              </select>

              <div className="mt-3">
                <label className="block text-xs font-semibold text-slate-700 mb-1">Available Bed Number *</label>
                {availableBedsInWard.length === 0 ? (
                  <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs font-bold">
                    No suitable bed is currently available in this ward.
                  </div>
                ) : (
                  <select
                    value={selectedBedId}
                    onChange={e => setSelectedBedId(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-emerald-400 rounded-xl text-xs font-bold text-emerald-900 outline-none"
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
          </div>

          {/* Step 3: Doctor & Deposit Payment */}
          <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200/70 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-purple-700 uppercase tracking-wide block mb-2">3. Doctor & Deposit</span>
              
              <label className="block text-xs font-semibold text-slate-700 mb-1">Attending Consultant Doctor *</label>
              <select
                value={selectedDoctorId}
                onChange={e => setSelectedDoctorId(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs outline-none"
              >
                {doctors.map(d => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.department})
                  </option>
                ))}
              </select>

              <div className="grid grid-cols-2 gap-2 mt-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Deposit (₹ INR)</label>
                  <input
                    type="number"
                    step="1000"
                    value={depositAmount}
                    onChange={e => setDepositAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Payment Method</label>
                  <select
                    value={paymentMethod}
                    onChange={e => setPaymentMethod(e.target.value as any)}
                    className="w-full px-2 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold outline-none"
                  >
                    <option value="UPI">UPI / GPay</option>
                    <option value="CARD">Debit / Credit Card</option>
                    <option value="CASH">Cash</option>
                  </select>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={availableBedsInWard.length === 0}
              className={`w-full mt-4 py-2.5 rounded-xl text-xs font-extrabold text-white shadow-md transition-all flex items-center justify-center gap-2 ${
                availableBedsInWard.length === 0 ? 'bg-slate-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Confirm Admission & Assign Bed</span>
            </button>
          </div>
        </form>

        {admissionResult && (
          <div className={`mt-4 p-3.5 rounded-xl text-xs font-bold flex items-center gap-2 ${
            admissionResult.success ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' : 'bg-rose-50 text-rose-900 border border-rose-200'
          }`}>
            {admissionResult.success ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-rose-600" />}
            <span>{admissionResult.message}</span>
          </div>
        )}
      </div>

      {/* Patient Table with Instant QR and Payment Actions */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-slate-900">Hospital Patient Directory</h3>
            <p className="text-xs text-slate-500">View admission ledger, outstanding hospital balances, and print secure patient QR badges</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50/80 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-3 px-4">Patient ID & Name</th>
                <th className="py-3 px-4">Phone / Contact</th>
                <th className="py-3 px-4">Current Bed</th>
                <th className="py-3 px-4">Attending Doctor</th>
                <th className="py-3 px-4">Total Billed</th>
                <th className="py-3 px-4">Paid (Deposit)</th>
                <th className="py-3 px-4">Balance</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {patients.map(patient => (
                <tr key={patient.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    <div className="flex items-center gap-2">
                      <span>{patient.name}</span>
                      {patient.tamilName && (
                        <span className="text-[10px] text-indigo-600 font-tamil">({patient.tamilName})</span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-400 block font-normal">{patient.id} • {patient.gender} • {patient.age}y</span>
                  </td>

                  <td className="py-3.5 px-4 text-slate-600">
                    {patient.phone}
                    <span className="text-[10px] text-slate-400 block">{patient.bloodGroup}</span>
                  </td>

                  <td className="py-3.5 px-4">
                    {patient.currentBedNumber ? (
                      <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-bold text-[11px] border border-blue-200">
                        {patient.currentBedNumber}
                      </span>
                    ) : (
                      <span className="text-slate-400 italic">Discharged / Registered</span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 font-semibold text-slate-800">
                    {patient.doctorName || 'Not Assigned'}
                  </td>

                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    ₹ {patient.totalBilled.toLocaleString('en-IN')}
                  </td>

                  <td className="py-3.5 px-4 font-bold text-emerald-600">
                    ₹ {patient.totalPaid.toLocaleString('en-IN')}
                  </td>

                  <td className="py-3.5 px-4">
                    <span className={`font-extrabold ${patient.outstandingBalance > 0 ? 'text-rose-600' : 'text-slate-400'}`}>
                      ₹ {patient.outstandingBalance.toLocaleString('en-IN')}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          if (onOpenPaymentModal) onOpenPaymentModal(patient);
                          else setActiveTab('Billing');
                        }}
                        className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-xs font-bold transition-all flex items-center gap-1"
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>Pay</span>
                      </button>

                      <button
                        onClick={() => setActiveTab('Patients')}
                        className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-all flex items-center gap-1"
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
    </div>
  );
};
