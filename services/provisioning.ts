import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { firebaseConfig } from './firebase';

// Helper to Create User without logging out Admin
// Uses a secondary Firebase App instance
export const provisioningService = {
    async createUserAccount(email: string, password: string = 'welcome123') {
        let secondaryApp;
        try {
            // Check if secondary app init needed
            if (!getApps().some(app => app.name === 'ProvisioningApp')) {
                secondaryApp = initializeApp(firebaseConfig, 'ProvisioningApp');
            } else {
                secondaryApp = getApp('ProvisioningApp');
            }

            const secondaryAuth = getAuth(secondaryApp);

            // Create user in secondary auth (does not affect main auth)
            try {
                const userCred = await createUserWithEmailAndPassword(secondaryAuth, email, password);
                // Immediately sign out this secondary user to be safe
                await signOut(secondaryAuth);
                return { success: true, uid: userCred.user.uid, tempPassword: password };
            } catch (error: any) {
                if (error.code === 'auth/email-already-in-use') {
                    // If exists, we can't force reset password from client SDK without old password.
                    // But we can trigger a reset email?
                    // Or just report it exists.
                    return { success: false, reason: 'exists' };
                }
                throw error;
            }
        } catch (error: any) {
            console.error("Provisioning Error:", error);
            throw error;
        }
    },

    // New: Force Reset Password (Client Side Limitation: Can only send email if exists, or recreate)
    async sendResetEmail(email: string) {
        try {
            const auth = getAuth(); // Main auth
            const { sendPasswordResetEmail } = await import('firebase/auth');
            await sendPasswordResetEmail(auth, email);
            return { success: true };
        } catch (e: any) {
            console.error("Reset Email Error", e);
            throw e;
        }
    }
};
