'use client';

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  Auth,
} from 'firebase/auth';
import { initializeFirebase } from '../index';

let auth: Auth | null = null;
const getAuthInstance = () => {
    if (!auth) {
        const instances = initializeFirebase();
        auth = instances.auth;
    }
    return auth;
}

const googleProvider = new GoogleAuthProvider();

export async function handleEmailSignUp(email: string, password: string) {
  const auth = getAuthInstance();
  return createUserWithEmailAndPassword(auth, email, password);
}

export async function handleEmailSignIn(email: string, password: string) {
  const auth = getAuthInstance();
  return signInWithEmailAndPassword(auth, email, password);
}

export async function handleGoogleSignIn() {
  const auth = getAuthInstance();
  return signInWithPopup(auth, googleProvider);
}

export async function handleSignOut() {
  const auth = getAuthInstance();
  return signOut(auth);
}
