'use client';

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import { initializeFirebase } from '../index';

const { auth } = initializeFirebase();
const googleProvider = new GoogleAuthProvider();

export async function handleEmailSignUp(email: string, password: string) {
  return createUserWithEmailAndPassword(auth, email, password);
}

export async function handleEmailSignIn(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password);
}

export async function handleGoogleSignIn() {
  return signInWithPopup(auth, googleProvider);
}

export async function handleSignOut() {
  return signOut(auth);
}
