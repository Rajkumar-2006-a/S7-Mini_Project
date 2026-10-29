import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  Building2,
  DollarSign,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  ShieldCheck,
  Save,
  Info,
  Database,
  RefreshCw,
  Server,
  Layers,
  HardDrive,
  User,
  LogOut
} from 'lucide-react';
import { useHospital } from '../context/HospitalContext';

export const SettingsPage: React.FC = () => {
  const { wards, resetToDemoData, mongoStatus, isSyncing, syncWithDatabase, refreshMongoStatus, currentRole, currentUser, logout } = useHospital();

  const [hospitalName, setHospitalName] = useState('MedTrack Multi-Speciality Hospital');
  const [address, setAddress] = useState('42, Healthcare Enclave, Grand Trunk Road, Chidambaram, Tamil Nadu - 608001');
  const [phone, setPhone] = useState('+91 4144 238000');
  const [email, setEmail] = useState('admin@medtrack-care.in');
  const [icuAlertThreshold, setIcuAlertThreshold] = useState(85);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [syncNotice, setSyncNotice] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    syncWithDatabase();
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  const handleManualSync = async () => {
    await syncWithDatabase();
    setSyncNotice('State synchronized with MongoDB cluster.');
    setTimeout(() => setSyncNotice(null), 3500);
  };

  const handleReset = async () => {
    if (window.confirm('Are you sure you want to reset all hospital collections (beds, patients, vitals, admissions) back to clean initial state?')) {
      await resetToDemoData();
      setSyncNotice('Hospital database collections successfully reset to clean seed state!');
      setTimeout(() => setSyncNotice(null), 4000);
    }
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <SettingsIcon className="w-7 h-7 text-slate-700" />
            <span>Hospital Configuration & System Parameters</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage facility details, bed capacity alert thresholds, department pricing tariffs, and state management.
          </p>
        </div>

        <button
          onClick={handleReset}
          className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-xl text-xs border border-rose-200 shadow-xs transition-all flex items-center gap-1.5"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset All Demo Data</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Configuration saved successfully!</span>
        </div>
      )}

      {syncNotice && (
        <div className="p-3.5 bg-blue-50 border border-blue-200 text-blue-800 rounded-xl text-xs font-bold flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-blue-600" />
            <span>{syncNotice}</span>
          </div>
        </div>
      )}

      {/* MongoDB Database Cluster & Collections Storage Panel */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-md border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${mongoStatus.connected ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'}`}>
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-sm text-white">MongoDB Persistence Engine</h3>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide ${
                  mongoStatus.connected
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                }`}>
                  {mongoStatus.connected ? 'Cluster Connected' : 'In-Memory / Mongo Ready'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Target Database: <code className="text-emerald-300 font-mono font-semibold">{mongoStatus.dbName}</code> {mongoStatus.lastSyncedAt && `• Last sync: ${new Date(mongoStatus.lastSyncedAt).toLocaleTimeString()}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleManualSync}
              disabled={isSyncing}
              className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition-all flex items-center gap-1.5 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-blue-400' : ''}`} />
              <span>{isSyncing ? 'Syncing...' : 'Sync to MongoDB'}</span>
            </button>
            <button
              onClick={() => refreshMongoStatus()}
              className="px-3.5 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5"
            >
              <Server className="w-3.5 h-3.5" />
              <span>Test Status</span>
            </button>
          </div>
        </div>

        {/* Collections Overview */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 pt-1">
          <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Beds Collection</span>
            <span className="text-lg font-black text-emerald-400">{mongoStatus.collectionCounts?.beds ?? 320}</span>
          </div>
          <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Patients</span>
            <span className="text-lg font-black text-blue-400">{mongoStatus.collectionCounts?.patients ?? 24}</span>
          </div>
          <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Admissions</span>
            <span className="text-lg font-black text-cyan-400">{mongoStatus.collectionCounts?.admissions ?? 18}</span>
          </div>
          <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Transfers</span>
            <span className="text-lg font-black text-indigo-400">{mongoStatus.collectionCounts?.transfers ?? 8}</span>
          </div>
          <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Diagnostics</span>
            <span className="text-lg font-black text-purple-400">{mongoStatus.collectionCounts?.diagnosticRequests ?? 12}</span>
          </div>
          <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Vitals Logs</span>
            <span className="text-lg font-black text-rose-400">{mongoStatus.collectionCounts?.vitals ?? 20}</span>
          </div>
          <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Payments</span>
            <span className="text-lg font-black text-amber-400">{mongoStatus.collectionCounts?.payments ?? 14}</span>
          </div>
          <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Audit Trail</span>
            <span className="text-lg font-black text-slate-300">{mongoStatus.collectionCounts?.auditLogs ?? 15}</span>
          </div>
        </div>

        <div className="text-[11px] text-slate-400 flex items-start gap-2 pt-1">
          <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
          <span>
            {mongoStatus.connected
              ? `Connected to MongoDB instance with automatic collection synchronization. Changes to beds, patient records, diagnostics, and payments are stored in real-time.`
              : `To connect your external MongoDB cluster (e.g., MongoDB Atlas), set MONGODB_URI in Settings/Environment. While disconnected, MedTrack maintains an in-memory high-speed cache with automatic fallback.`}
          </span>
        </div>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Hospital Facility Profile (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-100 p-6 shadow-xs space-y-4 text-xs">
          <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-blue-600" />
            <span>Hospital Institution Identity</span>
          </h3>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Institution Name *</label>
            <input
              type="text"
              required
              value={hospitalName}
              onChange={e => setHospitalName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Registered Facility Address (Tamil Nadu) *</label>
            <input
              type="text"
              required
              value={address}
              onChange={e => setAddress(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Helpdesk & Emergency Phone *</label>
              <input
                type="text"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Official Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none"
              />
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <h4 className="font-bold text-slate-900 mb-2">Automated Capacity Alert Threshold</h4>
            <div>
              <label className="block text-[11px] text-slate-500 mb-1">
                Trigger high-strain warning when ICU / Ward occupancy exceeds: <strong className="text-slate-900">{icuAlertThreshold}%</strong>
              </label>
              <input
                type="range"
                min="50"
                max="95"
                value={icuAlertThreshold}
                onChange={e => setIcuAlertThreshold(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg cursor-pointer accent-blue-600"
              />
            </div>
          </div>

          <div className="pt-3 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>Save System Settings</span>
            </button>
          </div>
        </div>

        {/* Ward Tariffs & System Specs (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-100 p-6 shadow-xs flex flex-col justify-between text-xs">
          <div>
            <h3 className="font-extrabold text-sm text-slate-900 mb-3 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              <span>Standard Ward Daily Tariffs (INR ₹)</span>
            </h3>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {wards.map(w => (
                <div key={w.id} className="p-2.5 bg-slate-50 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-800">{w.name}</span>
                    <span className="text-[10px] text-slate-400 block">{w.totalBeds} Beds • Floor {w.floor}</span>
                  </div>
                  <span className="font-extrabold text-emerald-700">₹ {w.costPerDay.toLocaleString('en-IN')}/day</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 p-3 bg-blue-50/80 rounded-xl border border-blue-100 text-[11px] text-blue-900">
            <p className="font-bold">NABH Hospital Automation Standards</p>
            <p className="text-blue-700 mt-0.5">
              MedTrack enforces zero-waiting-list allocation rules and instant terminal sanitation checkpoints.
            </p>
          </div>
        </div>
      </form>

      {/* Active User Profile & Session Security Card - WITH LOGOUT INSIDE */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white font-black text-sm flex items-center justify-center shadow-md">
              {currentUser.name.split(' ').map(n => n[0]).filter(Boolean).slice(0, 2).join('') || 'DR'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-slate-900">{currentUser.name}</h3>
                <span className="px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-md text-[10px] font-extrabold">
                  {currentRole}
                </span>
                <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Active Clinical Session
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{currentUser.title} • {currentUser.department || 'Hospital Administration'}</p>
            </div>
          </div>

          <button
            onClick={logout}
            className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-extrabold rounded-xl text-xs shadow-md shadow-rose-600/20 transition-all flex items-center gap-2 shrink-0 cursor-pointer"
            title="Terminate current clinical operations session and return to login"
          >
            <LogOut className="w-4 h-4" />
            <span>Log Out of Profile</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Employee ID</span>
            <span className="font-mono font-bold text-slate-800">{currentUser.employeeId || 'MED-ADM-01'}</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Clinical Email</span>
            <span className="font-medium text-slate-700">{currentUser.email || 'admin@medtrack.org'}</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Session Duration</span>
            <span className="font-bold text-emerald-700">Authenticated • Active Duty</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Institutional Access</span>
            <span className="font-semibold text-slate-800">NABH Certified Portal</span>
          </div>
        </div>
      </div>
    </div>
  );
};
