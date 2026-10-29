import {
  Bed,
  Ward,
  Patient,
  Doctor,
  Nurse,
  Admission,
  Transfer,
  DischargeRecord,
  DiagnosticRoom,
  DiagnosticRequest,
  DiagnosticReport,
  Payment,
  CleaningLog,
  Housekeeper,
  VitalsRecord,
  TreatmentNote,
  NotificationItem,
  AuditLog,
  HospitalSettings,
  UserRole,
  BedStatus,
  ScanType,
  DiagnosticStatus,
  DiagnosticPriority,
  PaymentMethod,
  PaymentStatus
} from '../../frontend/src/types/index';

export type {
  Bed,
  Ward,
  Patient,
  Doctor,
  Nurse,
  Admission,
  Transfer,
  DischargeRecord,
  DiagnosticRoom,
  DiagnosticRequest,
  DiagnosticReport,
  Payment,
  CleaningLog,
  Housekeeper,
  VitalsRecord,
  TreatmentNote,
  NotificationItem,
  AuditLog,
  HospitalSettings,
  UserRole,
  BedStatus,
  ScanType,
  DiagnosticStatus,
  DiagnosticPriority,
  PaymentMethod,
  PaymentStatus
};

// MongoDB Collection Names Map
export const COLLECTIONS = {
  SETTINGS: 'settings',
  WARDS: 'wards',
  BEDS: 'beds',
  PATIENTS: 'patients',
  DOCTORS: 'doctors',
  NURSES: 'nurses',
  ADMISSIONS: 'admissions',
  TRANSFERS: 'transfers',
  DISCHARGES: 'discharges',
  DIAGNOSTIC_ROOMS: 'diagnosticRooms',
  DIAGNOSTIC_REQUESTS: 'diagnosticRequests',
  DIAGNOSTIC_REPORTS: 'diagnosticReports',
  PAYMENTS: 'payments',
  CLEANING_LOGS: 'cleaningLogs',
  VITALS: 'vitals',
  TREATMENT_NOTES: 'treatmentNotes',
  NOTIFICATIONS: 'notifications',
  AUDIT_LOGS: 'auditLogs',
} as const;

// Validation & Sanitization Helpers
export function sanitizeId<T extends { id?: string; _id?: any }>(item: T): T & { id: string; _id: string } {
  const id = item.id || (item._id ? String(item._id) : `ID-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`);
  return {
    ...item,
    id,
    _id: id
  };
}

export function validatePatient(data: any): Patient {
  if (!data.name || typeof data.name !== 'string') {
    throw new Error('Patient name is required');
  }
  return {
    id: data.id || `P${Math.floor(1000 + Math.random() * 9000)}`,
    name: data.name.trim(),
    tamilName: data.tamilName,
    age: Number(data.age) || 0,
    dob: data.dob || new Date().toISOString().split('T')[0],
    gender: data.gender || 'Male',
    phone: data.phone || '',
    bloodGroup: data.bloodGroup || 'O+ positive',
    address: data.address || '',
    nationality: data.nationality || 'Indian',
    emergencyContact: data.emergencyContact || {
      name: '',
      relationship: '',
      phone: ''
    },
    reasonForVisit: data.reasonForVisit || 'General checkup',
    diagnosis: data.diagnosis,
    status: data.status || 'REGISTERED',
    currentWardId: data.currentWardId,
    currentWardName: data.currentWardName,
    currentBedId: data.currentBedId,
    currentBedNumber: data.currentBedNumber,
    doctorId: data.doctorId,
    doctorName: data.doctorName,
    admissionDate: data.admissionDate,
    expectedDischargeDate: data.expectedDischargeDate,
    dischargeDate: data.dischargeDate,
    depositAmount: Number(data.depositAmount) || 0,
    totalBilled: Number(data.totalBilled) || 0,
    totalPaid: Number(data.totalPaid) || 0,
    outstandingBalance: Number(data.outstandingBalance) || 0,
    qrToken: data.qrToken || `QR-${Date.now()}`,
    createdAt: data.createdAt || new Date().toISOString()
  };
}

export function validateAdmission(data: any): Admission {
  if (!data.patientId || !data.bedId || !data.wardId) {
    throw new Error('patientId, wardId, and bedId are required for an admission');
  }
  return {
    id: data.id || `ADM-${Date.now()}`,
    patientId: data.patientId,
    patientName: data.patientName || '',
    wardId: data.wardId,
    wardName: data.wardName || '',
    bedId: data.bedId,
    bedNumber: data.bedNumber || '',
    doctorId: data.doctorId || '',
    doctorName: data.doctorName || '',
    admissionDate: data.admissionDate || new Date().toISOString(),
    expectedStayDays: Number(data.expectedStayDays) || 3,
    expectedDischargeDate: data.expectedDischargeDate || new Date(Date.now() + 3 * 86400000).toISOString(),
    deposit: Number(data.deposit) || 0,
    admissionNotes: data.admissionNotes || '',
    diagnosis: data.diagnosis || 'Observation',
    status: data.status || 'ACTIVE',
    dischargeDate: data.dischargeDate
  };
}

export function validateTransfer(data: any): Transfer {
  if (!data.patientId || !data.toWardId || !data.toBedId) {
    throw new Error('patientId, toWardId, and toBedId are required for transfer');
  }
  return {
    id: data.id || `TRF-${Date.now()}`,
    patientId: data.patientId,
    patientName: data.patientName || '',
    fromWardId: data.fromWardId || '',
    fromWardName: data.fromWardName || '',
    fromBedId: data.fromBedId || '',
    fromBedNumber: data.fromBedNumber || '',
    toWardId: data.toWardId,
    toWardName: data.toWardName || '',
    toBedId: data.toBedId,
    toBedNumber: data.toBedNumber || '',
    doctorId: data.doctorId || '',
    doctorName: data.doctorName || '',
    transferType: data.transferType || 'ROUTINE',
    reason: data.reason || 'Clinical upgrade/transfer',
    status: 'COMPLETED',
    timestamp: data.timestamp || new Date().toISOString(),
    notes: data.notes
  };
}

export function validateDischarge(data: any): DischargeRecord {
  if (!data.patientId) {
    throw new Error('patientId is required for discharge');
  }
  return {
    id: data.id || `DIS-${Date.now()}`,
    patientId: data.patientId,
    patientName: data.patientName || '',
    bedId: data.bedId,
    bedNumber: data.bedNumber || '',
    wardId: data.wardId,
    wardName: data.wardName || '',
    doctorId: data.doctorId || '',
    doctorName: data.doctorName || '',
    dischargeDate: data.dischargeDate || new Date().toISOString(),
    dischargeSummary: data.dischargeSummary || 'Patient stable and cleared for discharge.',
    prescriptions: data.prescriptions,
    followUpDate: data.followUpDate,
    clearedBilling: Boolean(data.clearedBilling)
  };
}

export function validatePayment(data: any): Payment {
  if (!data.patientId || data.amount === undefined) {
    throw new Error('patientId and amount are required for payment');
  }
  return {
    id: data.id || `PAY-${Date.now()}`,
    patientId: data.patientId,
    patientName: data.patientName || '',
    admissionId: data.admissionId,
    amount: Number(data.amount) || 0,
    method: data.method || 'CASH',
    transactionRef: data.transactionRef || `TXN-${Date.now()}`,
    date: data.date || new Date().toISOString(),
    receiver: data.receiver || 'Accounts Desk',
    notes: data.notes,
    status: data.status || 'PAID',
    type: data.type || 'WARD_CHARGE'
  };
}

export function validateDiagnosticRequest(data: any): DiagnosticRequest {
  if (!data.patientId || !data.scanType) {
    throw new Error('patientId and scanType are required for diagnostic request');
  }
  return {
    id: data.id || `REQ-${Date.now()}`,
    patientId: data.patientId,
    patientName: data.patientName || '',
    admissionId: data.admissionId,
    doctorId: data.doctorId || '',
    doctorName: data.doctorName || '',
    scanType: data.scanType,
    requestedDate: data.requestedDate || new Date().toISOString(),
    scheduledDate: data.scheduledDate,
    completedDate: data.completedDate,
    priority: data.priority || 'ROUTINE',
    clinicalReason: data.clinicalReason || '',
    notes: data.notes,
    assignedRoomId: data.assignedRoomId,
    assignedRoomName: data.assignedRoomName,
    assignedEquipment: data.assignedEquipment,
    status: data.status || 'REQUESTED',
    cost: Number(data.cost) || 0,
    reportId: data.reportId
  };
}

export function validateVitals(data: any): VitalsRecord {
  if (!data.patientId) {
    throw new Error('patientId is required for vitals');
  }
  return {
    id: data.id || `VIT-${Date.now()}`,
    patientId: data.patientId,
    patientName: data.patientName || '',
    temperature: Number(data.temperature) || 98.6,
    bpSystolic: Number(data.bpSystolic) || 120,
    bpDiastolic: Number(data.bpDiastolic) || 80,
    heartRate: Number(data.heartRate) || 72,
    spO2: Number(data.spO2) || 98,
    respiratoryRate: Number(data.respiratoryRate) || 16,
    weight: data.weight ? Number(data.weight) : undefined,
    notes: data.notes,
    recordedBy: data.recordedBy || 'Staff Nurse',
    timestamp: data.timestamp || new Date().toISOString()
  };
}

