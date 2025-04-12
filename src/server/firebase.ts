// firebase.ts
import { initializeApp, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore, collection, getDocs, doc, query, where, getDoc } from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";

// Define the interface for Firebase configuration
interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string; // optional if not provided
}

// Helper function to get environment variables and throw an error if not defined.
const getEnvVar = (key: string): string => {
  const value = import.meta.env[key];
  if (!value || value === "") {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
};

// Build the configuration object with explicit types
const firebaseConfig: FirebaseConfig = {
  apiKey: getEnvVar("VITE_FIREBASE_API_KEY"),
  authDomain: getEnvVar("VITE_FIREBASE_AUTH_DOMAIN"),
  projectId: getEnvVar("VITE_FIREBASE_PROJECT_ID"),
  storageBucket: getEnvVar("VITE_FIREBASE_STORAGE_BUCKET"),
  messagingSenderId: getEnvVar("VITE_FIREBASE_MESSAGING_SENDER_ID"),
  appId: getEnvVar("VITE_FIREBASE_APP_ID"),
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "",  // Provide fallback if needed
};

// Initialize Firebase
const app: FirebaseApp = initializeApp(firebaseConfig);
const db: Firestore = getFirestore(app);
const storage: FirebaseStorage = getStorage(app);

// Exporting the firebase services and utility functions
export {
  app,
  db,
  storage,
  collection,
  getDocs,
  doc,
  query,
  where,
  getDoc,
};
