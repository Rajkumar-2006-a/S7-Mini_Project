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
  HospitalSettings
} from '../types';

export const INITIAL_SETTINGS: HospitalSettings = {
  hospitalName: 'MedTrack Multi-Speciality Hospital',
  subtitle: 'Chidambaram Road, Tamil Nadu, India',
  address: '142, Hospital Road, Cuddalore Main Road, Chidambaram, Tamil Nadu 608001',
  state: 'Tamil Nadu',
  phone: '+91 4144 238900',
  email: 'operations@medtrack-hospital.in',
  wardCharges: {
    general: 1200,
    icu: 6500,
    emergency: 3500,
    speciality: 4000,
    maternity: 3000,
    pediatric: 2500,
  },
  diagnosticCharges: {
    xray: 850,
    ctScan: 4200,
    mriScan: 8500,
  },
  forecastSettings: {
    warningThresholdPercent: 80,
    criticalThresholdPercent: 90,
    forecastDays: 7,
  },
  autoCleanBedsOnDischarge: true
};

export const INITIAL_WARDS: Ward[] = [
  { id: 'w-gm', name: 'General Medicine Ward', code: 'GM', department: 'General Medicine', floor: 1, totalBeds: 120, occupiedBeds: 96, availableBeds: 20, cleaningBeds: 3, maintenanceBeds: 1, costPerDay: 1200, headDoctor: 'Dr. S. Karthikeyan', occupancyRate: 80, description: 'Adult medical admissions, fever clinics, diabetic care, and internal medicine.' },
  { id: 'w-icu', name: 'ICU – Intensive Care Unit', code: 'ICU', department: 'Critical Care', floor: 2, totalBeds: 20, occupiedBeds: 18, availableBeds: 2, cleaningBeds: 0, maintenanceBeds: 0, costPerDay: 6500, headDoctor: 'Dr. R. Pradeep', occupancyRate: 90, description: 'High-acuity invasive mechanical ventilation, multi-parameter telemetry, arterial lines.' },
  { id: 'w-em', name: 'Emergency Ward', code: 'EM', department: 'Emergency Medicine', floor: 1, totalBeds: 40, occupiedBeds: 32, availableBeds: 6, cleaningBeds: 1, maintenanceBeds: 1, costPerDay: 3500, headDoctor: 'Dr. V. Senthil', occupancyRate: 80, description: '24/7 acute trauma resuscitation, triage bays, and rapid stabilization.' },
  { id: 'w-card', name: 'Cardiology Ward', code: 'CARD', department: 'Cardiology', floor: 3, totalBeds: 30, occupiedBeds: 24, availableBeds: 5, cleaningBeds: 1, maintenanceBeds: 0, costPerDay: 4500, headDoctor: 'Dr. Aravind Kumar', occupancyRate: 80, description: 'Post-angiography, CCU monitoring, acute coronary care, and heart failure telemetry.' },
  { id: 'w-neuro', name: 'Neurology Ward', code: 'NEURO', department: 'Neurology', floor: 3, totalBeds: 15, occupiedBeds: 12, availableBeds: 3, cleaningBeds: 0, maintenanceBeds: 0, costPerDay: 4200, headDoctor: 'Dr. Meenakshi Sundaram', occupancyRate: 80, description: 'Acute stroke recovery, EEG telemetry, GCS neuro-monitoring, and neuropathy management.' },
  { id: 'w-ortho', name: 'Orthopaedics Ward', code: 'ORTHO', department: 'Orthopaedics', floor: 2, totalBeds: 20, occupiedBeds: 16, availableBeds: 4, cleaningBeds: 0, maintenanceBeds: 0, costPerDay: 3200, headDoctor: 'Dr. Deepa Shankar', occupancyRate: 80, description: 'Post-operative joint arthroplasty, polytrauma skeletal traction, and spinal care.' },
  { id: 'w-mat', name: 'Maternity & Obstetrics Ward', code: 'MAT', department: 'Obstetrics', floor: 4, totalBeds: 15, occupiedBeds: 11, availableBeds: 3, cleaningBeds: 1, maintenanceBeds: 0, costPerDay: 3000, headDoctor: 'Dr. Kavitha Raj', occupancyRate: 73, description: 'Antenatal care, labor delivery recovery suites, and postpartum convalescence.' },
  { id: 'w-ped', name: 'Paediatric Ward', code: 'PED', department: 'Paediatrics', floor: 4, totalBeds: 15, occupiedBeds: 12, availableBeds: 3, cleaningBeds: 0, maintenanceBeds: 0, costPerDay: 2500, headDoctor: 'Dr. Priya Lakshmi', occupancyRate: 80, description: 'Child inpatient care, broncho-pulmonary treatment, and pediatric infection management.' },
  { id: 'w-nicu', name: 'Neonatal ICU (NICU)', code: 'NICU', department: 'Neonatology', floor: 4, totalBeds: 10, occupiedBeds: 8, availableBeds: 2, cleaningBeds: 0, maintenanceBeds: 0, costPerDay: 5500, headDoctor: 'Dr. Harini Kumar', occupancyRate: 80, description: 'Premature infant radiant warmers, phototherapy, and neonatal CPAP ventilation.' },
  { id: 'w-gs', name: 'General Surgery Ward', code: 'GS', department: 'General Surgery', floor: 2, totalBeds: 10, occupiedBeds: 8, availableBeds: 2, cleaningBeds: 0, maintenanceBeds: 0, costPerDay: 3500, headDoctor: 'Dr. S. Karthikeyan', occupancyRate: 80, description: 'Pre-operative prep, elective abdominal laparoscopy recovery, and wound dressings.' },
  { id: 'w-neph', name: 'Nephrology Ward', code: 'NEPH', department: 'Nephrology', floor: 3, totalBeds: 6, occupiedBeds: 4, availableBeds: 2, cleaningBeds: 0, maintenanceBeds: 0, costPerDay: 4000, headDoctor: 'Dr. R. Pradeep', occupancyRate: 67, description: 'Hemodialysis access care, renal impairment stabilization, and electrolyte balances.' },
  { id: 'w-onco', name: 'Oncology Ward', code: 'ONCO', department: 'Oncology', floor: 5, totalBeds: 6, occupiedBeds: 4, availableBeds: 2, cleaningBeds: 0, maintenanceBeds: 0, costPerDay: 4800, headDoctor: 'Dr. Nandhini Ravi', occupancyRate: 67, description: 'Chemotherapy infusion bays, palliative care, and oncology symptom control.' },
  { id: 'w-resp', name: 'Respiratory Medicine Ward', code: 'RESP', department: 'Pulmonology', floor: 2, totalBeds: 8, occupiedBeds: 6, availableBeds: 2, cleaningBeds: 0, maintenanceBeds: 0, costPerDay: 3200, headDoctor: 'Dr. Aravind Kumar', occupancyRate: 75, description: 'Non-invasive BiPAP therapy, severe COPD exacerbation, and pneumonia recovery.' },
  { id: 'w-gastro', name: 'Gastroenterology Ward', code: 'GASTRO', department: 'Gastroenterology', floor: 3, totalBeds: 5, occupiedBeds: 4, availableBeds: 1, cleaningBeds: 0, maintenanceBeds: 0, costPerDay: 3400, headDoctor: 'Dr. Deepa Shankar', occupancyRate: 80, description: 'Post-endoscopy observation, liver disease telemetry, and GI bleeding protocol.' },
];

export const INITIAL_DOCTORS: Doctor[] = [
  { id: 'DOC-01', name: 'Dr. Govindharaj M.', department: 'Hospital Administration & Medicine', specialization: 'Chief Medical Officer / Internal Medicine', phone: '+91 98401 23456', email: 'govindharaj.m@medtrack.in', maxCapacity: 25, currentPatientCount: 12, availableCapacity: 13, isDemo: true, active: true },
  { id: 'DOC-02', name: 'Dr. S. Karthikeyan', department: 'General Medicine', specialization: 'Consultant Physician & Diabetologist', phone: '+91 94432 10987', email: 's.karthikeyan@medtrack.in', maxCapacity: 30, currentPatientCount: 22, availableCapacity: 8, isDemo: true, active: true },
  { id: 'DOC-03', name: 'Dr. R. Pradeep', department: 'Critical Care & ICU', specialization: 'Intensivist & Emergency Care Lead', phone: '+91 98840 55667', email: 'r.pradeep@medtrack.in', maxCapacity: 20, currentPatientCount: 18, availableCapacity: 2, isDemo: true, active: true },
  { id: 'DOC-04', name: 'Dr. Aravind Kumar', department: 'Cardiology', specialization: 'Interventional Cardiologist', phone: '+91 97910 88776', email: 'aravind.kumar@medtrack.in', maxCapacity: 25, currentPatientCount: 19, availableCapacity: 6, isDemo: true, active: true },
  { id: 'DOC-05', name: 'Dr. Priya Lakshmi', department: 'Paediatrics', specialization: 'Consultant Paediatrician', phone: '+91 98422 33445', email: 'priya.lakshmi@medtrack.in', maxCapacity: 20, currentPatientCount: 14, availableCapacity: 6, isDemo: true, active: true },
  { id: 'DOC-06', name: 'Dr. Meenakshi Sundaram', department: 'Neurology', specialization: 'Senior Neurologist', phone: '+91 94441 77889', email: 'meenakshi.sundaram@medtrack.in', maxCapacity: 18, currentPatientCount: 13, availableCapacity: 5, isDemo: true, active: true },
  { id: 'DOC-07', name: 'Dr. Kavitha Raj', department: 'Obstetrics & Gynaecology', specialization: 'Consultant Obstetrician & Surgeon', phone: '+91 98408 99001', email: 'kavitha.raj@medtrack.in', maxCapacity: 20, currentPatientCount: 12, availableCapacity: 8, isDemo: true, active: true },
  { id: 'DOC-08', name: 'Dr. Deepa Shankar', department: 'Orthopaedics', specialization: 'Orthopaedic & Trauma Surgeon', phone: '+91 97890 11223', email: 'deepa.shankar@medtrack.in', maxCapacity: 22, currentPatientCount: 15, availableCapacity: 7, isDemo: true, active: true },
];

export const INITIAL_NURSES: Nurse[] = [
  { id: 'NUR-01', name: 'Selvi M.', tamilName: 'செல்வி', ward: 'ICU – Intensive Care Unit', phone: '+91 98402 11101', shift: 'Morning', assignedPatientsCount: 4, active: true },
  { id: 'NUR-02', name: 'Revathi S.', tamilName: 'ரேவதி', ward: 'Cardiology Ward', phone: '+91 98402 11102', shift: 'Morning', assignedPatientsCount: 6, active: true },
  { id: 'NUR-03', name: 'Sudha K.', tamilName: 'சுதா', ward: 'General Medicine Ward', phone: '+91 98402 11103', shift: 'Evening', assignedPatientsCount: 8, active: true },
  { id: 'NUR-04', name: 'Pavithra D.', tamilName: 'பவித்ரா', ward: 'Paediatric Ward', phone: '+91 98402 11104', shift: 'Morning', assignedPatientsCount: 5, active: true },
  { id: 'NUR-05', name: 'Saranya R.', tamilName: 'சரண்யா', ward: 'Emergency Ward', phone: '+91 98402 11105', shift: 'Night', assignedPatientsCount: 7, active: true },
  { id: 'NUR-06', name: 'Gomathi P.', tamilName: 'கோமதி', ward: 'Maternity & Obstetrics Ward', phone: '+91 98402 11106', shift: 'Evening', assignedPatientsCount: 5, active: true },
  { id: 'NUR-07', name: 'Kalaivani N.', tamilName: 'கலைவாணி', ward: 'Neonatal ICU (NICU)', phone: '+91 98402 11107', shift: 'Morning', assignedPatientsCount: 3, active: true },
];

export const INITIAL_HOUSEKEEPERS: Housekeeper[] = [
  { id: 'HK-01', name: 'Selvi M.', tamilName: 'செல்வி', phone: '+91 98401 22001', shift: 'Morning', assignedWard: 'ICU – Intensive Care Unit', status: 'AVAILABLE', bedsCleanedToday: 8, rating: 4.9, speedMins: 8 },
  { id: 'HK-02', name: 'Muthu K.', tamilName: 'முத்து', phone: '+91 98401 22002', shift: 'Morning', assignedWard: 'Cardiology Ward', status: 'AVAILABLE', bedsCleanedToday: 7, rating: 4.8, speedMins: 9 },
  { id: 'HK-03', name: 'Murugesan R.', tamilName: 'முருகேசன்', phone: '+91 98401 22003', shift: 'Morning', assignedWard: 'Emergency & Trauma Care', status: 'AVAILABLE', bedsCleanedToday: 11, rating: 4.9, speedMins: 7 },
  { id: 'HK-04', name: 'Lakshmi S.', tamilName: 'லட்சுமி', phone: '+91 98401 22004', shift: 'Morning', assignedWard: 'Maternity & Obstetrics Ward', status: 'AVAILABLE', bedsCleanedToday: 6, rating: 4.9, speedMins: 8 },
  { id: 'HK-05', name: 'Anitha P.', tamilName: 'அனிதா', phone: '+91 98401 22005', shift: 'Evening', assignedWard: 'Paediatric Ward', status: 'AVAILABLE', bedsCleanedToday: 5, rating: 4.7, speedMins: 10 },
  { id: 'HK-06', name: 'Ramanathan V.', tamilName: 'ராமநாதன்', phone: '+91 98401 22006', shift: 'Evening', assignedWard: 'Orthopaedics Ward', status: 'AVAILABLE', bedsCleanedToday: 7, rating: 4.8, speedMins: 8 },
  { id: 'HK-07', name: 'Saravanan K.', tamilName: 'சரவணன்', phone: '+91 98401 22007', shift: 'Evening', assignedWard: 'Neurology & Stroke Unit', status: 'AVAILABLE', bedsCleanedToday: 6, rating: 4.8, speedMins: 9 },
  { id: 'HK-08', name: 'Deepa N.', tamilName: 'தீபா', phone: '+91 98401 22008', shift: 'Night', assignedWard: 'Nephrology & Dialysis Ward', status: 'AVAILABLE', bedsCleanedToday: 4, rating: 4.9, speedMins: 8 },
  { id: 'HK-09', name: 'Prakash T.', tamilName: 'பிரகாஷ்', phone: '+91 98401 22009', shift: 'Night', assignedWard: 'General Medicine Ward', status: 'AVAILABLE', bedsCleanedToday: 9, rating: 4.9, speedMins: 7 },
  { id: 'HK-10', name: 'Gomathi S.', tamilName: 'கோமதி', phone: '+91 98401 22010', shift: 'Night', assignedWard: 'Surgical Post-Op Ward', status: 'AVAILABLE', bedsCleanedToday: 8, rating: 4.8, speedMins: 8 },
  { id: 'HK-11', name: 'Karthika R.', tamilName: 'கார்த்திகா', phone: '+91 98401 22011', shift: 'Morning', assignedWard: 'Oncology Care Ward', status: 'AVAILABLE', bedsCleanedToday: 5, rating: 4.9, speedMins: 8 },
  { id: 'HK-12', name: 'Velmurugan A.', tamilName: 'வேல்முருகன்', phone: '+91 98401 22012', shift: 'Morning', assignedWard: 'Neonatal ICU (NICU)', status: 'AVAILABLE', bedsCleanedToday: 6, rating: 4.9, speedMins: 7 },
  { id: 'HK-13', name: 'Revathi D.', tamilName: 'ரேவதி', phone: '+91 98401 22013', shift: 'Evening', assignedWard: 'Cardiothoracic Step-Down', status: 'AVAILABLE', bedsCleanedToday: 4, rating: 4.8, speedMins: 9 },
  { id: 'HK-14', name: 'Senthil Kumar M.', tamilName: 'செந்தில்குமார்', phone: '+91 98401 22014', shift: 'Evening', assignedWard: 'Emergency & Trauma Care', status: 'AVAILABLE', bedsCleanedToday: 8, rating: 4.9, speedMins: 7 },
  { id: 'HK-15', name: 'Pushpa L.', tamilName: 'புஷ்பா', phone: '+91 98401 22015', shift: 'Night', assignedWard: 'ICU – Intensive Care Unit', status: 'AVAILABLE', bedsCleanedToday: 7, rating: 4.9, speedMins: 8 },
  { id: 'HK-16', name: 'Kannan B.', tamilName: 'கண்ணன்', phone: '+91 98401 22016', shift: 'Morning', assignedWard: 'Day Care & Dialysis Unit', status: 'AVAILABLE', bedsCleanedToday: 9, rating: 4.8, speedMins: 8 },
  { id: 'HK-17', name: 'Shanthi M.', tamilName: 'சாந்தி', phone: '+91 98401 22017', shift: 'Evening', assignedWard: 'Isolation & Infection Control Ward', status: 'AVAILABLE', bedsCleanedToday: 6, rating: 4.9, speedMins: 9 },
  { id: 'HK-18', name: 'Dhanasekar P.', tamilName: 'தனசேகர்', phone: '+91 98401 22018', shift: 'Night', assignedWard: 'Emergency & Trauma Care', status: 'AVAILABLE', bedsCleanedToday: 5, rating: 4.8, speedMins: 7 },
];

export const INITIAL_DIAGNOSTIC_ROOMS: DiagnosticRoom[] = [
  { id: 'R-XRAY-01', name: 'X-Ray Room 01 (Digital DR)', code: 'XRAY-01', type: 'XRAY', modality: 'Digital Radiography (DR)', floor: 1, equipmentId: 'EQ-XR-101', equipmentModel: 'Siemens Multix Impact Digital', status: 'AVAILABLE', department: 'Radiology', cost: 850, technicianName: 'V. Sundaram (Lead Tech)' },
  { id: 'R-XRAY-02', name: 'X-Ray Room 02 (Emergency Fluoroscopy)', code: 'XRAY-02', type: 'XRAY', modality: 'Fluoroscopy & High-Res DR', floor: 1, equipmentId: 'EQ-XR-102', equipmentModel: 'GE Healthcare Definium 646 HD', status: 'IN_USE', department: 'Radiology', currentRequestId: 'REQ-XR-802', currentScanType: 'Emergency Chest X-Ray', cost: 1100, technicianName: 'S. Prakash' },
  { id: 'R-CT-01', name: 'CT Scan Room 01 (128 Slice)', code: 'CT-01', type: 'CT_SCAN', modality: '128-Slice Whole Body CT', floor: 1, equipmentId: 'EQ-CT-201', equipmentModel: 'GE Revolution EVO 128-Slice', status: 'IN_USE', department: 'Radiology', currentRequestId: 'REQ-CT-804', currentScanType: 'High-Resolution Contrast CT', cost: 4500, technicianName: 'K. Meenakshi' },
  { id: 'R-CT-02', name: 'CT Scan Room 02 (64 Slice Dual Energy)', code: 'CT-02', type: 'CT_SCAN', modality: '64-Slice Spectral CT', floor: 1, equipmentId: 'EQ-CT-202', equipmentModel: 'Siemens SOMATOM go.Top', status: 'AVAILABLE', department: 'Radiology', cost: 3800, technicianName: 'R. Vignesh' },
  { id: 'R-MRI-01', name: 'MRI Scan Room 01 (3.0 Tesla Silent)', code: 'MRI-01', type: 'MRI_SCAN', modality: '3.0T High-Field Silent Scan', floor: 1, equipmentId: 'EQ-MR-301', equipmentModel: 'Philips Ingenia 3.0T Wide Bore', status: 'AVAILABLE', department: 'Radiology', cost: 7500, technicianName: 'Dr. P. Sundaramoorthy' },
  { id: 'R-MRI-02', name: 'MRI Scan Room 02 (1.5 Tesla Cardiac)', code: 'MRI-02', type: 'MRI_SCAN', modality: '1.5T Cardiac & Neuro MRI', floor: 1, equipmentId: 'EQ-MR-302', equipmentModel: 'Siemens MAGNETOM Altea 1.5T', status: 'AVAILABLE', department: 'Radiology', cost: 6200, technicianName: 'A. Jayachandran' },
];

export const INITIAL_PATIENTS: Patient[] = [
  {
    id: 'P1001',
    name: 'Arunkumar S.',
    tamilName: 'அருண்குமார்',
    age: 54,
    dob: '1972-04-12',
    gender: 'Male',
    phone: '+91 94431 88990',
    bloodGroup: 'B+ Positive',
    address: '12/4, Gandhi Road, Chidambaram, Cuddalore Dist, Tamil Nadu',
    nationality: 'Indian',
    emergencyContact: { name: 'Kavitha Arunkumar', relationship: 'Spouse', phone: '+91 94431 88991' },
    reasonForVisit: 'Severe chest tightness and acute shortness of breath',
    diagnosis: 'Acute Coronary Syndrome / NSTEMI with Grade II HTN',
    status: 'ADMITTED',
    currentWardId: 'w-icu',
    currentWardName: 'ICU – Intensive Care Unit',
    currentBedId: 'b-icu-001',
    currentBedNumber: 'ICU-001',
    doctorId: 'DOC-03',
    doctorName: 'Dr. R. Pradeep',
    admissionDate: '2026-09-08T09:30:00.000Z',
    expectedDischargeDate: '2026-09-14T11:00:00.000Z',
    depositAmount: 20000,
    totalBilled: 38500,
    totalPaid: 20000,
    outstandingBalance: 18500,
    qrToken: 'MEDTRACK_P1001_SECURE_AUTH_V1',
    createdAt: '2026-09-08T09:15:00.000Z',
  },
  {
    id: 'P1002',
    name: 'Meenakshi Sundaram',
    tamilName: 'மீனாட்சி',
    age: 62,
    dob: '1964-08-25',
    gender: 'Female',
    phone: '+91 98403 77665',
    bloodGroup: 'O+ Positive',
    address: '45, West Car Street, Chidambaram, Tamil Nadu',
    nationality: 'Indian',
    emergencyContact: { name: 'Senthilkumar M.', relationship: 'Son', phone: '+91 98403 77666' },
    reasonForVisit: 'Sudden onset left-sided facial droop and arm weakness',
    diagnosis: 'Acute Ischemic Stroke (Right MCA territory)',
    status: 'ADMITTED',
    currentWardId: 'w-icu',
    currentWardName: 'ICU – Intensive Care Unit',
    currentBedId: 'b-icu-002',
    currentBedNumber: 'ICU-002',
    doctorId: 'DOC-06',
    doctorName: 'Dr. Meenakshi Sundaram',
    admissionDate: '2026-09-09T03:15:00.000Z',
    expectedDischargeDate: '2026-09-16T14:00:00.000Z',
    depositAmount: 25000,
    totalBilled: 42000,
    totalPaid: 25000,
    outstandingBalance: 17000,
    qrToken: 'MEDTRACK_P1002_SECURE_AUTH_V1',
    createdAt: '2026-09-09T03:00:00.000Z',
  },
  {
    id: 'P1003',
    name: 'Karthikeyan V.',
    tamilName: 'கார்த்திகேயன்',
    age: 42,
    dob: '1984-11-03',
    gender: 'Male',
    phone: '+91 97892 33441',
    bloodGroup: 'A+ Positive',
    address: '88, North Street, Bhuvanagiri, Cuddalore, Tamil Nadu',
    nationality: 'Indian',
    emergencyContact: { name: 'Deepa Karthikeyan', relationship: 'Spouse', phone: '+91 97892 33442' },
    reasonForVisit: 'High grade remittent fever with chills and severe body ache (Day 5)',
    diagnosis: 'Acute Febrile Illness / Dengue Fever with Thrombocytopenia',
    status: 'ADMITTED',
    currentWardId: 'w-gm',
    currentWardName: 'General Medicine Ward',
    currentBedId: 'b-gm-001',
    currentBedNumber: 'GM-001',
    doctorId: 'DOC-02',
    doctorName: 'Dr. S. Karthikeyan',
    admissionDate: '2026-09-07T14:20:00.000Z',
    expectedDischargeDate: '2026-09-12T10:00:00.000Z',
    depositAmount: 10000,
    totalBilled: 14800,
    totalPaid: 10000,
    outstandingBalance: 4800,
    qrToken: 'MEDTRACK_P1003_SECURE_AUTH_V1',
    createdAt: '2026-09-07T14:00:00.000Z',
  },
  {
    id: 'P1004',
    name: 'Nandhini R.',
    tamilName: 'நந்தினி',
    age: 28,
    dob: '1998-02-14',
    gender: 'Female',
    phone: '+91 98841 22998',
    bloodGroup: 'O- Negative',
    address: '15/2, Anna Nagar, Vadalur, Tamil Nadu',
    nationality: 'Indian',
    emergencyContact: { name: 'Rajeshkumar T.', relationship: 'Spouse', phone: '+91 98841 22999' },
    reasonForVisit: 'Full-term pregnancy with active labor contractions',
    diagnosis: 'Primigravida at 39 weeks gestation in active phase of labor',
    status: 'ADMITTED',
    currentWardId: 'w-mat',
    currentWardName: 'Maternity & Obstetrics Ward',
    currentBedId: 'b-mat-001',
    currentBedNumber: 'MAT-001',
    doctorId: 'DOC-07',
    doctorName: 'Dr. Kavitha Raj',
    admissionDate: '2026-09-10T05:40:00.000Z',
    expectedDischargeDate: '2026-09-13T12:00:00.000Z',
    depositAmount: 15000,
    totalBilled: 19500,
    totalPaid: 15000,
    outstandingBalance: 4500,
    qrToken: 'MEDTRACK_P1004_SECURE_AUTH_V1',
    createdAt: '2026-09-10T05:20:00.000Z',
  },
  {
    id: 'P1005',
    name: 'Saravanan M.',
    tamilName: 'சரவணன்',
    age: 36,
    dob: '1990-06-19',
    gender: 'Male',
    phone: '+91 97904 55661',
    bloodGroup: 'AB+ Positive',
    address: '71, Katchery Street, Neyveli, Tamil Nadu',
    nationality: 'Indian',
    emergencyContact: { name: 'Latha Saravanan', relationship: 'Spouse', phone: '+91 97904 55662' },
    reasonForVisit: 'Road traffic accident with right lower extremity deformity',
    diagnosis: 'Closed fracture shaft of right femur, stable hemodynamics',
    status: 'ADMITTED',
    currentWardId: 'w-ortho',
    currentWardName: 'Orthopaedics Ward',
    currentBedId: 'b-ortho-001',
    currentBedNumber: 'ORTHO-001',
    doctorId: 'DOC-08',
    doctorName: 'Dr. Deepa Shankar',
    admissionDate: '2026-09-08T18:10:00.000Z',
    expectedDischargeDate: '2026-09-15T15:00:00.000Z',
    depositAmount: 25000,
    totalBilled: 36200,
    totalPaid: 25000,
    outstandingBalance: 11200,
    qrToken: 'MEDTRACK_P1005_SECURE_AUTH_V1',
    createdAt: '2026-09-08T17:50:00.000Z',
  },
  {
    id: 'P1006',
    name: 'Harini K. (Child)',
    tamilName: 'ஹரிணி',
    age: 6,
    dob: '2020-09-15',
    gender: 'Female',
    phone: '+91 98409 66778',
    bloodGroup: 'B+ Positive',
    address: '33, Raja Muthiah Nagar, Annamalai Nagar, Chidambaram, Tamil Nadu',
    nationality: 'Indian',
    emergencyContact: { name: 'Kumaravel S.', relationship: 'Father', phone: '+91 98409 66778' },
    reasonForVisit: 'Persistent high fever, wheezing, and productive cough',
    diagnosis: 'Bronchopneumonia with moderate respiratory distress',
    status: 'ADMITTED',
    currentWardId: 'w-ped',
    currentWardName: 'Paediatric Ward',
    currentBedId: 'b-ped-001',
    currentBedNumber: 'PED-001',
    doctorId: 'DOC-05',
    doctorName: 'Dr. Priya Lakshmi',
    admissionDate: '2026-09-09T11:00:00.000Z',
    expectedDischargeDate: '2026-09-13T10:00:00.000Z',
    depositAmount: 8000,
    totalBilled: 12500,
    totalPaid: 8000,
    outstandingBalance: 4500,
    qrToken: 'MEDTRACK_P1006_SECURE_AUTH_V1',
    createdAt: '2026-09-09T10:45:00.000Z',
  },
  {
    id: 'P1007',
    name: 'Senthilkumar P.',
    tamilName: 'செந்தில்குமார்',
    age: 49,
    dob: '1977-12-05',
    gender: 'Male',
    phone: '+91 94435 44332',
    bloodGroup: 'O+ Positive',
    address: '104, South Rampart, Cuddalore Port, Tamil Nadu',
    nationality: 'Indian',
    emergencyContact: { name: 'Malathi Senthil', relationship: 'Spouse', phone: '+91 94435 44333' },
    reasonForVisit: 'Severe palpitations, syncope on exertion, dyspnea',
    diagnosis: 'Complete Atrioventricular Heart Block (Post-MI)',
    status: 'ADMITTED',
    currentWardId: 'w-card',
    currentWardName: 'Cardiology Ward',
    currentBedId: 'b-card-001',
    currentBedNumber: 'CARD-001',
    doctorId: 'DOC-04',
    doctorName: 'Dr. Aravind Kumar',
    admissionDate: '2026-09-06T16:00:00.000Z',
    expectedDischargeDate: '2026-09-12T16:00:00.000Z',
    depositAmount: 30000,
    totalBilled: 48000,
    totalPaid: 30000,
    outstandingBalance: 18000,
    qrToken: 'MEDTRACK_P1007_SECURE_AUTH_V1',
    createdAt: '2026-09-06T15:30:00.000Z',
  },
  {
    id: 'P1008',
    name: 'Prabhakaran G.',
    tamilName: 'பிரபாகரன்',
    age: 58,
    dob: '1968-05-18',
    gender: 'Male',
    phone: '+91 97880 12345',
    bloodGroup: 'A+ Positive',
    address: '19, Sannathi Street, Sirkazhi, Tamil Nadu',
    nationality: 'Indian',
    emergencyContact: { name: 'Vijayakumar P.', relationship: 'Brother', phone: '+91 97880 12346' },
    reasonForVisit: 'Acute severe epigastric pain radiating to back',
    diagnosis: 'Acute Necrotizing Pancreatitis with localized effusion',
    status: 'ADMITTED',
    currentWardId: 'w-em',
    currentWardName: 'Emergency Ward',
    currentBedId: 'b-em-001',
    currentBedNumber: 'EM-001',
    doctorId: 'DOC-03',
    doctorName: 'Dr. R. Pradeep',
    admissionDate: '2026-09-10T02:15:00.000Z',
    expectedDischargeDate: '2026-09-15T11:00:00.000Z',
    depositAmount: 18000,
    totalBilled: 23500,
    totalPaid: 18000,
    outstandingBalance: 5500,
    qrToken: 'MEDTRACK_P1008_SECURE_AUTH_V1',
    createdAt: '2026-09-10T01:50:00.000Z',
  },
  {
    id: 'P1009',
    name: 'Kavitha Ranganathan',
    tamilName: 'கவிதா ரங்கநாதன்',
    age: 34,
    dob: '1992-06-15',
    gender: 'Female',
    phone: '+91 98412 34567',
    bloodGroup: 'B+ Positive',
    address: '28, South Street, Vadalur, Tamil Nadu',
    nationality: 'Indian',
    emergencyContact: { name: 'Ranganathan V.', relationship: 'Spouse', phone: '+91 98412 34568' },
    reasonForVisit: 'Gestational diabetes evaluation & antenatal fetal heartbeat monitoring',
    diagnosis: 'Gestational Diabetes Mellitus (GDM) at 34 weeks gestation',
    status: 'ADMITTED',
    currentWardId: 'w-mat',
    currentWardName: 'Maternity & Obstetrics Ward',
    currentBedId: 'b-mat-002',
    currentBedNumber: 'MAT-002',
    doctorId: 'DOC-07',
    doctorName: 'Dr. Kavitha Raj',
    admissionDate: '2026-09-10T07:20:00.000Z',
    expectedDischargeDate: '2026-09-13T12:00:00.000Z',
    depositAmount: 15000,
    totalBilled: 21000,
    totalPaid: 15000,
    outstandingBalance: 6000,
    qrToken: 'MEDTRACK_P1009_SECURE_AUTH_V1',
    createdAt: '2026-09-10T06:50:00.000Z',
  },
  {
    id: 'P1010',
    name: 'Ganesan Palanivel',
    tamilName: 'கணேசன் பழனிவேல்',
    age: 67,
    dob: '1959-11-03',
    gender: 'Male',
    phone: '+91 94421 98765',
    bloodGroup: 'O+ Positive',
    address: '8, Sivan Kovil Street, Bhuvanagiri, Tamil Nadu',
    nationality: 'Indian',
    emergencyContact: { name: 'Palanivel G.', relationship: 'Son', phone: '+91 94421 98766' },
    reasonForVisit: 'Post-percutaneous transluminal coronary angioplasty rhythm monitoring',
    diagnosis: 'Post-PTCA Stenting Status with Ventricular Ectopics under telemetry',
    status: 'ADMITTED',
    currentWardId: 'w-card',
    currentWardName: 'Cardiology Ward',
    currentBedId: 'b-card-002',
    currentBedNumber: 'CARD-002',
    doctorId: 'DOC-04',
    doctorName: 'Dr. Aravind Kumar',
    admissionDate: '2026-09-09T14:15:00.000Z',
    expectedDischargeDate: '2026-09-13T10:00:00.000Z',
    depositAmount: 25000,
    totalBilled: 38000,
    totalPaid: 25000,
    outstandingBalance: 13000,
    qrToken: 'MEDTRACK_P1010_SECURE_AUTH_V1',
    createdAt: '2026-09-09T13:40:00.000Z',
  },
  {
    id: 'P1011',
    name: 'Master Anirudh S.',
    tamilName: 'அனிருத்',
    age: 8,
    dob: '2018-03-22',
    gender: 'Male',
    phone: '+91 98842 55667',
    bloodGroup: 'A+ Positive',
    address: '14, College Road, Annamalai Nagar, Chidambaram, Tamil Nadu',
    nationality: 'Indian',
    emergencyContact: { name: 'Srinivasan K.', relationship: 'Father', phone: '+91 98842 55667' },
    reasonForVisit: 'High pyrexia, persistent wheezing cough, and decreased oral intake',
    diagnosis: 'Acute Viral Bronchiolitis with Mild Reactive Airway Disease',
    status: 'ADMITTED',
    currentWardId: 'w-ped',
    currentWardName: 'Paediatric Ward',
    currentBedId: 'b-ped-002',
    currentBedNumber: 'PED-002',
    doctorId: 'DOC-05',
    doctorName: 'Dr. Priya Lakshmi',
    admissionDate: '2026-09-10T08:00:00.000Z',
    expectedDischargeDate: '2026-09-13T16:00:00.000Z',
    depositAmount: 10000,
    totalBilled: 16500,
    totalPaid: 10000,
    outstandingBalance: 6500,
    qrToken: 'MEDTRACK_P1011_SECURE_AUTH_V1',
    createdAt: '2026-09-10T07:30:00.000Z',
  },
  {
    id: 'P1012',
    name: 'Subramanian Natarajan',
    tamilName: 'சுப்பிரமணியன் நடராஜன்',
    age: 58,
    dob: '1968-09-10',
    gender: 'Male',
    phone: '+91 97901 23489',
    bloodGroup: 'AB+ Positive',
    address: '52, Bazaar Street, Neyveli, Tamil Nadu',
    nationality: 'Indian',
    emergencyContact: { name: 'Natarajan S.', relationship: 'Brother', phone: '+91 97901 23490' },
    reasonForVisit: 'Bilateral pedal edema, elevated serum creatinine, and fatigue',
    diagnosis: 'Chronic Kidney Disease Stage 4 with Hyperkalemia (under hemodialysis evaluation)',
    status: 'ADMITTED',
    currentWardId: 'w-neph',
    currentWardName: 'Nephrology Ward',
    currentBedId: 'b-neph-002',
    currentBedNumber: 'NEPH-002',
    doctorId: 'DOC-03',
    doctorName: 'Dr. R. Pradeep',
    admissionDate: '2026-09-09T18:30:00.000Z',
    expectedDischargeDate: '2026-09-14T11:00:00.000Z',
    depositAmount: 20000,
    totalBilled: 32000,
    totalPaid: 20000,
    outstandingBalance: 12000,
    qrToken: 'MEDTRACK_P1012_SECURE_AUTH_V1',
    createdAt: '2026-09-09T18:00:00.000Z',
  },
  {
    id: 'P1013',
    name: 'Lakshmi Narayanan',
    tamilName: 'லட்சுமி நாராயணன்',
    age: 48,
    dob: '1978-01-20',
    gender: 'Female',
    phone: '+91 98409 87612',
    bloodGroup: 'B+ Positive',
    address: '101, Main Road, Kurinjipadi, Tamil Nadu',
    nationality: 'Indian',
    emergencyContact: { name: 'Narayanan M.', relationship: 'Spouse', phone: '+91 98409 87613' },
    reasonForVisit: 'Uncontrolled Type 2 Diabetes with right neuropathic plantar ulcer',
    diagnosis: 'T2DM with Diabetic Foot Ulcer (Wagner Grade 2) - Admission Recommended',
    status: 'REGISTERED',
    depositAmount: 0,
    totalBilled: 0,
    totalPaid: 0,
    outstandingBalance: 0,
    qrToken: 'MEDTRACK_P1013_SECURE_AUTH_V1',
    createdAt: '2026-09-10T09:10:00.000Z',
  },
  {
    id: 'P1014',
    name: 'Deepak Balaji',
    tamilName: 'தீபக் பாலாஜி',
    age: 29,
    dob: '1997-07-14',
    gender: 'Male',
    phone: '+91 97899 44332',
    bloodGroup: 'O+ Positive',
    address: '7, Railway Feeder Road, Cuddalore Old Town, Tamil Nadu',
    nationality: 'Indian',
    emergencyContact: { name: 'Balaji K.', relationship: 'Father', phone: '+91 97899 44333' },
    reasonForVisit: 'Frequent watery diarrhea, vomiting, severe cramping and dehydration',
    diagnosis: 'Acute Gastroenteritis with Moderate Dehydration - Triage for IV Rehydration Bed',
    status: 'REGISTERED',
    depositAmount: 0,
    totalBilled: 0,
    totalPaid: 0,
    outstandingBalance: 0,
    qrToken: 'MEDTRACK_P1014_SECURE_AUTH_V1',
    createdAt: '2026-09-10T09:45:00.000Z',
  },
  {
    id: 'P1015',
    name: 'Rajeshwari Ramanathan',
    tamilName: 'ராஜேஸ்வரி',
    age: 52,
    dob: '1974-12-05',
    gender: 'Female',
    phone: '+91 94435 66778',
    bloodGroup: 'A+ Positive',
    address: '33, North Car Street, Chidambaram, Tamil Nadu',
    nationality: 'Indian',
    emergencyContact: { name: 'Ramanathan T.', relationship: 'Spouse', phone: '+91 94435 66779' },
    reasonForVisit: 'Acute flare of bilateral knee osteoarthritis and inability to weight-bear',
    diagnosis: 'Severe Bilateral Knee Osteoarthritis with Synovial Effusion - Planned Inpatient Care',
    status: 'REGISTERED',
    depositAmount: 0,
    totalBilled: 0,
    totalPaid: 0,
    outstandingBalance: 0,
    qrToken: 'MEDTRACK_P1015_SECURE_AUTH_V1',
    createdAt: '2026-09-10T10:00:00.000Z',
  }
];

// Helper to generate beds matching exact total of 320 beds across departments
export const generateInitialBeds = (): Bed[] => {
  const beds: Bed[] = [];
  
  // 1. General Medicine (120 beds: GM-001 to GM-120)
  for (let i = 1; i <= 120; i++) {
    const num = `GM-${String(i).padStart(3, '0')}`;
    let status: Bed['status'] = 'OCCUPIED';
    let patientId: string | undefined = undefined;
    let patientName: string | undefined = undefined;

    if (i === 1) {
      status = 'OCCUPIED';
      patientId = 'P1003';
      patientName = 'Karthikeyan V.';
    } else if (i >= 97 && i <= 116) {
      status = 'AVAILABLE';
    } else if (i === 117 || i === 118 || i === 119) {
      status = 'CLEANING_REQUIRED';
    } else if (i === 120) {
      status = 'MAINTENANCE';
    } else {
      status = 'OCCUPIED';
      patientName = `Patient GM-${i}`;
    }

    beds.push({
      id: `b-gm-${String(i).padStart(3, '0')}`,
      number: num,
      wardId: 'w-gm',
      wardName: 'General Medicine Ward',
      department: 'General Medicine',
      floor: 1,
      status,
      patientId,
      patientName,
      doctorId: 'DOC-02',
      doctorName: 'Dr. S. Karthikeyan',
      notes: status === 'MAINTENANCE' ? 'Bed elevation hydraulic pump repair' : undefined
    });
  }

  // 2. ICU (20 beds: ICU-001 to ICU-020: 18 Occupied, 2 Available)
  for (let i = 1; i <= 20; i++) {
    const num = `ICU-${String(i).padStart(3, '0')}`;
    let status: Bed['status'] = 'OCCUPIED';
    let patientId: string | undefined = undefined;
    let patientName: string | undefined = undefined;

    if (i === 1) {
      patientId = 'P1001';
      patientName = 'Arunkumar S.';
    } else if (i === 2) {
      patientId = 'P1002';
      patientName = 'Meenakshi Sundaram';
    } else if (i === 19 || i === 20) {
      status = 'AVAILABLE';
    } else {
      patientName = `ICU Critical Patient ${i}`;
    }

    beds.push({
      id: `b-icu-${String(i).padStart(3, '0')}`,
      number: num,
      wardId: 'w-icu',
      wardName: 'ICU – Intensive Care Unit',
      department: 'Critical Care',
      floor: 2,
      status,
      patientId,
      patientName,
      doctorId: 'DOC-03',
      doctorName: 'Dr. R. Pradeep'
    });
  }

  // 3. Emergency (40 beds: EM-001 to EM-040)
  for (let i = 1; i <= 40; i++) {
    const num = `EM-${String(i).padStart(3, '0')}`;
    let status: Bed['status'] = 'OCCUPIED';
    let patientId: string | undefined = undefined;
    let patientName: string | undefined = undefined;

    if (i === 1) {
      patientId = 'P1008';
      patientName = 'Prabhakaran G.';
    } else if (i >= 33 && i <= 38) {
      status = 'AVAILABLE';
    } else if (i === 39) {
      status = 'CLEANING_REQUIRED';
    } else if (i === 40) {
      status = 'MAINTENANCE';
    } else {
      patientName = `Emergency Patient ${i}`;
    }

    beds.push({
      id: `b-em-${String(i).padStart(3, '0')}`,
      number: num,
      wardId: 'w-em',
      wardName: 'Emergency Ward',
      department: 'Emergency Medicine',
      floor: 1,
      status,
      patientId,
      patientName,
      doctorId: 'DOC-03',
      doctorName: 'Dr. R. Pradeep'
    });
  }

  // 4. Cardiology (30 beds: CARD-001 to CARD-030)
  for (let i = 1; i <= 30; i++) {
    const num = `CARD-${String(i).padStart(3, '0')}`;
    let status: Bed['status'] = 'OCCUPIED';
    let patientId: string | undefined = undefined;
    let patientName: string | undefined = undefined;

    if (i === 1) {
      patientId = 'P1007';
      patientName = 'Senthilkumar P.';
    } else if (i === 2) {
      patientId = 'P1010';
      patientName = 'Ganesan Palanivel';
    } else if (i >= 25 && i <= 29) {
      status = 'AVAILABLE';
    } else if (i === 30) {
      status = 'CLEANING_REQUIRED';
    } else {
      patientName = `Cardiac Patient ${i}`;
    }

    beds.push({
      id: `b-card-${String(i).padStart(3, '0')}`,
      number: num,
      wardId: 'w-card',
      wardName: 'Cardiology Ward',
      department: 'Cardiology',
      floor: 3,
      status,
      patientId,
      patientName,
      doctorId: 'DOC-04',
      doctorName: 'Dr. Aravind Kumar'
    });
  }

  // 5. Neurology (15 beds: NEURO-001 to NEURO-015)
  for (let i = 1; i <= 15; i++) {
    const num = `NEURO-${String(i).padStart(3, '0')}`;
    const status: Bed['status'] = i > 12 ? 'AVAILABLE' : 'OCCUPIED';
    beds.push({
      id: `b-neuro-${String(i).padStart(3, '0')}`,
      number: num,
      wardId: 'w-neuro',
      wardName: 'Neurology Ward',
      department: 'Neurology',
      floor: 3,
      status,
      patientName: status === 'OCCUPIED' ? `Neuro Patient ${i}` : undefined,
      doctorId: 'DOC-06',
      doctorName: 'Dr. Meenakshi Sundaram'
    });
  }

  // 6. Orthopaedics (20 beds: ORTHO-001 to ORTHO-020)
  for (let i = 1; i <= 20; i++) {
    const num = `ORTHO-${String(i).padStart(3, '0')}`;
    let status: Bed['status'] = 'OCCUPIED';
    let patientId: string | undefined = undefined;
    let patientName: string | undefined = undefined;

    if (i === 1) {
      patientId = 'P1005';
      patientName = 'Saravanan M.';
    } else if (i >= 17) {
      status = 'AVAILABLE';
    } else {
      patientName = `Ortho Patient ${i}`;
    }

    beds.push({
      id: `b-ortho-${String(i).padStart(3, '0')}`,
      number: num,
      wardId: 'w-ortho',
      wardName: 'Orthopaedics Ward',
      department: 'Orthopaedics',
      floor: 2,
      status,
      patientId,
      patientName,
      doctorId: 'DOC-08',
      doctorName: 'Dr. Deepa Shankar'
    });
  }

  // 7. Maternity & Obstetrics (15 beds: MAT-001 to MAT-015)
  for (let i = 1; i <= 15; i++) {
    const num = `MAT-${String(i).padStart(3, '0')}`;
    let status: Bed['status'] = 'OCCUPIED';
    let patientId: string | undefined = undefined;
    let patientName: string | undefined = undefined;

    if (i === 1) {
      patientId = 'P1004';
      patientName = 'Nandhini R.';
    } else if (i === 2) {
      patientId = 'P1009';
      patientName = 'Kavitha Ranganathan';
    } else if (i === 12 || i === 13 || i === 14) {
      status = 'AVAILABLE';
    } else if (i === 15) {
      status = 'CLEANING_REQUIRED';
    } else {
      patientName = `Maternity Patient ${i}`;
    }

    beds.push({
      id: `b-mat-${String(i).padStart(3, '0')}`,
      number: num,
      wardId: 'w-mat',
      wardName: 'Maternity & Obstetrics Ward',
      department: 'Obstetrics',
      floor: 4,
      status,
      patientId,
      patientName,
      doctorId: 'DOC-07',
      doctorName: 'Dr. Kavitha Raj'
    });
  }

  // 8. Paediatric Ward (15 beds: PED-001 to PED-015)
  for (let i = 1; i <= 15; i++) {
    const num = `PED-${String(i).padStart(3, '0')}`;
    let status: Bed['status'] = 'OCCUPIED';
    let patientId: string | undefined = undefined;
    let patientName: string | undefined = undefined;

    if (i === 1) {
      patientId = 'P1006';
      patientName = 'Harini K. (Child)';
    } else if (i === 2) {
      patientId = 'P1011';
      patientName = 'Master Anirudh S.';
    } else if (i >= 13) {
      status = 'AVAILABLE';
    } else {
      patientName = `Pediatric Patient ${i}`;
    }

    beds.push({
      id: `b-ped-${String(i).padStart(3, '0')}`,
      number: num,
      wardId: 'w-ped',
      wardName: 'Paediatric Ward',
      department: 'Paediatrics',
      floor: 4,
      status,
      patientId,
      patientName,
      doctorId: 'DOC-05',
      doctorName: 'Dr. Priya Lakshmi'
    });
  }

  // 9. NICU (10 beds: NICU-001 to NICU-010)
  for (let i = 1; i <= 10; i++) {
    const num = `NICU-${String(i).padStart(3, '0')}`;
    const status: Bed['status'] = i >= 9 ? 'AVAILABLE' : 'OCCUPIED';
    beds.push({
      id: `b-nicu-${String(i).padStart(3, '0')}`,
      number: num,
      wardId: 'w-nicu',
      wardName: 'Neonatal ICU (NICU)',
      department: 'Neonatology',
      floor: 4,
      status,
      patientName: status === 'OCCUPIED' ? `Neonate ${i}` : undefined,
      doctorId: 'DOC-05',
      doctorName: 'Dr. Priya Lakshmi'
    });
  }

  // 10. General Surgery (10 beds)
  for (let i = 1; i <= 10; i++) {
    const num = `GS-${String(i).padStart(3, '0')}`;
    const status: Bed['status'] = i >= 9 ? 'AVAILABLE' : 'OCCUPIED';
    beds.push({
      id: `b-gs-${String(i).padStart(3, '0')}`,
      number: num,
      wardId: 'w-gs',
      wardName: 'General Surgery Ward',
      department: 'General Surgery',
      floor: 2,
      status,
      patientName: status === 'OCCUPIED' ? `Surgery Patient ${i}` : undefined,
      doctorId: 'DOC-02',
      doctorName: 'Dr. S. Karthikeyan'
    });
  }

  // 11. Nephrology (6 beds)
  for (let i = 1; i <= 6; i++) {
    const num = `NEPH-${String(i).padStart(3, '0')}`;
    const status: Bed['status'] = i >= 5 ? 'AVAILABLE' : 'OCCUPIED';
    beds.push({
      id: `b-neph-${String(i).padStart(3, '0')}`,
      number: num,
      wardId: 'w-neph',
      wardName: 'Nephrology Ward',
      department: 'Nephrology',
      floor: 3,
      status,
      patientId: i === 2 ? 'P1012' : undefined,
      patientName: i === 2 ? 'Subramanian Natarajan' : (status === 'OCCUPIED' ? `Nephrology Patient ${i}` : undefined),
      doctorId: 'DOC-03',
      doctorName: 'Dr. R. Pradeep'
    });
  }

  // 12. Oncology (6 beds)
  for (let i = 1; i <= 6; i++) {
    const num = `ONCO-${String(i).padStart(3, '0')}`;
    const status: Bed['status'] = i >= 5 ? 'AVAILABLE' : 'OCCUPIED';
    beds.push({
      id: `b-onco-${String(i).padStart(3, '0')}`,
      number: num,
      wardId: 'w-onco',
      wardName: 'Oncology Ward',
      department: 'Oncology',
      floor: 5,
      status,
      patientName: status === 'OCCUPIED' ? `Oncology Patient ${i}` : undefined,
      doctorId: 'DOC-02',
      doctorName: 'Dr. S. Karthikeyan'
    });
  }

  // 13. Respiratory (8 beds)
  for (let i = 1; i <= 8; i++) {
    const num = `RESP-${String(i).padStart(3, '0')}`;
    const status: Bed['status'] = i >= 7 ? 'AVAILABLE' : 'OCCUPIED';
    beds.push({
      id: `b-resp-${String(i).padStart(3, '0')}`,
      number: num,
      wardId: 'w-resp',
      wardName: 'Respiratory Medicine Ward',
      department: 'Pulmonology',
      floor: 2,
      status,
      patientName: status === 'OCCUPIED' ? `Pulmonary Patient ${i}` : undefined,
      doctorId: 'DOC-04',
      doctorName: 'Dr. Aravind Kumar'
    });
  }

  // 14. Gastroenterology (5 beds)
  for (let i = 1; i <= 5; i++) {
    const num = `GASTRO-${String(i).padStart(3, '0')}`;
    const status: Bed['status'] = i >= 5 ? 'AVAILABLE' : 'OCCUPIED';
    beds.push({
      id: `b-gastro-${String(i).padStart(3, '0')}`,
      number: num,
      wardId: 'w-gastro',
      wardName: 'Gastroenterology Ward',
      department: 'Gastroenterology',
      floor: 3,
      status,
      patientName: status === 'OCCUPIED' ? `Gastro Patient ${i}` : undefined,
      doctorId: 'DOC-08',
      doctorName: 'Dr. Deepa Shankar'
    });
  }

  return beds;
};

export const INITIAL_BEDS = generateInitialBeds();

export const INITIAL_ADMISSIONS: Admission[] = [
  {
    id: 'ADM-2026-001',
    patientId: 'P1001',
    patientName: 'Arunkumar S.',
    wardId: 'w-icu',
    wardName: 'ICU – Intensive Care Unit',
    bedId: 'b-icu-001',
    bedNumber: 'ICU-001',
    doctorId: 'DOC-03',
    doctorName: 'Dr. R. Pradeep',
    admissionDate: '2026-09-08T09:30:00.000Z',
    expectedStayDays: 6,
    expectedDischargeDate: '2026-09-14T11:00:00.000Z',
    deposit: 20000,
    admissionNotes: 'Emergency admission for cardiac monitoring and enzyme panel.',
    diagnosis: 'Acute Coronary Syndrome / NSTEMI with Grade II HTN',
    status: 'ACTIVE'
  },
  {
    id: 'ADM-2026-002',
    patientId: 'P1002',
    patientName: 'Meenakshi Sundaram',
    wardId: 'w-icu',
    wardName: 'ICU – Intensive Care Unit',
    bedId: 'b-icu-002',
    bedNumber: 'ICU-002',
    doctorId: 'DOC-06',
    doctorName: 'Dr. Meenakshi Sundaram',
    admissionDate: '2026-09-09T03:15:00.000Z',
    expectedStayDays: 7,
    expectedDischargeDate: '2026-09-16T14:00:00.000Z',
    deposit: 25000,
    admissionNotes: 'Admitted for acute neuro-critical management post thrombolysis.',
    diagnosis: 'Acute Ischemic Stroke (Right MCA territory)',
    status: 'ACTIVE'
  },
  {
    id: 'ADM-2026-003',
    patientId: 'P1003',
    patientName: 'Karthikeyan V.',
    wardId: 'w-gm',
    wardName: 'General Medicine Ward',
    bedId: 'b-gm-001',
    bedNumber: 'GM-001',
    doctorId: 'DOC-02',
    doctorName: 'Dr. S. Karthikeyan',
    admissionDate: '2026-09-07T14:20:00.000Z',
    expectedStayDays: 5,
    expectedDischargeDate: '2026-09-12T10:00:00.000Z',
    deposit: 10000,
    admissionNotes: 'IV fluid resuscitation and platelet count monitoring.',
    diagnosis: 'Acute Febrile Illness / Dengue Fever with Thrombocytopenia',
    status: 'ACTIVE'
  },
  {
    id: 'ADM-2026-004',
    patientId: 'P1004',
    patientName: 'Nandhini R.',
    wardId: 'w-mat',
    wardName: 'Maternity & Obstetrics Ward',
    bedId: 'b-mat-001',
    bedNumber: 'MAT-001',
    doctorId: 'DOC-07',
    doctorName: 'Dr. Kavitha Raj',
    admissionDate: '2026-09-10T05:40:00.000Z',
    expectedStayDays: 3,
    expectedDischargeDate: '2026-09-13T12:00:00.000Z',
    deposit: 15000,
    admissionNotes: 'Planned normal delivery under fetal cardiotocography monitoring.',
    diagnosis: 'Primigravida at 39 weeks gestation in active labor',
    status: 'ACTIVE'
  }
];

export const INITIAL_TRANSFERS: Transfer[] = [
  {
    id: 'TRF-901',
    patientId: 'P1001',
    patientName: 'Arunkumar S.',
    fromWardId: 'w-em',
    fromWardName: 'Emergency Ward',
    fromBedId: 'b-em-005',
    fromBedNumber: 'EM-005',
    toWardId: 'w-icu',
    toWardName: 'ICU – Intensive Care Unit',
    toBedId: 'b-icu-001',
    toBedNumber: 'ICU-001',
    doctorId: 'DOC-03',
    doctorName: 'Dr. R. Pradeep',
    transferType: 'EMERGENCY_ICU',
    reason: 'Dynamic ST-segment elevation on telemetry requiring immediate arterial line monitoring and inotrope support.',
    status: 'COMPLETED',
    timestamp: '2026-09-08T11:45:00.000Z',
    notes: 'Moved with portable monitor under resuscitation team supervision.'
  },
  {
    id: 'TRF-902',
    patientId: 'P1002',
    patientName: 'Meenakshi Sundaram',
    fromWardId: 'w-em',
    fromWardName: 'Emergency Ward',
    fromBedId: 'b-em-008',
    fromBedNumber: 'EM-008',
    toWardId: 'w-icu',
    toWardName: 'ICU – Intensive Care Unit',
    toBedId: 'b-icu-002',
    toBedNumber: 'ICU-002',
    doctorId: 'DOC-06',
    doctorName: 'Dr. Meenakshi Sundaram',
    transferType: 'EMERGENCY_ICU',
    reason: 'Post-tPA infusion airway vigilance and frequent Glasgow Coma Scale scoring.',
    status: 'COMPLETED',
    timestamp: '2026-09-09T05:20:00.000Z',
    notes: 'Transferred smoothly, neuro-nursing team engaged.'
  },
  {
    id: 'TRF-903',
    patientId: 'P1005',
    patientName: 'Saravanan M.',
    fromWardId: 'w-em',
    fromWardName: 'Emergency Ward',
    fromBedId: 'b-em-012',
    fromBedNumber: 'EM-012',
    toWardId: 'w-ortho',
    toWardName: 'Orthopaedics Ward',
    toBedId: 'b-ortho-001',
    toBedNumber: 'ORTHO-001',
    doctorId: 'DOC-08',
    doctorName: 'Dr. Deepa Shankar',
    transferType: 'STEP_DOWN',
    reason: 'Stabilized in emergency department; transferred to surgical ward for pre-op Thomas splinting.',
    status: 'COMPLETED',
    timestamp: '2026-09-08T20:30:00.000Z',
    notes: 'Pre-operative clearance obtained.'
  }
];

export const INITIAL_DISCHARGES: DischargeRecord[] = [
  {
    id: 'DISC-701',
    patientId: 'P1011',
    patientName: 'Balamurugan K.',
    bedId: 'b-gm-025',
    bedNumber: 'GM-025',
    wardId: 'w-gm',
    wardName: 'General Medicine Ward',
    doctorId: 'DOC-02',
    doctorName: 'Dr. S. Karthikeyan',
    dischargeDate: '2026-09-07T14:30:00.000Z',
    dischargeSummary: 'Resolved acute gastroenteritis with electrolyte repletion. Clinically afebrile for 48 hours.',
    prescriptions: 'Oral rehydration salts, Tab. Ciprofloxacin 500mg BD x 3 days, Tab. Probiotics OD.',
    followUpDate: '2026-09-15',
    clearedBilling: true
  },
  {
    id: 'DISC-702',
    patientId: 'P1012',
    patientName: 'Revathi S.',
    bedId: 'b-mat-004',
    bedNumber: 'MAT-004',
    wardId: 'w-mat',
    wardName: 'Maternity & Obstetrics Ward',
    doctorId: 'DOC-07',
    doctorName: 'Dr. Kavitha Raj',
    dischargeDate: '2026-09-08T11:00:00.000Z',
    dischargeSummary: 'Uncomplicated full-term spontaneous vaginal delivery. Neonate healthy, active suckling established.',
    prescriptions: 'Tab. Iron & Folic Acid OD x 30 days, Tab. Calcium 500mg BD x 30 days.',
    followUpDate: '2026-09-22',
    clearedBilling: true
  }
];

export const INITIAL_DIAGNOSTIC_REQUESTS: DiagnosticRequest[] = [
  {
    id: 'REQ-XR-801',
    patientId: 'P1001',
    patientName: 'Arunkumar S.',
    admissionId: 'ADM-2026-001',
    doctorId: 'DOC-03',
    doctorName: 'Dr. R. Pradeep',
    scanType: 'XRAY',
    requestedDate: '2026-09-08T10:00:00.000Z',
    scheduledDate: '2026-09-08T10:30:00.000Z',
    completedDate: '2026-09-08T10:50:00.000Z',
    priority: 'STAT',
    clinicalReason: 'Evaluate cardiothoracic ratio, pulmonary vascular congestion and baseline cardiac silhouette.',
    assignedRoomId: 'R-XRAY-01',
    assignedRoomName: 'X-Ray Room 01 (Digital DR)',
    assignedEquipment: 'Siemens Multix Impact Digital',
    status: 'REPORTED',
    cost: 850,
    reportId: 'REP-XR-101'
  },
  {
    id: 'REQ-XR-802',
    patientId: 'P1006',
    patientName: 'Harini K. (Child)',
    admissionId: 'ADM-2026-006',
    doctorId: 'DOC-05',
    doctorName: 'Dr. Priya Lakshmi',
    scanType: 'XRAY',
    requestedDate: '2026-09-10T08:15:00.000Z',
    scheduledDate: '2026-09-10T09:00:00.000Z',
    priority: 'URGENT',
    clinicalReason: 'Chest X-Ray AP view for childhood bronchopneumonia consolidation.',
    assignedRoomId: 'R-XRAY-02',
    assignedRoomName: 'X-Ray Room 02 (Emergency Fluoroscopy)',
    assignedEquipment: 'GE Healthcare Definium 646 HD',
    status: 'IN_PROGRESS',
    cost: 850
  },
  {
    id: 'REQ-CT-804',
    patientId: 'P1002',
    patientName: 'Meenakshi Sundaram',
    admissionId: 'ADM-2026-002',
    doctorId: 'DOC-06',
    doctorName: 'Dr. Meenakshi Sundaram',
    scanType: 'CT_SCAN',
    requestedDate: '2026-09-09T03:30:00.000Z',
    scheduledDate: '2026-09-09T03:45:00.000Z',
    completedDate: '2026-09-09T04:10:00.000Z',
    priority: 'STAT',
    clinicalReason: 'Non-contrast brain computed tomography to rule out intracranial hemorrhage.',
    assignedRoomId: 'R-CT-01',
    assignedRoomName: 'CT Scan Room 01 (128 Slice)',
    assignedEquipment: 'GE Revolution EVO 128-Slice',
    status: 'REPORTED',
    cost: 4200,
    reportId: 'REP-CT-201'
  },
  {
    id: 'REQ-MR-805',
    patientId: 'P1002',
    patientName: 'Meenakshi Sundaram',
    admissionId: 'ADM-2026-002',
    doctorId: 'DOC-06',
    doctorName: 'Dr. Meenakshi Sundaram',
    scanType: 'MRI_SCAN',
    requestedDate: '2026-09-10T09:00:00.000Z',
    scheduledDate: '2026-09-10T11:30:00.000Z',
    priority: 'ROUTINE',
    clinicalReason: 'Brain MRI with Diffusion Weighted Imaging (DWI) and MR Angiogram of circle of Willis.',
    assignedRoomId: 'R-MRI-01',
    assignedRoomName: 'MRI Scan Room 01 (3.0 Tesla Silent)',
    assignedEquipment: 'Philips Ingenia 3.0T Wide Bore',
    status: 'SCHEDULED',
    cost: 8500
  }
];

export const INITIAL_DIAGNOSTIC_REPORTS: DiagnosticReport[] = [
  {
    id: 'REP-XR-101',
    requestId: 'REQ-XR-801',
    patientId: 'P1001',
    patientName: 'Arunkumar S.',
    doctorId: 'DOC-03',
    doctorName: 'Dr. R. Pradeep',
    scanType: 'XRAY',
    findings: 'Lungs show clear lung fields with normal broncho-vascular markings. No focal airspace consolidation, pleural effusion, or pneumothorax identified. Cardiac size is borderline enlarged with mild left ventricular prominence. Trachea is midline. Bony thorax intact.',
    impression: '1. Borderline cardiomegaly consistent with chronic hypertensive heart disease.\n2. No acute pulmonary edema or focal parenchymal pathology.',
    radiologistName: 'Dr. K. Swaminathan, MD (Radiodiagnosis)',
    reportDate: '2026-09-08T11:15:00.000Z',
    status: 'FINAL',
    recommendations: 'Correlation with 2D Echocardiogram and serum BNP recommended.'
  },
  {
    id: 'REP-CT-201',
    requestId: 'REQ-CT-804',
    patientId: 'P1002',
    patientName: 'Meenakshi Sundaram',
    doctorId: 'DOC-06',
    doctorName: 'Dr. Meenakshi Sundaram',
    scanType: 'CT_SCAN',
    findings: 'Axial non-contrast CT brain demonstrates loss of gray-white matter differentiation in the right insular ribbon and lentiform nucleus (early ischemic changes). No acute hyperdense vessel sign or acute parenchymal/subarachnoid hemorrhage. Ventricles and basal cisterns are symmetric.',
    impression: '1. Early acute infarct in right MCA territory (Alberta Stroke Program Early CT Score: 8/10).\n2. Absolute exclusion of intracranial hemorrhage, suitable for acute stroke protocol maintenance.',
    radiologistName: 'Dr. K. Swaminathan, MD (Radiodiagnosis)',
    reportDate: '2026-09-09T04:30:00.000Z',
    status: 'FINAL',
    recommendations: 'Follow up MRI brain DWI in 24 hours to delineate ischemic core.'
  }
];

export const INITIAL_PAYMENTS: Payment[] = [
  {
    id: 'PAY-1001',
    patientId: 'P1001',
    patientName: 'Arunkumar S.',
    admissionId: 'ADM-2026-001',
    amount: 20000,
    method: 'UPI',
    transactionRef: 'UPI/260908129844/HDFC',
    date: '2026-09-08T09:35:00.000Z',
    receiver: 'Frontdesk Cashier 01 (M. Vignesh)',
    type: 'DEPOSIT',
    status: 'PAID',
    notes: 'Initial emergency admission security deposit received via GooglePay.'
  },
  {
    id: 'PAY-1002',
    patientId: 'P1002',
    patientName: 'Meenakshi Sundaram',
    admissionId: 'ADM-2026-002',
    amount: 25000,
    method: 'CARD',
    transactionRef: 'POS/SBI/99824401',
    date: '2026-09-09T03:20:00.000Z',
    receiver: 'Emergency Desk (S. Divya)',
    type: 'DEPOSIT',
    status: 'PAID',
    notes: 'Credit Card swipe for neuro-ICU package deposit.'
  },
  {
    id: 'PAY-1003',
    patientId: 'P1003',
    patientName: 'Karthikeyan V.',
    admissionId: 'ADM-2026-003',
    amount: 10000,
    method: 'CASH',
    transactionRef: 'CASH/RCP-88401',
    date: '2026-09-07T14:25:00.000Z',
    receiver: 'Main Cashier (K. Ramesh)',
    type: 'DEPOSIT',
    status: 'PAID',
    notes: 'Direct cash deposit received against General Medicine bed.'
  },
  {
    id: 'PAY-1004',
    patientId: 'P1004',
    patientName: 'Nandhini R.',
    admissionId: 'ADM-2026-004',
    amount: 15000,
    method: 'UPI',
    transactionRef: 'UPI/260910058812/ICICI',
    date: '2026-09-10T05:45:00.000Z',
    receiver: 'Frontdesk Cashier 01 (M. Vignesh)',
    type: 'DEPOSIT',
    status: 'PAID',
    notes: 'Maternity admission advance payment.'
  },
  {
    id: 'PAY-1005',
    patientId: 'P1005',
    patientName: 'Saravanan M.',
    admissionId: 'ADM-2026-005',
    amount: 25000,
    method: 'UPI',
    transactionRef: 'UPI/260908183301/PAYTM',
    date: '2026-09-08T18:15:00.000Z',
    receiver: 'Emergency Desk (S. Divya)',
    type: 'DEPOSIT',
    status: 'PAID',
    notes: 'Orthopaedic trauma surgery advance.'
  },
  {
    id: 'PAY-1006',
    patientId: 'P1007',
    patientName: 'Senthilkumar P.',
    amount: 30000,
    method: 'CARD',
    transactionRef: 'POS/HDFC/554901',
    date: '2026-09-06T16:10:00.000Z',
    receiver: 'Main Cashier (K. Ramesh)',
    type: 'DEPOSIT',
    status: 'PAID',
    notes: 'Card authorization for cardiology telemetry.'
  }
];

export const INITIAL_CLEANING_LOGS: CleaningLog[] = [
  {
    id: 'CLN-101',
    bedId: 'b-gm-117',
    bedNumber: 'GM-117',
    wardName: 'General Medicine Ward',
    previousPatient: 'Muruganandam P. (Discharged)',
    staffName: 'Murugan (Sanitation)',
    startTime: '2026-09-10T08:00:00.000Z',
    status: 'CLEANING_IN_PROGRESS',
    notes: 'Terminal disinfection with hydrogen peroxide fogging in progress.'
  },
  {
    id: 'CLN-102',
    bedId: 'b-em-039',
    bedNumber: 'EM-039',
    wardName: 'Emergency Ward',
    previousPatient: 'Dinesh Kumar (Transferred)',
    staffName: 'Kuppan S.',
    startTime: '2026-09-10T08:30:00.000Z',
    status: 'CLEANING_IN_PROGRESS',
    notes: 'Mattress sanitization and linen replacement.'
  },
  {
    id: 'CLN-103',
    bedId: 'b-card-030',
    bedNumber: 'CARD-030',
    wardName: 'Cardiology Ward',
    previousPatient: 'Sivakumar R.',
    staffName: 'Anandhi M.',
    startTime: '2026-09-10T07:15:00.000Z',
    completionTime: '2026-09-10T07:45:00.000Z',
    status: 'COMPLETED',
    notes: 'Deep cleaned, sanitization certificate signed, bed made ready for new patient.'
  },
  {
    id: 'CLN-104',
    bedId: 'b-icu-019',
    bedNumber: 'ICU-019',
    wardName: 'ICU – Intensive Care Unit',
    previousPatient: 'S. Rajagopalan',
    staffName: 'Selvi M. (Nurse In-Charge)',
    startTime: '2026-09-09T22:00:00.000Z',
    completionTime: '2026-09-09T22:50:00.000Z',
    status: 'COMPLETED',
    notes: 'ICU terminal high-level wipe down completed.'
  }
];

export const INITIAL_VITALS: VitalsRecord[] = [
  {
    id: 'VIT-101',
    patientId: 'P1001',
    patientName: 'Arunkumar S.',
    temperature: 98.4,
    bpSystolic: 138,
    bpDiastolic: 86,
    heartRate: 76,
    spO2: 98,
    respiratoryRate: 16,
    weight: 74,
    notes: 'Hemodynamically stable on low-dose aspirin and beta blocker.',
    recordedBy: 'Selvi M. (RN)',
    timestamp: '2026-09-10T08:00:00.000Z'
  },
  {
    id: 'VIT-102',
    patientId: 'P1002',
    patientName: 'Meenakshi Sundaram',
    temperature: 98.8,
    bpSystolic: 142,
    bpDiastolic: 90,
    heartRate: 82,
    spO2: 97,
    respiratoryRate: 18,
    weight: 68,
    notes: 'GCS 14/15 (E4V4M6). Left upper extremity motor strength improved to 3/5.',
    recordedBy: 'Selvi M. (RN)',
    timestamp: '2026-09-10T08:15:00.000Z'
  },
  {
    id: 'VIT-103',
    patientId: 'P1003',
    patientName: 'Karthikeyan V.',
    temperature: 99.2,
    bpSystolic: 118,
    bpDiastolic: 74,
    heartRate: 88,
    spO2: 99,
    respiratoryRate: 16,
    weight: 70,
    notes: 'Hydration adequate. Platelets count on morning lab: 68,000/mcL (up from 45,000).',
    recordedBy: 'Sudha K. (RN)',
    timestamp: '2026-09-10T07:45:00.000Z'
  }
];

export const INITIAL_TREATMENT_NOTES: TreatmentNote[] = [
  {
    id: 'NOTE-101',
    patientId: 'P1001',
    patientName: 'Arunkumar S.',
    doctorId: 'DOC-03',
    doctorName: 'Dr. R. Pradeep',
    diagnosis: 'Acute Coronary Syndrome / NSTEMI with Grade II HTN',
    treatmentPlan: 'Tab. Ticagrelor 90mg BD, Tab. Aspirin 75mg OD, Inj. Enoxaparin 60mg SC BD, Tab. Atorvastatin 80mg HS.',
    doctorInstructions: 'Continuous telemetry. Strict bed rest. 2D Echo scheduled for tomorrow 11 AM.',
    followUp: 'Check Trop-I repeat at 24 hours. Step down to Cardiology Ward once cardiac biomarkers plateau.',
    notes: 'Patient feels comfortable; no active chest pain reported overnight.',
    timestamp: '2026-09-09T18:00:00.000Z'
  },
  {
    id: 'NOTE-102',
    patientId: 'P1002',
    patientName: 'Meenakshi Sundaram',
    doctorId: 'DOC-06',
    doctorName: 'Dr. Meenakshi Sundaram',
    diagnosis: 'Acute Ischemic Stroke (Right MCA territory)',
    treatmentPlan: 'Tab. Aspirin 150mg + Clopidogrel 75mg, Neuro-protective agents, gentle physiotherapy from Day 3.',
    doctorInstructions: 'Maintain BP between 140-160 mmHg systolic. Avoid aggressive hypotensive therapy.',
    followUp: 'MRI Brain review on Friday morning.',
    notes: 'Speech fluency recovering gradually.',
    timestamp: '2026-09-09T19:30:00.000Z'
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'NOTIF-01',
    title: 'ICU High Occupancy Alert',
    message: 'ICU occupancy reached 90% (18/20 beds). Only 2 beds currently available for emergency trauma.',
    type: 'CRITICAL',
    category: 'CAPACITY',
    timestamp: '10 mins ago',
    read: false,
    linkTab: 'Beds'
  },
  {
    id: 'NOTIF-02',
    title: 'Emergency Admission Registered',
    message: 'Patient Prabhakaran G. admitted to Emergency Ward Bed EM-001 by Dr. R. Pradeep.',
    type: 'INFO',
    category: 'BED',
    timestamp: '35 mins ago',
    read: false,
    linkTab: 'Admissions'
  },
  {
    id: 'NOTIF-03',
    title: 'CT Scan Completed',
    message: '128-Slice CT Scan report published for Patient Meenakshi Sundaram (P1002).',
    type: 'SUCCESS',
    category: 'DIAGNOSTIC',
    timestamp: '1 hour ago',
    read: true,
    linkTab: 'Diagnostics'
  },
  {
    id: 'NOTIF-04',
    title: 'Bed Cleaning Completed',
    message: 'Cardiology Bed CARD-030 deep cleaning completed and restored to AVAILABLE.',
    type: 'SUCCESS',
    category: 'BED',
    timestamp: '2 hours ago',
    read: true,
    linkTab: 'Bed Cleaning'
  },
  {
    id: 'NOTIF-05',
    title: 'Payment Received',
    message: '₹ 15,000 received via UPI for Patient Nandhini R. (Maternity Ward).',
    type: 'INFO',
    category: 'PAYMENT',
    timestamp: '3 hours ago',
    read: true,
    linkTab: 'Billing'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'AUD-901',
    user: 'Dr. Govindharaj M.',
    role: 'ADMIN',
    action: 'SYSTEM_CONFIG_UPDATED',
    entity: 'HospitalSettings',
    entityId: 'CONFIG-TAMILNADU-01',
    timestamp: '2026-09-10T09:15:00.000Z',
    metadata: { note: 'Verified MedTrack Tamil Nadu multi-speciality bed rules and zero waiting list integrity.' }
  },
  {
    id: 'AUD-902',
    user: 'Receptionist M. Vignesh',
    role: 'RECEPTIONIST',
    action: 'PATIENT_ADMITTED',
    entity: 'Patient',
    entityId: 'P1004',
    timestamp: '2026-09-10T05:40:00.000Z',
    metadata: { bedAssigned: 'MAT-001', deposit: 15000, paymentMethod: 'UPI' }
  },
  {
    id: 'AUD-903',
    user: 'Dr. R. Pradeep',
    role: 'DOCTOR',
    action: 'TRANSFER_CONFIRMED',
    entity: 'Transfer',
    entityId: 'TRF-901',
    timestamp: '2026-09-08T11:45:00.000Z',
    metadata: { fromBed: 'EM-005', toBed: 'ICU-001', reason: 'Cardiac instability' }
  },
  {
    id: 'AUD-904',
    user: 'Nurse Selvi M.',
    role: 'NURSE',
    action: 'CLEANING_COMPLETED',
    entity: 'Bed',
    entityId: 'b-icu-019',
    timestamp: '2026-09-09T22:50:00.000Z',
    metadata: { previousBedStatus: 'CLEANING_IN_PROGRESS', newBedStatus: 'AVAILABLE' }
  },
  {
    id: 'AUD-905',
    user: 'Dr. K. Swaminathan',
    role: 'DOCTOR',
    action: 'DIAGNOSTIC_REPORT_CREATED',
    entity: 'DiagnosticReport',
    entityId: 'REP-CT-201',
    timestamp: '2026-09-09T04:30:00.000Z',
    metadata: { scanType: 'CT_SCAN', patientId: 'P1002' }
  }
];

// Historical data for accurate 7-Day & 30-Day forecasting algorithms
export const HISTORICAL_7_DAYS = [
  { day: 'Mon', date: '04 Sep', admissions: 10, discharges: 6, totalOccupancy: 232, revenue: 165000 },
  { day: 'Tue', date: '05 Sep', admissions: 16, discharges: 10, totalOccupancy: 238, revenue: 182000 },
  { day: 'Wed', date: '06 Sep', admissions: 19, discharges: 12, totalOccupancy: 245, revenue: 194000 },
  { day: 'Thu', date: '07 Sep', admissions: 22, discharges: 18, totalOccupancy: 249, revenue: 210000 },
  { day: 'Fri', date: '08 Sep', admissions: 19, discharges: 13, totalOccupancy: 255, revenue: 188000 },
  { day: 'Sat', date: '09 Sep', admissions: 25, discharges: 19, totalOccupancy: 261, revenue: 235000 },
  { day: 'Sun', date: '10 Sep (Today)', admissions: 25, discharges: 19, totalOccupancy: 246, revenue: 248000 },
];
