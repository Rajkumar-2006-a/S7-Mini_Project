import { Router, Request, Response } from 'express';
import {
  fetchHospitalState,
  syncHospitalState,
  getMongoStatus,
  resetDatabaseToSeed,
  inMemoryState
} from './db';
import {
  savePatient,
  updateBed,
  recordAdmission,
  recordTransfer,
  recordDischarge,
  recordPayment,
  recordDiagnosticRequest,
  recordVitals,
  recordAudit
} from './services/dbOperations';

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

// 4. Beds Endpoints
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
    const updatedBed = await updateBed(id, req.body);
    if (!updatedBed) {
      return res.status(404).json({ error: `Bed with ID ${id} not found` });
    }
    res.json({ success: true, bed: updatedBed });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 5. Patients Endpoints
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
    const patient = await savePatient(req.body);
    res.json({ success: true, patient });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/patients/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const patient = await savePatient({ ...req.body, id });
    res.json({ success: true, patient });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// 6. Admissions Endpoints
router.get('/admissions', async (req: Request, res: Response) => {
  try {
    const state = await fetchHospitalState();
    res.json(state.admissions);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/admissions', async (req: Request, res: Response) => {
  try {
    const admission = await recordAdmission(req.body);
    res.json({ success: true, admission });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// 7. Transfers Endpoints
router.get('/transfers', async (req: Request, res: Response) => {
  try {
    const state = await fetchHospitalState();
    res.json(state.transfers);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/transfers', async (req: Request, res: Response) => {
  try {
    const transfer = await recordTransfer(req.body);
    res.json({ success: true, transfer });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// 8. Discharges Endpoints
router.get('/discharges', async (req: Request, res: Response) => {
  try {
    const state = await fetchHospitalState();
    res.json(state.discharges);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/discharges', async (req: Request, res: Response) => {
  try {
    const discharge = await recordDischarge(req.body);
    res.json({ success: true, discharge });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// 9. Diagnostics Endpoints
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

router.post('/diagnostics/requests', async (req: Request, res: Response) => {
  try {
    const request = await recordDiagnosticRequest(req.body);
    res.json({ success: true, request });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// 10. Payments Endpoints
router.get('/payments', async (req: Request, res: Response) => {
  try {
    const state = await fetchHospitalState();
    res.json(state.payments);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/payments', async (req: Request, res: Response) => {
  try {
    const payment = await recordPayment(req.body);
    res.json({ success: true, payment });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// 11. Vitals Endpoints
router.get('/vitals', async (req: Request, res: Response) => {
  try {
    const state = await fetchHospitalState();
    res.json(state.vitals);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/vitals', async (req: Request, res: Response) => {
  try {
    const vitals = await recordVitals(req.body);
    res.json({ success: true, vitals });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// 12. Audit Logs Endpoints
router.get('/audit-logs', async (req: Request, res: Response) => {
  try {
    const state = await fetchHospitalState();
    res.json(state.auditLogs);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/audit-logs', async (req: Request, res: Response) => {
  try {
    const audit = await recordAudit(req.body);
    res.json({ success: true, audit });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
