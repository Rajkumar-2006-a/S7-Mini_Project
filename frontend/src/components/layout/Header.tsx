import React, { useState, useEffect } from 'react';
import {
  Search,
  Bell,
  CheckCircle2,
  AlertTriangle,
  Info,
  Clock,
  LogOut,
  Sparkles,
  User,
  ShieldCheck,
  ChevronDown,
  Building2,
  FileText,
  X,
  ExternalLink,
  Lock,
  Phone,
  Mail,
  Calendar,
  KeyRound
} from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';
import { UserRole } from '../../types';

export const Header: React.FC = () => {
  const {
    currentRole,
    logout,
    notifications,
    markNotificationRead,
    clearAllNotifications,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    patients,
    beds,
    doctors
  } = useHospital();

  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const unreadNotifications = notifications.filter(n => !n.read);

  // Search matches
  const matchedPatients = searchQuery.trim()
    ? patients.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.id.toLowerCase().includes(searchQuery.toLowerCase()) || p.phone.includes(searchQuery))
    : [];

  const matchedBeds = searchQuery.trim()
    ? beds.filter(b => b.number.toLowerCase().includes(searchQuery.toLowerCase()) || b.wardName.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  const matchedDoctors = searchQuery.trim()
    ? doctors.filter(d => d.name.toLowerCase().includes(searchQuery.toLowerCase()) || d.specialization.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  // Role details
  const getRoleUser = (role: UserRole) => {
    switch (role) {
      case 'ADMIN':
        return {
          id: 'MED-ADM-01',
          name: 'Dr. Govindharaj M.',
          title: 'Chief Medical Administrator',
          initials: 'GM',
          badge: 'Admin Lead',
          role: 'ADMIN',
          email: 'admin@medtrack.org',
          phone: '+91 94431 88001',
          department: 'Hospital Administration & Governance',
          license: 'TN-MCI-2012-4029',
          shift: 'General Clinical Lead (08:00 - 20:00)',
          accessLevel: 'Super Administrator • Full Clinical Access',
          colorClasses: 'from-blue-600 to-indigo-700'
        };
      case 'DOCTOR':
        return {
          id: 'MED-DOC-01',
          name: 'Dr. S. Karthikeyan',
          title: 'Senior Consultant Physician',
          initials: 'SK',
          badge: 'Consultant MD',
          role: 'DOCTOR',
          email: 'doctor.karthik@medtrack.org',
          phone: '+91 94431 88002',
          department: 'General Medicine & Intensive Care',
          license: 'TN-MCI-2014-9821',
          shift: 'Morning & Ward Rounds (07:00 - 15:00)',
          accessLevel: 'Clinical Prescribing • Triage & Discharge Authorization',
          colorClasses: 'from-emerald-600 to-teal-700'
        };
      case 'NURSE':
        return {
          id: 'MED-NUR-01',
          name: 'Selvi M.',
          title: 'ICU Charge Nurse & Triage Lead',
          initials: 'SM',
          badge: 'Charge RN',
          role: 'NURSE',
          email: 'selvi@medtrack.org',
          phone: '+91 94431 88003',
          department: 'Intensive Care Unit (ICU)',
          license: 'TNC-RN-2015-38102',
          shift: 'Rotational Shift (08:00 - 16:00)',
          accessLevel: 'Bed Management • Vitals & Nursing Administration',
          colorClasses: 'from-purple-600 to-indigo-600'
        };
      case 'RECEPTIONIST':
        return {
          id: 'MED-REC-01',
          name: 'M. Vignesh',
          title: 'Admissions & Frontdesk Lead',
          initials: 'MV',
          badge: 'Frontdesk Lead',
          role: 'RECEPTIONIST',
          email: 'reception@medtrack.org',
          phone: '+91 94431 88004',
          department: 'Patient Admissions, Billing & Frontdesk',
          license: 'MED-STAFF-2019-114',
          shift: 'Day Shift (08:30 - 17:30)',
          accessLevel: 'Admissions Desk • Registration & Cashier Access',
          colorClasses: 'from-amber-600 to-rose-600'
        };
    }
  };

  const currentUser = getRoleUser(currentRole);

  const formattedDate = currentTime.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  const formattedClock = currentTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  return (
    <header className="h-18 bg-white border-b border-slate-200/80 px-6 flex items-center justify-between sticky top-0 z-20 shadow-xs">
      {/* Search Bar with autocomplete preview */}
      <div className="relative w-96 max-w-md">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSearchResults(true);
            }}
            onFocus={() => setShowSearchResults(true)}
            placeholder="Search patients, beds, doctors..."
            className="w-full pl-10 pr-4 py-2 bg-slate-100/80 hover:bg-slate-100 focus:bg-white text-sm text-slate-800 rounded-xl border border-transparent focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all placeholder:text-slate-400"
          />
        </div>

        {/* Live Search Popup */}
        {showSearchResults && searchQuery.trim() && (
          <div
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-200 p-3 z-50 max-h-96 overflow-y-auto"
            onMouseLeave={() => setShowSearchResults(false)}
          >
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-1.5">Search Results</div>

            {matchedPatients.length === 0 && matchedBeds.length === 0 && matchedDoctors.length === 0 ? (
              <p className="text-xs text-slate-500 p-3 text-center">No matching records found.</p>
            ) : (
              <div className="space-y-2">
                {matchedPatients.length > 0 && (
                  <div>
                    <span className="text-[10px] font-semibold text-blue-600 px-2">Patients</span>
                    {matchedPatients.slice(0, 3).map(p => (
                      <div
                        key={p.id}
                        onClick={() => {
                          setActiveTab('Patients');
                          setShowSearchResults(false);
                        }}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 cursor-pointer text-xs"
                      >
                        <span className="font-semibold text-slate-800">{p.name} ({p.id})</span>
                        <span className="text-slate-500">{p.currentBedNumber || p.status}</span>
                      </div>
                    ))}
                  </div>
                )}

                {matchedBeds.length > 0 && (
                  <div>
                    <span className="text-[10px] font-semibold text-emerald-600 px-2">Beds</span>
                    {matchedBeds.slice(0, 3).map(b => (
                      <div
                        key={b.id}
                        onClick={() => {
                          setActiveTab('Beds');
                          setShowSearchResults(false);
                        }}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 cursor-pointer text-xs"
                      >
                        <span className="font-semibold text-slate-800">Bed {b.number}</span>
                        <span className="text-slate-500">{b.wardName} ({b.status})</span>
                      </div>
                    ))}
                  </div>
                )}

                {matchedDoctors.length > 0 && (
                  <div>
                    <span className="text-[10px] font-semibold text-indigo-600 px-2">Doctors</span>
                    {matchedDoctors.slice(0, 3).map(d => (
                      <div
                        key={d.id}
                        onClick={() => {
                          setActiveTab('Doctors');
                          setShowSearchResults(false);
                        }}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 cursor-pointer text-xs"
                      >
                        <span className="font-semibold text-slate-800">{d.name}</span>
                        <span className="text-slate-500">{d.department}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right Header Operations */}
      <div className="flex items-center gap-5">
        {/* Notifications Icon & Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifMenu(!showNotifMenu)}
            className="relative p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
          >
            <Bell className="w-5 h-5" />
            {unreadNotifications.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">
                {unreadNotifications.length}
              </span>
            )}
          </button>

          {showNotifMenu && (
            <div
              className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 py-3 z-50"
              onMouseLeave={() => setShowNotifMenu(false)}
            >
              <div className="px-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                <span className="font-bold text-sm text-slate-800">Notifications</span>
                {unreadNotifications.length > 0 && (
                  <button
                    onClick={clearAllNotifications}
                    className="text-[11px] text-blue-600 hover:underline font-medium"
                  >
                    Mark all as read
                  </button>
                )}
              </div>

              <div className="max-h-72 overflow-y-auto px-2 py-1 divide-y divide-slate-100">
                {notifications.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-6">No notifications</p>
                ) : (
                  notifications.slice(0, 5).map(notif => (
                    <div
                      key={notif.id}
                      onClick={() => {
                        markNotificationRead(notif.id);
                        if (notif.linkTab) setActiveTab(notif.linkTab);
                        setShowNotifMenu(false);
                      }}
                      className={`p-2.5 rounded-xl cursor-pointer transition-colors ${
                        notif.read ? 'hover:bg-slate-50' : 'bg-blue-50/50 hover:bg-blue-50 font-medium'
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        {notif.type === 'CRITICAL' ? (
                          <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                        ) : notif.type === 'SUCCESS' ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        ) : (
                          <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                        )}
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-slate-800">{notif.title}</p>
                          <p className="text-[11px] text-slate-500 leading-snug">{notif.message}</p>
                          <span className="text-[10px] text-slate-400 mt-1 block">{notif.timestamp}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Capsule with Interactive Profile Menu & Modal */}
        <div className="relative pl-3 border-l border-slate-200">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-100 transition-all cursor-pointer group text-left"
            title="Open Clinician Profile & Session Management"
          >
            <div
              className={`w-9 h-9 rounded-xl bg-gradient-to-br ${currentUser.colorClasses} text-white font-extrabold text-xs flex items-center justify-center shadow-xs ring-2 ring-white/80 shrink-0 relative`}
            >
              {currentUser.initials}
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white" />
            </div>
            <div className="hidden sm:block text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                  {currentUser.name}
                </span>
                <span className="px-1.5 py-0.2 bg-slate-100 text-slate-600 rounded text-[9px] font-extrabold">
                  {currentUser.badge}
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium">{currentUser.title}</p>
            </div>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 transition-transform ${showProfileMenu ? 'rotate-180 text-blue-600' : ''}`} />
          </button>

          {/* BACKDROP for Profile Menu */}
          {showProfileMenu && (
            <div
              className="fixed inset-0 z-40"
              onClick={() => setShowProfileMenu(false)}
            />
          )}

          {/* PROFILE DROPDOWN MENU - WITH LOGOUT INSIDE */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-84 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 p-4 space-y-3.5 animate-in fade-in zoom-in-95 duration-150">
              {/* Profile Header */}
              <div className="flex items-start gap-3 pb-3 border-b border-slate-100">
                <div
                  className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${currentUser.colorClasses} text-white font-black text-sm flex items-center justify-center shadow-md ring-2 ring-white/90 shrink-0 relative`}
                >
                  {currentUser.initials}
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white shadow-xs" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-xs font-extrabold text-slate-900 truncate">{currentUser.name}</h3>
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium truncate">{currentUser.title}</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded-md text-[10px] font-bold border border-blue-200/60">
                      {currentUser.role}
                    </span>
                    <span className="text-[10px] text-emerald-600 font-extrabold flex items-center gap-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                      Active Shift
                    </span>
                  </div>
                </div>
              </div>

              {/* Profile Details & Credentials */}
              <div className="space-y-1.5 bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-[11px]">
                <div className="flex items-center justify-between text-slate-600">
                  <span className="text-slate-400 font-semibold">Employee ID:</span>
                  <span className="font-mono font-bold text-slate-800">{currentUser.id}</span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span className="text-slate-400 font-semibold">Medical Reg / Lic:</span>
                  <span className="font-mono font-semibold text-slate-700">{currentUser.license}</span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span className="text-slate-400 font-semibold">Department:</span>
                  <span className="font-semibold text-slate-800 truncate max-w-[160px]">{currentUser.department}</span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span className="text-slate-400 font-semibold">Duty Schedule:</span>
                  <span className="font-semibold text-slate-700">{currentUser.shift}</span>
                </div>
              </div>

              {/* View Full Profile Modal Link */}
              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  setShowProfileModal(true);
                }}
                className="w-full py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
              >
                <User className="w-3.5 h-3.5 text-slate-500" />
                <span>View Full Profile Credentials</span>
              </button>

              {/* LOGOUT BUTTON INSIDE PROFILE - REQUIRED BY USER */}
              <div className="pt-2 border-t border-slate-100">
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    logout();
                  }}
                  className="w-full py-2.5 px-4 bg-rose-600 hover:bg-rose-700 active:scale-98 text-white font-extrabold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md shadow-rose-600/25 transition-all cursor-pointer"
                  title="Logout and end current clinical session"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out of MedTrack</span>
                </button>
                <p className="text-[10px] text-slate-400 text-center mt-1.5">
                  Terminates session & clears authentication token
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Live Indian Date & Time */}
        <div className="hidden lg:flex flex-col text-right pl-3 border-l border-slate-200">
          <span className="text-[11px] text-slate-500 font-medium">{formattedDate}</span>
          <span className="text-sm font-extrabold text-slate-800 tracking-tight">{formattedClock}</span>
        </div>

        {/* FULL CLINICAL PROFILE MODAL - WITH PROMINENT LOGOUT INSIDE */}
        {showProfileModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              {/* Modal Header */}
              <div className={`p-6 bg-gradient-to-r ${currentUser.colorClasses} text-white flex items-center justify-between`}>
                <div className="flex items-center gap-3.5">
                  <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-xs border border-white/30 text-white font-black text-xl flex items-center justify-center shadow-inner">
                    {currentUser.initials}
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-white">{currentUser.name}</h2>
                    <p className="text-xs text-white/80 font-medium">{currentUser.title}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 bg-white/20 rounded-md text-[10px] font-extrabold tracking-wider uppercase border border-white/20">
                      {currentUser.role} • {currentUser.badge}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setShowProfileModal(false)}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body: Complete Profile Information */}
              <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2.5">
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-blue-600" />
                    <span>Clinical Profile & Institutional Credentials</span>
                  </h4>
                  <div className="grid grid-cols-2 gap-3 text-xs pt-1">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block uppercase">Employee ID</span>
                      <span className="font-mono font-bold text-slate-800">{currentUser.id}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block uppercase">Medical Council Reg</span>
                      <span className="font-mono font-bold text-slate-800">{currentUser.license}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block uppercase">Clinical Department</span>
                      <span className="font-semibold text-slate-800">{currentUser.department}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block uppercase">Duty Schedule</span>
                      <span className="font-semibold text-slate-800">{currentUser.shift}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block uppercase">Official Email</span>
                      <span className="font-medium text-slate-700">{currentUser.email}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block uppercase">Emergency Phone</span>
                      <span className="font-medium text-slate-700">{currentUser.phone}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50/60 p-4 rounded-2xl border border-blue-200/80 space-y-1.5 text-xs text-blue-900">
                  <div className="flex items-center gap-2 font-black text-blue-950">
                    <Building2 className="w-4 h-4 text-blue-600" />
                    <span>Hospital Facility Affiliation</span>
                  </div>
                  <p className="text-[11px] text-blue-800 leading-relaxed">
                    MedTrack Multi-Speciality Hospital, 42 Grand Trunk Road, Chidambaram, Tamil Nadu - 608001
                  </p>
                  <p className="text-[10px] text-blue-600 font-semibold pt-1">
                    System Permissions: {currentUser.accessLevel}
                  </p>
                </div>

                {/* LOGOUT BUTTON INSIDE PROFILE MODAL */}
                <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
                  <button
                    onClick={() => {
                      setShowProfileModal(false);
                      logout();
                    }}
                    className="w-full py-3 px-4 bg-rose-600 hover:bg-rose-700 active:scale-98 text-white font-black rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-rose-600/30 transition-all cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Log Out / Terminate Clinical Session</span>
                  </button>
                  <button
                    onClick={() => setShowProfileModal(false)}
                    className="w-full py-2 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
                  >
                    Close Profile Window
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
