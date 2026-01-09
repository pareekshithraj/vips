
import { db } from './firebase';
import {
    collection, addDoc, getDocs, doc, query, where, updateDoc, setDoc, serverTimestamp, orderBy, limit, deleteDoc, arrayUnion, arrayRemove, getDoc, writeBatch
} from 'firebase/firestore';
import { UserConfig } from '../types';

export interface AdmissionData {
    fullName: string;
    studentId?: string; // STU-001
    gender: string;
    dob: string;

    classLevel: string; // "10-A" (ID)
    section?: string;
    rollNumber: string;

    useTransport: boolean;
    busRouteId?: string;

    admittedBy: string; // "Parent", "Guardian", "Self"
    guardianName: string;
    fatherName: string;
    motherName: string;

    primaryContact: string;
    secondaryContact?: string;
    address: string;

    email?: string; // Auto-gen
}

const cleanObject = (obj: any) => {
    const newObj: any = {};
    Object.keys(obj).forEach(key => {
        if (obj[key] !== undefined) {
            newObj[key] = obj[key];
        }
    });
    return newObj;
};

export interface StaffMember {
    id: string;
    name: string;
    email: string;
    role: 'teacher' | 'driver' | 'admin' | 'staff';
    phone?: string;
    department?: string;
    salary?: string;
    joiningDate?: string;
    address?: string;
    status: 'Active' | 'Inactive';
}

export const managementService = {
    // 1. Admit Student (Create User Document)
    async admitStudent(data: AdmissionData) {
        try {
            // Generate a Student ID / Email if not provided
            // Pattern: studentname.class@vidyabodhini.org (simplified)
            const cleanName = data.fullName.toLowerCase().replace(/\s+/g, '');
            // Use provided Student ID or fallback
            const email = data.email || `${cleanName}.${new Date().getFullYear()}@vidyabodhini.org`;

            const userRef = doc(db, 'students', email);  // Changed from 'users' to 'students'
            const userSnap = await getDoc(userRef);

            if (userSnap.exists()) {
                throw new Error("Student ID/Email already exists.");
            }

            const [cls, stream] = data.classLevel.split('-'); // "11-Science" -> ["11", "Science"]

            const newConfig: UserConfig = {
                name: data.fullName,
                email: email,
                phone: data.primaryContact || '',
                schoolName: 'Vidyabodhini School',
                syllabusType: 'CBSE', // Default
                classLevel: parseInt(cls) as any || 11,
                selectedSubjectIds: [],
                customSubjects: [],
                manualChapters: {},
                heading: stream || 'General', // Store stream in a generic field or generic 'careerPath'
                examDate: new Date(new Date().getFullYear() + 1, 2, 1).toISOString(), // Next March 1st
                availableHours: [],
                chapterProgress: {},
                completedTopicIds: [],
                onboarded: false, // They need to login and set up subjects
                isSchoolStudent: true, // Flag for School Portal Access
                schoolId: 'school_vidyabodhini_2024',
                careerPath: { recommended: stream || 'Undecided', timestamp: new Date().toISOString() }, // Pre-set stream

                gamification: {
                    streak: 0,
                    lastStudyDate: '',
                    points: 0,
                    unlockedAchievementIds: []
                },
                // Custom fields for ERP
                parentName: data.fatherName || data.guardianName || data.motherName,
                admissionDate: new Date().toISOString(),
                admittedByParent: data.admittedBy === 'Parent',

                // Store full ERP data in a nested object or separate fields if needed
                erpData: {
                    details: cleanObject(data)
                }
            } as any;

            const cleanedConfig = cleanObject(newConfig);
            await setDoc(userRef, cleanedConfig);
            return { success: true, email: email };
        } catch (error) {
            console.error("Admission Error:", error);
            throw error;
        }
    },

    // 2. Class Management (Refactored: Grade -> Sections)
    async createClass(grade: string, annualFee: number) {
        const ref = doc(db, 'classes', grade);
        // Only set if not exists, or update fee? 
        // We use set with merge to create or update fee, preserving sections
        await setDoc(ref, {
            grade,
            annualFee,
            createdAt: serverTimestamp()
        }, { merge: true });
        return ref.id;
    },





    async addSection(grade: string, sectionName: string) {
        const ref = doc(db, 'classes', grade);
        const sectionData = {
            name: sectionName,
            teacherId: '',
            subjectIds: []
        };
        // Use arrayUnion to add to 'sections' array
        await updateDoc(ref, {
            sections: arrayUnion(sectionData)
        });
    },

    async deleteSection(grade: string, section: any) {
        const ref = doc(db, 'classes', grade);
        await updateDoc(ref, {
            sections: arrayRemove(section) // Must pass exact object to remove
        });
    },

    async updateSectionConfig(grade: string, oldSection: any, newConfig: any) {
        // Since it's an array, we must remove old and add new
        // OR we can just replace the whole sections array if we fetch it first.
        // For simplicity/atomic ops, let's fetch, modify, update.
        const ref = doc(db, 'classes', grade);
        const snap = await getDoc(ref);
        if (snap.exists()) {
            const data = snap.data();
            const sections = data.sections || [];
            const updatedSections = sections.map((s: any) =>
                s.name === oldSection.name ? { ...s, ...newConfig } : s
            );
            await updateDoc(ref, { sections: updatedSections });
        }
    },





    // 6. Staff Management (Split into Teachers, Admins, and Drivers)
    async addStaff(staff: { name: string; role: string; subject?: string; email: string; phone: string; joiningDate?: string; salary?: string }) {
        // Enforce Email as ID for easy lookup
        const role = (staff.role || '').toLowerCase();
        let collectionName = 'admins'; // default
        if (role === 'teacher') collectionName = 'teachers';
        else if (role === 'driver') collectionName = 'drivers';

        const ref = doc(db, collectionName, staff.email);
        await setDoc(ref, { ...staff, joinedAt: serverTimestamp() });
        return ref.id;
    },

    async getStaff() {
        const teachersSnap = await getDocs(collection(db, 'teachers'));
        const adminsSnap = await getDocs(collection(db, 'admins'));
        const driversSnap = await getDocs(collection(db, 'drivers'));

        const teachers = teachersSnap.docs.map(d => ({ id: d.id, ...d.data(), role: d.data().role || 'Teacher' }));
        const admins = adminsSnap.docs.map(d => ({ id: d.id, ...d.data(), role: d.data().role || 'Admin' }));
        const drivers = driversSnap.docs.map(d => ({ id: d.id, ...d.data(), role: d.data().role || 'Driver' }));

        return [...teachers, ...admins, ...drivers];
    },

    async getAllStaff() {
        return this.getStaff();
    },

    async updateStaff(id: string, updates: any) {
        // ID is Email now
        const teacherRef = doc(db, 'teachers', id);
        const adminRef = doc(db, 'admins', id);
        const driverRef = doc(db, 'drivers', id);

        // Try update in all collections
        const tSnap = await getDoc(teacherRef);
        if (tSnap.exists()) {
            await updateDoc(teacherRef, updates);
            return;
        }

        const aSnap = await getDoc(adminRef);
        if (aSnap.exists()) {
            await updateDoc(adminRef, updates);
            return;
        }

        const dSnap = await getDoc(driverRef);
        if (dSnap.exists()) {
            await updateDoc(driverRef, updates);
        }
    },

    async deleteStaff(id: string, role: string) {
        // Try deleting from all potential staff collections to handle mismatches
        const collections = ['admins', 'teachers', 'drivers', 'staff'];
        await Promise.all(collections.map(col => deleteDoc(doc(db, col, id))));
    },

    // 7. Student Specific Getters
    async getStudentFees(studentEmail: string) {
        // Fetch fee records for this student
        const q = query(
            collection(db, 'fees'),
            where('studentId', '==', studentEmail),
            orderBy('date', 'desc')
        );
        const snap = await getDocs(q);
        return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    },

    async getStudentAttendance(studentEmail: string) {
        const q = query(
            collection(db, 'attendance'),
            where('studentId', '==', studentEmail),
            orderBy('date', 'desc'),
            limit(30) // Last 30 days
        );
        const snap = await getDocs(q);
        return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    },

    async markAttendance(classId: string, date: string, records: { studentId: string, status: 'Present' | 'Absent' | 'Late', name: string }[]) {
        const batch = writeBatch(db);

        records.forEach(rec => {
            // ID: date_studentId
            const docId = `${date}_${rec.studentId}`;
            const ref = doc(db, 'attendance', docId);
            batch.set(ref, {
                date: new Date(date).toISOString(),
                classId,
                studentId: rec.studentId,
                studentName: rec.name,
                status: rec.status,
                markedAt: serverTimestamp()
            });
        });

        await batch.commit();
        return true;
    },

    // 9. Subject Management
    async getSubjects() {
        const subRef = collection(db, 'subjects');
        const snap = await getDocs(subRef);
        return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    },

    async createSubject(subject: { name: string; code: string; type: string }) {
        const subRef = collection(db, 'subjects');
        await addDoc(subRef, { ...subject, createdAt: serverTimestamp() });
    },

    async updateSubject(id: string, updates: any) {
        await updateDoc(doc(db, 'subjects', id), updates);
    },

    async deleteSubject(id: string) {
        await deleteDoc(doc(db, 'subjects', id));
    },

    async assignTeacherToSubject(subjectId: string, teacherId: string, teacherName: string) {
        // 1. Update Subject Doc
        await updateDoc(doc(db, 'subjects', subjectId), {
            teacherId: teacherId
        });

        // 2. Update Teacher Doc (Check both teachers and admins collections as per our split)
        const subjectSnap = await getDoc(doc(db, 'subjects', subjectId));
        const subjectName = subjectSnap.data()?.name || '';

        const teacherRef = doc(db, 'teachers', teacherId);
        const adminRef = doc(db, 'admins', teacherId);

        const tSnap = await getDoc(teacherRef);
        if (tSnap.exists()) {
            await updateDoc(teacherRef, { subject: subjectName, subjectId: subjectId });
            return;
        }

        const aSnap = await getDoc(adminRef);
        if (aSnap.exists()) {
            await updateDoc(adminRef, { subject: subjectName, subjectId: subjectId });
        }
    },

    // 10. Extended Student Management (ERP)
    async getAllStudents(classFilter?: string) {
        const studentsRef = collection(db, 'students');
        const snap = await getDocs(studentsRef);
        let students = snap.docs.map(d => ({ id: d.id, ...d.data() } as any));

        if (classFilter) {
            students = students.filter((s: any) => s.classLevel == classFilter);
        }
        return students;
    },

    async updateStudent(studentId: string, updates: any) {
        const studentRef = doc(db, 'students', studentId);
        const userRef = doc(db, 'users', studentId);

        const studentSnap = await getDoc(studentRef);
        if (studentSnap.exists()) {
            await updateDoc(studentRef, cleanObject(updates));
            return;
        }

        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
            await updateDoc(userRef, cleanObject(updates));
            return;
        }

        throw new Error("Student not found in either School or LMS records.");
    },

    async deleteStudent(studentId: string) {
        await deleteDoc(doc(db, 'students', studentId));
        await deleteDoc(doc(db, 'users', studentId));
    },

    // 11. Extended Class Details
    async updateClass(classId: string, updates: any) {
        const docRef = doc(db, 'classes', classId);
        await updateDoc(docRef, updates);
    },

    async getClassStudents(grade: string, section?: string) {
        // Find students with this grade/section
        const studentsRef = collection(db, 'students');
        const snap = await getDocs(studentsRef);
        return snap.docs
            .map(d => ({ id: d.id, ...d.data() } as any))
            .filter(s => s.classLevel == grade && (!section || s.section === section || s.erpData?.details?.section === section));
    },

    // 7. Stats & Overview
    async getOverviewStats() {
        // Fetch real count from collections
        const [studentsSnap, classesSnap, teachersSnap, adminsSnap, busesSnap] = await Promise.all([
            getDocs(collection(db, 'students')),
            getDocs(collection(db, 'classes')),
            getDocs(collection(db, 'teachers')),
            getDocs(collection(db, 'admins')),
            getDocs(collection(db, 'buses'))
        ]);

        let totalCollected = 0;
        let expectedFee = 0;
        let admissionCount = 0;

        // Calculate Fees from Student Data
        studentsSnap.docs.forEach(doc => {
            const data = doc.data();
            admissionCount++;
            totalCollected += (data.feePaid || 0);
        });

        // Calculate Pending Fees (based on Annual Fee for academic year)
        const classes = classesSnap.docs.map(d => ({ id: d.id, ...d.data() } as any));
        studentsSnap.docs.forEach(doc => {
            const student = doc.data();
            const studentClass = classes.find(c => c.id === student.classLevel);
            if (studentClass && studentClass.annualFee) {
                expectedFee += studentClass.annualFee;
            }
        });

        const pendingFees = Math.max(0, expectedFee - totalCollected);

        return {
            admissions: admissionCount,
            totalCollected,
            pendingFees,
            totalStaff: teachersSnap.size + adminsSnap.size,
            totalClasses: classesSnap.size,
            totalBuses: busesSnap.size
        };
    },

    // 8. Real Fee Management Logic
    async recordFeePayment(studentId: string, amount: number, remarks: string, month?: string) {
        const studentRef = doc(db, 'students', studentId);
        const studentSnap = await getDoc(studentRef);

        if (!studentSnap.exists()) throw new Error("Student not found");

        const studentData = studentSnap.data();
        const currentPaid = studentData.feePaid || 0;
        const history = studentData.feeHistory || [];

        const newPayment = {
            amount,
            date: new Date().toISOString(),
            remarks,
            month: month || 'General',
            id: new Date().getTime().toString()
        };

        await updateDoc(studentRef, {
            feePaid: currentPaid + amount,
            feeHistory: [...history, newPayment]
        });
    },

    // 12. Smart Academic Features (LEAD Style)

    // --- Homework ---
    async createHomework(data: { classLevel: string, section: string, subjectId: string, title: string, description: string, dueDate: string, teacherId: string }) {
        const ref = collection(db, 'homework');
        await addDoc(ref, {
            ...data,
            createdAt: serverTimestamp(),
            status: 'Active'
        });
    },

    async getHomework(classLevel: string, section: string) {
        const ref = collection(db, 'homework');
        // Simple query: match class and section
        const q = query(ref, where('classLevel', '==', classLevel), where('section', '==', section), orderBy('createdAt', 'desc'), limit(50));
        const snap = await getDocs(q);
        return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    },

    // --- Circulars / Notices (Unified) ---
    async createNotice(data: { title: string, content: string, audience: 'All' | 'Teachers' | 'Students' | 'Parents' | 'Drivers', author: string }) {
        await addDoc(collection(db, 'notices'), {
            ...data,
            date: new Date().toISOString(),
            createdAt: serverTimestamp()
        });
    },

    async getNotices(audience: string) {
        const ref = collection(db, 'notices');
        const snap = await getDocs(ref);
        const allNotices = snap.docs
            .map(d => ({ id: d.id, ...d.data() } as any))
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        // If Admin, return all
        if (audience === 'Admin') return allNotices;

        // Otherwise filter
        return allNotices.filter(n => {
            // 'All' audience always shown
            if (n.audience === 'All') return true;
            // Match specific audience (handle singular/plural mismatch just in case)
            if (n.audience === audience) return true;
            if (audience === 'Students' && n.audience === 'Student') return true;
            if (audience === 'Student' && n.audience === 'Students') return true;
            return false;
        });
    },

    async deleteNotice(id: string) {
        await deleteDoc(doc(db, 'notices', id));
    },

    // --- Admissions CRM (Leads) ---
    async addLead(lead: { parentName: string, studentName: string, phone: string, classInterest: string, status: 'Inquiry' | 'Visit' | 'Application' | 'Converted' }) {
        await addDoc(collection(db, 'leads'), {
            ...lead,
            lastContact: new Date().toISOString(),
            createdAt: serverTimestamp()
        });
    },

    async getLeads() {
        const snap = await getDocs(collection(db, 'leads'));
        return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    },

    async updateLeadStage(id: string, status: string) {
        await updateDoc(doc(db, 'leads', id), { status, lastContact: new Date().toISOString() });
    },

    // --- Parent Helpdesk (Ticketing) ---
    async createTicket(ticket: { parentId: string, studentName: string, category: string, description: string }) {
        await addDoc(collection(db, 'tickets'), {
            ...ticket,
            status: 'Open',
            createdAt: serverTimestamp(),
            updates: []
        });
    },

    async getTickets() {
        const snap = await getDocs(collection(db, 'tickets'));
        return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    },

    async resolveTicket(id: string, reply: string) {
        await updateDoc(doc(db, 'tickets', id), {
            status: 'Resolved',
            resolution: reply,
            resolvedAt: new Date().toISOString()
        });
    },

    // --- Legacy Circulars (Deprecated - use createNotice instead) ---
    async createCircular(circular: { title: string, content: string, audience: string, date?: string, author?: string }) {
        // Redirect to unified notices collection
        await this.createNotice({
            title: circular.title,
            content: circular.content,
            audience: circular.audience as any,
            author: circular.author || 'Admin'
        });
    },

    async getCirculars() {
        // Redirect to getNotices with 'All' to maintain backward compatibility
        return this.getNotices('All');
    },

    async deleteCircular(id: string) {
        await this.deleteNotice(id);
    },

    // --- AI Assessment (Question Paper Generator) ---
    async saveQuestionPaper(paper: {
        classLevel: string,
        subject: string,
        title: string,
        teacherId: string,
        questions: any[],
        totalMarks: number,
        type: 'Manual' | 'AI-Generated'
    }) {
        await addDoc(collection(db, 'assessments'), {
            ...paper,
            status: 'Pending Approval',
            createdAt: serverTimestamp()
        });
    },

    async getQuestionPapers(filters?: { classLevel?: string, subject?: string }) {
        const ref = collection(db, 'assessments');
        const snap = await getDocs(ref);
        let docs = snap.docs.map(d => ({ id: d.id, ...d.data() } as any));

        if (filters?.classLevel) docs = docs.filter(d => d.classLevel === filters.classLevel);
        if (filters?.subject) docs = docs.filter(d => d.subject === filters.subject);

        return docs.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
    },

    async approveQuestionPaper(id: string) {
        await updateDoc(doc(db, 'assessments', id), { status: 'Approved' });
    },

    async getFeeDetails() {
        // 1. Get All Classes
        const classesSnap = await getDocs(collection(db, 'classes'));
        const classes = classesSnap.docs.map(d => ({ id: d.id, ...d.data() } as any));

        // 2. Get All Students (Admitted)
        const usersSnap = await getDocs(collection(db, 'users'));
        const students = usersSnap.docs.map(d => d.data()) as any[];

        // 3. Aggregate Data
        // Map: ClassID -> { collected, pending, totalStudents }
        const classStats: any = {};

        classes.forEach(c => {
            classStats[c.id] = {
                grade: c.grade,
                section: c.section,
                annualFee: c.annualFee || 0,
                collected: 0,
                expected: 0,
                name: `${c.grade} -${c.section} `
            };
        });

        students.forEach(s => {
            if (s.classLevel && classStats[s.classLevel]) {
                const paid = s.feePaid || 0;
                const yearlyDue = (classStats[s.classLevel].annualFee || 0);

                classStats[s.classLevel].collected += paid;
                classStats[s.classLevel].expected += yearlyDue;
            }
        });

        // 4. Transform to List for UI
        // Group by Grade for the breakdown view
        const gradeMap: any = {};

        Object.values(classStats).forEach((cs: any) => {
            if (!gradeMap[cs.grade]) {
                gradeMap[cs.grade] = {
                    grade: cs.grade,
                    totalFee: 0, // Sum of collected for grade
                    sections: []
                };
            }
            gradeMap[cs.grade].sections.push({
                name: cs.section,
                collected: cs.collected,
                pending: Math.max(0, cs.expected - cs.collected)
            });
            gradeMap[cs.grade].totalFee += cs.collected;
        });

        return Object.values(gradeMap);
    },

    // 12. Admission Requests (Public -> Admin)
    async submitAdmissionRequest(request: AdmissionRequest) {
        const ref = collection(db, 'admission_requests');
        await addDoc(ref, { ...request, status: 'Pending', createdAt: serverTimestamp() });
    },

    // --- Attendance System ---
    async markAttendanceRegister(classId: string, date: string, records: { studentId: string, status: 'Present' | 'Absent' }[]) {
        const id = `${classId}_${date}`; // Unique ID for daily register
        await setDoc(doc(db, 'attendance_registers', id), {
            classId,
            date,
            records,
            createdAt: serverTimestamp()
        });
    },

    async getAttendance(classId: string, date: string) {
        const id = `${classId}_${date}`;
        const snap = await getDoc(doc(db, 'attendance_registers', id));
        return snap.exists() ? snap.data().records : [];
    },

    async getDailyAttendanceStats(date: string) {
        const q = query(collection(db, 'attendance_registers'), where('date', '==', date));
        const snap = await getDocs(q);
        let total = 0;
        let present = 0;

        snap.docs.forEach(doc => {
            const records = doc.data().records || [];
            total += records.length;
            present += records.filter((r: any) => r.status === 'Present').reduce((acc: number, val: any) => acc + 1, 0); // Count presents
            // Note: using reduce or filter length. Simple filter length is fine.
            // records.filter(r => r.status === 'Present').length;
        });

        // Re-calculate accurately
        total = 0; present = 0;
        snap.docs.forEach(doc => {
            const records = doc.data().records || [];
            total += records.length;
            present += records.filter((r: any) => r.status === 'Present').length;
        });

        return { total, present, absent: total - present };
    },

    // --- Timetable System ---
    async saveTimetable(classId: string, schedule: any) {
        // schedule: { Monday: [{ subject, teacher, time }], Tuesday: [...] }
        await setDoc(doc(db, 'timetables', classId), {
            classId,
            schedule,
            updatedAt: serverTimestamp()
        });
    },

    async getTimetable(classId: string) {
        const snap = await getDoc(doc(db, 'timetables', classId));
        return snap.exists() ? snap.data().schedule : null;
    },


    async getAdmissionRequests() {
        const snap = await getDocs(collection(db, 'admission_requests'));
        return snap.docs.map(d => ({ id: d.id, ...d.data() } as any)).sort((a, b) => b.timestamp - a.timestamp);
    },

    async updateAdmissionRequestStatus(id: string, status: 'Approved' | 'Rejected') {
        await updateDoc(doc(db, 'admission_requests', id), { status });
    },

    // 13. Exam & Grading System
    async createExam(examData: ExamData) {
        await addDoc(collection(db, 'exams'), { ...examData, createdAt: serverTimestamp() });
    },

    async getExams(grade?: string) {
        let q = collection(db, 'exams');
        const snap = await getDocs(q);
        return snap.docs.map(d => ({ id: d.id, ...d.data() } as any));
    },

    async deleteExam(id: string) {
        await deleteDoc(doc(db, 'exams', id));
    },

    async saveMarks(examId: string, studentId: string, marks: any) {
        // specific doc for student's result in an exam
        const resultId = `${examId}_${studentId} `;
        await setDoc(doc(db, 'exam_results', resultId), {
            examId,
            studentId,
            marks, // e.g., { math: 90, science: 85 }
            updatedAt: serverTimestamp()
        });
    },

    async getExamResults(examId: string) {
        // Fetch all results for a specific exam
        // In a real app we'd query by examId. For now, fetch all and filter client side if needed or just use ID convention
        const snap = await getDocs(collection(db, 'exam_results'));
        return snap.docs
            .map(d => d.data())
            .filter((r: any) => r.examId === examId);
    },
    // 14. Bulk Import Utility
    async bulkCreateStudents(students: any[]) {
        // We use batches (max 500 ops per batch)
        const batch = writeBatch(db);

        students.forEach((student) => {
            const newDocRef = doc(collection(db, "students"));

            const studentDoc = cleanObject({
                ...student,
                role: 'student',
                createdAt: serverTimestamp(),
                erpData: {
                    details: cleanObject({
                        rollNumber: student.rollNumber || '',
                        admissionDate: new Date().toISOString(),
                        address: 'Bulk Imported'
                    }),
                    guardians: cleanObject({
                        fatherName: student.parentName,
                        phone: student.phone
                    })
                }
            });

            batch.set(newDocRef, studentDoc);
        });

        await batch.commit();
    },

    // 15. Payroll Management
    // 15. Payroll Management
    async recordSalary(staffId: string, amount: number, month: string, bonus: number = 0) {
        // 1. Record Payment
        const ref = await addDoc(collection(db, 'payroll'), {
            staffId,
            amount: amount + bonus,
            baseAmount: amount,
            bonus,
            month, // Format: YYYY-MM
            paidAt: serverTimestamp(),
            status: 'Paid'
        });

        // 2. Notify Staff
        await addDoc(collection(db, 'staff_notifications'), {
            staffId,
            title: 'Salary Credited',
            message: `Your salary for ${month} of ₹${(amount + bonus).toLocaleString()} has been credited.`,
            type: 'payment',
            read: false,
            createdAt: serverTimestamp()
        });

        return ref.id;
    },

    // --- Notifications ---
    async getStaffNotifications(staffId: string) {
        const q = query(collection(db, 'staff_notifications'), where('staffId', '==', staffId), orderBy('createdAt', 'desc'));
        const snap = await getDocs(q);
        return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    },



    async getPayrollStats() {
        const snap = await getDocs(collection(db, 'payroll'));
        const docs = snap.docs.map(d => d.data());
        return docs; // Simplified return for stats
    },


    // Fee Management
    async getFees() {
        const snapshot = await getDocs(collection(db, 'fees'));
        return snapshot.docs.map(d => ({ id: d.id, ...d.data(), date: d.data().date || new Date().toISOString() }));
    },

    async collectFee(data: any) {
        await addDoc(collection(db, 'fees'), data);
    },

    async getStudents() {
        const snapshot = await getDocs(collection(db, 'students'));
        return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    },

    // 16. Events Management
    async getEvents() {
        const q = query(collection(db, 'events'), orderBy('date', 'asc'));
        const snap = await getDocs(q);
        return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    },

    async addEvent(event: any) {
        const ref = doc(collection(db, 'events'));
        await setDoc(ref, { ...event, createdAt: serverTimestamp() });
        return ref.id;
    },

    async deleteEvent(id: string) {
        await deleteDoc(doc(db, 'events', id));
    },



    // --- 18. LMS: Materials Management ---
    async addMaterial(material: any) {
        const ref = collection(db, 'materials');
        await addDoc(ref, { ...material, uploadedAt: serverTimestamp() });
    },

    async getMaterials(classLevel?: string, subjectId?: string) {
        let q = query(collection(db, 'materials'), orderBy('uploadedAt', 'desc'));
        if (classLevel) q = query(q, where('classLevel', '==', classLevel));
        if (subjectId) q = query(q, where('subjectId', '==', subjectId));

        const snap = await getDocs(q);
        return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    },

    async deleteMaterial(id: string) {
        await deleteDoc(doc(db, 'materials', id));
    },

    // --- 19. LMS: Assignments (Homework) ---
    async addAssignment(assignment: any) {
        const ref = collection(db, 'assignments');
        await addDoc(ref, { ...assignment, createdAt: serverTimestamp() });
    },

    async getAssignments(classLevel?: string, subjectId?: string) {
        let q = query(collection(db, 'assignments'), orderBy('dueDate', 'asc'));

        const snap = await getDocs(q);
        // Client-side filtering if composite index Issues arise, but simple separate index usually okay or just filter all
        // For robustness in this MVP without custom indexes:
        let docs = snap.docs.map(d => ({ id: d.id, ...d.data() } as any));
        if (classLevel) docs = docs.filter(d => d.classLevel == classLevel);
        if (subjectId) docs = docs.filter(d => d.subjectId == subjectId);
        return docs;
    },

    async deleteAssignment(id: string) {
        await deleteDoc(doc(db, 'assignments', id));
    },

    async submitAssignment(submission: any) {
        const id = `${submission.assignmentId}_${submission.studentId}`;
        await setDoc(doc(db, 'submissions', id), { ...submission, submittedAt: serverTimestamp() });
    },

    async getSubmissions(assignmentId: string) {
        const q = query(collection(db, 'submissions'), where('assignmentId', '==', assignmentId));
        const snap = await getDocs(q);
        return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    },

    // --- 20. LMS: Quizzes ---
    async createQuiz(quiz: any) {
        await addDoc(collection(db, 'quizzes'), { ...quiz, createdAt: serverTimestamp() });
    },

    async getQuizzes(classLevel?: string) {
        let q = query(collection(db, 'quizzes'), orderBy('createdAt', 'desc'));
        const snap = await getDocs(q);
        let docs = snap.docs.map(d => ({ id: d.id, ...d.data() } as any));
        if (classLevel) docs = docs.filter(d => d.classLevel == classLevel);
        return docs;
    },

    async deleteQuiz(id: string) {
        await deleteDoc(doc(db, 'quizzes', id));
    },

    async submitQuizResult(result: any) {
        const id = `${result.quizId}_${result.studentId}`;
        await setDoc(doc(db, 'quiz_results', id), { ...result, attemptedAt: serverTimestamp() });
    },

    async getStudentQuizResults(studentId: string) {
        const q = query(collection(db, 'quiz_results'), where('studentId', '==', studentId));
        const snap = await getDocs(q);
        return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    },

    // --- 21. Teacher Communication ---
    async sendMessage(msg: { from: string, to: string, subject: string, body: string, role: string }) {
        await addDoc(collection(db, 'messages'), { ...msg, timestamp: serverTimestamp(), read: false });
    },

    async getMessages(userEmail: string) {
        // Sent TO me
        const q = query(collection(db, 'messages'), where('to', '==', userEmail), orderBy('timestamp', 'desc'));
        const snap = await getDocs(q);
        return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    },

    // --- 22. Inventory Management ---
    async getInventory() {
        const snap = await getDocs(collection(db, 'inventory'));
        return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    },

    async addInventoryItem(item: any) {
        await addDoc(collection(db, 'inventory'), { ...item, updatedAt: serverTimestamp() });
    },

    async updateInventoryItem(id: string, data: any) {
        await updateDoc(doc(db, 'inventory', id), data);
    },

    async deleteInventoryItem(id: string) {
        await deleteDoc(doc(db, 'inventory', id));
    },


    // --- 23. Transport Management ---
    async getDrivers() {
        const snap = await getDocs(collection(db, 'drivers'));
        return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    },

    async addDriver(driver: any) {
        // Use email as ID if present, else auto-gen
        const Ref = driver.email ? doc(db, 'drivers', driver.email) : doc(collection(db, 'drivers'));
        await setDoc(Ref, { ...driver, status: 'Active', joinedAt: serverTimestamp() });
    },

    async getDriverByEmail(email: string) {
        const d = await getDoc(doc(db, 'drivers', email));
        return d.exists() ? { id: d.id, ...d.data() } : null;
    },
    async updateDriver(id: string, updates: any) {
        await updateDoc(doc(db, 'drivers', id), updates);
    },

    async getBuses() {
        const snap = await getDocs(collection(db, 'buses'));
        return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    },

    async addBus(bus: any) {
        const ref = await addDoc(collection(db, 'buses'), { ...bus, status: 'Active' });
        return ref.id;
    },

    async updateBus(id: string, updates: any) {
        await updateDoc(doc(db, 'buses', id), updates);
    },

    async getRoutes() {
        const snap = await getDocs(collection(db, 'routes'));
        return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    },

    async addRoute(route: any) {
        await addDoc(collection(db, 'routes'), route);
    },

    async updateRoute(id: string, updates: any) {
        await updateDoc(doc(db, 'routes', id), updates);
    },

    // Linking Logic
    async assignDriverToBus(driverId: string, busId: string) {
        // 1. Update Driver
        await updateDoc(doc(db, 'drivers', driverId), { busId: busId });
        // 2. Update Bus
        await updateDoc(doc(db, 'buses', busId), { driverId: driverId });

        // 3. Sync Route ID if Bus has one
        const busSnap = await getDoc(doc(db, 'buses', busId));
        if (busSnap.exists() && busSnap.data().routeId) {
            await updateDoc(doc(db, 'drivers', driverId), { routeId: busSnap.data().routeId });
        }
    },

    async assignBusToRoute(busId: string, routeId: string) {
        await updateDoc(doc(db, 'buses', busId), { routeId: routeId });

        // Sync to Driver
        const busSnap = await getDoc(doc(db, 'buses', busId));
        if (busSnap.exists() && busSnap.data().driverId) {
            await updateDoc(doc(db, 'drivers', busSnap.data().driverId), { routeId: routeId });
        }
    },

    async markBusAttendance(date: string, routeId: string, records: any[]) {
        const id = `${date}_${routeId}`;
        await setDoc(doc(db, 'bus_attendance', id), {
            date, routeId, records, timestamp: serverTimestamp()
        });
    },

    async getStudentsByRoute(routeId: string) {
        const q = query(collection(db, 'students'), where('erpData.details.busRouteId', '==', routeId));
        const snap = await getDocs(q);
        return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    },

    async deleteBus(id: string) {
        await deleteDoc(doc(db, 'buses', id));
    },

    async deleteDriver(id: string) {
        await deleteDoc(doc(db, 'drivers', id));
    },

    async deleteRoute(id: string) {
        await deleteDoc(doc(db, 'routes', id));
    },

    // --- Calendar System ---
    async addCalendarEvent(event: CalendarEvent) {
        return await addDoc(collection(db, 'calendar_events'), {
            ...event,
            createdAt: serverTimestamp()
        });
    },

    async getCalendarEvents() {
        const q = query(collection(db, 'calendar_events'), orderBy('date', 'asc'));
        const snap = await getDocs(q);
        return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    },

    async deleteCalendarEvent(id: string) {
        await deleteDoc(doc(db, 'calendar_events', id));
    },

    // --- 24. Class & Subject Management ---
    async getClasses() {
        const snap = await getDocs(collection(db, 'classes'));
        return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    },

    async addClass(classData: any) {
        await addDoc(collection(db, 'classes'), { ...classData, createdAt: serverTimestamp() });
    },

    // Removed duplicate updateClass


    async deleteClass(id: string) {
        await deleteDoc(doc(db, 'classes', id));
    },

    async getAllSubjects() {
        const snap = await getDocs(collection(db, 'subjects'));
        return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    },

    async addSubject(subject: any) {
        await addDoc(collection(db, 'subjects'), { ...subject, createdAt: serverTimestamp() });
    },

    async updateSubjectDetails(id: string, updates: any) {
        await updateDoc(doc(db, 'subjects', id), updates);
    },

    async removeSubject(id: string) {
        await deleteDoc(doc(db, 'subjects', id));
    },

    async assignClassSubjectTeacher(classId: string, subjectId: string, teacherId: string) {
        // Renamed to avoid conflict with assignTeacherToSubject(subjectId, ...)
        const classRef = doc(db, 'classes', classId);
        await updateDoc(classRef, {
            [`subjectTeachers.${subjectId}`]: teacherId
        });
    },

    // --- 25. Helpdesk (Student) ---
    async createStudentTicket(ticket: any) {
        await addDoc(collection(db, 'tickets'), {
            ...ticket,
            status: 'Open',
            createdAt: serverTimestamp()
        });
    },

    async getStudentTickets() {
        const snap = await getDocs(collection(db, 'tickets'));
        return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    },

    // --- 26. Question Papers (Teacher) ---
    async saveTeacherQuestionPaper(paper: any) {
        await addDoc(collection(db, 'question_papers'), {
            ...paper,
            createdAt: serverTimestamp(),
            status: 'Pending Review'
        });
    },

    // --- 27. Student Specific Views ---
    async fetchStudentFees(email: string) {
        // Fetch fees where studentEmail matches
        const q = query(collection(db, 'fees'), where('studentEmail', '==', email), orderBy('date', 'desc'));
        const snap = await getDocs(q);
        return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    },

    async fetchStudentAttendance(email: string) {
        // Fetch attendance records for this student
        const q = query(collection(db, 'attendance_records'), where('studentEmail', '==', email), orderBy('date', 'desc'));
        const snap = await getDocs(q);
        return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    },

    async getStudentsByClassId(classId: string) {
        return this.getAllStudents(classId);
    },

    // --- 28. Class Attendance (Teacher) ---
    async submitClassAttendance(classId: string, date: string, records: any[]) {
        // 1. Save the daily register summary
        const registerId = `${classId}_${date}`;
        await setDoc(doc(db, 'class_registers', registerId), {
            classId,
            date,
            totalStudents: records.length,
            presentCount: records.filter(r => r.status === 'Present').length,
            timestamp: serverTimestamp()
        });

        // 2. Save individual student records for querying by student
        const batch = writeBatch(db);

        // We might have many students, so we should be careful with batch limits (500). 
        // For a single class (30-60 students), one batch is fine.
        records.forEach(record => {
            // record: { studentId, status, name }
            // We need studentEmail ideally, but if not present, we rely on ID.
            // Let's assume record has studentId. We might need to fetch studentEmail if not provided, 
            // but for now, let's assume the UI passes what it has.
            // To make `getStudentAttendance` work with email, we need to ensure we save email here.
            // The UI (TeacherModules) passes: { studentId, status, name }.

            // Generate a unique ID for the record: studentId_date
            const recordRef = doc(db, 'attendance_records', `${record.studentId}_${date}`);

            // ! Critical: We need student email for the student portal query. 
            // If the UI doesn't pass it, we might have an issue.
            // Let's trust that the 'students' array in TeacherModules has 'email' and we can pass it down.
            // I will update TeacherModules to pass email.

            batch.set(recordRef, {
                classId,
                date,
                studentId: record.studentId,
                studentName: record.name,
                studentEmail: record.email || '', // Anticipating UI update
                status: record.status,
                timestamp: serverTimestamp()
            });
        });

        await batch.commit();
    }
};


export interface ExamData {
    title: string;
    grade: string;
    date: string;
    subjects: string[]; // List of subject IDs or Names
    totalMarks: number;
}


export interface AdmissionRequest {
    id?: string;
    studentName: string;
    parentName: string; // Father or Mother
    email: string;
    phone: string;
    grade: string;
    message?: string;
    status?: 'Pending' | 'Approved' | 'Rejected';
    timestamp?: any;
}

export interface ClassSection {
    id: string;
    grade: string;
    section: string;
    stream?: string;
}

export interface Driver {
    id: string;
    name: string;
    license: string;
    phone: string;
    status: 'Active' | 'On Leave';
}

export interface Bus {
    id: string;
    number: string;
    capacity: number;
    status: 'Active' | 'Maintenance';
}

export interface Route {
    id: string;
    name: string;
    fees: number;
    stopCount: number;
}

export interface Staff {
    id: string;
    name: string;
    role: string;
    subject: string;
    email: string;
    phone: string;
    joinedAt?: any;
}

export interface CalendarEvent {
    id?: string;
    title: string;
    start: string; // ISO Date string
    type: 'Holiday' | 'Exam' | 'Activity' | 'Meeting';
    description?: string;
}
