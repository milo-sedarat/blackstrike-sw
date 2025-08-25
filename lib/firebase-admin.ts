import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

// Ensure this is only used on the server side
if (typeof window !== 'undefined') {
  throw new Error('firebase-admin should only be used on the server side');
}

// Initialize Firebase Admin if not already initialized and environment variables are available
if (!getApps().length && process.env.FIREBASE_PROJECT_ID) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

// Only export if Firebase is initialized
export const auth = getApps().length > 0 ? getAuth() : null;
export const db = getApps().length > 0 ? getFirestore() : null; 