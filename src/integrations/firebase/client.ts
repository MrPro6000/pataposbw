import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";
import { firebaseConfig } from "./config";

// --- Diagnostic log (safe to leave in until debugging is complete) ---------
console.info(
  `[Firebase client] apiKey present: ${Boolean(firebaseConfig.apiKey)}, ` +
    `projectId: ${firebaseConfig.projectId || "(empty)"}`
);

// Guard: If the API key is blank we should NOT attempt to initialize Firebase,
// otherwise Firebase throws an unrecoverable `auth/invalid-api-key` error that
// takes down the entire app.
const isConfigured = Boolean(
  firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId
);

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let storage: FirebaseStorage | null = null;

if (isConfigured) {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
} else {
  console.error(
    "[Firebase] Configuration is missing or incomplete. " +
      "Check that VITE_FIREBASE_API_KEY, VITE_FIREBASE_AUTH_DOMAIN, and " +
      "VITE_FIREBASE_PROJECT_ID secrets are set and do a hard-refresh (Ctrl+Shift+R)."
  );
}

export { auth, db, storage };
export default app;
