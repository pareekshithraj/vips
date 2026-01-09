/**
 * PORTAL CONTEXT SERVICE
 * 
 * Manages complete separation between:
 * 1. LMS PORTAL - For ALL students across ALL schools (Individual learning management)
 * 2. SCHOOL PORTAL - For a specific school only (School administration & management)
 * 
 * Admin can switch between these two portals to view different datasets
 */

export type PortalType = 'lms' | 'school';

export interface PortalContext {
  type: PortalType;
  schoolId?: string; // Only for school portal
  schoolName?: string;
  description: string;
  icon: string;
}

export const PORTAL_CONTEXTS: Record<PortalType, PortalContext> = {
  lms: {
    type: 'lms',
    description: 'Learning Management System - All students from all schools',
    icon: '📚',
  },
  school: {
    type: 'school',
    description: 'School Management Portal - Vidyabodhini Integrated Public School',
    icon: '🏫',
    schoolId: 'school_vidyabodhini_2024',
    schoolName: 'Vidyabodhini Integrated Public School',
  },
};

/**
 * DATA COLLECTION MAPPING
 * 
 * LMS COLLECTIONS (All Schools, Global):
 * - users (Global user accounts, profiles, learning data)
 * 
 * SCHOOL ERP COLLECTIONS (School-Specific, Vidyabodhini Only):
 * - admissions (Student admission records)
 * - staff (Teacher & staff management)
 * - students (School-specific student data)
 * - fees (Fee management)
 * - transport (Transport management)
 * - inventory (School inventory)
 * - timetable (School timetable)
 * - notices (School notices & announcements)
 * - calendar (School calendar & events)
 */
export const COLLECTION_MAPPING: Record<PortalType, string[]> = {
  lms: ['users'],
  school: ['admissions', 'staff', 'students', 'fees', 'transport', 'inventory', 'timetable', 'notices', 'calendar'],
};

export const portalContextService = {
  /**
   * Get portal context by type
   */
  getPortalContext(type: PortalType): PortalContext {
    return PORTAL_CONTEXTS[type];
  },

  /**
   * Check if user is in LMS mode
   */
  isLMSMode(type: PortalType): boolean {
    return type === 'lms';
  },

  /**
   * Check if user is in School mode
   */
  isSchoolMode(type: PortalType): boolean {
    return type === 'school';
  },

  /**
   * Get filter criteria based on portal
   * Use this to filter database queries
   */
  getPortalFilter(type: PortalType): Record<string, any> {
    if (type === 'lms') {
      // LMS shows data from ALL students across all schools
      // No filter needed - show everything
      return {};
    } else {
      // School portal shows only data for this school
      return {
        schoolId: PORTAL_CONTEXTS.school.schoolId,
      };
    }
  },

  /**
   * Get portal display name
   */
  getPortalDisplayName(type: PortalType): string {
    return type === 'lms' ? 'LMS Portal' : 'School Portal';
  },

  /**
   * Get allowed collections for this portal
   * Use this to determine which data to fetch
   */
  getAllowedCollections(type: PortalType): string[] {
    return COLLECTION_MAPPING[type];
  },

  /**
   * Check if a collection is allowed in this portal
   */
  isCollectionAllowed(collection: string, type: PortalType): boolean {
    return COLLECTION_MAPPING[type].includes(collection);
  },

  /**
   * Get portal color scheme
   */
  getPortalColors(type: PortalType) {
    if (type === 'lms') {
      return {
        primary: 'indigo', // Indigo for LMS
        secondary: 'violet',
        accent: 'indigo-600',
      };
    } else {
      return {
        primary: 'emerald', // Emerald for School
        secondary: 'green',
        accent: 'emerald-600',
      };
    }
  },

  /**
   * Get portal navigation items based on type
   */
  getPortalMenuItems(type: PortalType) {
    if (type === 'lms') {
      return {
        title: 'LMS Dashboard',
        subtitle: 'Learning Management System',
        items: [
          { id: 'plan', label: 'Study Plan', icon: '📋' },
          { id: 'library', label: 'Content Library', icon: '📖' },
          { id: 'progress', label: 'My Progress', icon: '📊' },
          { id: 'leaderboard', label: 'Leaderboard', icon: '🏆' },
          { id: 'career', label: 'Career Path', icon: '🎯' },
        ],
      };
    } else {
      return {
        title: 'School Dashboard',
        subtitle: 'Vidyabodhini Integrated Public School',
        items: [
          { id: 'overview', label: 'Overview', icon: '📊' },
          { id: 'students', label: 'Students', icon: '👥' },
          { id: 'staff', label: 'Staff', icon: '👨‍🏫' },
          { id: 'timetable', label: 'Timetable', icon: '📅' },
          { id: 'notices', label: 'Notices', icon: '📢' },
        ],
      };
    }
  },
};
