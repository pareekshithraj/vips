import React, { useState } from 'react';
import {
    Users, GraduationCap, Bus, CreditCard, Calendar, FileText,
    Layers, ClipboardList, PenTool, UserPlus, Layout
} from 'lucide-react';
import { PortalType } from '../../../services/portalContext';

// Import Modules
import { StaffManagement } from '../../modules/admin/StaffManagement';
import { AdmissionManagement } from '../../modules/admin/AdmissionManagement';
import { TransportManagement } from '../../modules/admin/TransportManagement';
import {
    InventoryManager,
    TimetableBuilder,
    CircularsManager,
    EventCalendar,
    FeeManagementModule
} from '../../modules/admin/AdminModules';

interface SchoolManagementProps {
    darkMode: boolean;
    role?: string;
    activePortal?: PortalType;
    activeTab?: string;
    onTabChange?: (tabId: string) => void;
}

export const SchoolManagement: React.FC<SchoolManagementProps> = ({ darkMode, role, activePortal = 'school', activeTab: parentActiveTab, onTabChange }) => {
    const [localActiveTab, setLocalActiveTab] = useState('admissions');
    
    // Use parent tab if provided, otherwise use local state
    const activeTab = parentActiveTab || localActiveTab;
    const handleTabChange = (tabId: string) => {
        setLocalActiveTab(tabId);
        onTabChange?.(tabId);
    };

    const tabs = [
        { id: 'admissions', label: 'Admissions', icon: UserPlus, component: <AdmissionManagement darkMode={darkMode} /> },
        { id: 'staff', label: 'Staff Hub', icon: Users, component: <StaffManagement darkMode={darkMode} /> },
        { id: 'students', label: 'Students', icon: GraduationCap, component: <div className="p-8 text-center font-bold text-slate-400">Student Directory Moved to Analytics &gt; Students</div> }, // Placeholder or move logic here
        { id: 'fees', label: 'Fee Manager', icon: CreditCard, component: <FeeManagementModule darkMode={darkMode} /> },
        { id: 'transport', label: 'Transport', icon: Bus, component: <TransportManagement darkMode={darkMode} /> },
        { id: 'inventory', label: 'Inventory', icon: Layers, component: <InventoryManager darkMode={darkMode} /> },
        { id: 'timetable', label: 'Timetable', icon: ClipboardList, component: <TimetableBuilder darkMode={darkMode} /> },
        { id: 'circulars', label: 'Notices', icon: FileText, component: <CircularsManager darkMode={darkMode} role={role} /> },
        { id: 'calendar', label: 'Calendar', icon: Calendar, component: <EventCalendar darkMode={darkMode} /> },
    ];

    // Only render if in SCHOOL portal
    if (activePortal !== 'school') {
        return null;
    }

    return (
        <div className="h-full flex flex-col bg-slate-50 dark:bg-slate-950">
            {/* Show tabs only when in SCHOOL portal */}
            <div className={`flex overflow-x-auto p-2 gap-2 border-b no-scrollbar shrink-0 ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => handleTabChange(tab.id)}
                        className={`
                            flex items-center gap-2 px-4 py-3 rounded-xl whitespace-nowrap font-bold text-xs uppercase tracking-wide transition-all
                            ${activeTab === tab.id
                                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200'
                                : (darkMode ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-500 hover:bg-slate-100')}
                        `}
                    >
                        <tab.icon size={16} />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-4 lg:p-6 custom-scrollbar">
                <div className="max-w-7xl mx-auto">
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {tabs.find(t => t.id === activeTab)?.component}
                    </div>
                </div>
            </div>
        </div>
    );
};
