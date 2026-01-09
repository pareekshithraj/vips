import { db } from './firebase';
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    signOut,
    onAuthStateChanged,
    User,
    EmailAuthProvider,
    reauthenticateWithCredential,
    updatePassword,
    sendPasswordResetEmail
} from 'firebase/auth';
import { doc, getDoc, collection, query, where, getDocs, setDoc } from 'firebase/firestore';
import { userService } from './user';



export const authService = {


    async login(data: any): Promise<any> {
        // Email/Pass Login
        const userCredential = await signInWithEmailAndPassword(getAuth(), data.email, data.password);
        const email = userCredential.user.email!.toLowerCase(); // Normalize to lowercase for Firestore ID lookup

        console.log('[Auth] Login Logic Started for:', email);

        // UNIVERSAL PRIORITY CHECK - PARALLEL EXECUTION
        const collections = ['admins', 'teachers', 'drivers', 'students', 'users'];
        const checks = [
            getDoc(doc(db, 'admins', email)),
            getDoc(doc(db, 'teachers', email)),
            getDoc(doc(db, 'drivers', email)),
            getDoc(doc(db, 'students', email)),
            getDoc(doc(db, 'users', email))
        ];

        const results = await Promise.all(checks);
        
        const [adminSnap, teacherSnap, driverSnap, schoolStudentSnap, studentSnap] = results;

        // 1. Check Admins
        if (adminSnap.exists()) return { email, uid: userCredential.user.uid, ...adminSnap.data(), role: 'admin' };

        // 2. Check Teachers
        if (teacherSnap.exists()) {
            console.log('[Auth] Teacher Found!');
            return { email, uid: userCredential.user.uid, ...teacherSnap.data(), role: 'teacher' };
        }

        // 3. Check Drivers
        if (driverSnap.exists()) {
            return { email, uid: userCredential.user.uid, ...driverSnap.data(), role: 'driver' };
        }

        // 4. Check School Students
        if (schoolStudentSnap.exists()) {
            return { email, uid: userCredential.user.uid, ...schoolStudentSnap.data(), role: 'student', isSchoolStudent: true };
        }

        // 5. Check External LMS Users
        if (studentSnap.exists()) {
            return { email, uid: userCredential.user.uid, ...studentSnap.data(), role: 'student', isSchoolStudent: false };
        }

        // On-the-fly provisioning if missing? (Optional)
        console.log('[Auth] No Record Found - Defaulting to Student New');
        return {
            email: userCredential.user.email!,
            uid: userCredential.user.uid,
            role: 'student',
        };
    },

    async register(data: any) {
        const userCredential = await createUserWithEmailAndPassword(getAuth(), data.email, data.password);
        const user = userCredential.user;

        // Create initial user config in Firestore
        await userService.updateUserConfig(data.email, {
            name: data.name,
            email: data.email,
            phone: data.phone,
            schoolName: data.schoolName,
            classLevel: parseInt(data.classLevel) as any,
            syllabusType: data.syllabusType,
            selectedSubjectIds: [],
            customSubjects: [],
            manualChapters: {},
            examDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 60).toISOString().split('T')[0],
            availableHours: [
                { weekday: 0, hours: 6 }, { weekday: 1, hours: 3 }, { weekday: 2, hours: 3 },
                { weekday: 3, hours: 3 }, { weekday: 4, hours: 3 }, { weekday: 5, hours: 3 },
                { weekday: 6, hours: 5 }
            ],
            chapterProgress: {},
            completedTopicIds: [],
            onboarded: false,
            gamification: { streak: 0, lastStudyDate: '', points: 0, unlockedAchievementIds: [] }
        });

        return {
            email: user.email!,
            uid: user.uid,
            role: 'student', 
        };
    },

    async changePassword(currentPass: string, newPass: string) {
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user || !user.email) throw new Error("Not logged in");

        // Re-authenticate
        const cred = EmailAuthProvider.credential(user.email, currentPass);

        await reauthenticateWithCredential(user, cred);
        await updatePassword(user, newPass);

        return { success: true };
    },

    async sendPasswordResetEmail(email: string) {
        const auth = getAuth();
        await sendPasswordResetEmail(auth, email);
    },

    async logout() {
        const auth = getAuth();
        await signOut(auth);
        localStorage.removeItem('user_session'); // Clear session
    },

    async getSession(): Promise<any> {
        return new Promise((resolve) => {
            const unsubscribe = onAuthStateChanged(getAuth(), async (user) => {
                unsubscribe();
                if (user && user.email) {
                    const email = user.email.toLowerCase();

                    // PARALLEL EXECUTION
                    const checks = [
                        getDoc(doc(db, 'admins', email)),
                        getDoc(doc(db, 'teachers', email)),
                        getDoc(doc(db, 'drivers', email)),
                        getDoc(doc(db, 'students', email)),
                        getDoc(doc(db, 'users', email))
                    ];

                    try {
                        const [adminSnap, teacherSnap, driverSnap, schoolStudentSnap, studentSnap] = await Promise.all(checks);

                        // 1. Check Admins
                        if (adminSnap.exists()) {
                            resolve({ email: user.email, ...adminSnap.data(), role: 'admin' });
                            return;
                        }

                        // 2. Check Teachers
                        if (teacherSnap.exists()) {
                            resolve({ email: user.email, ...teacherSnap.data(), role: 'teacher' });
                            return;
                        }

                        // 3. Check Drivers
                        if (driverSnap.exists()) {
                            resolve({ email: user.email, ...driverSnap.data(), role: 'driver' });
                            return;
                        }

                        // 4. Check SCHOOL STUDENTS
                        if (schoolStudentSnap.exists()) {
                            resolve({ email: user.email, ...schoolStudentSnap.data(), role: 'student', isSchoolStudent: true });
                            return;
                        }

                        // 5. Check EXTERNAL USERS (LMS)
                        if (studentSnap.exists()) {
                            resolve({ email: user.email, role: 'student', isSchoolStudent: false, ...studentSnap.data() });
                            return;
                        }

                        // If logged in but no data
                        resolve(null);

                    } catch (err) {
                        console.error("Error fetching user session data:", err);
                        resolve(null);
                    }
                } else {
                    resolve(null);
                }
            });
        });
    }
};
