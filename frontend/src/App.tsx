import React from 'react';
import { HospitalProvider, useHospital } from './context/HospitalContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { LoginPage } from './pages/LoginPage';

import { AdminDashboard } from './dashboards/AdminDashboard';
import { DoctorDashboard } from './dashboards/DoctorDashboard';
import { NurseDashboard } from './dashboards/NurseDashboard';
import { ReceptionistDashboard } from './dashboards/ReceptionistDashboard';

import { BedsPage } from './pages/BedsPage';
import { PatientsPage } from './pages/PatientsPage';
import { AdmissionsPage } from './pages/AdmissionsPage';
import { TransfersPage } from './pages/TransfersPage';
import { DiagnosticsPage } from './pages/DiagnosticsPage';
import { BedCleaningPage } from './pages/BedCleaningPage';
import { BillingPage } from './pages/BillingPage';
import { DischargePage } from './pages/DischargePage';
import { ForecastPage } from './pages/ForecastPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { ReportsPage } from './pages/ReportsPage';
import { AuditLogsPage } from './pages/AuditLogsPage';
import { SettingsPage } from './pages/SettingsPage';
import { WardsPage } from './pages/WardsPage';
import { DoctorsPage } from './pages/DoctorsPage';

const MainContent: React.FC = () => {
  const { activeTab, currentRole, isAuthenticated } = useHospital();

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'Dashboard':
        if (currentRole === 'DOCTOR') return <DoctorDashboard />;
        if (currentRole === 'NURSE') return <NurseDashboard />;
        if (currentRole === 'RECEPTIONIST') return <ReceptionistDashboard />;
        return <AdminDashboard />;

      case 'Patients':
        return <PatientsPage />;

      case 'Admissions':
        return <AdmissionsPage />;

      case 'Beds':
        return <BedsPage />;

      case 'Wards':
        return <WardsPage />;

      case 'Doctors':
        return <DoctorsPage />;

      case 'Transfers':
        return <TransfersPage />;

      case 'Diagnostics':
        return <DiagnosticsPage />;

      case 'Billing':
        return <BillingPage />;

      case 'Discharges':
        return <DischargePage />;

      case 'Bed Cleaning':
        return <BedCleaningPage />;

      case 'Forecast':
        return <ForecastPage />;

      case 'Analytics':
        return <AnalyticsPage />;

      case 'Reports':
        return <ReportsPage />;

      case 'Notifications':
      case 'Audit Logs':
        return <AuditLogsPage />;

      case 'Settings':
        return <SettingsPage />;

      default:
        if (currentRole === 'DOCTOR') return <DoctorDashboard />;
        if (currentRole === 'NURSE') return <NurseDashboard />;
        if (currentRole === 'RECEPTIONIST') return <ReceptionistDashboard />;
        return <AdminDashboard />;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 font-sans text-slate-800 antialiased selection:bg-blue-600 selection:text-white">
      {/* Dark Sidebar matching screenshot */}
      <Sidebar />

      {/* Main App Content Viewport */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export function App() {
  return (
    <HospitalProvider>
      <MainContent />
    </HospitalProvider>
  );
}

export default App;
