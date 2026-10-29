import React, { useState } from 'react';
import {
  CreditCard,
  CheckCircle2,
  DollarSign,
  QrCode,
  Receipt,
  User,
  Search,
  Plus,
  ArrowRight,
  Printer
} from 'lucide-react';
import { useHospital } from '../context/HospitalContext';
import { Patient, Payment, PaymentMethod } from '../types';

export const BillingPage: React.FC = () => {
  const { patients, payments, recordPayment } = useHospital();

  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [payAmount, setPayAmount] = useState(5000);
  const [payMethod, setPayMethod] = useState<PaymentMethod>('UPI');
  const [notes, setNotes] = useState('Interim in-patient fee payment.');
  const [successMsg, setSuccessMsg] = useState('');
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  const totalCollected = payments.reduce((acc, p) => acc + p.amount, 0);
  const selectedPatient = patients.find(p => p.id === selectedPatientId);

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatientId || payAmount <= 0) return;

    recordPayment({
      patientId: selectedPatientId,
      amount: Number(payAmount),
      method: payMethod,
      type: 'IN_PATIENT_BILL',
      notes: notes.trim()
    });

    setSuccessMsg(`Payment of ₹ ${payAmount.toLocaleString('en-IN')} via ${payMethod} recorded successfully!`);
    setPayAmount(5000);
    setTimeout(() => setSuccessMsg(''), 5000);
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
          <CreditCard className="w-7 h-7 text-emerald-600" />
          <span>Billing, Payments & Accounts Ledger</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Collect patient deposits, intermediate room tariffs, radiology charges, and settle discharge invoices in Indian Rupees (₹).
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-4.5 border border-slate-100 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Total Revenue Collected (Month)</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900">₹ {totalCollected.toLocaleString('en-IN')}</span>
            <span className="text-xs font-bold text-emerald-600">↑ 18%</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Across all 14 hospital wards</p>
        </div>

        <div className="bg-white rounded-2xl p-4.5 border border-slate-100 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Total Outstanding Receivables</span>
          <div className="mt-2">
            <span className="text-2xl font-extrabold text-rose-600">
              ₹ {patients.reduce((acc, p) => acc + p.outstandingBalance, 0).toLocaleString('en-IN')}
            </span>
            <p className="text-[11px] text-rose-500 font-medium mt-1">Unsettled active in-patient bills</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4.5 border border-slate-100 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">UPI / Digital Adoption</span>
          <div className="mt-2">
            <span className="text-2xl font-extrabold text-indigo-600">74%</span>
            <p className="text-[11px] text-indigo-600 font-medium mt-1">Instant GPay / PhonePe / Cards</p>
          </div>
        </div>
      </div>

      {/* Payment Processing Form */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-xs">
        <h3 className="font-extrabold text-sm text-slate-900 mb-4 flex items-center gap-2">
          <Plus className="w-4 h-4 text-emerald-600" />
          <span>Collect Patient Payment (Cash / UPI / Card)</span>
        </h3>

        <form onSubmit={handlePayment} className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Select Patient *</label>
            <select
              required
              value={selectedPatientId}
              onChange={e => setSelectedPatientId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none"
            >
              <option value="">-- Choose Patient --</option>
              {patients.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.id}) - Due: ₹ {p.outstandingBalance.toLocaleString('en-IN')}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Amount to Pay (₹ INR) *</label>
            <input
              type="number"
              step="500"
              required
              value={payAmount}
              onChange={e => setPayAmount(Number(e.target.value))}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Payment Method</label>
            <select
              value={payMethod}
              onChange={e => setPayMethod(e.target.value as PaymentMethod)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none"
            >
              <option value="UPI">UPI / GPay / PhonePe</option>
              <option value="CARD">Credit / Debit Card</option>
              <option value="CASH">Cash</option>
              <option value="INSURANCE">TPA / Insurance</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              disabled={!selectedPatientId}
              className={`w-full py-2.5 rounded-xl text-xs font-extrabold text-white shadow-md transition-all flex items-center justify-center gap-1.5 ${
                !selectedPatientId ? 'bg-slate-300 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Record & Issue Receipt</span>
            </button>
          </div>
        </form>

        {successMsg && (
          <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}
      </div>

      {/* Transaction History Ledger */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-900">Hospital Payment Ledger & Receipts</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50/80 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-3 px-4">Receipt ID</th>
                <th className="py-3 px-4">Patient Name</th>
                <th className="py-3 px-4">Payment Category</th>
                <th className="py-3 px-4">Amount Paid</th>
                <th className="py-3 px-4">Mode</th>
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {payments.map(p => (
                <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">
                    <button
                      type="button"
                      onClick={() => setSelectedPayment(p)}
                      className="font-mono text-[11px] text-emerald-700 hover:text-emerald-900 font-bold underline-offset-2 hover:underline transition-colors"
                      title="View payment details"
                    >
                      {p.id}
                    </button>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">{p.patientName}</td>
                  <td className="py-3.5 px-4">{p.type.replace('_', ' ')}</td>
                  <td className="py-3.5 px-4 font-extrabold text-emerald-700">₹ {p.amount.toLocaleString('en-IN')}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 bg-slate-100 font-bold text-[10px] rounded-md">{p.method}</span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-400">{new Date(p.timestamp).toLocaleString('en-IN')}</td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => {
                        setSuccessMsg(`Receipt #${p.id} for ₹ ${p.amount.toLocaleString('en-IN')} sent to billing printer.`);
                        setTimeout(() => setSuccessMsg(''), 4000);
                      }}
                      className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-all flex items-center gap-1 inline-flex"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedPayment && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900">{selectedPayment.id}</h3>
                <p className="text-xs text-slate-500 mt-1">{selectedPayment.patientName}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPayment(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center text-lg leading-none"
                title="Close payment details"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Patient</span>
                <p className="mt-1 font-extrabold text-slate-900">{selectedPayment.patientName}</p>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block">Amount</span>
                <p className="mt-1 font-extrabold text-emerald-800">₹ {selectedPayment.amount.toLocaleString('en-IN')}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Method</span>
                <p className="mt-1 font-bold text-slate-900">{selectedPayment.method}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Status</span>
                <p className="mt-1 font-bold text-emerald-700">{selectedPayment.status}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 sm:col-span-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Category</span>
                <p className="mt-1 font-bold text-slate-900">{selectedPayment.type.replace(/_/g, ' ')}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 sm:col-span-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Transaction Ref</span>
                <p className="mt-1 font-mono text-slate-900">{selectedPayment.transactionRef}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 sm:col-span-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Receipt Issued To</span>
                <p className="mt-1 font-bold text-slate-900">{selectedPayment.receiver}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 sm:col-span-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Date & Time</span>
                <p className="mt-1 font-bold text-slate-900">{new Date(selectedPayment.date).toLocaleString('en-IN')}</p>
              </div>

              {selectedPayment.notes && (
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 sm:col-span-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Notes</span>
                  <p className="mt-1 text-slate-800 leading-relaxed">{selectedPayment.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
