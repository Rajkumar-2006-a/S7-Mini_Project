import React, { useState } from 'react';
import {
  User,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Globe,
  QrCode,
  CheckCircle2,
  AlertCircle,
  X,
  Camera,
  KeyRound
} from 'lucide-react';
import { useHospital } from '../context/HospitalContext';
import { UserRole } from '../types';

export const LoginPage: React.FC = () => {
  const { login } = useHospital();

  // State
  const [selectedRole, setSelectedRole] = useState<UserRole>('ADMIN');
  const [username, setUsername] = useState<string>('admin@medtrack.org');
  const [password, setPassword] = useState<string>('MedTrack@2026');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [language, setLanguage] = useState<'en' | 'ta' | 'hi'>('en');
  const [showLangMenu, setShowLangMenu] = useState<boolean>(false);

  // Modals
  const [showQRModal, setShowQRModal] = useState<boolean>(false);
  const [showForgotModal, setShowForgotModal] = useState<boolean>(false);
  const [isScanningQR, setIsScanningQR] = useState<boolean>(false);

  const roleDetails: Record<UserRole, { label: string; user: string; pass: string; title: string; dept: string }> = {
    ADMIN: {
      label: 'Admin',
      user: 'admin@medtrack.org',
      pass: 'MedTrack@2026',
      title: 'Dr. Govindharaj M. (Chief Medical Administrator)',
      dept: 'Hospital Governance & Capacity Planning'
    },
    DOCTOR: {
      label: 'Doctor',
      user: 'doctor.karthik@medtrack.org',
      pass: 'MedTrack@2026',
      title: 'Dr. S. Karthikeyan (Senior Consultant Physician)',
      dept: 'General Medicine & ICU Operations'
    },
    NURSE: {
      label: 'Nurse',
      user: 'selvi@medtrack.org',
      pass: 'MedTrack@2026',
      title: 'Selvi M. (ICU Charge Nurse)',
      dept: 'Bedside Telemetry & Ward Sanitation'
    },
    RECEPTIONIST: {
      label: 'Receptionist',
      user: 'reception@medtrack.org',
      pass: 'MedTrack@2026',
      title: 'M. Vignesh (Chief Admissions Officer)',
      dept: 'Patient Registration & Bed Allocation'
    }
  };

  const handleRolePillClick = (role: UserRole) => {
    setSelectedRole(role);
    setUsername(roleDetails[role].user);
    setPassword(roleDetails[role].pass);
    setErrorMessage('');
  };

  const handleLoginSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage('');

    if (!username.trim() || !password.trim()) {
      setErrorMessage('Please enter both username and password.');
      return;
    }

    setIsLoading(true);

    const lowerUser = username.toLowerCase();
    let targetRole: UserRole = selectedRole;

    if (lowerUser.includes('doctor') || lowerUser.includes('karthik')) {
      targetRole = 'DOCTOR';
    } else if (lowerUser.includes('selvi') || lowerUser.includes('nurse')) {
      targetRole = 'NURSE';
    } else if (lowerUser.includes('reception') || lowerUser.includes('vignesh')) {
      targetRole = 'RECEPTIONIST';
    } else if (lowerUser.includes('admin') || lowerUser.includes('govindharaj') || lowerUser.includes('govind') || lowerUser.includes('rajesh') || lowerUser.includes('aisha')) {
      targetRole = 'ADMIN';
    }

    setTimeout(() => {
      login(targetRole, username, password);
      setIsLoading(false);
    }, 350);
  };

  const handleQRSimulateScan = (role: UserRole) => {
    setIsScanningQR(true);
    setTimeout(() => {
      setIsScanningQR(false);
      setShowQRModal(false);
      login(role, roleDetails[role].user, 'MedTrack@2026');
    }, 600);
  };

  const translations = {
    en: {
      lang: 'English',
      welcome: 'Welcome to',
      signInSubtitle: 'Sign in to continue to your dashboard',
      roleLabel: 'SELECT STAFF ROLE & DASHBOARD:',
      username: 'Username',
      usernamePlaceholder: 'Enter your username',
      password: 'Password',
      passwordPlaceholder: 'Enter your password',
      rememberMe: 'Remember me',
      forgotPassword: 'Forgot password?',
      signInBtn: 'Sign In',
      or: 'OR',
      qrBtn: 'Login with Staff ID (QR)'
    },
    ta: {
      lang: 'தமிழ் (Tamil)',
      welcome: 'நல்வரவு',
      signInSubtitle: 'உங்கள் கட்டுப்பாட்டு அறைக்கு உள்நுழையவும்',
      roleLabel: 'பணியாளர் பொறுப்பு & கட்டுப்பாட்டு அறை:',
      username: 'பயனர் பெயர்',
      usernamePlaceholder: 'பயனர் பெயரை உள்ளிடவும்',
      password: 'கடவுச்சொல்',
      passwordPlaceholder: 'கடவுச்சொல்லை உள்ளிடவும்',
      rememberMe: 'என்னை நினைவில் கொள்',
      forgotPassword: 'கடவுச்சொல் மறந்துவிட்டதா?',
      signInBtn: 'உள்நுழைக',
      or: 'அல்லது',
      qrBtn: 'மருத்துவ பணியாளர் QR அட்டை மூலம் உள்நுழைக'
    },
    hi: {
      lang: 'हिन्दी (Hindi)',
      welcome: 'स्वागत है',
      signInSubtitle: 'अपने डैशबोर्ड पर जारी रखने के लिए लॉगिन करें',
      roleLabel: 'स्टाफ भूमिका और डैशबोर्ड चुनें:',
      username: 'उपयोगकर्ता नाम',
      usernamePlaceholder: 'उपयोगकर्ता नाम दर्ज करें',
      password: 'पासवर्ड',
      passwordPlaceholder: 'पासवर्ड दर्ज करें',
      rememberMe: 'मुझे याद रखें',
      forgotPassword: 'पासवर्ड भूल गए?',
      signInBtn: 'साइन इन करें',
      or: 'या',
      qrBtn: 'स्टाफ आईडी (QR) से लॉगिन करें'
    }
  };

  const t = translations[language];

  return (
    <div className="min-h-screen bg-[#F0F4F8] flex items-center justify-center p-4 sm:p-6 select-none font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Centered Login Card */}
      <div className="w-full max-w-[480px] bg-white rounded-[24px] shadow-[0_10px_35px_-5px_rgba(15,23,42,0.08),0_0_1px_1px_rgba(15,23,42,0.05)] border border-slate-100 p-7 sm:p-9 relative">
        
        {/* Top-Right Language Switcher */}
        <div className="flex justify-end mb-3">
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors shadow-2xs"
            >
              <Globe className="w-3.5 h-3.5 text-slate-500" />
              <span>{language === 'en' ? 'English' : language === 'ta' ? 'தமிழ்' : 'हिन्दी'}</span>
              <span className="text-[10px] text-slate-400 ml-0.5">▼</span>
            </button>

            {showLangMenu && (
              <div className="absolute right-0 mt-1 w-36 bg-white rounded-xl shadow-xl border border-slate-200 py-1 z-30">
                <button
                  type="button"
                  onClick={() => { setLanguage('en'); setShowLangMenu(false); }}
                  className={`w-full px-3 py-1.5 text-left text-xs font-medium hover:bg-slate-50 flex items-center justify-between ${
                    language === 'en' ? 'text-blue-600 font-bold bg-blue-50/50' : 'text-slate-700'
                  }`}
                >
                  <span>English</span>
                  {language === 'en' && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />}
                </button>
                <button
                  type="button"
                  onClick={() => { setLanguage('ta'); setShowLangMenu(false); }}
                  className={`w-full px-3 py-1.5 text-left text-xs font-medium hover:bg-slate-50 flex items-center justify-between ${
                    language === 'ta' ? 'text-blue-600 font-bold bg-blue-50/50' : 'text-slate-700'
                  }`}
                >
                  <span>தமிழ் (Tamil)</span>
                  {language === 'ta' && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />}
                </button>
                <button
                  type="button"
                  onClick={() => { setLanguage('hi'); setShowLangMenu(false); }}
                  className={`w-full px-3 py-1.5 text-left text-xs font-medium hover:bg-slate-50 flex items-center justify-between ${
                    language === 'hi' ? 'text-blue-600 font-bold bg-blue-50/50' : 'text-slate-700'
                  }`}
                >
                  <span>हिन्दी (Hindi)</span>
                  {language === 'hi' && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Header Titles */}
        <div>
          <h1 className="text-[28px] sm:text-[30px] font-extrabold text-[#0B2545] tracking-tight leading-tight">
            {t.welcome} <span className="text-[#0B2545]">Med</span><span className="text-[#00A8FF]">Track</span>
          </h1>
          <p className="text-xs sm:text-[13px] text-slate-500 font-medium mt-1">
            {t.signInSubtitle}
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="mt-6">
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
            {t.roleLabel}
          </label>
          <div className="grid grid-cols-4 gap-1 p-1 bg-[#F1F5F9] rounded-xl border border-slate-200/80">
            {(['ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST'] as UserRole[]).map((r) => {
              const isSelected = selectedRole === r;
              return (
                <button
                  key={r}
                  type="button"
                  onClick={() => handleRolePillClick(r)}
                  className={`py-1.5 px-2 rounded-lg text-xs font-semibold transition-all text-center truncate ${
                    isSelected
                      ? 'bg-white text-[#1D64D8] font-bold shadow-xs border border-slate-200/80'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                  }`}
                >
                  {roleDetails[r].label}
                </button>
              );
            })}
          </div>

          {/* Active Profile Info Capsule */}
          <div className="mt-3 px-3.5 py-2.5 bg-[#F4F9FF] border border-[#D8E8FC] rounded-xl flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-2.5 h-2.5 rounded-full bg-[#3B82F6] shrink-0" />
              <div className="overflow-hidden">
                <p className="font-bold text-[#0B2545] text-xs truncate leading-tight">
                  {roleDetails[selectedRole].title}
                </p>
                <p className="text-[11px] text-slate-500 truncate leading-tight mt-0.5">
                  {roleDetails[selectedRole].dept}
                </p>
              </div>
            </div>
            <span className="text-[10px] font-bold text-[#2563EB] uppercase bg-[#DBEAFE] px-2 py-0.5 rounded shrink-0 ml-2">
              {selectedRole}
            </span>
          </div>
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className="mt-3 p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form Fields */}
        <form onSubmit={handleLoginSubmit} className="mt-5 space-y-4">
          {/* Username Field */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-slate-400" />
              <span>{t.username}</span>
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={t.usernamePlaceholder}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-[13px] text-slate-800 placeholder-slate-400 outline-none focus:border-[#1D64D8] focus:ring-2 focus:ring-[#1D64D8]/15 transition-all shadow-2xs"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-slate-400" />
              <span>{t.password}</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t.passwordPlaceholder}
                className="w-full pl-3.5 pr-10 py-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-[13px] text-slate-800 placeholder-slate-400 outline-none focus:border-[#1D64D8] focus:ring-2 focus:ring-[#1D64D8]/15 transition-all shadow-2xs tracking-widest font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between text-xs pt-0.5">
            <label className="flex items-center gap-2 cursor-pointer text-slate-600 font-medium">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-slate-300 text-[#1D64D8] focus:ring-[#1D64D8] w-4 h-4 cursor-pointer"
              />
              <span>{t.rememberMe}</span>
            </label>

            <button
              type="button"
              onClick={() => setShowForgotModal(true)}
              className="text-[#1D64D8] hover:underline font-bold text-xs"
            >
              {t.forgotPassword}
            </button>
          </div>

          {/* Sign In CTA Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-[#1D64D8] hover:bg-[#1554B8] active:bg-[#0E4295] text-white font-bold rounded-xl text-xs sm:text-[13px] shadow-md shadow-blue-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Verifying...</span>
              </>
            ) : (
              <>
                <span>{t.signInBtn}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* OR Divider */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <div className="relative flex justify-center text-[10px] uppercase font-bold text-slate-400">
            <span className="bg-white px-2.5">{t.or}</span>
          </div>
        </div>

        {/* Login with Staff ID (QR) */}
        <button
          type="button"
          onClick={() => setShowQRModal(true)}
          className="w-full py-2.5 px-4 bg-[#F8FAFC] hover:bg-slate-100 active:bg-slate-200/80 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 transition-all flex items-center justify-center gap-2 shadow-2xs"
        >
          <QrCode className="w-4 h-4 text-[#1D64D8]" />
          <span>{t.qrBtn}</span>
        </button>
      </div>

      {/* =========================================================================
          MODAL: STAFF ID QR SCANNER / QUICK BADGE ACCESS
         ========================================================================= */}
      {showQRModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                  <QrCode className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Hospital Staff QR / Badge Reader</h3>
                  <p className="text-[10px] text-slate-500">Scan physical RFID wristband or employee card</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowQRModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 text-center">
              <div className="w-44 h-44 mx-auto bg-slate-900 rounded-2xl relative flex items-center justify-center overflow-hidden border-2 border-dashed border-blue-400/80">
                <Camera className="w-8 h-8 text-white/30" />
                <div className="absolute inset-x-0 h-0.5 bg-cyan-400 animate-pulse top-1/2 -translate-y-1/2 shadow-[0_0_12px_#22d3ee]" />
                <div className="absolute inset-2 border border-white/20 rounded-xl pointer-events-none" />
              </div>
              <p className="text-xs text-slate-500 mt-2.5">
                Hold your MedTrack hospital badge or QR ID in front of the optical reader.
              </p>

              <div className="mt-4 pt-3 border-t border-slate-100 text-left">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Simulate Badge Tap:
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    disabled={isScanningQR}
                    onClick={() => handleQRSimulateScan('ADMIN')}
                    className="p-2 rounded-xl border border-blue-200 bg-blue-50/50 hover:bg-blue-100 text-blue-800 font-bold text-left transition-colors flex items-center justify-between"
                  >
                    <span>🛡️ Dr. Govindharaj M. (Admin)</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={isScanningQR}
                    onClick={() => handleQRSimulateScan('DOCTOR')}
                    className="p-2 rounded-xl border border-indigo-200 bg-indigo-50/50 hover:bg-indigo-100 text-indigo-800 font-bold text-left transition-colors flex items-center justify-between"
                  >
                    <span>🩺 Dr. Karthik (MD)</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={isScanningQR}
                    onClick={() => handleQRSimulateScan('NURSE')}
                    className="p-2 rounded-xl border border-teal-200 bg-teal-50/50 hover:bg-teal-100 text-teal-800 font-bold text-left transition-colors flex items-center justify-between"
                  >
                    <span>❤️ Selvi (Nurse)</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={isScanningQR}
                    onClick={() => handleQRSimulateScan('RECEPTIONIST')}
                    className="p-2 rounded-xl border border-emerald-200 bg-emerald-50/50 hover:bg-emerald-100 text-emerald-800 font-bold text-left transition-colors flex items-center justify-between"
                  >
                    <span>📋 Vignesh (Reception)</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: FORGOT PASSWORD / CLINICAL RECOVERY
         ========================================================================= */}
      {showForgotModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                  <KeyRound className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Hospital Passkey Assistance</h3>
                  <p className="text-[10px] text-slate-500">MedTrack Security & IT Helpdesk</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowForgotModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs text-slate-600">
              <p>
                For security compliance under <strong>NABH Level 3</strong>, clinical accounts require IT administrator authorization for password resets.
              </p>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 font-mono text-[11px]">
                <p className="text-slate-800 font-bold">Standard Demo Passkeys:</p>
                <div className="flex items-center justify-between text-slate-600">
                  <span>Passkey:</span>
                  <strong className="text-blue-700 font-bold bg-white px-2 py-0.5 rounded border">MedTrack@2026</strong>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span>IT Desk Phone:</span>
                  <strong>+91 (044) 2890-4100</strong>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span>Ext:</span>
                  <strong>#410 (Hospital Server Room)</strong>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setPassword('MedTrack@2026');
                    setShowForgotModal(false);
                  }}
                  className="w-full py-2.5 bg-[#1D64D8] hover:bg-[#1554B8] text-white font-bold rounded-xl shadow-md transition-colors"
                >
                  Auto-fill Passkey & Return
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
