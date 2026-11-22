import { initializeApp, getApps, getApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getFirestore } from 'firebase/firestore';

// Your live Firebase project configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDZBwgE1_0AlNaK1HOxnvRs61irZ1DwbUg",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "international-business-g-80964.firebaseapp.com",
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "https://international-business-g-80964-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "international-business-g-80964",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "international-business-g-80964.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "850928934698",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:850928934698:web:6ba4ae9f52ce92cd9e0853",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-CZCHKRWPEP"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const rtdb = getDatabase(app);
export const db = getFirestore(app);
