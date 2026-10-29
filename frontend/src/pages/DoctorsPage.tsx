import React, { useState } from 'react';
import { Stethoscope, Phone, Mail, Award, CheckCircle2, UserPlus, X, BedDouble, Activity, CalendarDays } from 'lucide-react';
import { useHospital } from '../context/HospitalContext';
import { Patient } from '../types';

export const DoctorsPage: React.FC = () => {
  const { doctors, patients, setActiveTab } = useHospital();
  const [selectedDoctorPatients, setSelectedDoctorPatients] = useState<{
    doctorName: string;
    patients: Patient[];
  } | null>(null);

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
          <Stethoscope className="w-7 h-7 text-emerald-600" />
          <span>Medical Faculty & Consultant Doctors</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Specialist medical staff, active in-patient case allocations, and on-duty availability status.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {doctors.map(doc => {
          const assignedPatients = patients.filter(p => p.doctorId === doc.id && p.status === 'ADMITTED');
          const assignedCount = assignedPatients.length;

          return (
            <div
              key={doc.id}
              className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-black text-base flex items-center justify-center shadow-md shadow-blue-500/20 shrink-0">
                    {doc.name.split(' ')[1]?.charAt(0) || 'D'}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900">{doc.name}</h3>
                    <p className="text-xs text-blue-600 font-bold">{doc.specialization}</p>
                    <span className="text-[11px] text-slate-400 font-medium">{doc.department}</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{doc.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate">{doc.email}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => setSelectedDoctorPatients({ doctorName: doc.name, patients: assignedPatients })}
                  className="px-2.5 py-1 bg-blue-50 text-blue-800 rounded-lg font-bold transition hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  title="View assigned patient details"
                >
                  {assignedCount} In-Patients
                </button>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-lg font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>On Duty</span>
                  </span>
                  <button
                    onClick={() => setActiveTab('Admissions')}
                    className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Admit new patient under this doctor"
                  >
                    <UserPlus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {selectedDoctorPatients && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900">{selectedDoctorPatients.doctorName}</h3>
                <p className="text-xs text-slate-500 mt-1">
                  {selectedDoctorPatients.patients.length} active admitted patient{selectedDoctorPatients.patients.length !== 1 ? 's' : ''}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedDoctorPatients(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center"
                title="Close patient list"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              {selectedDoctorPatients.patients.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-500">
                  No admitted patients assigned to this doctor.
                </div>
              ) : (
                selectedDoctorPatients.patients.map(patient => (
                  <div key={patient.id} className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h4 className="text-base font-extrabold text-slate-900">{patient.name}</h4>
                        <p className="text-[11px] text-slate-500 font-mono">{patient.id} • {patient.age} yrs • {patient.gender}</p>
                      </div>
                      <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-bold uppercase">
                        {patient.status}
                      </span>
                    </div>

                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700">
                      <div className="flex items-center gap-2">
                        <BedDouble className="w-3.5 h-3.5 text-blue-500" />
                        <span>{patient.currentWardName || 'Ward not assigned'} • {patient.currentBedNumber || 'No bed'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CalendarDays className="w-3.5 h-3.5 text-indigo-500" />
                        <span>{patient.admissionDate ? new Date(patient.admissionDate).toLocaleDateString('en-GB') : 'Admission date pending'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span>{patient.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Activity className="w-3.5 h-3.5 text-rose-500" />
                        <span>{patient.diagnosis || 'Diagnosis pending'}</span>
                      </div>
                    </div>

                    <div className="mt-4 flex justify-end">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedDoctorPatients(null);
                          setActiveTab('Patients');
                        }}
                        className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold"
                      >
                        Open patient records
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
