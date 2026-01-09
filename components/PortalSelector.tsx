/**
 * PORTAL SELECTOR COMPONENT - Header Version
 * 
 * Simple portal switcher for header
 */

import React from 'react';
import { BookOpen, Building2 } from 'lucide-react';
import { PortalType } from '../services/portalContext';

interface PortalSelectorProps {
  currentPortal: PortalType;
  onPortalChange: (portal: PortalType) => void;
  darkMode: boolean;
}

export const PortalSelector: React.FC<PortalSelectorProps> = ({
  currentPortal,
  onPortalChange,
  darkMode,
}) => {
  return (
    <div className="flex items-center gap-2 border rounded-2xl p-1" style={{
      borderColor: darkMode ? '#374151' : '#e5e7eb',
      backgroundColor: darkMode ? '#1f2937' : '#f3f4f6',
    }}>
      {/* LMS Button */}
      <button
        onClick={() => onPortalChange('lms')}
        className={`px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 transition-all ${
          currentPortal === 'lms'
            ? 'bg-indigo-600 text-white shadow-lg'
            : darkMode
              ? 'text-slate-400 hover:text-white'
              : 'text-slate-600 hover:text-slate-900'
        }`}
      >
        <BookOpen className="w-4 h-4" />
        LMS
      </button>

      {/* School Button */}
      <button
        onClick={() => onPortalChange('school')}
        className={`px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 transition-all ${
          currentPortal === 'school'
            ? 'bg-emerald-600 text-white shadow-lg'
            : darkMode
              ? 'text-slate-400 hover:text-white'
              : 'text-slate-600 hover:text-slate-900'
        }`}
      >
        <Building2 className="w-4 h-4" />
        SCHOOL
      </button>
    </div>
  );
};
