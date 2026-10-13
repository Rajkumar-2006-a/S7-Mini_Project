import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Bed,
  Ward,
  Patient,
  Doctor,
  Nurse,
  Admission,
  Transfer,
  TransferType,
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
  AuthUser,
  ScanType,
  DiagnosticPriority,
  PaymentMethod,
  MongoStatus
} from '../types';

export const DEFAULT_USERS: Record<UserRole, AuthUser> = {
  ADMIN: {
    id: 'USR-ADM-01',
    name: 'Dr. Govindharaj M.',
    role: 'ADMIN',
    email: 'admin@medtrack.org',
    avatarUrl: '',
    title: 'Chief Medical Administrator',
    department: 'Hospital Governance & Capacity Planning',
    employeeId: 'MED-ADM-01'
  },
  DOCTOR: {
    id: 'DOC-01',
    name: 'Dr. S. Karthikeyan',
    role: 'DOCTOR',
    email: 'doctor.karthik@medtrack.org',
    avatarUrl: '',
    title: 'Senior Consultant Physician (MD)',
    department: 'General Medicine & ICU',
    employeeId: 'MED-DOC-01'
  },
  NURSE: {
    id: 'NUR-01',
    name: 'Selvi M.',
    role: 'NURSE',
    email: 'selvi@medtrack.org',
    avatarUrl: '',
    title: 'ICU Charge Nurse & Triage Lead (RN)',
    department: 'Intensive Care Unit (ICU)',
    employeeId: 'MED-NUR-01'
  },
  RECEPTIONIST: {
    id: 'REC-01',
    name: 'M. Vignesh',
    role: 'RECEPTIONIST',
    email: 'reception@medtrack.org',
    avatarUrl: '',
    title: 'Admissions & Frontdesk Lead',
    department: 'Patient Admissions & Billing',
    employeeId: 'MED-REC-01'
  }
};

import {
  INITIAL_SETTINGS,
  INITIAL_WARDS,
  INITIAL_DOCTORS,
  INITIAL_NURSES,
  INITIAL_DIAGNOSTIC_ROOMS,
  INITIAL_PATIENTS,
  INITIAL_BEDS,
  INITIAL_ADMISSIONS,
  INITIAL_TRANSFERS,
  INITIAL_DISCHARGES,
  INITIAL_DIAGNOSTIC_REQUESTS,
  INITIAL_DIAGNOSTIC_REPORTS,
  INITIAL_PAYMENTS,
  INITIAL_CLEANING_LOGS,
  INITIAL_HOUSEKEEPERS,
  INITIAL_VITALS,
  INITIAL_TREATMENT_NOTES,
  INITIAL_NOTIFICATIONS,
  INITIAL_AUDIT_LOGS,
  HISTORICAL_7_DAYS
} from '../data/seedData';
import { generateHospitalForecast, ForecastSummary } from '../utils/forecasting';

interface HospitalContextType {
  // Authentication & Session
  isAuthenticated: boolean;
  currentUser: AuthUser;
  login: (role: UserRole, email?: string, password?: string) => boolean;
  logout: () => void;

  // State
  currentRole: UserRole;
  currentDoctorId: string;
  currentNurseId: string;
  activeTab: string;
  settings: HospitalSettings;
  beds: Bed[];
  wards: Ward[];
  patients: Patient[];
  doctors: Doctor[];
  nurses: Nurse[];
  admissions: Admission[];
  transfers: Transfer[];
  discharges: DischargeRecord[];
  diagnosticRooms: DiagnosticRoom[];
  diagnosticRequests: DiagnosticRequest[];
  diagnosticReports: DiagnosticReport[];
  payments: Payment[];
  cleaningLogs: CleaningLog[];
  housekeepers: Housekeeper[];
  cleaningDelaySeconds: number;
  autoTurnoverEnabled: boolean;
  vitals: VitalsRecord[];
  treatmentNotes: TreatmentNote[];
  notifications: NotificationItem[];
  auditLogs: AuditLog[];
  forecast: ForecastSummary;
  searchQuery: string;
  selectedWardFilter: string;
  selectedPatientForTransferId: string | null;

  // Setters / Nav
  setCurrentRole: (role: UserRole) => void;
  setActiveTab: (tab: string, wardFilter?: string) => void;
  setSelectedWardFilter: (wardId: string) => void;
  setSelectedPatientForTransferId: (patientId: string | null) => void;
  setSearchQuery: (query: string) => void;

  // Business Actions
  registerPatient: (patientData: Omit<Patient, 'id' | 'status' | 'totalBilled' | 'totalPaid' | 'outstandingBalance' | 'qrToken' | 'createdAt'>) => Patient;
  registerAndAdmitPatient: (params: {
    patientData: Omit<Patient, 'id' | 'status' | 'totalBilled' | 'totalPaid' | 'outstandingBalance' | 'qrToken' | 'createdAt'>;
    admitImmediately?: boolean;
    admissionData?: {
      wardId: string;
      bedId: string;
      doctorId: string;
      expectedStayDays: number;
      deposit: number;
      admissionNotes: string;
      diagnosis: string;
      paymentMethod: PaymentMethod;
    };
  }) => { success: boolean; message: string; patient: Patient; admission?: Admission };
  admitPatient: (params: {
    patientId: string;
    wardId: string;
    bedId: string;
    doctorId: string;
    expectedStayDays: number;
    deposit: number;
    admissionNotes: string;
    diagnosis: string;
    paymentMethod: PaymentMethod;
  }) => { success: boolean; message: string; admission?: Admission };
  
  transferPatient: (params: {
    patientId: string;
    toWardId: string;
    toBedId: string;
    doctorId: string;
    reason: string;
    transferType?: TransferType;
    notes?: string;
    clinicalNotes?: string;
  }) => { success: boolean; message: string; transfer?: Transfer };

  startBedCleaning: (bedId: string, staffName?: string) => { success: boolean; message: string };
  completeBedCleaning: (bedId: string, staffName?: string, notes?: string) => { success: boolean; message: string };
  autoCleanAllPendingBeds: (staffName?: string) => { success: boolean; message: string };
  addHousekeeper: (data: Omit<Housekeeper, 'id' | 'bedsCleanedToday' | 'status'>) => void;
  updateHousekeeperStatus: (id: string, status: Housekeeper['status']) => void;
  setCleaningDelaySeconds: (seconds: number) => void;
  setAutoTurnoverEnabled: (enabled: boolean) => void;
  setBedMaintenance: (bedId: string, reason: string) => { success: boolean; message: string };
  restoreBedFromMaintenance: (bedId: string) => { success: boolean; message: string };

  requestDiagnostic: (params: {
    patientId: string;
    admissionId?: string;
    doctorId: string;
    scanType: ScanType;
    priority: DiagnosticPriority;
    clinicalReason: string;
    notes?: string;
    assignedRoomId?: string;
  }) => { success: boolean; message: string; request?: DiagnosticRequest };

  assignDiagnosticRoom: (requestId: string, roomId: string) => { success: boolean; message: string };
  completeDiagnosticScan: (requestId: string) => { success: boolean; message: string };
  submitDiagnosticReport: (params: {
    requestId: string;
    findings: string;
    impression: string;
    recommendations?: string;
    radiologistName: string;
  }) => { success: boolean; message: string; report?: DiagnosticReport };

  recordVitals: (record: Omit<VitalsRecord, 'id' | 'timestamp'>) => { success: boolean; message: string };
  addTreatmentNote: (note: Omit<TreatmentNote, 'id' | 'timestamp'>) => { success: boolean; message: string };
  recordPayment: (params: {
    patientId: string;
    admissionId?: string;
    amount: number;
    method: PaymentMethod;
    type: Payment['type'];
    notes?: string;
  }) => { success: boolean; message: string; payment?: Payment };

  dischargePatient: (params: {
    patientId: string;
    notes?: string;
    dischargeSummary?: string;
    prescriptions?: string;
    doctorId?: string;
    followUpDate?: string;
    clearedBilling?: boolean;
    autoCleanBed?: boolean;
  }) => { success: boolean; message: string; discharge?: DischargeRecord };

  updateSettings: (newSettings: Partial<HospitalSettings>) => void;
  markNotificationRead: (id: string) => void;
  clearAllNotifications: () => void;
  resetToDemoData: () => void;
  mongoStatus: MongoStatus;
  isSyncing: boolean;
  syncWithDatabase: () => Promise<void>;
  refreshMongoStatus: () => Promise<void>;
}

const HospitalContext = createContext<HospitalContextType | undefined>(undefined);

export const HospitalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const saved = localStorage.getItem('medtrack_auth');
    return saved === 'true';
  });

  const [currentRole, setCurrentRoleState] = useState<UserRole>(() => {
    const savedRole = localStorage.getItem('medtrack_role') as UserRole;
    return savedRole && DEFAULT_USERS[savedRole] ? savedRole : 'ADMIN';
  });

  const [currentUser, setCurrentUser] = useState<AuthUser>(() => {
    const savedRole = localStorage.getItem('medtrack_role') as UserRole;
    return savedRole && DEFAULT_USERS[savedRole] ? DEFAULT_USERS[savedRole] : DEFAULT_USERS.ADMIN;
  });

  const setCurrentRole = (role: UserRole) => {
    setCurrentRoleState(role);
    setCurrentUser(DEFAULT_USERS[role] || DEFAULT_USERS.ADMIN);
    localStorage.setItem('medtrack_role', role);
    setActiveTab('Dashboard');
  };

  const login = (role: UserRole, email?: string, password?: string): boolean => {
    setCurrentRoleState(role);
    const user = DEFAULT_USERS[role] || DEFAULT_USERS.ADMIN;
    setCurrentUser(user);
    setIsAuthenticated(true);
    localStorage.setItem('medtrack_auth', 'true');
    localStorage.setItem('medtrack_role', role);
    setActiveTab('Dashboard');
    pushNotification('Authentication Successful', `Welcome back, ${user.name} (${user.title}).`, 'SUCCESS', 'BED');
    return true;
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.setItem('medtrack_auth', 'false');
    pushNotification('Logged Out', 'Your clinical operations session has safely ended.', 'INFO', 'BED');
  };

  const [currentDoctorId] = useState<string>('DOC-01'); // Dr. Govindharaj M. default
  const [currentNurseId] = useState<string>('NUR-01'); // Selvi default
  const [activeTab, setActiveTabState] = useState<string>('Dashboard');
  const [selectedWardFilter, setSelectedWardFilter] = useState<string>('ALL');
  const [selectedPatientForTransferId, setSelectedPatientForTransferId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const setActiveTab = (tab: string, wardFilter?: string) => {
    setActiveTabState(tab);
    if (wardFilter !== undefined) {
      setSelectedWardFilter(wardFilter);
    }
  };

  // Persistent / reactive state
  const [settings, setSettings] = useState<HospitalSettings>(() => {
    const saved = localStorage.getItem('medtrack_settings');
    return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
  });

  const [wards, setWards] = useState<Ward[]>(() => {
    const saved = localStorage.getItem('medtrack_wards');
    return saved ? JSON.parse(saved) : INITIAL_WARDS;
  });

  const [beds, setBeds] = useState<Bed[]>(() => {
    const saved = localStorage.getItem('medtrack_beds');
    return saved ? JSON.parse(saved) : INITIAL_BEDS;
  });

  const [patients, setPatients] = useState<Patient[]>(() => {
    const saved = localStorage.getItem('medtrack_patients');
    return saved ? JSON.parse(saved) : INITIAL_PATIENTS;
  });

  const [doctors] = useState<Doctor[]>(INITIAL_DOCTORS);
  const [nurses] = useState<Nurse[]>(INITIAL_NURSES);

  const [admissions, setAdmissions] = useState<Admission[]>(() => {
    const saved = localStorage.getItem('medtrack_admissions');
    return saved ? JSON.parse(saved) : INITIAL_ADMISSIONS;
  });

  const [transfers, setTransfers] = useState<Transfer[]>(() => {
    const saved = localStorage.getItem('medtrack_transfers');
    return saved ? JSON.parse(saved) : INITIAL_TRANSFERS;
  });

  const [discharges, setDischarges] = useState<DischargeRecord[]>(() => {
    const saved = localStorage.getItem('medtrack_discharges');
    return saved ? JSON.parse(saved) : INITIAL_DISCHARGES;
  });

  const [diagnosticRooms, setDiagnosticRooms] = useState<DiagnosticRoom[]>(() => {
    const saved = localStorage.getItem('medtrack_diagnostic_rooms');
    return saved ? JSON.parse(saved) : INITIAL_DIAGNOSTIC_ROOMS;
  });

  const [diagnosticRequests, setDiagnosticRequests] = useState<DiagnosticRequest[]>(() => {
    const saved = localStorage.getItem('medtrack_diagnostic_requests');
    return saved ? JSON.parse(saved) : INITIAL_DIAGNOSTIC_REQUESTS;
  });

  const [diagnosticReports, setDiagnosticReports] = useState<DiagnosticReport[]>(() => {
    const saved = localStorage.getItem('medtrack_diagnostic_reports');
    return saved ? JSON.parse(saved) : INITIAL_DIAGNOSTIC_REPORTS;
  });

  const [payments, setPayments] = useState<Payment[]>(() => {
    const saved = localStorage.getItem('medtrack_payments');
    return saved ? JSON.parse(saved) : INITIAL_PAYMENTS;
  });

  const [cleaningLogs, setCleaningLogs] = useState<CleaningLog[]>(() => {
    const saved = localStorage.getItem('medtrack_cleaning_logs');
    return saved ? JSON.parse(saved) : INITIAL_CLEANING_LOGS;
  });

  const [housekeepers, setHousekeepers] = useState<Housekeeper[]>(() => {
    const saved = localStorage.getItem('medtrack_housekeepers');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= INITIAL_HOUSEKEEPERS.length) return parsed;
      } catch {}
    }
    return INITIAL_HOUSEKEEPERS;
  });

  const [cleaningDelaySeconds, setCleaningDelaySeconds] = useState<number>(() => {
    // Zero delay mode as requested: beds are sanitized and made available with no delay
    const saved = localStorage.getItem('medtrack_cleaning_delay');
    if (saved !== null && Number(saved) === 0) return 0;
    return 0; // Default to 0 seconds (zero delay)
  });

  const [autoTurnoverEnabled, setAutoTurnoverEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('medtrack_auto_turnover');
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [vitals, setVitals] = useState<VitalsRecord[]>(() => {
    const saved = localStorage.getItem('medtrack_vitals');
    return saved ? JSON.parse(saved) : INITIAL_VITALS;
  });

  const [treatmentNotes, setTreatmentNotes] = useState<TreatmentNote[]>(() => {
    const saved = localStorage.getItem('medtrack_treatment_notes');
    return saved ? JSON.parse(saved) : INITIAL_TREATMENT_NOTES;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('medtrack_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem('medtrack_audit_logs');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  const [mongoStatus, setMongoStatus] = useState<MongoStatus>({
    connected: false,
    uriConfigured: false,
    dbName: 'medtrack_hospital',
    mode: 'IN_MEMORY',
    collectionCounts: {}
  });

  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // Initial load from MongoDB backend on startup
  useEffect(() => {
    let isMounted = true;
    const fetchInitialState = async () => {
      try {
        const res = await fetch('/api/hospital/state');
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data && isMounted) {
            if (json.data.beds && json.data.beds.length > 0) setBeds(json.data.beds);
            if (json.data.wards && json.data.wards.length > 0) setWards(json.data.wards);
            if (json.data.patients && json.data.patients.length > 0) setPatients(json.data.patients);
            if (json.data.admissions && json.data.admissions.length > 0) setAdmissions(json.data.admissions);
            if (json.data.transfers && json.data.transfers.length > 0) setTransfers(json.data.transfers);
            if (json.data.diagnosticRooms && json.data.diagnosticRooms.length > 0) setDiagnosticRooms(json.data.diagnosticRooms);
            if (json.data.diagnosticRequests && json.data.diagnosticRequests.length > 0) setDiagnosticRequests(json.data.diagnosticRequests);
            if (json.data.diagnosticReports && json.data.diagnosticReports.length > 0) setDiagnosticReports(json.data.diagnosticReports);
            if (json.data.payments && json.data.payments.length > 0) setPayments(json.data.payments);
            if (json.data.cleaningLogs && json.data.cleaningLogs.length > 0) setCleaningLogs(json.data.cleaningLogs);
            if (json.data.vitals && json.data.vitals.length > 0) setVitals(json.data.vitals);
            if (json.data.treatmentNotes && json.data.treatmentNotes.length > 0) setTreatmentNotes(json.data.treatmentNotes);
            if (json.data.notifications && json.data.notifications.length > 0) setNotifications(json.data.notifications);
            if (json.data.auditLogs && json.data.auditLogs.length > 0) setAuditLogs(json.data.auditLogs);
            if (json.data.settings) setSettings(json.data.settings);
          }
          if (json.dbStatus && isMounted) {
            setMongoStatus(json.dbStatus);
          }
        }
      } catch (err) {
        console.warn('Initial state sync from MongoDB notice:', err);
      }
    };

    fetchInitialState();

    const interval = setInterval(async () => {
      try {
        const res = await fetch('/api/database/status');
        if (res.ok) {
          const status = await res.json();
          if (isMounted) setMongoStatus(status);
        }
      } catch {}
    }, 15000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const refreshMongoStatus = async () => {
    try {
      const res = await fetch('/api/database/status');
      if (res.ok) {
        const status = await res.json();
        setMongoStatus(status);
      }
    } catch (err) {
      console.warn('Failed to refresh mongo status', err);
    }
  };

  const syncWithDatabase = async () => {
    setIsSyncing(true);
    try {
      const res = await fetch('/api/hospital/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          beds,
          wards,
          patients,
          admissions,
          transfers,
          diagnosticRooms,
          diagnosticRequests,
          diagnosticReports,
          payments,
          cleaningLogs,
          vitals,
          treatmentNotes,
          notifications,
          auditLogs,
          settings
        })
      });
      if (res.ok) {
        const json = await res.json();
        if (json.dbStatus) {
          setMongoStatus(json.dbStatus);
        }
      }
    } catch (e) {
      console.warn('MongoDB sync notice:', e);
    } finally {
      setIsSyncing(false);
    }
  };

  // Sync ward counts whenever beds change
  useEffect(() => {
    setWards(prevWards => {
      const updatedWards = prevWards.map(ward => {
        const wardBeds = beds.filter(b => b.wardId === ward.id);
        const total = wardBeds.length;
        const occupied = wardBeds.filter(b => b.status === 'OCCUPIED').length;
        const available = wardBeds.filter(b => b.status === 'AVAILABLE').length;
        const cleaning = wardBeds.filter(b => b.status === 'CLEANING_REQUIRED' || b.status === 'CLEANING_IN_PROGRESS').length;
        const maintenance = wardBeds.filter(b => b.status === 'MAINTENANCE').length;
        const occupancyRate = total > 0 ? Math.round((occupied / total) * 100) : 0;
        return {
          ...ward,
          totalBeds: total,
          occupiedBeds: occupied,
          availableBeds: available,
          cleaningBeds: cleaning,
          maintenanceBeds: maintenance,
          occupancyRate
        };
      });
      localStorage.setItem('medtrack_wards', JSON.stringify(updatedWards));
      return updatedWards;
    });
    localStorage.setItem('medtrack_beds', JSON.stringify(beds));
  }, [beds]);

  // Local storage auto sync
  useEffect(() => {
    localStorage.setItem('medtrack_patients', JSON.stringify(patients));
  }, [patients]);

  useEffect(() => {
    localStorage.setItem('medtrack_admissions', JSON.stringify(admissions));
  }, [admissions]);

  useEffect(() => {
    localStorage.setItem('medtrack_transfers', JSON.stringify(transfers));
  }, [transfers]);

  useEffect(() => {
    localStorage.setItem('medtrack_discharges', JSON.stringify(discharges));
  }, [discharges]);

  useEffect(() => {
    localStorage.setItem('medtrack_payments', JSON.stringify(payments));
  }, [payments]);

  useEffect(() => {
    localStorage.setItem('medtrack_cleaning_logs', JSON.stringify(cleaningLogs));
  }, [cleaningLogs]);

  useEffect(() => {
    localStorage.setItem('medtrack_diagnostic_requests', JSON.stringify(diagnosticRequests));
  }, [diagnosticRequests]);

  useEffect(() => {
    localStorage.setItem('medtrack_diagnostic_rooms', JSON.stringify(diagnosticRooms));
  }, [diagnosticRooms]);

  useEffect(() => {
    localStorage.setItem('medtrack_diagnostic_reports', JSON.stringify(diagnosticReports));
  }, [diagnosticReports]);

  useEffect(() => {
    localStorage.setItem('medtrack_vitals', JSON.stringify(vitals));
  }, [vitals]);

  useEffect(() => {
    localStorage.setItem('medtrack_treatment_notes', JSON.stringify(treatmentNotes));
  }, [treatmentNotes]);

  useEffect(() => {
    localStorage.setItem('medtrack_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('medtrack_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem('medtrack_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('medtrack_housekeepers', JSON.stringify(housekeepers));
  }, [housekeepers]);

  useEffect(() => {
    localStorage.setItem('medtrack_cleaning_delay', String(cleaningDelaySeconds));
  }, [cleaningDelaySeconds]);

  useEffect(() => {
    localStorage.setItem('medtrack_auto_turnover', JSON.stringify(autoTurnoverEnabled));
  }, [autoTurnoverEnabled]);

  // Automated background bed turnover cycle
  useEffect(() => {
    if (!autoTurnoverEnabled) return;

    const interval = setInterval(() => {
      const now = Date.now();
      setBeds(currentBeds => {
        const completedBeds = currentBeds.filter(b => {
          if (b.status === 'CLEANING_IN_PROGRESS' && b.cleaningStartedAt) {
            const started = new Date(b.cleaningStartedAt).getTime();
            const delaySec = b.cleaningEstimatedSeconds ?? cleaningDelaySeconds;
            return now - started >= delaySec * 1000;
          }
          return false;
        });

        if (completedBeds.length === 0) return currentBeds;

        // Free up housekeepers assigned to these beds
        setHousekeepers(prevHk => prevHk.map(hk => {
          const matched = completedBeds.find(cb => 
            cb.id === hk.activeBedId || (cb.cleaningStaff && cb.cleaningStaff.includes(hk.name))
          );
          if (matched) {
            return {
              ...hk,
              status: 'AVAILABLE' as const,
              activeBedId: undefined,
              activeBedNumber: undefined,
              bedsCleanedToday: hk.bedsCleanedToday + 1
            };
          }
          return hk;
        }));

        // Update cleaning logs to completed
        const completionTime = new Date().toISOString();
        setCleaningLogs(prevLogs => prevLogs.map(l => {
          if (completedBeds.some(cb => cb.id === l.bedId) && l.status === 'CLEANING_IN_PROGRESS') {
            return {
              ...l,
              completionTime,
              status: 'COMPLETED' as const,
              notes: 'Automated terminal UV decontamination & hygiene inspection certified.'
            };
          }
          return l;
        }));

        completedBeds.forEach(cb => {
          pushNotification(
            'Bed Cleaned & Ready',
            `Bed ${cb.number} (${cb.wardName}) has completed automated terminal cleaning by ${cb.cleaningStaff || 'Housekeeping Staff'} and is now AVAILABLE!`,
            'SUCCESS',
            'BED',
            'Beds'
          );
          logAudit('BED_AUTO_CLEANING_COMPLETED', 'Bed', cb.id, { bedNumber: cb.number, ward: cb.wardName });
        });

        return currentBeds.map(b => {
          if (completedBeds.some(cb => cb.id === b.id)) {
            return {
              ...b,
              status: 'AVAILABLE' as const,
              lastCleanedAt: new Date().toISOString(),
              cleaningStartedAt: undefined,
              cleaningEstimatedSeconds: undefined,
              notes: undefined
            };
          }
          return b;
        });
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [autoTurnoverEnabled, cleaningDelaySeconds]);

  // Debounced MongoDB background synchronizer
  useEffect(() => {
    const handler = setTimeout(() => {
      fetch('/api/hospital/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          beds,
          wards,
          patients,
          admissions,
          transfers,
          diagnosticRooms,
          diagnosticRequests,
          diagnosticReports,
          payments,
          cleaningLogs,
          vitals,
          treatmentNotes,
          notifications,
          auditLogs,
          settings
        })
      })
      .then(res => res.json())
      .then(json => {
        if (json && json.dbStatus) {
          setMongoStatus(json.dbStatus);
        }
      })
      .catch(() => {});
    }, 1200);

    return () => clearTimeout(handler);
  }, [beds, wards, patients, admissions, transfers, diagnosticRequests, diagnosticReports, payments, cleaningLogs, vitals, treatmentNotes, notifications, auditLogs, settings]);

  // Compute live transparent forecast
  const forecast = generateHospitalForecast(beds, wards, HISTORICAL_7_DAYS);

  // Helper for audit logging
  const logAudit = (action: string, entity: string, entityId: string, metadata?: Record<string, any>) => {
    const newLog: AuditLog = {
      id: `AUD-${Date.now()}`,
      user: currentRole === 'ADMIN' ? 'Dr. Govindharaj M.' : currentRole === 'DOCTOR' ? 'Dr. S. Karthikeyan' : currentRole === 'NURSE' ? 'Selvi M.' : 'M. Vignesh (Frontdesk)',
      role: currentRole,
      action,
      entity,
      entityId,
      timestamp: new Date().toISOString(),
      metadata
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Helper for notification
  const pushNotification = (title: string, message: string, type: NotificationItem['type'], category: NotificationItem['category'], linkTab?: string) => {
    const newNotif: NotificationItem = {
      id: `NOTIF-${Date.now()}`,
      title,
      message,
      type,
      category,
      timestamp: 'Just now',
      read: false,
      linkTab
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // 1. Patient Registration & Direct Admission Workflow
  const registerAndAdmitPatient = (params: {
    patientData: Omit<Patient, 'id' | 'status' | 'totalBilled' | 'totalPaid' | 'outstandingBalance' | 'qrToken' | 'createdAt'>;
    admitImmediately?: boolean;
    admissionData?: {
      wardId: string;
      bedId: string;
      doctorId: string;
      expectedStayDays: number;
      deposit: number;
      admissionNotes: string;
      diagnosis: string;
      paymentMethod: PaymentMethod;
    };
  }): { success: boolean; message: string; patient: Patient; admission?: Admission } => {
    // Determine next unique patient ID safely
    const maxPatientNum = patients.reduce((max, p) => {
      const match = p.id.match(/P(\d+)/);
      if (match) {
        const num = parseInt(match[1], 10);
        return num > max ? num : max;
      }
      return max;
    }, 1000);
    const newId = `P${maxPatientNum + 1}`;
    const createdAt = new Date().toISOString();

    if (params.admitImmediately && params.admissionData) {
      const { wardId, bedId, doctorId, expectedStayDays, deposit, admissionNotes, diagnosis, paymentMethod } = params.admissionData;
      const targetBed = beds.find(b => b.id === bedId);
      if (!targetBed) {
        return {
          success: false,
          message: 'Selected bed does not exist.',
          patient: { ...params.patientData, id: newId, status: 'REGISTERED', totalBilled: 0, totalPaid: 0, outstandingBalance: 0, qrToken: '', createdAt }
        };
      }
      if (targetBed.status !== 'AVAILABLE') {
        return {
          success: false,
          message: `Bed ${targetBed.number} is not available (currently ${targetBed.status}). Please choose an available bed.`,
          patient: { ...params.patientData, id: newId, status: 'REGISTERED', totalBilled: 0, totalPaid: 0, outstandingBalance: 0, qrToken: '', createdAt }
        };
      }

      const ward = wards.find(w => w.id === wardId);
      const doctor = doctors.find(d => d.id === doctorId);
      const admissionDate = new Date().toISOString();
      const expDate = new Date();
      expDate.setDate(expDate.getDate() + expectedStayDays);

      const admissionId = `ADM-2026-${String(admissions.length + 1).padStart(3, '0')}`;
      const initialWardCharge = (ward?.costPerDay || 1500) * expectedStayDays;
      const doctorConsultationFee = 1500;
      const totalEstimated = initialWardCharge + doctorConsultationFee;
      const outstanding = Math.max(0, totalEstimated - deposit);

      const newPatient: Patient = {
        ...params.patientData,
        id: newId,
        status: 'ADMITTED',
        currentWardId: wardId,
        currentWardName: ward?.name || 'General Ward',
        currentBedId: bedId,
        currentBedNumber: targetBed.number,
        doctorId: doctor?.id,
        doctorName: doctor?.name,
        admissionDate,
        expectedDischargeDate: expDate.toISOString(),
        diagnosis: diagnosis || params.patientData.reasonForVisit,
        depositAmount: deposit,
        totalBilled: totalEstimated,
        totalPaid: deposit,
        outstandingBalance: outstanding,
        qrToken: `MEDTRACK_${newId}_SECURE_AUTH_V1`,
        createdAt
      };

      const newAdmission: Admission = {
        id: admissionId,
        patientId: newId,
        patientName: newPatient.name,
        wardId,
        wardName: ward?.name || 'General Ward',
        bedId,
        bedNumber: targetBed.number,
        doctorId,
        doctorName: doctor?.name || 'Dr. Assigned',
        admissionDate,
        expectedStayDays,
        expectedDischargeDate: expDate.toISOString(),
        deposit,
        admissionNotes,
        diagnosis: diagnosis || params.patientData.reasonForVisit,
        status: 'ACTIVE'
      };

      // Atomic bed update
      setBeds(prev => prev.map(b => {
        if (b.id === bedId) {
          return {
            ...b,
            status: 'OCCUPIED',
            patientId: newId,
            patientName: newPatient.name,
            patientAge: newPatient.age,
            patientGender: newPatient.gender,
            doctorId: doctor?.id,
            doctorName: doctor?.name,
            admissionDate
          };
        }
        return b;
      }));

      // If deposit > 0, record payment
      if (deposit > 0) {
        const newPayment: Payment = {
          id: `PAY-${Date.now()}`,
          patientId: newId,
          patientName: newPatient.name,
          admissionId,
          amount: deposit,
          method: paymentMethod,
          transactionRef: `${paymentMethod}/ADM-${Date.now().toString().slice(-6)}`,
          date: new Date().toISOString(),
          receiver: currentRole === 'ADMIN' ? 'Dr. Govindharaj M.' : 'Frontdesk Cashier',
          notes: `Initial Admission Deposit for Bed ${targetBed.number}`,
          status: 'PAID',
          type: 'DEPOSIT'
        };
        setPayments(prev => [newPayment, ...prev]);
      }

      setAdmissions(prev => [newAdmission, ...prev]);
      setPatients(prev => [newPatient, ...prev]);

      logAudit('PATIENT_ADMITTED', 'Patient', newId, {
        name: newPatient.name,
        bed: targetBed.number,
        ward: ward?.name,
        admissionId
      });

      pushNotification(
        'Patient Registered & Admitted',
        `${newPatient.name} (${newId}) admitted directly to Bed ${targetBed.number} (${ward?.name}).`,
        'SUCCESS',
        'BED',
        'Patients'
      );

      return {
        success: true,
        message: `Patient ${newPatient.name} successfully registered and admitted to Bed ${targetBed.number}!`,
        patient: newPatient,
        admission: newAdmission
      };
    } else {
      // Just register patient
      const newPatient: Patient = {
        ...params.patientData,
        id: newId,
        status: 'REGISTERED',
        totalBilled: 0,
        totalPaid: 0,
        outstandingBalance: 0,
        qrToken: `MEDTRACK_${newId}_SECURE_AUTH_V1`,
        createdAt
      };

      setPatients(prev => [newPatient, ...prev]);
      logAudit('PATIENT_REGISTERED', 'Patient', newId, { name: newPatient.name, phone: newPatient.phone });
      pushNotification('Patient Registered', `${newPatient.name} (${newId}) registered successfully.`, 'INFO', 'BED', 'Patients');

      return {
        success: true,
        message: `Patient ${newPatient.name} (${newId}) registered successfully.`,
        patient: newPatient
      };
    }
  };

  const registerPatient = (patientData: Omit<Patient, 'id' | 'status' | 'totalBilled' | 'totalPaid' | 'outstandingBalance' | 'qrToken' | 'createdAt'>): Patient => {
    const res = registerAndAdmitPatient({ patientData, admitImmediately: false });
    return res.patient;
  };

  // 2. Patient Admission (Strict check: Bed must be AVAILABLE)
  const admitPatient = ({
    patientId,
    wardId,
    bedId,
    doctorId,
    expectedStayDays,
    deposit,
    admissionNotes,
    diagnosis,
    paymentMethod
  }: {
    patientId: string;
    wardId: string;
    bedId: string;
    doctorId: string;
    expectedStayDays: number;
    deposit: number;
    admissionNotes: string;
    diagnosis: string;
    paymentMethod: PaymentMethod;
  }) => {
    const targetBed = beds.find(b => b.id === bedId);
    if (!targetBed) {
      return { success: false, message: 'Specified bed does not exist.' };
    }
    if (targetBed.status !== 'AVAILABLE') {
      return { success: false, message: 'This bed is no longer available. Please select another available bed.' };
    }

    const patient = patients.find(p => p.id === patientId);
    if (!patient) {
      return { success: false, message: 'Patient not found.' };
    }

    const ward = wards.find(w => w.id === wardId);
    const doctor = doctors.find(d => d.id === doctorId);
    const admissionDate = new Date().toISOString();
    const expDate = new Date();
    expDate.setDate(expDate.getDate() + expectedStayDays);

    const admissionId = `ADM-2026-${String(admissions.length + 1).padStart(3, '0')}`;
    const newAdmission: Admission = {
      id: admissionId,
      patientId,
      patientName: patient.name,
      wardId,
      wardName: ward?.name || 'General Ward',
      bedId,
      bedNumber: targetBed.number,
      doctorId,
      doctorName: doctor?.name || 'Dr. Assigned',
      admissionDate,
      expectedStayDays,
      expectedDischargeDate: expDate.toISOString(),
      deposit,
      admissionNotes,
      diagnosis,
      status: 'ACTIVE'
    };

    // Calculate initial estimated bill
    const initialWardCharge = (ward?.costPerDay || 1500) * expectedStayDays;
    const doctorConsultationFee = 1500;
    const totalEstimated = initialWardCharge + doctorConsultationFee;
    const outstanding = Math.max(0, totalEstimated - deposit);

    // Update Bed state (Atomically to OCCUPIED)
    setBeds(prev => prev.map(b => {
      if (b.id === bedId) {
        return {
          ...b,
          status: 'OCCUPIED',
          patientId: patient.id,
          patientName: patient.name,
          patientAge: patient.age,
          patientGender: patient.gender,
          doctorId: doctor?.id,
          doctorName: doctor?.name,
          admissionDate
        };
      }
      return b;
    }));

    // Update Patient State
    setPatients(prev => prev.map(p => {
      if (p.id === patientId) {
        return {
          ...p,
          status: 'ADMITTED',
          currentWardId: wardId,
          currentWardName: ward?.name,
          currentBedId: bedId,
          currentBedNumber: targetBed.number,
          doctorId: doctor?.id,
          doctorName: doctor?.name,
          admissionDate,
          expectedDischargeDate: expDate.toISOString(),
          diagnosis,
          depositAmount: deposit,
          totalBilled: totalEstimated,
          totalPaid: deposit,
          outstandingBalance: outstanding
        };
      }
      return p;
    }));

    // Record Deposit Payment if deposit > 0
    if (deposit > 0) {
      const newPayment: Payment = {
        id: `PAY-${Date.now()}`,
        patientId: patient.id,
        patientName: patient.name,
        admissionId,
        amount: deposit,
        method: paymentMethod,
        transactionRef: `${paymentMethod}/ADM-${Date.now().toString().slice(-6)}`,
        date: new Date().toISOString(),
        receiver: currentRole === 'ADMIN' ? 'Dr. Govindharaj M.' : 'Frontdesk Cashier',
        type: 'DEPOSIT',
        status: 'PAID',
        notes: `Admission deposit for Bed ${targetBed.number} (${ward?.name})`
      };
      setPayments(prev => [newPayment, ...prev]);
    }

    setAdmissions(prev => [newAdmission, ...prev]);
    logAudit('PATIENT_ADMITTED', 'Admission', admissionId, { bedAssigned: targetBed.number, ward: ward?.name, deposit });
    pushNotification('Patient Admitted', `${patient.name} admitted to ${targetBed.number} in ${ward?.name}.`, 'SUCCESS', 'BED', 'Beds');

    return { success: true, message: `Patient ${patient.name} successfully admitted to Bed ${targetBed.number}!`, admission: newAdmission };
  };

  // 3. Inter-Ward Transfer (Moves patient, updates old bed to CLEANING_REQUIRED, sets new bed to OCCUPIED)
  const transferPatient = ({
    patientId,
    toWardId,
    toBedId,
    doctorId,
    reason,
    transferType,
    notes,
    clinicalNotes
  }: {
    patientId: string;
    toWardId: string;
    toBedId: string;
    doctorId: string;
    reason: string;
    transferType?: TransferType;
    notes?: string;
    clinicalNotes?: string;
  }) => {
    const patient = patients.find(p => p.id === patientId);
    if (!patient || patient.status !== 'ADMITTED') {
      return { success: false, message: 'Active admitted patient not found.' };
    }

    const destinationBed = beds.find(b => b.id === toBedId);
    if (!destinationBed) {
      return { success: false, message: 'Destination bed does not exist.' };
    }
    if (destinationBed.status !== 'AVAILABLE') {
      return { success: false, message: 'Destination bed is no longer available. Please select another bed.' };
    }

    const fromWardName = patient.currentWardName || 'Unknown Ward';
    const fromBedNumber = patient.currentBedNumber || 'Unknown Bed';
    const fromBedId = patient.currentBedId;

    const toWard = wards.find(w => w.id === toWardId);
    const doctor = doctors.find(d => d.id === doctorId);

    const transferId = `TRF-${Date.now().toString().slice(-6)}`;
    const effectiveNotes = clinicalNotes || notes || '';
    const newTransfer: Transfer = {
      id: transferId,
      patientId: patient.id,
      patientName: patient.name,
      fromWardId: patient.currentWardId || '',
      fromWardName,
      fromBedId: fromBedId || '',
      fromBedNumber,
      toWardId,
      toWardName: toWard?.name || 'Destination Ward',
      toBedId,
      toBedNumber: destinationBed.number,
      doctorId,
      doctorName: doctor?.name || 'Assigned Doctor',
      transferType: transferType || 'ROUTINE',
      reason,
      status: 'COMPLETED',
      timestamp: new Date().toISOString(),
      notes: effectiveNotes
    };

    // Update beds: fromBed -> CLEANING_REQUIRED; toBed -> OCCUPIED
    setBeds(prev => prev.map(b => {
      if (fromBedId && b.id === fromBedId) {
        return {
          ...b,
          status: 'CLEANING_REQUIRED',
          patientId: undefined,
          patientName: undefined,
          patientAge: undefined,
          patientGender: undefined,
          doctorId: undefined,
          doctorName: undefined,
          admissionDate: undefined,
          notes: `Requires terminal cleaning following transfer of ${patient.name} to ${destinationBed.number}`
        };
      }
      if (b.id === toBedId) {
        return {
          ...b,
          status: 'OCCUPIED',
          patientId: patient.id,
          patientName: patient.name,
          patientAge: patient.age,
          patientGender: patient.gender,
          doctorId: doctor?.id,
          doctorName: doctor?.name,
          admissionDate: patient.admissionDate || new Date().toISOString()
        };
      }
      return b;
    }));

    // Update Patient current location
    setPatients(prev => prev.map(p => {
      if (p.id === patientId) {
        return {
          ...p,
          currentWardId: toWardId,
          currentWardName: toWard?.name,
          currentBedId: toBedId,
          currentBedNumber: destinationBed.number,
          doctorId: doctor?.id,
          doctorName: doctor?.name,
        };
      }
      return p;
    }));

    // Update Active Admission location
    setAdmissions(prev => prev.map(adm => {
      if (adm.patientId === patientId && adm.status === 'ACTIVE') {
        return {
          ...adm,
          wardId: toWardId,
          wardName: toWard?.name || adm.wardName,
          bedId: toBedId,
          bedNumber: destinationBed.number,
          doctorId: doctor?.id || adm.doctorId,
          doctorName: doctor?.name || adm.doctorName
        };
      }
      return adm;
    }));

    // Create Cleaning Log for the previous bed
    if (fromBedId) {
      const newCleanLog: CleaningLog = {
        id: `CLN-${Date.now()}`,
        bedId: fromBedId,
        bedNumber: fromBedNumber,
        wardName: fromWardName,
        previousPatient: `${patient.name} (Transferred)`,
        staffName: 'Pending Housekeeping Assignment',
        startTime: new Date().toISOString(),
        status: 'CLEANING_IN_PROGRESS',
        notes: `Transfer sanitization: moved from ${fromBedNumber} to ${destinationBed.number}`
      };
      setCleaningLogs(prev => [newCleanLog, ...prev]);
    }

    setTransfers(prev => [newTransfer, ...prev]);
    setSelectedPatientForTransferId(null);
    logAudit('PATIENT_TRANSFERRED', 'Transfer', transferId, {
      fromBed: fromBedNumber,
      toBed: destinationBed.number,
      reason,
      transferType: transferType || 'ROUTINE'
    });
    pushNotification(
      'Patient Transferred',
      `${patient.name} transferred from ${fromBedNumber} (${fromWardName}) to ${destinationBed.number} (${toWard?.name}). Previous bed marked for cleaning.`,
      'INFO',
      'TRANSFER',
      'Transfers'
    );

    return { success: true, message: `Patient successfully transferred to ${destinationBed.number}!`, transfer: newTransfer };
  };

  // 4. Bed Cleaning Operations & Housekeeping Team
  const startBedCleaning = (bedId: string, staffName?: string) => {
    const bed = beds.find(b => b.id === bedId);
    if (!bed) return { success: false, message: 'Bed not found.' };

    // Select available housekeeper from roster
    const assignedHk = staffName
      ? housekeepers.find(h => h.name.toLowerCase() === staffName.toLowerCase() || staffName.includes(h.name))
      : housekeepers.find(h => h.status === 'AVAILABLE' && (h.assignedWard === bed.wardName || true)) || housekeepers.find(h => h.status === 'AVAILABLE') || housekeepers[0];

    const finalStaff = assignedHk ? `${assignedHk.name} (Housekeeping)` : (staffName || 'Selvi M. (Housekeeping Lead)');

    // When zero delay is configured, immediately complete cleaning and make bed available
    if (cleaningDelaySeconds === 0) {
      return completeBedCleaning(bedId, finalStaff, 'Automated terminal UV decontamination certified.');
    }

    if (assignedHk) {
      setHousekeepers(prev => prev.map(h => 
        h.id === assignedHk.id 
          ? { ...h, status: 'CLEANING', activeBedId: bed.id, activeBedNumber: bed.number }
          : h
      ));
    }

    const now = new Date().toISOString();
    setBeds(prev => prev.map(b => {
      if (b.id === bedId) {
        return {
          ...b,
          status: 'CLEANING_IN_PROGRESS',
          cleaningStaff: finalStaff,
          cleaningStartedAt: now,
          cleaningEstimatedSeconds: cleaningDelaySeconds,
          notes: `Terminal decontamination underway by ${finalStaff}`
        };
      }
      return b;
    }));

    const log: CleaningLog = {
      id: `CLN-${Date.now()}`,
      bedId,
      bedNumber: bed.number,
      wardName: bed.wardName,
      previousPatient: bed.notes || 'Hospital Discharge',
      staffName: finalStaff,
      startTime: now,
      status: 'CLEANING_IN_PROGRESS',
      notes: `Terminal disinfection initiated.`
    };
    setCleaningLogs(prev => [log, ...prev]);
    logAudit('CLEANING_STARTED', 'Bed', bedId, { bedNumber: bed.number, staff: finalStaff });

    return { success: true, message: `Bed ${bed.number} is now in cleaning process with ${finalStaff}!` };
  };

  const completeBedCleaning = (bedId: string, staffName?: string, notes?: string) => {
    const bed = beds.find(b => b.id === bedId);
    if (!bed) return { success: false, message: 'Bed not found.' };

    const now = new Date().toISOString();
    setBeds(prev => prev.map(b => {
      if (b.id === bedId) {
        return {
          ...b,
          status: 'AVAILABLE',
          lastCleanedAt: now,
          cleaningStaff: staffName || b.cleaningStaff,
          cleaningStartedAt: undefined,
          cleaningEstimatedSeconds: undefined,
          notes: undefined
        };
      }
      return b;
    }));

    // Free up assigned housekeeper
    setHousekeepers(prev => prev.map(h => {
      if (h.activeBedId === bedId || (bed.cleaningStaff && bed.cleaningStaff.includes(h.name))) {
        return {
          ...h,
          status: 'AVAILABLE',
          activeBedId: undefined,
          activeBedNumber: undefined,
          bedsCleanedToday: h.bedsCleanedToday + 1
        };
      }
      return h;
    }));

    setCleaningLogs(prev => prev.map(log => {
      if (log.bedId === bedId && log.status === 'CLEANING_IN_PROGRESS') {
        return {
          ...log,
          completionTime: now,
          status: 'COMPLETED',
          notes: notes || 'Sanitized & verified ready for admission.'
        };
      }
      return log;
    }));

    logAudit('CLEANING_COMPLETED', 'Bed', bedId, { bedNumber: bed.number, staff: staffName || bed.cleaningStaff });
    pushNotification('Bed Cleaned & Available', `Bed ${bed.number} (${bed.wardName}) has been sanitized and is now AVAILABLE.`, 'SUCCESS', 'BED', 'Beds');

    return { success: true, message: `Bed ${bed.number} is now clean and AVAILABLE for new patients!` };
  };

  const autoCleanAllPendingBeds = (staffName: string = 'Automated Terminal Housekeeping Team') => {
    const now = new Date().toISOString();
    const pendingBeds = beds.filter(b => b.status === 'CLEANING_REQUIRED' || b.status === 'CLEANING_IN_PROGRESS');
    if (pendingBeds.length === 0) {
      return { success: false, message: 'No beds are currently awaiting sanitation.' };
    }

    setBeds(prev => prev.map(b => {
      if (b.status === 'CLEANING_REQUIRED' || b.status === 'CLEANING_IN_PROGRESS') {
        return {
          ...b,
          status: 'AVAILABLE',
          lastCleanedAt: now,
          cleaningStaff: staffName,
          cleaningStartedAt: undefined,
          cleaningEstimatedSeconds: undefined,
          notes: undefined
        };
      }
      return b;
    }));

    // Free all housekeepers
    setHousekeepers(prev => prev.map(h => ({
      ...h,
      status: 'AVAILABLE',
      activeBedId: undefined,
      activeBedNumber: undefined,
      bedsCleanedToday: h.activeBedId ? h.bedsCleanedToday + 1 : h.bedsCleanedToday
    })));

    setCleaningLogs(prev => {
      const updatedExisting = prev.map(l => {
        if (l.status === 'CLEANING_IN_PROGRESS') {
          return {
            ...l,
            completionTime: now,
            status: 'COMPLETED' as const,
            notes: 'Automated batch terminal decontamination completed.'
          };
        }
        return l;
      });

      const newLogs: CleaningLog[] = pendingBeds
        .filter(b => !prev.some(l => l.bedId === b.id && l.status === 'CLEANING_IN_PROGRESS'))
        .map(b => ({
          id: `CLN-${Date.now()}-${b.id}`,
          bedId: b.id,
          bedNumber: b.number,
          wardName: b.wardName,
          previousPatient: b.notes || 'Hospital Discharge',
          staffName,
          startTime: now,
          completionTime: now,
          status: 'COMPLETED',
          notes: 'Automated terminal decontamination & UV sterilization completed.'
        }));

      return [...newLogs, ...updatedExisting];
    });

    logAudit('BATCH_BEDS_AUTO_CLEANED', 'BedBatch', 'ALL', { count: pendingBeds.length });
    pushNotification('Batch Bed Sanitization Completed', `${pendingBeds.length} beds automatically sanitized and made AVAILABLE.`, 'SUCCESS', 'BED', 'Beds');

    return { success: true, message: `All ${pendingBeds.length} pending beds automatically sanitized and returned to AVAILABLE!` };
  };

  const addHousekeeper = (data: Omit<Housekeeper, 'id' | 'bedsCleanedToday' | 'status'>) => {
    const newId = `HK-${String(housekeepers.length + 1).padStart(2, '0')}`;
    const newHk: Housekeeper = {
      ...data,
      id: newId,
      status: 'AVAILABLE',
      bedsCleanedToday: 0
    };
    setHousekeepers(prev => [...prev, newHk]);
    logAudit('HOUSEKEEPER_ADDED', 'Housekeeper', newId, { name: data.name, ward: data.assignedWard });
    pushNotification('Housekeeper Added', `${data.name} added to Housekeeping Roster (${data.shift} Shift).`, 'SUCCESS', 'BED', 'Bed Cleaning');
  };

  const updateHousekeeperStatus = (id: string, status: Housekeeper['status']) => {
    setHousekeepers(prev => prev.map(h => h.id === id ? { ...h, status } : h));
  };

  const setBedMaintenance = (bedId: string, reason: string) => {
    const bed = beds.find(b => b.id === bedId);
    if (!bed) return { success: false, message: 'Bed not found.' };

    setBeds(prev => prev.map(b => {
      if (b.id === bedId) {
        return { ...b, status: 'MAINTENANCE', notes: reason };
      }
      return b;
    }));

    logAudit('BED_SET_MAINTENANCE', 'Bed', bedId, { bedNumber: bed.number, reason });
    return { success: true, message: `Bed ${bed.number} marked for MAINTENANCE.` };
  };

  const restoreBedFromMaintenance = (bedId: string) => {
    const bed = beds.find(b => b.id === bedId);
    if (!bed) return { success: false, message: 'Bed not found.' };

    setBeds(prev => prev.map(b => {
      if (b.id === bedId) {
        return { ...b, status: 'AVAILABLE', notes: undefined };
      }
      return b;
    }));

    logAudit('BED_RESTORED_MAINTENANCE', 'Bed', bedId, { bedNumber: bed.number });
    pushNotification('Bed Restored', `Bed ${bed.number} maintenance completed and restored to AVAILABLE.`, 'SUCCESS', 'BED', 'Beds');
    return { success: true, message: `Bed ${bed.number} restored to AVAILABLE!` };
  };

  // 5. Diagnostics & Imaging
  const requestDiagnostic = ({
    patientId,
    admissionId,
    doctorId,
    scanType,
    priority,
    clinicalReason,
    notes,
    assignedRoomId
  }: {
    patientId: string;
    admissionId?: string;
    doctorId: string;
    scanType: ScanType;
    priority: DiagnosticPriority;
    clinicalReason: string;
    notes?: string;
    assignedRoomId?: string;
  }) => {
    const patient = patients.find(p => p.id === patientId);
    if (!patient) return { success: false, message: 'Patient not found.' };

    const doctor = doctors.find(d => d.id === doctorId);
    const scanCost = scanType === 'XRAY' ? settings.diagnosticCharges.xray : scanType === 'CT_SCAN' ? settings.diagnosticCharges.ctScan : settings.diagnosticCharges.mriScan;

    let room: DiagnosticRoom | undefined;
    if (assignedRoomId) {
      room = diagnosticRooms.find(r => r.id === assignedRoomId);
      if (room && room.status !== 'AVAILABLE') {
        return { success: false, message: 'Selected diagnostic room is currently in use or under maintenance.' };
      }
    }

    const reqId = `REQ-${scanType.slice(0, 2)}-${Date.now().toString().slice(-4)}`;
    const newRequest: DiagnosticRequest = {
      id: reqId,
      patientId: patient.id,
      patientName: patient.name,
      admissionId,
      doctorId,
      doctorName: doctor?.name || 'Dr. Govindharaj M.',
      scanType,
      requestedDate: new Date().toISOString(),
      priority,
      clinicalReason,
      notes,
      assignedRoomId: room?.id,
      assignedRoomName: room?.name,
      assignedEquipment: room?.equipmentModel,
      status: room ? 'SCHEDULED' : 'REQUESTED',
      cost: scanCost
    };

    // If room is assigned, update room status
    if (room) {
      setDiagnosticRooms(prev => prev.map(r => r.id === room?.id ? { ...r, status: 'IN_USE', currentRequestId: reqId } : r));
    }

    // Add diagnostic scan cost to patient total bill
    setPatients(prev => prev.map(p => {
      if (p.id === patientId) {
        const newBilled = p.totalBilled + scanCost;
        return {
          ...p,
          totalBilled: newBilled,
          outstandingBalance: Math.max(0, newBilled - p.totalPaid)
        };
      }
      return p;
    }));

    setDiagnosticRequests(prev => [newRequest, ...prev]);
    logAudit('DIAGNOSTIC_REQUEST_CREATED', 'DiagnosticRequest', reqId, { scanType, patient: patient.name, cost: scanCost });
    pushNotification(
      'Diagnostic Scan Requested',
      `${scanType} requested for ${patient.name} (${priority} priority). Charge: ₹${scanCost}.`,
      priority === 'STAT' ? 'CRITICAL' : 'INFO',
      'DIAGNOSTIC',
      'Diagnostics'
    );

    return { success: true, message: `Diagnostic ${scanType} request created successfully!`, request: newRequest };
  };

  const assignDiagnosticRoom = (requestId: string, roomId: string) => {
    const room = diagnosticRooms.find(r => r.id === roomId);
    if (!room || room.status !== 'AVAILABLE') {
      return { success: false, message: 'This diagnostic room is no longer available. Please select another available room.' };
    }

    setDiagnosticRooms(prev => prev.map(r => r.id === roomId ? { ...r, status: 'IN_USE', currentRequestId: requestId } : r));
    setDiagnosticRequests(prev => prev.map(req => {
      if (req.id === requestId) {
        return {
          ...req,
          assignedRoomId: room.id,
          assignedRoomName: room.name,
          assignedEquipment: room.equipmentModel,
          status: 'SCHEDULED',
          scheduledDate: new Date().toISOString()
        };
      }
      return req;
    }));

    return { success: true, message: `Assigned to ${room.name} (${room.equipmentModel})!` };
  };

  const completeDiagnosticScan = (requestId: string) => {
    const req = diagnosticRequests.find(r => r.id === requestId);
    if (!req) return { success: false, message: 'Request not found.' };

    const now = new Date().toISOString();
    // Free the room back to AVAILABLE
    if (req.assignedRoomId) {
      setDiagnosticRooms(prev => prev.map(r => r.id === req.assignedRoomId ? { ...r, status: 'AVAILABLE', currentRequestId: undefined } : r));
    }

    setDiagnosticRequests(prev => prev.map(r => {
      if (r.id === requestId) {
        return {
          ...r,
          status: 'REPORT_PENDING',
          completedDate: now
        };
      }
      return r;
    }));

    logAudit('SCAN_COMPLETED', 'DiagnosticRequest', requestId, { scanType: req.scanType, patient: req.patientName });
    pushNotification('Scan Completed', `${req.scanType} scan completed for ${req.patientName}. Awaiting radiologist report.`, 'SUCCESS', 'DIAGNOSTIC', 'Diagnostics');

    return { success: true, message: `Scan completed! Radiologist report is now pending.` };
  };

  const submitDiagnosticReport = ({
    requestId,
    findings,
    impression,
    recommendations,
    radiologistName
  }: {
    requestId: string;
    findings: string;
    impression: string;
    recommendations?: string;
    radiologistName: string;
  }) => {
    const req = diagnosticRequests.find(r => r.id === requestId);
    if (!req) return { success: false, message: 'Diagnostic request not found.' };

    const reportId = `REP-${req.scanType.slice(0, 2)}-${Date.now().toString().slice(-4)}`;
    const newReport: DiagnosticReport = {
      id: reportId,
      requestId,
      patientId: req.patientId,
      patientName: req.patientName,
      doctorId: req.doctorId,
      doctorName: req.doctorName,
      scanType: req.scanType,
      findings,
      impression,
      radiologistName,
      reportDate: new Date().toISOString(),
      status: 'FINAL',
      recommendations
    };

    setDiagnosticReports(prev => [newReport, ...prev]);
    setDiagnosticRequests(prev => prev.map(r => {
      if (r.id === requestId) {
        return {
          ...r,
          status: 'REPORTED',
          reportId
        };
      }
      return r;
    }));

    logAudit('REPORT_CREATED', 'DiagnosticReport', reportId, { patient: req.patientName, radiologist: radiologistName });
    pushNotification(
      'Diagnostic Report Available',
      `Official radiologist report published for ${req.patientName} (${req.scanType}).`,
      'SUCCESS',
      'DIAGNOSTIC',
      'Diagnostics'
    );

    return { success: true, message: 'Diagnostic report saved and attached to patient medical chart!', report: newReport };
  };

  // 6. Vitals & Treatment
  const recordVitals = (recordData: Omit<VitalsRecord, 'id' | 'timestamp'>) => {
    const newRecord: VitalsRecord = {
      ...recordData,
      id: `VIT-${Date.now()}`,
      timestamp: new Date().toISOString()
    };
    setVitals(prev => [newRecord, ...prev]);
    logAudit('VITALS_RECORDED', 'Vitals', newRecord.id, { patient: recordData.patientName, recordedBy: recordData.recordedBy });
    return { success: true, message: 'Vitals recorded successfully.' };
  };

  const addTreatmentNote = (noteData: Omit<TreatmentNote, 'id' | 'timestamp'>) => {
    const newNote: TreatmentNote = {
      ...noteData,
      id: `NOTE-${Date.now()}`,
      timestamp: new Date().toISOString()
    };
    setTreatmentNotes(prev => [newNote, ...prev]);
    logAudit('TREATMENT_NOTE_ADDED', 'TreatmentNote', newNote.id, { patient: noteData.patientName, doctor: noteData.doctorName });
    return { success: true, message: 'Treatment notes updated.' };
  };

  // 7. Payments
  const recordPayment = ({
    patientId,
    admissionId,
    amount,
    method,
    type,
    notes
  }: {
    patientId: string;
    admissionId?: string;
    amount: number;
    method: PaymentMethod;
    type: Payment['type'];
    notes?: string;
  }) => {
    const patient = patients.find(p => p.id === patientId);
    if (!patient) return { success: false, message: 'Patient not found.' };

    const paymentId = `PAY-${Date.now().toString().slice(-6)}`;
    const newPayment: Payment = {
      id: paymentId,
      patientId,
      patientName: patient.name,
      admissionId,
      amount,
      method,
      transactionRef: `${method}/TXN-${Date.now().toString().slice(-7)}`,
      date: new Date().toISOString(),
      receiver: currentRole === 'ADMIN' ? 'Dr. Govindharaj M.' : 'Frontdesk Cashier (M. Vignesh)',
      type,
      status: 'PAID',
      notes
    };

    setPatients(prev => prev.map(p => {
      if (p.id === patientId) {
        const newPaid = p.totalPaid + amount;
        return {
          ...p,
          totalPaid: newPaid,
          outstandingBalance: Math.max(0, p.totalBilled - newPaid)
        };
      }
      return p;
    }));

    setPayments(prev => [newPayment, ...prev]);
    logAudit('PAYMENT_RECORDED', 'Payment', paymentId, { amount, method, patient: patient.name });
    pushNotification('Payment Recorded', `₹ ${amount.toLocaleString('en-IN')} received via ${method} for ${patient.name}.`, 'SUCCESS', 'PAYMENT', 'Billing');

    return { success: true, message: `Payment of ₹ ${amount.toLocaleString('en-IN')} recorded successfully!`, payment: newPayment };
  };

  // 8. Patient Discharge Workflow (With Automatic Bed Cleaning)
  const dischargePatient = ({
    patientId,
    notes,
    dischargeSummary,
    prescriptions,
    doctorId,
    followUpDate,
    clearedBilling,
    autoCleanBed = true
  }: {
    patientId: string;
    notes?: string;
    dischargeSummary?: string;
    prescriptions?: string;
    doctorId?: string;
    followUpDate?: string;
    clearedBilling?: boolean;
    autoCleanBed?: boolean;
  }) => {
    const patient = patients.find(p => p.id === patientId);
    if (!patient) return { success: false, message: 'Patient not found.' };
    if (patient.status !== 'ADMITTED') return { success: false, message: 'Patient is not currently admitted.' };

    const bedId = patient.currentBedId;
    const bedNumber = patient.currentBedNumber || 'Bed';
    const wardName = patient.currentWardName || 'Ward';
    const wardId = patient.currentWardId;
    const dischargeTime = new Date().toISOString();
    const assignedDoctor = doctors.find(d => d.id === doctorId) || doctors.find(d => d.id === patient.doctorId) || doctors[0];
    const summaryText = dischargeSummary || notes || 'Patient discharged satisfactorily following clinical recovery.';

    // 1. Bed Cleaning Process on Patient Discharge
    let assignedStaffName = 'Housekeeping Staff';
    if (bedId) {
      if (autoCleanBed) {
        // Find available housekeeper from roster
        const availableHousekeeper = housekeepers.find(h => h.status === 'AVAILABLE' && (h.assignedWard === wardName || true))
          || housekeepers.find(h => h.status === 'AVAILABLE')
          || housekeepers[0];

        assignedStaffName = availableHousekeeper ? `${availableHousekeeper.name} (Housekeeping)` : 'Automated Housekeeping Team';

        if (availableHousekeeper) {
          setHousekeepers(prev => prev.map(h => 
            h.id === availableHousekeeper.id 
              ? { ...h, status: 'CLEANING', activeBedId: bedId, activeBedNumber: bedNumber }
              : h
          ));
        }

        // Route the bed straight into the cleaning workflow so it is visibly marked for sanitation
        // before becoming available again for the next admission.
        setBeds(prev => prev.map(b => {
          if (b.id === bedId) {
            return {
              ...b,
              status: 'CLEANING_IN_PROGRESS',
              patientId: undefined,
              patientName: undefined,
              patientAge: undefined,
              patientGender: undefined,
              doctorId: undefined,
              doctorName: undefined,
              admissionDate: undefined,
              cleaningStaff: assignedStaffName,
              cleaningStartedAt: dischargeTime,
              cleaningEstimatedSeconds: cleaningDelaySeconds,
              notes: `Terminal decontamination underway by ${assignedStaffName} following discharge of ${patient.name}`
            };
          }
          return b;
        }));

        const inProgLog: CleaningLog = {
          id: `CLN-${Date.now()}`,
          bedId,
          bedNumber,
          wardName,
          previousPatient: `${patient.name} (Discharged)`,
          staffName: assignedStaffName,
          startTime: dischargeTime,
          status: 'CLEANING_IN_PROGRESS',
          notes: `Post-discharge terminal decontamination in progress.`
        };
        setCleaningLogs(prev => [inProgLog, ...prev]);
        logAudit('BED_CLEANING_AUTO_INITIATED', 'Bed', bedId, { bedNumber, ward: wardName, staff: assignedStaffName, estSeconds: cleaningDelaySeconds });
      } else {
        // Mark as manual cleaning required
        setBeds(prev => prev.map(b => {
          if (b.id === bedId) {
            return {
              ...b,
              status: 'CLEANING_REQUIRED',
              patientId: undefined,
              patientName: undefined,
              patientAge: undefined,
              patientGender: undefined,
              doctorId: undefined,
              doctorName: undefined,
              admissionDate: undefined,
              notes: `Sanitation required following discharge of ${patient.name}`
            };
          }
          return b;
        }));

        const newCleanLog: CleaningLog = {
          id: `CLN-${Date.now()}`,
          bedId,
          bedNumber,
          wardName,
          previousPatient: `${patient.name} (Discharged)`,
          staffName: 'Pending Housekeeper',
          startTime: dischargeTime,
          status: 'CLEANING_IN_PROGRESS',
          notes: notes || 'Post-discharge terminal decontamination required'
        };
        setCleaningLogs(prev => [newCleanLog, ...prev]);
      }
    }

    // 2. Mark Admission as DISCHARGED
    setAdmissions(prev => prev.map(adm => {
      if (adm.patientId === patientId && adm.status === 'ACTIVE') {
        return {
          ...adm,
          status: 'DISCHARGED',
          dischargeDate: dischargeTime
        };
      }
      return adm;
    }));

    // 3. Mark Patient as DISCHARGED
    setPatients(prev => prev.map(p => {
      if (p.id === patientId) {
        return {
          ...p,
          status: 'DISCHARGED',
          dischargeDate: dischargeTime,
          currentWardId: undefined,
          currentWardName: undefined,
          currentBedId: undefined,
          currentBedNumber: undefined
        };
      }
      return p;
    }));

    // 4. Create Discharge Record
    const dischargeId = `DISC-${Date.now().toString().slice(-6)}`;
    const newDischarge: DischargeRecord = {
      id: dischargeId,
      patientId: patient.id,
      patientName: patient.name,
      bedId,
      bedNumber,
      wardId,
      wardName,
      doctorId: assignedDoctor.id,
      doctorName: assignedDoctor.name,
      dischargeDate: dischargeTime,
      dischargeSummary: summaryText,
      prescriptions,
      followUpDate,
      clearedBilling: clearedBilling ?? (patient.outstandingBalance <= 0)
    };
    setDischarges(prev => [newDischarge, ...prev]);

    logAudit('PATIENT_DISCHARGED', 'Patient', patientId, { bedFreed: bedNumber, ward: wardName, dischargeId, autoCleaned: autoCleanBed });
    
    if (autoCleanBed) {
      pushNotification(
        'Patient Discharged & Bed Sent for Cleaning',
        `${patient.name} discharged. Bed ${bedNumber} in ${wardName} has entered the sanitation queue and will be restored for admission after cleaning completes.`,
        'SUCCESS',
        'DISCHARGE',
        'Discharges'
      );
    } else {
      pushNotification(
        'Patient Discharged',
        `${patient.name} discharged. Bed ${bedNumber} in ${wardName} marked for CLEANING_REQUIRED.`,
        'INFO',
        'DISCHARGE',
        'Discharges'
      );
    }

    const message = autoCleanBed
      ? `Patient ${patient.name} discharged successfully! Bed ${bedNumber} has been sent to the cleaning queue with ${assignedStaffName}.`
      : `Patient ${patient.name} discharged successfully! Bed ${bedNumber} queued for sanitation.`;

    return {
      success: true,
      message,
      discharge: newDischarge
    };
  };

  const updateSettings = (newSettings: Partial<HospitalSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    logAudit('SETTINGS_UPDATED', 'HospitalSettings', 'CONFIG-01');
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const clearAllNotifications = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const resetToDemoData = async () => {
    try {
      const res = await fetch('/api/hospital/reset', { method: 'POST' });
      if (res.ok) {
        const json = await res.json();
        if (json.dbStatus) {
          setMongoStatus(json.dbStatus);
        }
      }
    } catch (err) {
      console.warn('Failed to reset MongoDB database:', err);
    }

    localStorage.clear();
    setSettings(INITIAL_SETTINGS);
    setWards(INITIAL_WARDS);
    setBeds(INITIAL_BEDS);
    setPatients(INITIAL_PATIENTS);
    setAdmissions(INITIAL_ADMISSIONS);
    setTransfers(INITIAL_TRANSFERS);
    setDischarges(INITIAL_DISCHARGES);
    setDiagnosticRooms(INITIAL_DIAGNOSTIC_ROOMS);
    setDiagnosticRequests(INITIAL_DIAGNOSTIC_REQUESTS);
    setDiagnosticReports(INITIAL_DIAGNOSTIC_REPORTS);
    setPayments(INITIAL_PAYMENTS);
    setCleaningLogs(INITIAL_CLEANING_LOGS);
    setHousekeepers(INITIAL_HOUSEKEEPERS);
    setVitals(INITIAL_VITALS);
    setTreatmentNotes(INITIAL_TREATMENT_NOTES);
    setNotifications(INITIAL_NOTIFICATIONS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    pushNotification('Demo Data Restored', 'MedTrack hospital records restored to initial state in MongoDB & local storage.', 'INFO', 'CAPACITY');
  };

  return (
    <HospitalContext.Provider
      value={{
        isAuthenticated,
        currentUser,
        login,
        logout,
        currentRole,
        currentDoctorId,
        currentNurseId,
        activeTab,
        settings,
        beds,
        wards,
        patients,
        doctors,
        nurses,
        admissions,
        transfers,
        discharges,
        diagnosticRooms,
        diagnosticRequests,
        diagnosticReports,
        payments,
        cleaningLogs,
        housekeepers,
        cleaningDelaySeconds,
        autoTurnoverEnabled,
        vitals,
        treatmentNotes,
        notifications,
        auditLogs,
        forecast,
        searchQuery,
        selectedWardFilter,
        selectedPatientForTransferId,
        setCurrentRole,
        setActiveTab,
        setSelectedWardFilter,
        setSelectedPatientForTransferId,
        setSearchQuery,
        registerPatient,
        registerAndAdmitPatient,
        admitPatient,
        transferPatient,
        startBedCleaning,
        completeBedCleaning,
        autoCleanAllPendingBeds,
        addHousekeeper,
        updateHousekeeperStatus,
        setCleaningDelaySeconds,
        setAutoTurnoverEnabled,
        setBedMaintenance,
        restoreBedFromMaintenance,
        requestDiagnostic,
        assignDiagnosticRoom,
        completeDiagnosticScan,
        submitDiagnosticReport,
        recordVitals,
        addTreatmentNote,
        recordPayment,
        dischargePatient,
        updateSettings,
        markNotificationRead,
        clearAllNotifications,
        resetToDemoData,
        mongoStatus,
        isSyncing,
        syncWithDatabase,
        refreshMongoStatus
      }}
    >
      {children}
    </HospitalContext.Provider>
  );
};

export const useHospital = () => {
  const context = useContext(HospitalContext);
  if (!context) {
    throw new Error('useHospital must be used within a HospitalProvider');
  }
  return context;
};
