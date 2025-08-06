import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBCEcd64sI3oW-p-xMakgbJ8n3zER7vKl8",
  authDomain: "flexifit-802ca.firebaseapp.com",
  projectId: "flexifit-802ca",
  storageBucket: "flexifit-802ca.firebasestorage.app",
  messagingSenderId: "656701329767",
  appId: "1:656701329767:web:6c99299b917e341c245fc2",
  measurementId: "G-WF30TTM1XS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const db = getFirestore(app);
export const auth = getAuth(app);