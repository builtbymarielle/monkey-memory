import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCvAifQAaeZNQhAqiaX-Z-gDEn8FKp9vJw",
  authDomain: "monkey-memory.firebaseapp.com",
  projectId: "monkey-memory",
  storageBucket: "monkey-memory.firebasestorage.app",
  messagingSenderId: "32778529333",
  appId: "1:32778529333:web:df23c3f1866da6fb89df7c",
  measurementId: "G-LD34GJXD2T"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;