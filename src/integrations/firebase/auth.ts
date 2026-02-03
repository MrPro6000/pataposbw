import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
  sendEmailVerification,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "./client";
import { createUserProfile } from "./firestore";

// Helper to guard against null auth
const requireAuth = () => {
  if (!auth) {
    throw new Error(
      "Firebase Auth is not initialized. Check that VITE_FIREBASE_* secrets are configured and refresh."
    );
  }
  return auth;
};

// Sign up with email and password
export const signUp = async (email: string, password: string) => {
  try {
    const a = requireAuth();
    const userCredential = await createUserWithEmailAndPassword(a, email, password);
    const user = userCredential.user;

    // Create initial user profile in Firestore
    await createUserProfile(user.uid, {
      email: user.email,
      createdAt: new Date().toISOString(),
      kycStatus: "pending",
      businessSetupComplete: false,
    });

    // Send email verification
    await sendEmailVerification(user);

    return { user, error: null };
  } catch (error: any) {
    return { user: null, error: error.message };
  }
};

// Sign in with email and password
export const signIn = async (email: string, password: string) => {
  try {
    const a = requireAuth();
    const userCredential = await signInWithEmailAndPassword(a, email, password);
    return { user: userCredential.user, error: null };
  } catch (error: any) {
    return { user: null, error: error.message };
  }
};

// Sign out
export const signOut = async () => {
  try {
    const a = requireAuth();
    await firebaseSignOut(a);
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};

// Password reset
export const resetPassword = async (email: string) => {
  try {
    const a = requireAuth();
    await sendPasswordResetEmail(a, email);
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};

// Get current user
export const getCurrentUser = (): User | null => {
  return auth?.currentUser ?? null;
};

// Subscribe to auth state changes
// Returns a no-op unsubscribe if auth is not configured
export const onAuthChange = (callback: (user: User | null) => void) => {
  if (!auth) {
    console.warn("[Firebase] onAuthChange: auth not initialized");
    // Immediately call back with null user and return a no-op unsubscribe
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
};
