import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyC40O4ZGyyd6oMf-F8dFXfpaVqsycEIofs",
    authDomain: "test-app-341fe.firebaseapp.com",
    projectId: "test-app-341fe",
    storageBucket: "test-app-341fe.firebasestorage.app",
    messagingSenderId: "872174691632",
    appId: "1:872174691632:web:9e53184741861ae70a14f5",
    measurementId: "G-BC2PWXLEML"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);
