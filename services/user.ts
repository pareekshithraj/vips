import { db } from "./firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { UserConfig } from "../types";

export const userService = {
    async getUserConfig(email: string): Promise<UserConfig | null> {
        const ref = doc(db, "users", email);
        const snap = await getDoc(ref);

        if (!snap.exists()) {
            return null;
        }

        return snap.data() as UserConfig;
    },

    async updateUserConfig(email: string, config: UserConfig): Promise<void> {
        const ref = doc(db, "users", email);
        await setDoc(ref, config, { merge: true });
    }
};
