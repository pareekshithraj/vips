import { auth } from './firebase';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    signOut,
    onAuthStateChanged,
    User
} from 'firebase/auth';
import { userService } from './user';

export const googleProvider = new GoogleAuthProvider();

export const authService = {
    async loginWithGoogle() {
        const userCredential = await signInWithPopup(auth, googleProvider);
        const user = userCredential.user;

        // Check if user exists in Firestore, if not create basic config
        const existingConfig = await userService.getUserConfig(user.email!);
        if (!existingConfig) {
            await userService.updateUserConfig(user.email!, {
                name: user.displayName || 'Student',
                email: user.email!,
                phone: '',
                schoolName: 'Vidyabodhini Integrated Public School',
                classLevel: 10,
                syllabusType: 'CBSE',
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
        }

        return {
            email: user.email,
            uid: user.uid,
            name: user.displayName,
            photoURL: user.photoURL
        };
    },

    async login(data: any): Promise<any> {
        const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
        return {
            email: userCredential.user.email,
            uid: userCredential.user.uid
        };
    },

    async register(data: any) {
        const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);

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
            email: userCredential.user.email,
            uid: userCredential.user.uid
        };
    },

    async logout() {
        return signOut(auth);
    },

    async getSession(): Promise<any> {
        return new Promise((resolve) => {
            const unsubscribe = onAuthStateChanged(auth, async (user) => {
                unsubscribe();
                if (user && user.email) {
                    // Fetch user details to return a complete session object like before
                    const config = await userService.getUserConfig(user.email);
                    resolve(config || { email: user.email });
                } else {
                    resolve(null);
                }
            });
        });
    }
};
