import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const cleanFirebaseEnv = (value) => {
  if (!value) return value;

  let cleanValue = String(value).trim();
  const propertyValueMatch = cleanValue.match(/^\w+\s*:\s*(.+)$/);

  if (propertyValueMatch) {
    cleanValue = propertyValueMatch[1].trim();
  }

  return cleanValue
    .replace(/,+$/g, '')
    .trim()
    .replace(/^['"`]+|['"`]+$/g, '')
    .trim();
};

const firebaseConfig = {
  apiKey: cleanFirebaseEnv(process.env.NEXT_PUBLIC_FIREBASE_API_KEY),
  authDomain: cleanFirebaseEnv(process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN),
  projectId: cleanFirebaseEnv(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID),
  storageBucket: cleanFirebaseEnv(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET),
  messagingSenderId: cleanFirebaseEnv(process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID),
  appId: cleanFirebaseEnv(process.env.NEXT_PUBLIC_FIREBASE_APP_ID),
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
