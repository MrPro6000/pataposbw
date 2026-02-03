

# Plan: Migrate from Firebase Auth to Lovable Cloud Auth

## Overview

This plan replaces the current Firebase Authentication setup (which is failing due to environment variable issues) with the built-in Lovable Cloud authentication system. Lovable Cloud uses Supabase under the hood and is already configured in your project.

## Why This Fixes the Problem

- The current Firebase secrets are not being injected into the Vite build correctly, causing the `auth/invalid-api-key` and "Firebase Auth is not initialized" errors
- Lovable Cloud auth is already configured and working (no API keys needed from you)
- The Supabase client is auto-generated and already functional

## What Will Change

### Files to Modify

1. **src/hooks/useAuth.tsx** - Replace Firebase auth listener with Supabase auth
2. **src/pages/Auth.tsx** - Update sign-in/sign-up to use Supabase client instead of Firebase
3. **src/pages/KYC.tsx** - Update to use Supabase user instead of Firebase user
4. **src/pages/BusinessSetup.tsx** - Same as above
5. **Dashboard and Admin pages** - Update auth checks if needed

### Files to Create

1. **src/integrations/supabase/auth.ts** - Helper functions for sign-in, sign-up, sign-out, password reset using Supabase

### Files That Can Be Removed (Optional Cleanup Later)

- src/integrations/firebase/auth.ts
- src/integrations/firebase/client.ts  
- src/integrations/firebase/config.ts
- src/integrations/firebase/firestore.ts
- src/integrations/firebase/storage.ts
- src/integrations/firebase/index.ts

## Migration Steps

### Step 1: Create Supabase Auth Helpers

Create a new file with authentication functions that wrap the Supabase client:
- `signIn(email, password)` - Email/password login
- `signUp(email, password)` - Email/password registration  
- `signOut()` - Logout
- `resetPassword(email)` - Password reset email
- `onAuthChange(callback)` - Auth state listener

### Step 2: Update the useAuth Hook

Replace Firebase auth listener with Supabase:

```text
Before (Firebase):
- Import from firebase/auth
- Call onAuthChange from Firebase module
- User type is firebase User

After (Supabase):
- Import from @supabase/supabase-js
- Use supabase.auth.onAuthStateChange
- User type is Supabase User
```

Key changes:
- Listen to `supabase.auth.onAuthStateChange` instead of Firebase's `onAuthStateChanged`
- Store both `session` and `user` (Supabase best practice)
- Fetch user profile from Supabase `profiles` table instead of Firestore

### Step 3: Update the Auth Page

The login/signup form will call Supabase methods:
- `supabase.auth.signInWithPassword()` for login
- `supabase.auth.signUp()` for registration
- Handle the OTP flow using Supabase phone auth (or simplify to email-only initially)

### Step 4: Update Firestore References to Supabase

Replace Firestore reads/writes with Supabase table queries:
- `getUserProfile` reads from `profiles` table
- `getBusinessProfile` reads from a `business_profiles` table (may need to create)
- `getKYCSubmission` reads from a `kyc_submissions` table (may need to create)
- `createUserProfile` inserts into `profiles` table

### Step 5: Update Storage References

Replace Firebase Storage with Supabase Storage:
- Use the existing `kyc-documents` bucket for KYC uploads
- Update upload functions to use `supabase.storage`

## Database Tables Needed

You already have:
- `profiles` table with `user_id`, `email`
- `user_roles` table with role management
- `handle_new_user` trigger that auto-creates profile on signup

May need to create:
- `business_profiles` table for business setup data
- `kyc_submissions` table for KYC documents and status

## Technical Details

### Auth State Initialization Pattern

Following Supabase best practices to avoid deadlocks:

```typescript
useEffect(() => {
  // Set up listener FIRST
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    (event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      // Defer profile fetch to avoid deadlock
      if (session?.user) {
        setTimeout(() => fetchProfile(session.user.id), 0);
      }
    }
  );

  // THEN check for existing session
  supabase.auth.getSession().then(({ data: { session } }) => {
    setSession(session);
    setUser(session?.user ?? null);
  });

  return () => subscription.unsubscribe();
}, []);
```

### Google OAuth (If Needed Later)

The project already has `@lovable.dev/cloud-auth-js` installed. To add Google sign-in:

```typescript
import { lovable } from "@/integrations/lovable/index";

const handleGoogleSignIn = async () => {
  const { error } = await lovable.auth.signInWithOAuth("google", {
    redirect_uri: window.location.origin,
  });
};
```

## Expected Outcome

After implementation:
- Login and signup will work immediately without any API key configuration
- Users will be stored in the Lovable Cloud database
- The "Firebase Auth is not initialized" error will be gone
- Authentication will work on both Preview and Published URLs

## Migration of Existing Users

If you have existing users in Firebase, they will need to re-register since Firebase and Supabase maintain separate user databases. This is expected when switching auth providers.

