export type BedStatus = 'AVAILABLE' | 'OCCUPIED' | 'CLEANING_REQUIRED' | 'CLEANING_IN_PROGRESS' | 'MAINTENANCE';

export type UserRole = 'ADMIN' | 'DOCTOR' | 'NURSE' | 'RECEPTIONIST';

export interface AuthUser {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  avatarUrl: string;
  title: string;
  department?: string;
  employeeId: string;
}

export type ScanType = 'XRAY' | 'CT_SCAN' | 'MRI_SCAN';

export type DiagnosticStatus = 'REQUESTED' | 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'REPORT_PENDING' | 'REPORTED' | 'CANCELLED';

export type DiagnosticPriority = 'ROUTINE' | 'URGENT' | 'STAT';

export type DiagnosticRoomStatus = 'AVAILABLE' | 'IN_USE' | 'MAINTENANCE' | 'OUT_OF_SERVICE';

export type PaymentMethod = 'CASH' | 'CARD' | 'UPI' | 'OTHER';

export type PaymentStatus = 'PAID' | 'PARTIAL' | 'PENDING';

export interface Bed {
  id: string;
  number: string;
  wardId: string;
  wardName: string;
  department: string;
  floor: number;
  status: BedStatus;
  patientId?: string;
  patientName?: string;
  patientAge?: number;
  patientGender?: string;
  doctorId?: string;
  doctorName?: string;
  admissionDate?: string;
  lastCleanedAt?: string;
  cleaningStaff?: string;
  cleaningStartedAt?: string;
  cleaningEstimatedSeconds?: number;
  notes?: string;
}

export interface Housekeeper {
  id: string;
  name: string;
  tamilName?: string;
  phone: string;
  shift: 'Morning' | 'Evening' | 'Night';
  assignedWard: string;
  status: 'AVAILABLE' | 'CLEANING' | 'ON_BREAK';
  activeBedId?: string;
  activeBedNumber?: string;
  bedsCleanedToday: number;
  rating: number;
  speedMins: number;
}

export interface Ward {
  id: string;
  name: string;
  code: string;
  department: string;
  floor: number;
  totalBeds: number;
  occupiedBeds: number;
  availableBeds: number;
  cleaningBeds: number;
  maintenanceBeds: number;
  costPerDay: number;
  headDoctor: string;
  occupancyRate: number;
  description?: string;
}

export interface Patient {
  id: string; // e.g. P1001
  name: string;
  tamilName?: string;
  age: number;
  dob: string;
  gender: 'Male' | 'Female' | 'Other';
  phone: string;
  bloodGroup: string;
  address: string;
  nationality: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  reasonForVisit: string;
  diagnosis?: string;
  status: 'ADMITTED' | 'DISCHARGED' | 'REGISTERED';
  currentWardId?: string;
  currentWardName?: string;
  currentBedId?: string;
  currentBedNumber?: string;
  doctorId?: string;
  doctorName?: string;
  admissionDate?: string;
  expectedDischargeDate?: string;
  dischargeDate?: string;
  depositAmount: number;
  totalBilled: number;
  totalPaid: number;
  outstandingBalance: number;
  qrToken: string;
  createdAt: string;
}

export interface Doctor {
  id: string;
  name: string;
  department: string;
  specialization: string;
  phone: string;
  email: string;
  maxCapacity: number;
  currentPatientCount: number;
  availableCapacity: number;
  isDemo: boolean;
  active: boolean;
  avatarUrl?: string;
}

export interface Nurse {
  id: string;
  name: string;
  tamilName?: string;
  ward: string;
  phone: string;
  shift: 'Morning' | 'Evening' | 'Night';
  assignedPatientsCount: number;
  active: boolean;
}

export interface Admission {
  id: string;
  patientId: string;
  patientName: string;
  wardId: string;
  wardName: string;
  bedId: string;
  bedNumber: string;
  doctorId: string;
  doctorName: string;
  admissionDate: string;
  expectedStayDays: number;
  expectedDischargeDate: string;
  deposit: number;
  admissionNotes: string;
  diagnosis: string;
  status: 'ACTIVE' | 'DISCHARGED';
  dischargeDate?: string;
}

export type TransferType = 'EMERGENCY_ICU' | 'STEP_DOWN' | 'ROUTINE' | 'ROUTINE_UPGRADE' | 'SPECIALITY' | 'SURGICAL_POST_OP' | 'ISOLATION';

export interface Transfer {
  id: string;
  patientId: string;
  patientName: string;
  fromWardId: string;
  fromWardName: string;
  fromBedId: string;
  fromBedNumber: string;
  toWardId: string;
  toWardName: string;
  toBedId: string;
  toBedNumber: string;
  doctorId: string;
  doctorName: string;
  transferType?: TransferType;
  reason: string;
  status: 'COMPLETED';
  timestamp: string;
  notes?: string;
}

export interface DischargeRecord {
  id: string;
  patientId: string;
  patientName: string;
  bedId?: string;
  bedNumber: string;
  wardId?: string;
  wardName: string;
  doctorId: string;
  doctorName: string;
  dischargeDate: string;
  dischargeSummary: string;
  prescriptions?: string;
  followUpDate?: string;
  clearedBilling: boolean;
}

export interface DiagnosticRoom {
  id: string;
  name: string;
  code: string; // e.g. XRAY-01, CT-01, MRI-01
  type: ScanType;
  floor: number;
  equipmentId: string;
  equipmentModel: string;
  status: DiagnosticRoomStatus;
  department: string;
  currentRequestId?: string;
  cost?: number;
  technicianName?: string;
  modality?: string;
  currentScanType?: string;
}

export interface DiagnosticRequest {
  id: string;
  patientId: string;
  patientName: string;
  admissionId?: string;
  doctorId: string;
  doctorName: string;
  scanType: ScanType;
  requestedDate: string;
  scheduledDate?: string;
  completedDate?: string;
  priority: DiagnosticPriority;
  clinicalReason: string;
  notes?: string;
  assignedRoomId?: string;
  assignedRoomName?: string;
  assignedEquipment?: string;
  status: DiagnosticStatus;
  cost: number;
  reportId?: string;
}

export interface DiagnosticReport {
  id: string;
  requestId: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  scanType: ScanType;
  findings: string;
  impression: string;
  radiologistName: string;
  reportDate: string;
  status: 'FINAL' | 'DRAFT';
  recommendations?: string;
  notes?: string;
}

export interface Payment {
  id: string;
  patientId: string;
  patientName: string;
  admissionId?: string;
  amount: number;
  method: PaymentMethod;
  transactionRef: string;
  date: string;
  receiver: string;
  notes?: string;
  status: PaymentStatus;
  type: 'DEPOSIT' | 'WARD_CHARGE' | 'DIAGNOSTIC' | 'DOCTOR_FEE' | 'FINAL_SETTLEMENT';
}

export interface CleaningLog {
  id: string;
  bedId: string;
  bedNumber: string;
  wardName: string;
  previousPatient?: string;
  staffName: string;
  startTime: string;
  completionTime?: string;
  notes?: string;
  status: 'CLEANING_IN_PROGRESS' | 'COMPLETED';
}

export interface VitalsRecord {
  id: string;
  patientId: string;
  patientName: string;
  temperature: number; // in Fahrenheit, e.g. 98.6
  bpSystolic: number; // e.g. 120
  bpDiastolic: number; // e.g. 80
  heartRate: number; // bpm e.g. 74
  spO2: number; // percentage e.g. 98
  respiratoryRate: number; // breaths/min e.g. 16
  weight?: number; // kg
  notes?: string;
  recordedBy: string;
  timestamp: string;
}

export interface TreatmentNote {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  diagnosis: string;
  treatmentPlan: string;
  doctorInstructions: string;
  followUp: string;
  notes?: string;
  timestamp: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'INFO' | 'WARNING' | 'CRITICAL' | 'SUCCESS';
  category: 'BED' | 'CAPACITY' | 'TRANSFER' | 'DIAGNOSTIC' | 'PAYMENT' | 'DISCHARGE';
  timestamp: string;
  read: boolean;
  linkTab?: string;
}

export interface AuditLog {
  id: string;
  user: string;
  role: UserRole;
  action: string;
  entity: string;
  entityId: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface HospitalSettings {
  hospitalName: string;
  subtitle: string;
  address: string;
  state: string;
  phone: string;
  email: string;
  wardCharges: {
    general: number;
    icu: number;
    emergency: number;
    speciality: number;
    maternity: number;
    pediatric: number;
  };
  diagnosticCharges: {
    xray: number;
    ctScan: number;
    mriScan: number;
  };
  forecastSettings: {
    warningThresholdPercent: number; // e.g. 80
    criticalThresholdPercent: number; // e.g. 90
    forecastDays: number; // 7
  };
  autoCleanBedsOnDischarge?: boolean;
}

export interface MongoStatus {
  connected: boolean;
  uriConfigured: boolean;
  dbName: string;
  host?: string;
  error?: string;
  collectionCounts: Record<string, number>;
  lastSyncedAt?: string;
  mode: 'MONGODB' | 'IN_MEMORY';
}
