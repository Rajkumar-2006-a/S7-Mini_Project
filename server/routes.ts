import { Router, Request, Response } from 'express';
import {
  fetchHospitalState,
  syncHospitalState,
  getMongoStatus,
  resetDatabaseToSeed,
  getMongoClient
} from './db';

const router = Router();

// 1. Health & Database Status
router.get('/health', async (req: Request, res: Response) => {
  const status = await getMongoStatus();
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    database: status
  });
});

router.get('/database/status', async (req: Request, res: Response) => {
  try {
    const status = await getMongoStatus();
    res.json(status);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch MongoDB status' });
  }
});

// 2. Full Hospital State Sync (GET & POST)
router.get('/hospital/state', async (req: Request, res: Response) => {
  try {
    const state = await fetchHospitalState();
    const status = await getMongoStatus();
    res.json({
      success: true,
      data: state,
      dbStatus: status
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/hospital/sync', async (req: Request, res: Response) => {
  try {
    const partialState = req.body;
    const success = await syncHospitalState(partialState);
    const status = await getMongoStatus();
    res.json({
      success,
      message: success ? 'Hospital state synchronized with MongoDB.' : 'Partial sync failure.',
      dbStatus: status
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 3. Reset Database to Initial Seed State
router.post('/hospital/reset', async (req: Request, res: Response) => {
  try {
    const success = await resetDatabaseToSeed();
    const freshState = await fetchHospitalState();
    const status = await getMongoStatus();
    res.json({
      success,
      message: 'Database reset to clean Tamil Nadu MedTrack hospital seed state.',
      data: freshState,
      dbStatus: status
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 4. Collection-specific endpoints
router.get('/beds', async (req: Request, res: Response) => {
  try {
    const state = await fetchHospitalState();
    res.json(state.beds);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/beds/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedBed = req.body;
    const state = await fetchHospitalState();
    const newBeds = state.beds.map(b => b.id === id ? { ...b, ...updatedBed } : b);
    await syncHospitalState({ beds: newBeds });
    res.json({ success: true, bed: updatedBed });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/patients', async (req: Request, res: Response) => {
  try {
    const state = await fetchHospitalState();
    res.json(state.patients);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/patients', async (req: Request, res: Response) => {
  try {
    const newPatient = req.body;
    const state = await fetchHospitalState();
    const updatedPatients = [newPatient, ...state.patients];
    await syncHospitalState({ patients: updatedPatients });
    res.json({ success: true, patient: newPatient });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/admissions', async (req: Request, res: Response) => {
  try {
    const state = await fetchHospitalState();
    res.json(state.admissions);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/transfers', async (req: Request, res: Response) => {
  try {
    const state = await fetchHospitalState();
    res.json(state.transfers);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/discharges', async (req: Request, res: Response) => {
  try {
    const state = await fetchHospitalState();
    res.json(state.discharges);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/diagnostics', async (req: Request, res: Response) => {
  try {
    const state = await fetchHospitalState();
    res.json({
      requests: state.diagnosticRequests,
      rooms: state.diagnosticRooms,
      reports: state.diagnosticReports
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/payments', async (req: Request, res: Response) => {
  try {
    const state = await fetchHospitalState();
    res.json(state.payments);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/audit-logs', async (req: Request, res: Response) => {
  try {
    const state = await fetchHospitalState();
    res.json(state.auditLogs);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
