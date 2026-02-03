// Firebase configuration — Updated 2026-02-03
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

// Log presence of Firebase config vars (mask actual value)
const mask = (v: string) => (v.length > 0 ? `${v.slice(0, 4)}...` : "(empty)");
console.info(
  `[Firebase config] apiKey: ${mask(apiKey)}, authDomain: ${mask(authDomain)}, projectId: ${mask(projectId)}`
);

if (!apiKey || !authDomain || !projectId) {
  console.error(
    `[Firebase] Some config values are empty. Ensure secrets are named VITE_FIREBASE_API_KEY, VITE_FIREBASE_AUTH_DOMAIN, etc., and refresh the preview.`
  );
}

export const firebaseConfig = {
  apiKey,
  authDomain,
  projectId,
  storageBucket,
  messagingSenderId,
  appId,
};
