import React, { useState } from 'react';
import {
  UserPlus,
  BedDouble,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  CreditCard,
  Building2,
  Calendar,
  Users,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { useHospital } from '../context/HospitalContext';
import { PaymentMethod } from '../types';

export const AdmissionsPage: React.FC = () => {
  const { patients, beds, wards, doctors, admissions, admitPatient, registerAndAdmitPatient } = useHospital();

  const [admissionMode, setAdmissionMode] = useState<'EXISTING' | 'NEW_PATIENT'>('EXISTING');

  // Existing Patient Admission State
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [selectedWardId, setSelectedWardId] = useState('w-gm');
  const [selectedBedId, setSelectedBedId] = useState('');
  const [selectedDoctorId, setSelectedDoctorId] = useState('DOC-01');
  const [expectedDays, setExpectedDays] = useState(4);
  const [deposit, setDeposit] = useState(10000);
  const [diagnosis, setDiagnosis] = useState('');
  const [notes, setNotes] = useState('Direct in-patient admission.');
  const [payMethod, setPayMethod] = useState<PaymentMethod>('UPI');
  const [resMsg, setResMsg] = useState<{ success: boolean; message: string } | null>(null);

  // New Patient Addition State
  const [newName, setNewName] = useState('');
  const [newTamilName, setNewTamilName] = useState('');
  const [newAge, setNewAge] = useState(38);
  const [newGender, setNewGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [newDob, setNewDob] = useState('1988-05-15');
  const [newBloodGroup, setNewBloodGroup] = useState('B+ Positive');
  const [newPhone, setNewPhone] = useState('+91 9');
  const [newAddress, setNewAddress] = useState('Chidambaram, Tamil Nadu');
  const [newEmergName, setNewEmergName] = useState('');
  const [newEmergRel, setNewEmergRel] = useState('Spouse');
  const [newEmergPhone, setNewEmergPhone] = useState('');
  const [newReason, setNewReason] = useState('');

  const availableBeds = beds.filter(b => b.wardId === selectedWardId && b.status === 'AVAILABLE');

  const applyTemplate = (preset: 'emergency' | 'maternity' | 'cardiac' | 'pediatric') => {
    if (preset === 'emergency') {
      setNewName('Vijay Anand');
      setNewTamilName('விஜய் ஆனந்த்');
      setNewAge(36);
      setNewGender('Male');
      setNewBloodGroup('O+ Positive');
      setNewPhone('+91 98402 99182');
      setNewAddress('24, South Car Street, Chidambaram, Tamil Nadu');
      setNewEmergName('Anandhi V.');
      setNewEmergRel('Spouse');
      setNewEmergPhone('+91 98402 99183');
      setNewReason('Severe acute abdomen with right lower quadrant tenderness');
      setDiagnosis('Acute Appendicitis - Emergency Inpatient Laparoscopy Pre-op');
      setSelectedWardId('w-em');
      setSelectedDoctorId('DOC-03');
      setDeposit(15000);
      setExpectedDays(3);
    } else if (preset === 'maternity') {
      setNewName('Sangeetha Murugan');
      setNewTamilName('சங்கீதா முருகன்');
      setNewAge(28);
      setNewGender('Female');
      setNewBloodGroup('B+ Positive');
      setNewPhone('+91 97891 22334');
      setNewAddress('15, West Sannathi Street, Vadalur, Tamil Nadu');
      setNewEmergName('Murugan K.');
      setNewEmergRel('Spouse');
      setNewEmergPhone('+91 97891 22335');
      setNewReason('Spontaneous onset labor contractions at 39 weeks');
      setDiagnosis('Full Term Gestation in Active Labor Stage 1');
      setSelectedWardId('w-mat');
      setSelectedDoctorId('DOC-07');
      setDeposit(20000);
      setExpectedDays(3);
    } else if (preset === 'cardiac') {
      setNewName('Sivakumar Ramalingam');
      setNewTamilName('சிவகுமார் ராமலிங்கம்');
      setNewAge(61);
      setNewGender('Male');
      setNewBloodGroup('A+ Positive');
      setNewPhone('+91 94433 77889');
      setNewAddress('42, Gandhiji Road, Bhuvanagiri, Tamil Nadu');
      setNewEmergName('Ramalingam S.');
      setNewEmergRel('Son');
      setNewEmergPhone('+91 94433 77890');
      setNewReason('Retrosternal chest tightness and shortness of breath');
      setDiagnosis('Unstable Angina Pectoris / Troponin Positive Telemetry');
      setSelectedWardId('w-icu');
      setSelectedDoctorId('DOC-04');
      setDeposit(25000);
      setExpectedDays(5);
    } else if (preset === 'pediatric') {
      setNewName('Baby Kaviya (Child)');
      setNewTamilName('காவியா');
      setNewAge(6);
      setNewGender('Female');
      setNewBloodGroup('O+ Positive');
      setNewPhone('+91 98421 11223');
      setNewAddress('10, College Quarters, Annamalai Nagar, Chidambaram');
      setNewEmergName('Karthik N.');
      setNewEmergRel('Parent');
      setNewEmergPhone('+91 98421 11223');
      setNewReason('Persistent pyrexia and spasmodic wheezing');
      setDiagnosis('Acute Bronchopneumonia with mild respiratory distress');
      setSelectedWardId('w-ped');
      setSelectedDoctorId('DOC-05');
      setDeposit(12000);
      setExpectedDays(4);
    }
    setSelectedBedId('');
  };

  const handleAdmitSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (admissionMode === 'NEW_PATIENT') {
      if (!newName.trim() || !newPhone.trim()) {
        setResMsg({ success: false, message: 'Please provide patient full name and contact number.' });
        return;
      }
      if (!selectedBedId) {
        setResMsg({ success: false, message: 'Please select an AVAILABLE bed for admission.' });
        return;
      }

      const res = registerAndAdmitPatient({
        patientData: {
          name: newName.trim(),
          tamilName: newTamilName.trim() || undefined,
          age: Number(newAge),
          dob: newDob,
          gender: newGender,
          phone: newPhone.trim(),
          bloodGroup: newBloodGroup,
          address: newAddress.trim(),
          nationality: 'Indian',
          emergencyContact: {
            name: newEmergName.trim() || 'Primary Guardian',
            relationship: newEmergRel,
            phone: newEmergPhone.trim() || newPhone.trim()
          },
          reasonForVisit: newReason.trim() || 'Direct emergency/elective in-patient bed admission',
          diagnosis: diagnosis.trim() || newReason.trim() || 'Inpatient clinical admission'
        },
        admitImmediately: true,
        admissionData: {
          wardId: selectedWardId,
          bedId: selectedBedId,
          doctorId: selectedDoctorId,
          expectedStayDays: Number(expectedDays),
          deposit: Number(deposit),
          admissionNotes: notes,
          diagnosis: diagnosis.trim() || newReason.trim() || 'Inpatient clinical treatment',
          paymentMethod: payMethod
        }
      });

      setResMsg(res);
      if (res.success) {
        setNewName('');
        setNewTamilName('');
        setNewReason('');
        setSelectedBedId('');
      }
      return;
    }

    // Existing patient admission
    if (!selectedPatientId || !selectedBedId) {
      setResMsg({ success: false, message: 'Please select a registered patient and an AVAILABLE bed.' });
      return;
    }

    const res = admitPatient({
      patientId: selectedPatientId,
      wardId: selectedWardId,
      bedId: selectedBedId,
      doctorId: selectedDoctorId,
      expectedStayDays: Number(expectedDays),
      deposit: Number(deposit),
      admissionNotes: notes,
      diagnosis: diagnosis || 'Clinical evaluation and in-patient treatment',
      paymentMethod: payMethod
    });

    setResMsg(res);
    if (res.success) {
      setSelectedBedId('');
      setSelectedPatientId('');
    }
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
          <UserPlus className="w-7 h-7 text-blue-600" />
          <span>Patient Admission Records & Workstation</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Direct bed allocation engine. Strictly pairs incoming patients to real-time available beds.
        </p>
      </div>

      {/* Admission Workflow Form */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-xs">
        <h3 className="font-extrabold text-sm text-slate-900 mb-4 flex items-center gap-2">
          <BedDouble className="w-4 h-4 text-blue-600" />
          <span>Process New In-Patient Bed Admission</span>
        </h3>

        <div className="flex flex-wrap items-center justify-between gap-3 mb-5 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
            <button
              type="button"
              onClick={() => {
                setAdmissionMode('EXISTING');
                setResMsg(null);
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                admissionMode === 'EXISTING'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Admit Registered Patient
            </button>
            <button
              type="button"
              onClick={() => {
                setAdmissionMode('NEW_PATIENT');
                setResMsg(null);
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                admissionMode === 'NEW_PATIENT'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>+ New Patient Addition & Bed Admission</span>
            </button>
          </div>

          {admissionMode === 'NEW_PATIENT' && (
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-slate-500 font-semibold flex items-center gap-1 text-[11px]">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>Quick-Fill:</span>
              </span>
              <button
                type="button"
                onClick={() => applyTemplate('emergency')}
                className="px-2 py-0.5 bg-slate-50 hover:bg-rose-50 text-rose-700 border border-slate-200 rounded-md text-[11px] font-bold"
              >
                Emergency
              </button>
              <button
                type="button"
                onClick={() => applyTemplate('maternity')}
                className="px-2 py-0.5 bg-slate-50 hover:bg-pink-50 text-pink-700 border border-slate-200 rounded-md text-[11px] font-bold"
              >
                Maternity
              </button>
              <button
                type="button"
                onClick={() => applyTemplate('cardiac')}
                className="px-2 py-0.5 bg-slate-50 hover:bg-red-50 text-red-700 border border-slate-200 rounded-md text-[11px] font-bold"
              >
                Cardiac
              </button>
              <button
                type="button"
                onClick={() => applyTemplate('pediatric')}
                className="px-2 py-0.5 bg-slate-50 hover:bg-emerald-50 text-emerald-700 border border-slate-200 rounded-md text-[11px] font-bold"
              >
                Paediatric
              </button>
            </div>
          )}
        </div>

        <form onSubmit={handleAdmitSubmit} className="space-y-4 text-xs">
          {admissionMode === 'NEW_PATIENT' ? (
            /* New Patient Addition Fields */
            <div className="p-4 bg-blue-50/40 rounded-2xl border border-blue-100 space-y-3.5">
              <div className="flex items-center justify-between pb-2 border-b border-blue-100">
                <span className="font-extrabold text-blue-900 text-xs flex items-center gap-1.5">
                  <UserPlus className="w-4 h-4 text-blue-600" />
                  <span>Step 1: Patient Demographics & Contact</span>
                </span>
                <span className="text-[11px] font-mono font-bold text-blue-700 bg-blue-100/60 px-2 py-0.5 rounded-md">
                  Auto ID: P{1000 + patients.length + 1}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Full Legal Name *</label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={e => setNewName(e.target.value)}
                    placeholder="e.g. Senthil Nathan R."
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-blue-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Tamil Script Name <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={newTamilName}
                    onChange={e => setNewTamilName(e.target.value)}
                    placeholder="e.g. செந்தில்நாதன்"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-blue-500 font-tamil font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Age *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    max={120}
                    value={newAge}
                    onChange={e => setNewAge(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-blue-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Gender *</label>
                  <select
                    value={newGender}
                    onChange={e => setNewGender(e.target.value as any)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-blue-500 font-medium"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={newDob}
                    onChange={e => setNewDob(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-blue-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Blood Group</label>
                  <select
                    value={newBloodGroup}
                    onChange={e => setNewBloodGroup(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-blue-500 font-medium"
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
                  <label className="block font-bold text-slate-700 mb-1">Primary Mobile *</label>
                  <input
                    type="tel"
                    required
                    value={newPhone}
                    onChange={e => setNewPhone(e.target.value)}
                    placeholder="+91 94431 00000"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-blue-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Residential Address</label>
                  <input
                    type="text"
                    value={newAddress}
                    onChange={e => setNewAddress(e.target.value)}
                    placeholder="Street, Town, District"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-blue-500 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Emergency Contact Name</label>
                  <input
                    type="text"
                    value={newEmergName}
                    onChange={e => setNewEmergName(e.target.value)}
                    placeholder="Guardian / Kin"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-blue-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Relationship</label>
                  <select
                    value={newEmergRel}
                    onChange={e => setNewEmergRel(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-blue-500 font-medium"
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
                  <label className="block font-bold text-slate-700 mb-1">Emergency Contact Phone</label>
                  <input
                    type="tel"
                    value={newEmergPhone}
                    onChange={e => setNewEmergPhone(e.target.value)}
                    placeholder="+91 9..."
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-blue-500 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Reason for Admission / Triage Symptoms *</label>
                <input
                  type="text"
                  required
                  value={newReason}
                  onChange={e => setNewReason(e.target.value)}
                  placeholder="e.g. Severe acute breathlessness with lower chest tightness"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-blue-500 font-medium"
                />
              </div>
            </div>
          ) : (
            /* Existing Patient Select */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="sm:col-span-2 lg:col-span-3">
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-bold text-slate-700">Select Patient *</label>
                  <button
                    type="button"
                    onClick={() => setAdmissionMode('NEW_PATIENT')}
                    className="text-[11px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>+ Or Register A Brand New Patient</span>
                  </button>
                </div>
                <select
                  required
                  value={selectedPatientId}
                  onChange={e => {
                    if (e.target.value === '__NEW__') {
                      setAdmissionMode('NEW_PATIENT');
                    } else {
                      setSelectedPatientId(e.target.value);
                    }
                  }}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none font-medium"
                >
                  <option value="">-- Choose Registered Patient --</option>
                  <option value="__NEW__" className="text-blue-600 font-bold bg-blue-50">
                    ⭐ + Register & Admit New Patient Directly...
                  </option>
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.id}) - {p.status === 'ADMITTED' ? `Occupying ${p.currentBedNumber} (${p.currentWardName})` : 'Ready for Bed Assignment'}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Bed Allocation & Financial Deposit Section */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3.5">
            <span className="font-extrabold text-slate-800 text-xs flex items-center gap-1.5 pb-2 border-b border-slate-200">
              <BedDouble className="w-4 h-4 text-blue-600" />
              <span>Step 2: Bed Allocation, Attending Doctor & Initial Deposit</span>
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Target Ward *</label>
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
                <label className="block font-bold text-slate-700 mb-1">Available Bed *</label>
                {availableBeds.length === 0 ? (
                  <div className="p-2 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl text-xs font-bold flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                    <span>No bed available in this ward.</span>
                  </div>
                ) : (
                  <select
                    required
                    value={selectedBedId}
                    onChange={e => setSelectedBedId(e.target.value)}
                    className="w-full px-3 py-2 bg-emerald-50 border border-emerald-300 text-emerald-950 font-bold rounded-xl text-xs outline-none"
                  >
                    <option value="">-- Choose Bed --</option>
                    {availableBeds.map(b => (
                      <option key={b.id} value={b.id}>
                        Bed {b.number} (Floor {b.floor}) - AVAILABLE
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Attending Doctor</label>
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
                <label className="block font-bold text-slate-700 mb-1">Admission Diagnosis</label>
                <input
                  type="text"
                  value={diagnosis}
                  onChange={e => setDiagnosis(e.target.value)}
                  placeholder="e.g. Acute appendicitis evaluation"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Expected Stay (Days)</label>
                <input
                  type="number"
                  min={1}
                  max={60}
                  value={expectedDays}
                  onChange={e => setExpectedDays(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Deposit (₹) & Mode</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    step="500"
                    value={deposit}
                    onChange={e => setDeposit(Number(e.target.value))}
                    className="w-full px-2 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none"
                  />
                  <select
                    value={payMethod}
                    onChange={e => setPayMethod(e.target.value as PaymentMethod)}
                    className="w-full px-2 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none font-medium"
                  >
                    <option value="UPI">UPI / GPay</option>
                    <option value="CARD">Card</option>
                    <option value="CASH">Cash</option>
                    <option value="OTHER">Insurance</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end pt-2">
            <button
              type="submit"
              disabled={availableBeds.length === 0}
              className={`px-6 py-2.5 rounded-xl text-xs font-black text-white shadow-md transition-all flex items-center gap-2 active:scale-95 ${
                availableBeds.length === 0 ? 'bg-slate-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{admissionMode === 'NEW_PATIENT' ? 'Register Patient & Confirm Bed Allocation' : 'Confirm Admission & Lock Bed'}</span>
            </button>
          </div>
        </form>

        {resMsg && (
          <div className={`mt-4 p-3.5 rounded-xl text-xs font-bold flex items-center gap-2 ${
            resMsg.success ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' : 'bg-rose-50 text-rose-900 border border-rose-200'
          }`}>
            {resMsg.success ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertTriangle className="w-4 h-4 text-rose-600" />}
            <span>{resMsg.message}</span>
          </div>
        )}
      </div>

      {/* Admissions Log Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100">
          <h3 className="font-bold text-sm text-slate-900">Hospital In-Patient Admissions Log</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50/80 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-3 px-4">Admission ID</th>
                <th className="py-3 px-4">Patient</th>
                <th className="py-3 px-4">Ward & Bed</th>
                <th className="py-3 px-4">Doctor</th>
                <th className="py-3 px-4">Diagnosis</th>
                <th className="py-3 px-4">Deposit</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {admissions.map(adm => (
                <tr key={adm.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">{adm.id}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">{adm.patientName}</td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-blue-700">{adm.bedNumber}</span>
                    <span className="text-[10px] text-slate-400 block">{adm.wardName}</span>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-800">{adm.doctorName}</td>
                  <td className="py-3.5 px-4 max-w-xs truncate">{adm.diagnosis}</td>
                  <td className="py-3.5 px-4 font-bold text-emerald-700">₹ {adm.deposit.toLocaleString('en-IN')}</td>
                  <td className="py-3.5 px-4 text-slate-400">{new Date(adm.admissionDate).toLocaleDateString('en-GB')}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-bold rounded-md">
                      {adm.status}
                    </span>
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
