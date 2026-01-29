// This file reads your Firebase configuration from environment variables.
// In development, these are set in a .env file.
// For production, you should set these environment variables on your hosting provider (e.g., Vercel).

// Note: The NEXT_PUBLIC_ prefix is required for these variables to be
// exposed to the browser, which is necessary for the Firebase client-side SDK.
export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};
