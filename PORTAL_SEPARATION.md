# LMS Portal vs School Portal - Complete Separation

## 📋 Overview

The system now completely separates two independent portals:

### **1. LMS PORTAL (Learning Management System)**
- **Scope**: For ALL students across ALL schools
- **Purpose**: Individual learning, study plans, progress tracking, career paths
- **Color Scheme**: Indigo/Violet (💙)
- **Access**: Any student globally using the system
- **Data**: Independent learning data not tied to any specific school

### **2. SCHOOL PORTAL (School Administration)**
- **Scope**: ONLY Vidyabodhini Integrated Public School
- **Purpose**: School management, student enrollment, staff management, timetables, notices
- **Color Scheme**: Emerald/Green (💚)
- **Access**: School admin and staff only
- **Data**: Only Vidyabodhini related information

---

## 🎛️ Portal Selector

Admins can switch between portals using the **Portal Selector** component in the sidebar:

```
📚 LMS Portal
├── Learning Management System
└── For ALL students across ALL schools

🏫 School Portal
├── School Management & Administration
└── Vidyabodhini Integrated Public School Only
```

### Features:
- **Easy switching** - Click dropdown to switch portals
- **Visual confirmation** - Color-coded interface shows which portal is active
- **Info banner** - Top of dashboard clearly shows active portal
- **Persistent menu** - Menu items update based on portal context

---

## 🔧 Implementation Details

### **Portal Context Service** (`services/portalContext.ts`)

The service provides:

```typescript
PORTAL_CONTEXTS = {
  lms: {
    type: 'lms',
    description: 'Learning Management System',
    icon: '📚',
    // No schoolId - shows ALL data
  },
  school: {
    type: 'school',
    description: 'School Management Portal',
    schoolId: 'school_vidyabodhini_2024',
    schoolName: 'Vidyabodhini Integrated Public School',
    icon: '🏫',
  }
}
```

### **Database Filtering**

```typescript
// LMS Portal - Get ALL students
const lmsFilter = portalContextService.getPortalFilter('lms');
// Returns: {} (no filter, show everything)

// School Portal - Get ONLY Vidyabodhini students
const schoolFilter = portalContextService.getPortalFilter('school');
// Returns: { schoolId: 'school_vidyabodhini_2024' }
```

---

## 📊 Admin Dashboard - Portal Switching

### State Management
```tsx
const [activePortal, setActivePortal] = useState<PortalType>('school');

// When admin switches portal
const handlePortalChange = (portal: PortalType) => {
  setActivePortal(portal);
  setActiveTab('dashboard'); // Reset to dashboard
};
```

### Visual Feedback

**When LMS Portal is Active:**
- Hero section: Indigo/Violet gradient
- Icon: 📚
- Banner: "LMS Portal - All Students, All Schools"
- Buttons: "View LMS" and "LMS Analytics"
- Color accent: Indigo-600

**When School Portal is Active:**
- Hero section: Emerald/Teal gradient
- Icon: 🏫
- Banner: "School Portal - Vidyabodhini Only"
- Buttons: "Manage School" and "View Analytics"
- Color accent: Emerald-600

---

## 🔄 Data Flow

### For LMS Portal:
```
Admin clicks "LMS Portal"
    ↓
adminService.getAllStudents() 
    ↓ (No school filter)
Returns students from ALL schools
    ↓
Dashboard shows:
  - Global learning statistics
  - Cross-school insights
  - LMS-specific analytics
```

### For School Portal:
```
Admin clicks "School Portal"
    ↓
managementService.getSchoolStudents(schoolId)
    ↓ (With school filter)
Returns ONLY Vidyabodhini students
    ↓
Dashboard shows:
  - School-specific student data
  - Staff information
  - Timetables
  - Notices & circulars
```

---

## 💾 Database Collections

### LMS Data (No School Filter)
```
/users/{userId}
├── chapterProgress
├── completedTopicIds
├── gamification
└── careerPath
```

### School Data (Filtered by schoolId)
```
/students/{studentId}
├── schoolId: "school_vidyabodhini_2024"
├── admissionData
├── timetable
└── fees

/staff/{staffId}
├── schoolId: "school_vidyabodhini_2024"
├── role
└── qualifications

/notices/{noticeId}
├── schoolId: "school_vidyabodhini_2024"
└── audience
```

---

## 🛡️ Security Considerations

1. **Data Isolation**
   - LMS queries have NO school filter (global)
   - School queries MUST have schoolId filter
   - Never mix data from different sources

2. **Admin Permissions**
   - Can only see data from portals they have access to
   - School admin: Only school portal
   - Global admin: Both portals

3. **Database Rules (Firebase)**
   ```
   // LMS Portal - User's own data
   allow read: if request.auth.uid == resource.data.userId;
   
   // School Portal - School admin only
   allow read: if request.auth.schoolId == resource.data.schoolId;
   ```

---

## 🎯 Usage Examples

### Example 1: Admin views LMS Portal
```tsx
// activePortal = 'lms'
const students = await adminService.getAllStudents();
// Gets ALL students across ALL schools

// In query:
const q = query(collection(db, 'users'));
// No schoolId filter
```

### Example 2: Admin views School Portal
```tsx
// activePortal = 'school'
const students = await managementService.getSchoolStudents();
// Gets ONLY Vidyabodhini students

// In query:
const q = query(
  collection(db, 'students'),
  where('schoolId', '==', 'school_vidyabodhini_2024')
);
```

---

## 🚀 Features Coming Soon

### LMS Portal Enhancements
- ✅ Global student analytics
- ✅ Cross-school performance comparisons
- ✅ Learning path optimization
- ✅ Global leaderboards

### School Portal Enhancements
- ✅ Detailed student records
- ✅ Staff management
- ✅ Timetable scheduling
- ✅ Attendance tracking
- ✅ Fee management
- ✅ Notice distribution

---

## 📱 Mobile Responsiveness

Portal selector works on all devices:
- **Desktop**: Full sidebar with dropdown
- **Tablet**: Collapsible menu
- **Mobile**: Compact selector with clear active state

---

## 🔔 Important Notes

⚠️ **CRITICAL SEPARATION RULES**

1. **LMS and School data are completely independent**
   - Never use school filter in LMS queries
   - Always apply school filter in school queries

2. **Portal state persists during admin session**
   - Switching portals resets the active tab
   - All data is portal-specific

3. **Users see different views based on portal**
   - LMS Portal shows learning-centric features
   - School Portal shows management-centric features

4. **Admin dashboard clearly indicates active portal**
   - Header banner shows which portal is active
   - Color scheme changes based on portal
   - Menu items are portal-specific

---

## 📞 Support

For questions about portal separation:
- Check `services/portalContext.ts` for portal definitions
- Check `components/PortalSelector.tsx` for UI implementation
- Check `components/school/admin/AdminDashboard.tsx` for integration
