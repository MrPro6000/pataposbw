// Firebase configuration
// These values are loaded from environment variables set in Lovable Cloud secrets

// Secrets are often pasted with surrounding quotes (e.g. "AIza...") or whitespace.
// Firebase treats those as part of the key and can throw auth/invalid-api-key.
const cleanEnv = (value: string | undefined) =>
  (value ?? "").trim().replace(/^['"]|['"]$/g, "");

const apiKey = cleanEnv(import.meta.env.VITE_FIREBASE_API_KEY);
const authDomain = cleanEnv(import.meta.env.VITE_FIREBASE_AUTH_DOMAIN);
const projectId = cleanEnv(import.meta.env.VITE_FIREBASE_PROJECT_ID);
const storageBucket = cleanEnv(import.meta.env.VITE_FIREBASE_STORAGE_BUCKET);
const messagingSenderId = cleanEnv(import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID);
const appId = cleanEnv(import.meta.env.VITE_FIREBASE_APP_ID);

if (import.meta.env.DEV) {
  const missing = [
    !apiKey && "VITE_FIREBASE_API_KEY",
    !authDomain && "VITE_FIREBASE_AUTH_DOMAIN",
    !projectId && "VITE_FIREBASE_PROJECT_ID",
    !storageBucket && "VITE_FIREBASE_STORAGE_BUCKET",
    !messagingSenderId && "VITE_FIREBASE_MESSAGING_SENDER_ID",
    !appId && "VITE_FIREBASE_APP_ID",
  ].filter(Boolean);
  if (missing.length) {
    console.warn(
      `[Firebase] Missing config env var(s): ${missing.join(", ")}. ` +
        `If you just updated secrets, refresh the preview.`
    );
  }
}

export const firebaseConfig = {
  apiKey,
  authDomain,
  projectId,
  storageBucket,
  messagingSenderId,
  appId,
};
