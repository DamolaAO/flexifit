import { createContext, useEffect } from "react";
import { useState } from "react";
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, sendPasswordResetEmail, updateProfile } from "firebase/auth";
import { auth } from "..//firebase/firebaseConfig";
import { setDoc, getDoc, doc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setInitializing(false);
    });
    return unsubscribe;
  }, []);

  async function login(email, password) {
    setLoading(true);
    setError(null);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
      setUser(userCredential.user);
      await ensureUserDoc(userCredential.user);
    } catch (err) {
      setError(err.code || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    setLoading(true);
    setError(null);
    try {
      await signOut(auth);
      setUser(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function forgotPassword(email) {
    setLoading(true);
    setError(null);
    try {
      await sendPasswordResetEmail(auth, email.trim());
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  async function ensureUserDoc(user) {
    const ref = doc(db, "users", user.uid);
    const snap = await getDoc(ref);

    const baseUserData = {
      email: user.email,
      createdAt: new Date().toISOString(),
      name: "",
      age: null,
      height: null,
      weight: null,
      fitnessGoal: "",
      fitnessLevel: ""
    };

    await setDoc(ref, snap.exists() ? {} : baseUserData, { merge: true });
  }

  async function register(email, password) {
    setLoading(true);
    setError(null);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
      await ensureUserDoc(cred.user);

      const displayName = email.split("@")[0];

      await updateProfile(cred.user, { displayName });

      return cred.user;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthContext.Provider value={{ user,
      initializing,
      loading,
      error,
      login,
      register,
      logout,
      forgotPassword }}>
      {children}
    </AuthContext.Provider>
  )
}