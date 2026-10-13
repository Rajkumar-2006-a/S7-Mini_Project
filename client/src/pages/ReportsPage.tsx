import React, { useState } from 'react';
import {
  FileText,
  Download,
  Printer,
  Calendar,
  Filter,
  CheckCircle2,
  Table,
  Building2
} from 'lucide-react';
import { useHospital } from '../context/HospitalContext';

export const ReportsPage: React.FC = () => {
  const { patients, admissions, discharges, payments, transfers, wards } = useHospital();
  const [reportType, setReportType] = useState('OCCUPANCY');

  const handleExportCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';

    if (reportType === 'OCCUPANCY') {
      csvContent += 'Ward Code,Ward Name,Total Beds,Occupied Beds,Available Beds,Occupancy Rate (%)\n';
      wards.forEach(w => {
        csvContent += `${w.code},"${w.name}",${w.totalBeds},${w.occupiedBeds},${w.availableBeds},${w.occupancyRate}\n`;
      });
    } else if (reportType === 'ADMISSIONS') {
      csvContent += 'Admission ID,Patient Name,Ward,Bed Number,Doctor,Deposit,Admission Date\n';
      admissions.forEach(a => {
        csvContent += `${a.id},"${a.patientName}","${a.wardName}",${a.bedNumber},"${a.doctorName}",${a.deposit},${a.admissionDate}\n`;
      });
    } else {
      csvContent += 'Receipt ID,Patient Name,Type,Amount,Method,Timestamp\n';
      payments.forEach(p => {
        csvContent += `${p.id},"${p.patientName}",${p.type},${p.amount},${p.method},${p.timestamp}\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `MedTrack_${reportType}_Report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <FileText className="w-7 h-7 text-blue-600" />
            <span>Hospital Operational & Regulatory Reports</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Generate and export NABH-compliant hospital occupancy, financial ledger, and patient census reports.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Report Selection Tabs */}
      <div className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-slate-100 shadow-xs">
        <button
          onClick={() => setReportType('OCCUPANCY')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
            reportType === 'OCCUPANCY' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Ward Bed Occupancy Census
        </button>
        <button
          onClick={() => setReportType('ADMISSIONS')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
            reportType === 'ADMISSIONS' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Admissions & Discharge Ledger
        </button>
        <button
          onClick={() => setReportType('FINANCIAL')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
            reportType === 'FINANCIAL' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Revenue & Billing Collections
        </button>
      </div>

      {/* Report Data Table Preview */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-sm text-slate-900">
              {reportType === 'OCCUPANCY'
                ? 'Ward Bed Census & Capacity Breakdown'
                : reportType === 'ADMISSIONS'
                ? 'Patient In-Flow / Out-Flow Log'
                : 'Hospital Revenue & Payment Receipts'}
            </h3>
            <p className="text-xs text-slate-400">Generated on {new Date().toLocaleDateString('en-GB')}</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          {reportType === 'OCCUPANCY' && (
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50/80 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-100">
                <tr>
                  <th className="py-3 px-4">Ward Code</th>
                  <th className="py-3 px-4">Ward Name</th>
                  <th className="py-3 px-4">Floor</th>
                  <th className="py-3 px-4">Total Beds</th>
                  <th className="py-3 px-4">Occupied</th>
                  <th className="py-3 px-4">Available</th>
                  <th className="py-3 px-4">Occupancy Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {wards.map(w => (
                  <tr key={w.id} className="hover:bg-slate-50/70">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">{w.code}</td>
                    <td className="py-3 px-4 font-bold text-slate-800">{w.name}</td>
                    <td className="py-3 px-4">Floor {w.floor}</td>
                    <td className="py-3 px-4">{w.totalBeds}</td>
                    <td className="py-3 px-4 font-semibold text-blue-600">{w.occupiedBeds}</td>
                    <td className="py-3 px-4 font-semibold text-emerald-600">{w.availableBeds}</td>
                    <td className="py-3 px-4 font-extrabold">{w.occupancyRate}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {reportType === 'ADMISSIONS' && (
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50/80 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-100">
                <tr>
                  <th className="py-3 px-4">ID</th>
                  <th className="py-3 px-4">Patient Name</th>
                  <th className="py-3 px-4">Ward / Bed</th>
                  <th className="py-3 px-4">Attending Doctor</th>
                  <th className="py-3 px-4">Deposit</th>
                  <th className="py-3 px-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {admissions.map(a => (
                  <tr key={a.id} className="hover:bg-slate-50/70">
                    <td className="py-3 px-4 font-mono text-slate-500">{a.id}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">{a.patientName}</td>
                    <td className="py-3 px-4">{a.wardName} - {a.bedNumber}</td>
                    <td className="py-3 px-4 font-semibold">{a.doctorName}</td>
                    <td className="py-3 px-4 font-bold text-emerald-600">₹ {a.deposit.toLocaleString('en-IN')}</td>
                    <td className="py-3 px-4">{new Date(a.admissionDate).toLocaleDateString('en-GB')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {reportType === 'FINANCIAL' && (
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50/80 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-100">
                <tr>
                  <th className="py-3 px-4">Receipt ID</th>
                  <th className="py-3 px-4">Patient</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Method</th>
                  <th className="py-3 px-4">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {payments.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50/70">
                    <td className="py-3 px-4 font-mono text-slate-500">{p.id}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">{p.patientName}</td>
                    <td className="py-3 px-4">{p.type}</td>
                    <td className="py-3 px-4 font-extrabold text-emerald-600">₹ {p.amount.toLocaleString('en-IN')}</td>
                    <td className="py-3 px-4 font-bold">{p.method}</td>
                    <td className="py-3 px-4 text-slate-400">{new Date(p.timestamp).toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
