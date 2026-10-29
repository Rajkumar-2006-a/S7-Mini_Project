import { MongoClient, Db } from 'mongodb';
import {
  INITIAL_SETTINGS,
  INITIAL_WARDS,
  INITIAL_BEDS,
  INITIAL_PATIENTS,
  INITIAL_DOCTORS,
  INITIAL_NURSES,
  INITIAL_ADMISSIONS,
  INITIAL_TRANSFERS,
  INITIAL_DISCHARGES,
  INITIAL_DIAGNOSTIC_ROOMS,
  INITIAL_DIAGNOSTIC_REQUESTS,
  INITIAL_DIAGNOSTIC_REPORTS,
  INITIAL_PAYMENTS,
  INITIAL_CLEANING_LOGS,
  INITIAL_VITALS,
  INITIAL_TREATMENT_NOTES,
  INITIAL_NOTIFICATIONS,
  INITIAL_AUDIT_LOGS
} from './data/seedData';

export interface HospitalDatabaseState {
  settings: typeof INITIAL_SETTINGS;
  wards: typeof INITIAL_WARDS;
  beds: typeof INITIAL_BEDS;
  patients: typeof INITIAL_PATIENTS;
  doctors: typeof INITIAL_DOCTORS;
  nurses: typeof INITIAL_NURSES;
  admissions: typeof INITIAL_ADMISSIONS;
  transfers: typeof INITIAL_TRANSFERS;
  discharges: typeof INITIAL_DISCHARGES;
  diagnosticRooms: typeof INITIAL_DIAGNOSTIC_ROOMS;
  diagnosticRequests: typeof INITIAL_DIAGNOSTIC_REQUESTS;
  diagnosticReports: typeof INITIAL_DIAGNOSTIC_REPORTS;
  payments: typeof INITIAL_PAYMENTS;
  cleaningLogs: typeof INITIAL_CLEANING_LOGS;
  vitals: typeof INITIAL_VITALS;
  treatmentNotes: typeof INITIAL_TREATMENT_NOTES;
  notifications: typeof INITIAL_NOTIFICATIONS;
  auditLogs: typeof INITIAL_AUDIT_LOGS;
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

// In-Memory Fallback State (when MongoDB URI is not set or while establishing connection)
export let inMemoryState: HospitalDatabaseState = {
  settings: JSON.parse(JSON.stringify(INITIAL_SETTINGS)),
  wards: JSON.parse(JSON.stringify(INITIAL_WARDS)),
  beds: JSON.parse(JSON.stringify(INITIAL_BEDS)),
  patients: JSON.parse(JSON.stringify(INITIAL_PATIENTS)),
  doctors: JSON.parse(JSON.stringify(INITIAL_DOCTORS)),
  nurses: JSON.parse(JSON.stringify(INITIAL_NURSES)),
  admissions: JSON.parse(JSON.stringify(INITIAL_ADMISSIONS)),
  transfers: JSON.parse(JSON.stringify(INITIAL_TRANSFERS)),
  discharges: JSON.parse(JSON.stringify(INITIAL_DISCHARGES)),
  diagnosticRooms: JSON.parse(JSON.stringify(INITIAL_DIAGNOSTIC_ROOMS)),
  diagnosticRequests: JSON.parse(JSON.stringify(INITIAL_DIAGNOSTIC_REQUESTS)),
  diagnosticReports: JSON.parse(JSON.stringify(INITIAL_DIAGNOSTIC_REPORTS)),
  payments: JSON.parse(JSON.stringify(INITIAL_PAYMENTS)),
  cleaningLogs: JSON.parse(JSON.stringify(INITIAL_CLEANING_LOGS)),
  vitals: JSON.parse(JSON.stringify(INITIAL_VITALS)),
  treatmentNotes: JSON.parse(JSON.stringify(INITIAL_TREATMENT_NOTES)),
  notifications: JSON.parse(JSON.stringify(INITIAL_NOTIFICATIONS)),
  auditLogs: JSON.parse(JSON.stringify(INITIAL_AUDIT_LOGS)),
};

let client: MongoClient | null = null;
let db: Db | null = null;
let connectionError: string | undefined = undefined;
let isConnecting = false;

const MONGODB_URI = process.env.MONGODB_URI || '';
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME || 'medtrack_hospital';

export async function getMongoClient(): Promise<Db | null> {
  if (db) return db;
  if (!MONGODB_URI) return null;
  if (isConnecting) return null;

  try {
    isConnecting = true;
    console.log(`[MongoDB] Connecting to database: ${MONGODB_DB_NAME}...`);
    client = new MongoClient(MONGODB_URI, {
      connectTimeoutMS: 5000,
      serverSelectionTimeoutMS: 5000,
    });
    await client.connect();
    db = client.db(MONGODB_DB_NAME);
    connectionError = undefined;
    console.log(`[MongoDB] Successfully connected to MongoDB database "${MONGODB_DB_NAME}"`);

    // Ensure collections are indexed and seeded
    await initializeAndSeedMongoDB(db);
    return db;
  } catch (err: any) {
    connectionError = err.message || 'Failed to connect to MongoDB';
    console.warn(`[MongoDB] Connection notice: ${connectionError}. Operating in in-memory mode.`);
    db = null;
    return null;
  } finally {
    isConnecting = false;
  }
}

async function initializeAndSeedMongoDB(database: Db) {
  try {
    // Check if beds collection has any records
    const bedsCount = await database.collection('beds').countDocuments();
    if (bedsCount === 0) {
      console.log('[MongoDB] Initializing collections with hospital seed dataset...');

      await database.collection('settings').updateOne(
        { _id: 'hospital_settings' as any },
        { $set: { _id: 'hospital_settings' as any, ...INITIAL_SETTINGS } },
        { upsert: true }
      );

      if (INITIAL_WARDS.length > 0) {
        await database.collection('wards').insertMany(INITIAL_WARDS.map(w => ({ ...w, _id: w.id as any })));
      }
      if (INITIAL_BEDS.length > 0) {
        await database.collection('beds').insertMany(INITIAL_BEDS.map(b => ({ ...b, _id: b.id as any })));
      }
      if (INITIAL_PATIENTS.length > 0) {
        await database.collection('patients').insertMany(INITIAL_PATIENTS.map(p => ({ ...p, _id: p.id as any })));
      }
      if (INITIAL_DOCTORS.length > 0) {
        await database.collection('doctors').insertMany(INITIAL_DOCTORS.map(d => ({ ...d, _id: d.id as any })));
      }
      if (INITIAL_NURSES.length > 0) {
        await database.collection('nurses').insertMany(INITIAL_NURSES.map(n => ({ ...n, _id: n.id as any })));
      }
      if (INITIAL_ADMISSIONS.length > 0) {
        await database.collection('admissions').insertMany(INITIAL_ADMISSIONS.map(a => ({ ...a, _id: a.id as any })));
      }
      if (INITIAL_TRANSFERS.length > 0) {
        await database.collection('transfers').insertMany(INITIAL_TRANSFERS.map(t => ({ ...t, _id: t.id as any })));
      }
      if (INITIAL_DISCHARGES.length > 0) {
        await database.collection('discharges').insertMany(INITIAL_DISCHARGES.map(d => ({ ...d, _id: d.id as any })));
      }
      if (INITIAL_DIAGNOSTIC_ROOMS.length > 0) {
        await database.collection('diagnosticRooms').insertMany(INITIAL_DIAGNOSTIC_ROOMS.map(r => ({ ...r, _id: r.id as any })));
      }
      if (INITIAL_DIAGNOSTIC_REQUESTS.length > 0) {
        await database.collection('diagnosticRequests').insertMany(INITIAL_DIAGNOSTIC_REQUESTS.map(r => ({ ...r, _id: r.id as any })));
      }
      if (INITIAL_DIAGNOSTIC_REPORTS.length > 0) {
        await database.collection('diagnosticReports').insertMany(INITIAL_DIAGNOSTIC_REPORTS.map(r => ({ ...r, _id: r.id as any })));
      }
      if (INITIAL_PAYMENTS.length > 0) {
        await database.collection('payments').insertMany(INITIAL_PAYMENTS.map(p => ({ ...p, _id: p.id as any })));
      }
      if (INITIAL_CLEANING_LOGS.length > 0) {
        await database.collection('cleaningLogs').insertMany(INITIAL_CLEANING_LOGS.map(c => ({ ...c, _id: c.id as any })));
      }
      if (INITIAL_VITALS.length > 0) {
        await database.collection('vitals').insertMany(INITIAL_VITALS.map(v => ({ ...v, _id: v.id as any })));
      }
      if (INITIAL_TREATMENT_NOTES.length > 0) {
        await database.collection('treatmentNotes').insertMany(INITIAL_TREATMENT_NOTES.map(t => ({ ...t, _id: t.id as any })));
      }
      if (INITIAL_NOTIFICATIONS.length > 0) {
        await database.collection('notifications').insertMany(INITIAL_NOTIFICATIONS.map(n => ({ ...n, _id: n.id as any })));
      }
      if (INITIAL_AUDIT_LOGS.length > 0) {
        await database.collection('auditLogs').insertMany(INITIAL_AUDIT_LOGS.map(a => ({ ...a, _id: a.id as any })));
      }

      console.log('[MongoDB] Hospital seed dataset successfully written to MongoDB!');
    }

    // Create Indexes for rapid lookup
    await database.collection('beds').createIndex({ wardId: 1, status: 1 });
    await database.collection('patients').createIndex({ status: 1, currentWardId: 1 });
    await database.collection('admissions').createIndex({ status: 1, patientId: 1 });
    await database.collection('diagnosticRequests').createIndex({ status: 1, patientId: 1 });
  } catch (seedErr) {
    console.error('[MongoDB] Error during seeding/indexing:', seedErr);
  }
}

export async function getMongoStatus(): Promise<MongoStatus> {
  const database = await getMongoClient();
  const uriConfigured = Boolean(MONGODB_URI && MONGODB_URI.trim().length > 0);

  if (database) {
    try {
      const [
        bedsCount,
        patientsCount,
        admissionsCount,
        transfersCount,
        diagnosticsCount,
        vitalsCount,
        paymentsCount,
        logsCount
      ] = await Promise.all([
        database.collection('beds').countDocuments(),
        database.collection('patients').countDocuments(),
        database.collection('admissions').countDocuments(),
        database.collection('transfers').countDocuments(),
        database.collection('diagnosticRequests').countDocuments(),
        database.collection('vitals').countDocuments(),
        database.collection('payments').countDocuments(),
        database.collection('auditLogs').countDocuments(),
      ]);

      return {
        connected: true,
        uriConfigured: true,
        dbName: MONGODB_DB_NAME,
        mode: 'MONGODB',
        lastSyncedAt: new Date().toISOString(),
        collectionCounts: {
          beds: bedsCount,
          patients: patientsCount,
          admissions: admissionsCount,
          transfers: transfersCount,
          diagnosticRequests: diagnosticsCount,
          vitals: vitalsCount,
          payments: paymentsCount,
          auditLogs: logsCount
        }
      };
    } catch (err: any) {
      return {
        connected: false,
        uriConfigured,
        dbName: MONGODB_DB_NAME,
        mode: 'IN_MEMORY',
        error: err.message,
        collectionCounts: {
          beds: inMemoryState.beds.length,
          patients: inMemoryState.patients.length,
          admissions: inMemoryState.admissions.length,
          transfers: inMemoryState.transfers.length,
          discharges: inMemoryState.discharges.length,
          diagnosticRequests: inMemoryState.diagnosticRequests.length,
          vitals: inMemoryState.vitals.length,
          payments: inMemoryState.payments.length,
          auditLogs: inMemoryState.auditLogs.length
        }
      };
    }
  }

  return {
    connected: false,
    uriConfigured,
    dbName: MONGODB_DB_NAME,
    mode: 'IN_MEMORY',
    error: connectionError || (uriConfigured ? 'Connecting to MongoDB...' : 'MONGODB_URI not configured in environment'),
    collectionCounts: {
      beds: inMemoryState.beds.length,
      patients: inMemoryState.patients.length,
      admissions: inMemoryState.admissions.length,
      transfers: inMemoryState.transfers.length,
      discharges: inMemoryState.discharges.length,
      diagnosticRequests: inMemoryState.diagnosticRequests.length,
      vitals: inMemoryState.vitals.length,
      payments: inMemoryState.payments.length,
      auditLogs: inMemoryState.auditLogs.length
    }
  };
}

export async function fetchHospitalState(): Promise<HospitalDatabaseState> {
  const database = await getMongoClient();

  if (!database) {
    return inMemoryState;
  }

  try {
    const [
      settingsDoc,
      wards,
      beds,
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
      vitals,
      treatmentNotes,
      notifications,
      auditLogs
    ] = await Promise.all([
      database.collection('settings').findOne({ _id: 'hospital_settings' as any }),
      database.collection('wards').find().toArray(),
      database.collection('beds').find().toArray(),
      database.collection('patients').find().toArray(),
      database.collection('doctors').find().toArray(),
      database.collection('nurses').find().toArray(),
      database.collection('admissions').find().sort({ admissionDate: -1 }).toArray(),
      database.collection('transfers').find().sort({ timestamp: -1 }).toArray(),
      database.collection('discharges').find().sort({ dischargeDate: -1 }).toArray(),
      database.collection('diagnosticRooms').find().toArray(),
      database.collection('diagnosticRequests').find().sort({ requestedDate: -1 }).toArray(),
      database.collection('diagnosticReports').find().sort({ reportDate: -1 }).toArray(),
      database.collection('payments').find().sort({ date: -1 }).toArray(),
      database.collection('cleaningLogs').find().sort({ startTime: -1 }).toArray(),
      database.collection('vitals').find().sort({ timestamp: -1 }).toArray(),
      database.collection('treatmentNotes').find().sort({ timestamp: -1 }).toArray(),
      database.collection('notifications').find().sort({ timestamp: -1 }).toArray(),
      database.collection('auditLogs').find().sort({ timestamp: -1 }).toArray(),
    ]);

    const cleanSettings = settingsDoc ? (({ _id, ...rest }: any) => rest)(settingsDoc) : INITIAL_SETTINGS;

    const sanitize = (list: any[]) => list.map(({ _id, ...rest }) => rest);

    return {
      settings: cleanSettings as any,
      wards: sanitize(wards) as any,
      beds: sanitize(beds) as any,
      patients: sanitize(patients) as any,
      doctors: sanitize(doctors) as any,
      nurses: sanitize(nurses) as any,
      admissions: sanitize(admissions) as any,
      transfers: sanitize(transfers) as any,
      discharges: sanitize(discharges) as any,
      diagnosticRooms: sanitize(diagnosticRooms) as any,
      diagnosticRequests: sanitize(diagnosticRequests) as any,
      diagnosticReports: sanitize(diagnosticReports) as any,
      payments: sanitize(payments) as any,
      cleaningLogs: sanitize(cleaningLogs) as any,
      vitals: sanitize(vitals) as any,
      treatmentNotes: sanitize(treatmentNotes) as any,
      notifications: sanitize(notifications) as any,
      auditLogs: sanitize(auditLogs) as any,
    };
  } catch (err) {
    console.error('[MongoDB] Fetch state error, falling back to memory state:', err);
    return inMemoryState;
  }
}

export async function syncHospitalState(partialState: Partial<HospitalDatabaseState>): Promise<boolean> {
  // Update in-memory state always
  inMemoryState = {
    ...inMemoryState,
    ...partialState
  };

  const database = await getMongoClient();
  if (!database) {
    return true;
  }

  try {
    const promises: Promise<any>[] = [];

    if (partialState.settings) {
      promises.push(
        database.collection('settings').updateOne(
          { _id: 'hospital_settings' as any },
          { $set: { _id: 'hospital_settings' as any, ...partialState.settings } },
          { upsert: true }
        )
      );
    }

    const syncCollection = (collName: string, items?: any[]) => {
      if (!items) return;
      const coll = database.collection(collName);
      const bulkOps = items.map(item => ({
        updateOne: {
          filter: { id: item.id },
          update: { $set: { ...item, _id: item.id } },
          upsert: true
        }
      }));
      if (bulkOps.length > 0) {
        promises.push(coll.bulkWrite(bulkOps as any));
      }
    };

    syncCollection('wards', partialState.wards);
    syncCollection('beds', partialState.beds);
    syncCollection('patients', partialState.patients);
    syncCollection('admissions', partialState.admissions);
    syncCollection('transfers', partialState.transfers);
    syncCollection('discharges', partialState.discharges);
    syncCollection('diagnosticRooms', partialState.diagnosticRooms);
    syncCollection('diagnosticRequests', partialState.diagnosticRequests);
    syncCollection('diagnosticReports', partialState.diagnosticReports);
    syncCollection('payments', partialState.payments);
    syncCollection('cleaningLogs', partialState.cleaningLogs);
    syncCollection('vitals', partialState.vitals);
    syncCollection('treatmentNotes', partialState.treatmentNotes);
    syncCollection('notifications', partialState.notifications);
    syncCollection('auditLogs', partialState.auditLogs);

    await Promise.all(promises);
    return true;
  } catch (err) {
    console.error('[MongoDB] Failed to sync state to MongoDB:', err);
    return false;
  }
}

export async function resetDatabaseToSeed(): Promise<boolean> {
  inMemoryState = {
    settings: JSON.parse(JSON.stringify(INITIAL_SETTINGS)),
    wards: JSON.parse(JSON.stringify(INITIAL_WARDS)),
    beds: JSON.parse(JSON.stringify(INITIAL_BEDS)),
    patients: JSON.parse(JSON.stringify(INITIAL_PATIENTS)),
    doctors: JSON.parse(JSON.stringify(INITIAL_DOCTORS)),
    nurses: JSON.parse(JSON.stringify(INITIAL_NURSES)),
    admissions: JSON.parse(JSON.stringify(INITIAL_ADMISSIONS)),
    transfers: JSON.parse(JSON.stringify(INITIAL_TRANSFERS)),
    discharges: JSON.parse(JSON.stringify(INITIAL_DISCHARGES)),
    diagnosticRooms: JSON.parse(JSON.stringify(INITIAL_DIAGNOSTIC_ROOMS)),
    diagnosticRequests: JSON.parse(JSON.stringify(INITIAL_DIAGNOSTIC_REQUESTS)),
    diagnosticReports: JSON.parse(JSON.stringify(INITIAL_DIAGNOSTIC_REPORTS)),
    payments: JSON.parse(JSON.stringify(INITIAL_PAYMENTS)),
    cleaningLogs: JSON.parse(JSON.stringify(INITIAL_CLEANING_LOGS)),
    vitals: JSON.parse(JSON.stringify(INITIAL_VITALS)),
    treatmentNotes: JSON.parse(JSON.stringify(INITIAL_TREATMENT_NOTES)),
    notifications: JSON.parse(JSON.stringify(INITIAL_NOTIFICATIONS)),
    auditLogs: JSON.parse(JSON.stringify(INITIAL_AUDIT_LOGS)),
  };

  const database = await getMongoClient();
  if (!database) {
    return true;
  }

  try {
    const collections = [
      'settings', 'wards', 'beds', 'patients', 'doctors', 'nurses',
      'admissions', 'transfers', 'discharges', 'diagnosticRooms', 'diagnosticRequests',
      'diagnosticReports', 'payments', 'cleaningLogs', 'vitals',
      'treatmentNotes', 'notifications', 'auditLogs'
    ];

    for (const c of collections) {
      await database.collection(c).deleteMany({});
    }

    await initializeAndSeedMongoDB(database);
    return true;
  } catch (err) {
    console.error('[MongoDB] Reset database error:', err);
    return false;
  }
}
