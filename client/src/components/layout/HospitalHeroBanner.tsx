import React from 'react';
import { useHospital } from '../../context/HospitalContext';
import { Building2, Sparkles } from 'lucide-react';

export const HospitalHeroBanner: React.FC = () => {
  const { currentRole } = useHospital();

  const getGreeting = () => {
    switch (currentRole) {
      case 'ADMIN':
        return { name: 'Dr. Govindharaj', roleSubtitle: "Here's what's happening at MedTrack Multi-Speciality Hospital today." };
      case 'DOCTOR':
        return { name: 'Dr. Karthikeyan', roleSubtitle: '12 active assigned patients require clinical attention and rounds.' };
      case 'NURSE':
        return { name: 'Selvi', roleSubtitle: 'Ward shift active: 4 patient vitals and 6 bed sanitations scheduled.' };
      case 'RECEPTIONIST':
        return { name: 'Vignesh', roleSubtitle: '54 beds available for new patient admissions across 14 departments.' };
    }
  };

  const info = getGreeting();

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-50/90 via-sky-50/50 to-indigo-50/70 border border-blue-100 p-6 sm:p-7 shadow-xs mb-6">
      {/* Background Hospital Illustration / Architectural Accent */}
      <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-20 lg:opacity-30 pointer-events-none flex items-center justify-end pr-8 overflow-hidden">
        <svg viewBox="0 0 400 200" className="h-full text-blue-600 fill-current" preserveAspectRatio="none">
          <path d="M50,180 L50,80 L120,80 L120,40 L220,40 L220,180 Z M230,180 L230,100 L320,100 L320,180 Z M330,180 L330,120 L380,120 L380,180 Z" opacity="0.4" />
          <path d="M140,60 L200,60 L200,180 L140,180 Z" opacity="0.6" />
          <circle cx="170" cy="80" r="10" opacity="0.8" />
        </svg>
      </div>

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-700 tracking-wide uppercase">
              Hospital Command Center
            </span>
            <span className="text-xs text-slate-400">Tamil Nadu • Live Operations</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Good Morning, {info.name}
          </h1>
          <p className="text-sm text-slate-600 mt-1 font-medium max-w-xl">
            {info.roleSubtitle}
          </p>
        </div>

        {/* Scenic Quote Badge */}
        <div className="hidden sm:flex flex-col items-end text-right">
          <span className="text-xs font-semibold italic text-blue-700 font-serif tracking-wide">
            "Better Care, Brighter Tomorrows"
          </span>
          <span className="text-[11px] text-slate-400 font-medium mt-0.5">
            MedTrack Multi-Speciality Healthcare
          </span>
        </div>
      </div>
    </div>
  );
};
