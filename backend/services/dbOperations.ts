import { getMongoClient, inMemoryState } from '../db';
import {
  Patient,
  Bed,
  Admission,
  Transfer,
  DischargeRecord,
  Payment,
  DiagnosticRequest,
  DiagnosticReport,
  VitalsRecord,
  AuditLog,
  validatePatient,
  validateAdmission,
  validateTransfer,
  validateDischarge,
  validatePayment,
  validateDiagnosticRequest,
  validateVitals
} from '../models/index';

// ========================================================
// Granular Direct MongoDB CRUD Operations
// ========================================================

/**
 * Update or Insert a Patient
 */
export async function savePatient(patientData: any): Promise<Patient> {
  const patient = validatePatient(patientData);
  const sanitized = { ...patient, _id: patient.id };

  // 1. Update in-memory state
  const idx = inMemoryState.patients.findIndex(p => p.id === patient.id);
  if (idx >= 0) {
    inMemoryState.patients[idx] = sanitized;
  } else {
    inMemoryState.patients.unshift(sanitized);
  }

  // 2. Persist directly to MongoDB
  const database = await getMongoClient();
  if (database) {
    await database.collection('patients').updateOne(
      { id: patient.id },
      { $set: sanitized },
      { upsert: true }
    );
  }

  return sanitized;
}

/**
 * Update Bed Status and details
 */
export async function updateBed(bedId: string, updates: Partial<Bed>): Promise<Bed | null> {
  const idx = inMemoryState.beds.findIndex(b => b.id === bedId);
  if (idx < 0) return null;

  inMemoryState.beds[idx] = { ...inMemoryState.beds[idx], ...updates };
  const updatedBed = inMemoryState.beds[idx];

  const database = await getMongoClient();
  if (database) {
    await database.collection('beds').updateOne(
      { id: bedId },
      { $set: updates }
    );
  }

  return updatedBed;
}

/**
 * Record Patient Admission
 * Automatically synchronizes Bed to OCCUPIED and Patient status to ADMITTED
 */
export async function recordAdmission(admissionData: any): Promise<Admission> {
  const admission = validateAdmission(admissionData);
  const sanitized = { ...admission, _id: admission.id };

  inMemoryState.admissions.unshift(sanitized);

  // Update Bed to OCCUPIED
  if (admission.bedId) {
    await updateBed(admission.bedId, {
      status: 'OCCUPIED',
      patientId: admission.patientId,
      patientName: admission.patientName,
      doctorId: admission.doctorId,
      doctorName: admission.doctorName,
      admissionDate: admission.admissionDate
    });
  }

  // Update Patient to ADMITTED
  const pIdx = inMemoryState.patients.findIndex(p => p.id === admission.patientId);
  if (pIdx >= 0) {
    inMemoryState.patients[pIdx].status = 'ADMITTED';
    inMemoryState.patients[pIdx].currentBedId = admission.bedId;
    inMemoryState.patients[pIdx].currentBedNumber = admission.bedNumber;
    inMemoryState.patients[pIdx].currentWardId = admission.wardId;
    inMemoryState.patients[pIdx].currentWardName = admission.wardName;
    inMemoryState.patients[pIdx].doctorId = admission.doctorId;
    inMemoryState.patients[pIdx].doctorName = admission.doctorName;
    inMemoryState.patients[pIdx].admissionDate = admission.admissionDate;
  }

  const database = await getMongoClient();
  if (database) {
    await database.collection('admissions').insertOne(sanitized as any);
    if (admission.patientId) {
      await database.collection('patients').updateOne(
        { id: admission.patientId },
        {
          $set: {
            status: 'ADMITTED',
            currentBedId: admission.bedId,
            currentBedNumber: admission.bedNumber,
            currentWardId: admission.wardId,
            currentWardName: admission.wardName,
            doctorId: admission.doctorId,
            doctorName: admission.doctorName,
            admissionDate: admission.admissionDate
          }
        }
      );
    }
  }

  return sanitized;
}

/**
 * Record Patient Transfer
 * Frees previous bed (sets to CLEANING_REQUIRED) and occupies new bed
 */
export async function recordTransfer(transferData: any): Promise<Transfer> {
  const transfer = validateTransfer(transferData);
  const sanitized = { ...transfer, _id: transfer.id };

  inMemoryState.transfers.unshift(sanitized);

  // Free previous bed -> CLEANING_REQUIRED
  if (transfer.fromBedId) {
    await updateBed(transfer.fromBedId, {
      status: 'CLEANING_REQUIRED',
      patientId: undefined,
      patientName: undefined,
      admissionDate: undefined
    });
  }

  // Occupy destination bed -> OCCUPIED
  if (transfer.toBedId) {
    await updateBed(transfer.toBedId, {
      status: 'OCCUPIED',
      patientId: transfer.patientId,
      patientName: transfer.patientName,
      doctorId: transfer.doctorId,
      doctorName: transfer.doctorName
    });
  }

  // Update patient location
  const pIdx = inMemoryState.patients.findIndex(p => p.id === transfer.patientId);
  if (pIdx >= 0) {
    inMemoryState.patients[pIdx].currentBedId = transfer.toBedId;
    inMemoryState.patients[pIdx].currentBedNumber = transfer.toBedNumber;
    inMemoryState.patients[pIdx].currentWardId = transfer.toWardId;
    inMemoryState.patients[pIdx].currentWardName = transfer.toWardName;
  }

  const database = await getMongoClient();
  if (database) {
    await database.collection('transfers').insertOne(sanitized as any);
    if (transfer.patientId) {
      await database.collection('patients').updateOne(
        { id: transfer.patientId },
        {
          $set: {
            currentBedId: transfer.toBedId,
            currentBedNumber: transfer.toBedNumber,
            currentWardId: transfer.toWardId,
            currentWardName: transfer.toWardName
          }
        }
      );
    }
  }

  return sanitized;
}

/**
 * Record Patient Discharge
 * Marks bed as CLEANING_REQUIRED and updates patient to DISCHARGED
 */
export async function recordDischarge(dischargeData: any): Promise<DischargeRecord> {
  const discharge = validateDischarge(dischargeData);
  const sanitized = { ...discharge, _id: discharge.id };

  inMemoryState.discharges.unshift(sanitized);

  // Bed becomes CLEANING_REQUIRED
  if (discharge.bedId) {
    await updateBed(discharge.bedId, {
      status: 'CLEANING_REQUIRED',
      patientId: undefined,
      patientName: undefined,
      admissionDate: undefined
    });
  }

  // Patient marked DISCHARGED
  const pIdx = inMemoryState.patients.findIndex(p => p.id === discharge.patientId);
  if (pIdx >= 0) {
    inMemoryState.patients[pIdx].status = 'DISCHARGED';
    inMemoryState.patients[pIdx].dischargeDate = discharge.dischargeDate;
    inMemoryState.patients[pIdx].currentBedId = undefined;
    inMemoryState.patients[pIdx].currentBedNumber = undefined;
  }

  const database = await getMongoClient();
  if (database) {
    await database.collection('discharges').insertOne(sanitized as any);
    if (discharge.patientId) {
      await database.collection('patients').updateOne(
        { id: discharge.patientId },
        {
          $set: {
            status: 'DISCHARGED',
            dischargeDate: discharge.dischargeDate,
            currentBedId: null,
            currentBedNumber: null
          }
        }
      );
    }
  }

  return sanitized;
}

/**
 * Record Patient Payment
 * Automatically adjusts patient totalPaid & outstandingBalance
 */
export async function recordPayment(paymentData: any): Promise<Payment> {
  const payment = validatePayment(paymentData);
  const sanitized = { ...payment, _id: payment.id };

  inMemoryState.payments.unshift(sanitized);

  // Update patient ledger
  const pIdx = inMemoryState.patients.findIndex(p => p.id === payment.patientId);
  if (pIdx >= 0) {
    const patient = inMemoryState.patients[pIdx];
    patient.totalPaid = (patient.totalPaid || 0) + Number(payment.amount);
    patient.outstandingBalance = Math.max(0, (patient.totalBilled || 0) - patient.totalPaid);
  }

  const database = await getMongoClient();
  if (database) {
    await database.collection('payments').insertOne(sanitized as any);
    if (payment.patientId) {
      await database.collection('patients').updateOne(
        { id: payment.patientId },
        {
          $inc: { totalPaid: Number(payment.amount) }
        }
      );
    }
  }

  return sanitized;
}

/**
 * Record Diagnostic Request
 */
export async function recordDiagnosticRequest(requestData: any): Promise<DiagnosticRequest> {
  const request = validateDiagnosticRequest(requestData);
  const sanitized = { ...request, _id: request.id };

  inMemoryState.diagnosticRequests.unshift(sanitized);

  const database = await getMongoClient();
  if (database) {
    await database.collection('diagnosticRequests').insertOne(sanitized as any);
  }

  return sanitized;
}

/**
 * Record Vitals
 */
export async function recordVitals(vitalsData: any): Promise<VitalsRecord> {
  const vitals = validateVitals(vitalsData);
  const sanitized = { ...vitals, _id: vitals.id };

  inMemoryState.vitals.unshift(sanitized);

  const database = await getMongoClient();
  if (database) {
    await database.collection('vitals').insertOne(sanitized as any);
  }

  return sanitized;
}

/**
 * Record Audit Log
 */
export async function recordAudit(logData: any): Promise<AuditLog> {
  const audit: AuditLog = {
    id: logData.id || `AUD-${Date.now()}`,
    user: logData.user || 'System',
    role: logData.role || 'ADMIN',
    action: logData.action || 'UPDATE',
    entity: logData.entity || 'General',
    entityId: logData.entityId || 'SYS',
    timestamp: logData.timestamp || new Date().toISOString(),
    metadata: logData.metadata
  };
  const sanitized = { ...audit, _id: audit.id };

  inMemoryState.auditLogs.unshift(sanitized);

  const database = await getMongoClient();
  if (database) {
    await database.collection('auditLogs').insertOne(sanitized as any);
  }

  return sanitized;
}
