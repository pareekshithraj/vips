import { db } from './firebase';
import { collection, doc, setDoc, writeBatch, serverTimestamp, getDocs, deleteDoc, updateDoc } from 'firebase/firestore';
import { managementService } from './management';

// Helper to generate random dates within the last year
const randomDate = (start: Date, end: Date) => {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

const SAMPLE_NAMES = [
    "Aarav", "Vivaan", "Aditya", "Vihaan", "Arjun", "Sai", "Reyansh", "Ayan", "Krishna", "Ishaan",
    "Diya", "Saanvi", "Ananya", "Aadhya", "Pari", "Kiara", "Myra", "Riya", "Anvi", "Angel"
];
const SURNAMES = ["Patel", "Sharma", "Gupta", "Singh", "Kumar", "Verma", "Mehta", "Reddy", "Nair", "Iyer"];

const CLASSES = ["9", "10", "11", "12"];
const SECTIONS = ["A", "B"];
const SUBJECTS = ["Mathematics", "Physics", "Chemistry", "Biology", "English", "Computer Science", "History", "Geography"];

export const seederService = {
    async clearDatabase() {
        console.log("Clearing Database...");
        const collections = ['students', 'teachers', 'drivers', 'classes', 'bus_routes', 'fees', 'attendance', 'notices', 'timetables'];
        for (const col of collections) {
            const snap = await getDocs(collection(db, col));
            const batch = writeBatch(db);
            snap.docs.forEach(d => batch.delete(d.ref));
            await batch.commit();
        }
        console.log("Database Cleared.");
    },

    async seedAll() {
        console.log("Starting Seeding...");

        // 1. Create Classes
        for (const cls of CLASSES) {
            for (const sec of SECTIONS) {
                const classId = `${cls}-${sec}`;
                await setDoc(doc(db, 'classes', classId), {
                    grade: cls,
                    section: sec, // Store section properly
                    sectionName: sec,
                    annualFee: cls === '11' || cls === '12' ? 65000 : 45000,
                    classTeacher: 'Pending',
                    schoolId: 'school_vidyabodhini_2024'
                });

                // Create Timetable for this class
                const schedule: any = {};
                ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].forEach(day => {
                    schedule[day] = [
                        { subject: 'Mathematics', time: '09:00 AM', teacher: 'Mrs. Sharma', status: 'Upcoming' },
                        { subject: 'Physics', time: '10:30 AM', teacher: 'Mr. Verma', status: 'Upcoming' },
                        { subject: 'English', time: '12:00 PM', teacher: 'Ms. Alice', status: 'Upcoming' },
                        { subject: 'Computer Sci', time: '01:30 PM', teacher: 'Tech Lab', status: 'Upcoming' }
                    ];
                });
                // Ensure Today has data
                const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                const today = days[new Date().getDay()];
                if (today !== 'Sunday' && today !== 'Saturday') {
                    // already covered in loop
                } else {
                    // Add mock weekend classes if testing on weekend
                    schedule['Saturday'] = [
                        { subject: 'Extra Class', time: '10:00 AM', teacher: 'Mr. Singh', status: 'Upcoming' }
                    ];
                }

                await managementService.saveTimetable(classId, schedule);
            }
        }

        // 2. Create Bus Routes
        const routes = [
            { name: 'Route 1 - North City', driver: 'Raju Driver', fees: 1500, stopCount: 5, stops: ['Central Mall', 'City Park', 'Sector 12', 'School'] },
            { name: 'Route 2 - South Extension', driver: 'Mohan Driver', fees: 1800, stopCount: 6, stops: ['Lakeside', 'Green Valley', 'Market Road', 'School'] }
        ];

        for (const route of routes) {
            await setDoc(doc(db, 'bus_routes', route.name.replace(/\s+/g, '_')), {
                ...route,
                createdAt: serverTimestamp(),
                schoolId: 'school_vidyabodhini_2024'
            });
        }

        // 3. Create Students (Batch)
        const studentBatch = writeBatch(db);
        const students: any[] = [];

        for (let i = 0; i < 50; i++) {
            const firstName = SAMPLE_NAMES[Math.floor(Math.random() * SAMPLE_NAMES.length)];
            const lastName = SURNAMES[Math.floor(Math.random() * SURNAMES.length)];
            const fullName = `${firstName} ${lastName}`;
            const cls = CLASSES[Math.floor(Math.random() * CLASSES.length)];
            const sec = SECTIONS[Math.floor(Math.random() * SECTIONS.length)];
            const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@vidyabodhini.org`; // Unique email

            const studentData = {
                name: fullName,
                email: email,
                role: 'student',
                classLevel: `${cls}-${sec}`, // ID: 10-A
                rollNumber: 100 + i,
                isSchoolStudent: true,
                onboarded: true,
                phone: '9876543210',
                address: '123, Sample Street, City',
                feePaid: Math.random() > 0.5 ? (cls === '11' ? 65000 : 45000) : 20000,
                attendance: Math.floor(Math.random() * 20) + 80, // 80-100%
                erData: {
                    details: {
                        admittedBy: 'Admin',
                        fatherName: `Mr. ${lastName}`,
                        motherName: `Mrs. ${lastName}`
                    }
                },
                schoolId: 'school_vidyabodhini_2024'
            };

            const ref = doc(db, 'students', email);
            studentBatch.set(ref, studentData);
            students.push(studentData);

            // Seed Fees
            const feeRef = doc(db, 'fees', `${email}_2024`);
            studentBatch.set(feeRef, {
                studentId: email,
                amount: 25000,
                status: 'Paid',
                date: new Date().toISOString(),
                type: 'Tuition Fee Term 1'
            });

            // Seed Attendance (Last 30 days)
            // Note: In real app we allow `managementService` to handle this but for seed we batch
            // Skipping detailed daily attendance for 50 students to save writes, 
            // but we will ensure `getStudentAttendance` has something.
            // Let's add 5 records for each student
            for (let d = 1; d <= 5; d++) {
                const dDate = new Date();
                dDate.setDate(dDate.getDate() - d);
                const attRef = doc(db, 'attendance', `${dDate.toISOString().split('T')[0]}_${email}`);
                studentBatch.set(attRef, {
                    studentId: email,
                    date: dDate.toISOString(),
                    status: Math.random() > 0.1 ? 'Present' : 'Absent',
                    classId: `${cls}-${sec}`
                });
            }
        }
        await studentBatch.commit();

        // 4. Create Staff (Teachers & Drivers)
        // Teacher 1 (Generic)
        await setDoc(doc(db, 'teachers', 'teacher@vidyabodhini.org'), {
            name: 'Demo Teacher',
            email: 'teacher@vidyabodhini.org',
            role: 'teacher',
            subject: 'Mathematics',
            schoolId: 'school_vidyabodhini_2024',
            joinedAt: serverTimestamp()
        });
        // Teacher 2 (Custom User)
        await setDoc(doc(db, 'teachers', 'vijay@vips.in'), {
            name: 'Vijay Staff',
            email: 'vijay@vips.in',
            role: 'teacher',
            phone: '9876543210',
            subject: 'Physics',
            schoolId: 'school_vidyabodhini_2024',
            joinedAt: serverTimestamp()
        });
        // Driver
        await setDoc(doc(db, 'drivers', 'driver@vidyabodhini.org'), {
            name: 'Demo Driver',
            email: 'driver@vidyabodhini.org',
            role: 'driver',
            phone: '9876543211',
            licenseNumber: 'DL-1234567890',
            routeId: 'Route_1_-_North_City', // Matches route seeded above
            schoolId: 'school_vidyabodhini_2024',
            joinedAt: serverTimestamp()
        });

        // 5. Create Notices
        const notices = [
            { title: 'School Sports Day', content: 'Annual Sports Day will be held on 25th Jan.', audience: 'All' },
            { title: 'Parent Teacher Meeting', content: 'PTM for Class 10 is scheduled for Saturday.', audience: 'Parents' },
            { title: 'Exam Schedule Released', content: 'Final Exams start from March 1st. Check timetable.', audience: 'Students' },
            { title: 'Staff Meeting', content: 'Urgent staff meeting in the Conference Room at 2 PM.', audience: 'Teachers' }
        ];

        for (const n of notices) {
            await managementService.createNotice({ ...n, author: 'Principal', schoolId: 'school_vidyabodhini_2024' } as any);
        }

        console.log("Seeding Complete!");
        return { success: true, message: `Seeded ${students.length} students, classes, and routes.` };
    },

    async repairData() {
        console.log("Starting Robust Repair...");
        let count = 0;
        const updates: Promise<any>[] = [];

        // Helper to queue update
        const queueUpdate = (ref: any, data: any) => {
            updates.push(updateDoc(ref, data).then(() => count++).catch(e => console.error("Repair failed for doc:", e)));
        };

        // Repair Students
        const sSnap = await getDocs(collection(db, 'students'));
        sSnap.docs.forEach(d => {
            const data = d.data();
            const update: any = {};
            if (!data.schoolId) update.schoolId = 'school_vidyabodhini_2024';
            // Fix classLevel type if needed (ensure it's a string)
            if (typeof data.classLevel === 'number') update.classLevel = String(data.classLevel);

            if (Object.keys(update).length > 0) queueUpdate(d.ref, update);
        });

        // Repair Teachers
        const tSnap = await getDocs(collection(db, 'teachers'));
        tSnap.docs.forEach(d => {
            if (!d.data().schoolId) queueUpdate(d.ref, { schoolId: 'school_vidyabodhini_2024' });
        });

        // Repair Classes
        const cSnap = await getDocs(collection(db, 'classes'));
        cSnap.docs.forEach(d => {
            if (!d.data().schoolId) queueUpdate(d.ref, { schoolId: 'school_vidyabodhini_2024' });
        });

        // Execute all updates
        await Promise.all(updates);
        return { success: true, message: `Scanned DB. Repaired ${count} issues.` };
    }
};
