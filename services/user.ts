import { db } from "./firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { UserConfig } from "../types";

export const userService = {
    async getUserConfig(email: string, isSchool: boolean = false): Promise<UserConfig | null> {
        const collectionName = isSchool ? "students" : "users";
        const ref = doc(db, collectionName, email);
        const snap = await getDoc(ref);

        if (!snap.exists()) {
            return null;
        }

        return snap.data() as UserConfig;
    },

    async updateUserConfig(email: string, config: UserConfig, isSchool: boolean = false): Promise<void> {
        const collectionName = isSchool ? "students" : "users";
        const ref = doc(db, collectionName, email);
        await setDoc(ref, config, { merge: true });
    }
};
