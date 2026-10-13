import React, { useState } from 'react';
import {
  ShieldCheck,
  Search,
  Filter,
  Clock,
  User,
  Activity,
  Layers,
  CheckCircle2
} from 'lucide-react';
import { useHospital } from '../context/HospitalContext';

export const AuditLogsPage: React.FC = () => {
  const { auditLogs } = useHospital();
  const [filterAction, setFilterAction] = useState('ALL');
  const [search, setSearch] = useState('');

  const filteredLogs = auditLogs.filter(log => {
    if (filterAction !== 'ALL' && log.action !== filterAction) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchDetails = log.details.toLowerCase().includes(q);
      const matchActor = log.actorName.toLowerCase().includes(q);
      const matchEntity = log.entityId.toLowerCase().includes(q);
      if (!matchDetails && !matchActor && !matchEntity) return false;
    }
    return true;
  });

  const getActionColor = (action: string) => {
    switch (action) {
      case 'ADMISSION':
        return 'bg-blue-100 text-blue-800';
      case 'DISCHARGE':
        return 'bg-rose-100 text-rose-800';
      case 'TRANSFER':
        return 'bg-purple-100 text-purple-800';
      case 'CLEANING_STARTED':
      case 'CLEANING_COMPLETED':
        return 'bg-orange-100 text-orange-800';
      case 'PAYMENT_RECEIVED':
        return 'bg-emerald-100 text-emerald-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
          <ShieldCheck className="w-7 h-7 text-emerald-600" />
          <span>System Security & Operational Audit Trail</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Chronological, tamper-evident activity ledger logging all bed changes, clinical actions, and administrative overrides.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search audit trail by actor, patient ID, bed..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white"
            />
          </div>
        </div>

        <select
          value={filterAction}
          onChange={e => setFilterAction(e.target.value)}
          className="text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none"
        >
          <option value="ALL">All Event Types</option>
          <option value="ADMISSION">ADMISSION</option>
          <option value="TRANSFER">TRANSFER</option>
          <option value="DISCHARGE">DISCHARGE</option>
          <option value="CLEANING_STARTED">CLEANING STARTED</option>
          <option value="CLEANING_COMPLETED">CLEANING COMPLETED</option>
          <option value="PAYMENT_RECEIVED">PAYMENT RECEIVED</option>
          <option value="DIAGNOSTIC_ORDERED">DIAGNOSTIC ORDERED</option>
        </select>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50/80 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-3 px-4">Event ID</th>
                <th className="py-3 px-4">Action Type</th>
                <th className="py-3 px-4">Actor</th>
                <th className="py-3 px-4">Entity ID</th>
                <th className="py-3 px-4">Audit Description</th>
                <th className="py-3 px-4 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredLogs.map(log => (
                <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400">{log.id}</td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md uppercase ${getActionColor(log.action)}`}>
                      {log.action.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    {log.actorName}
                    <span className="text-[10px] text-slate-400 block font-normal">{log.actorRole}</span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-700">{log.entityId}</td>
                  <td className="py-3.5 px-4 text-slate-700">{log.details}</td>
                  <td className="py-3.5 px-4 text-right text-slate-400 font-mono text-[11px]">
                    {new Date(log.timestamp).toLocaleString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
