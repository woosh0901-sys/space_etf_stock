import { initializeApp, getApps } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDmrSGoSNRKzvFas_lkfVgDqtAmmyWXQKA",
  authDomain: "f1team-581cb.firebaseapp.com",
  projectId: "f1team-581cb",
  storageBucket: "f1team-581cb.firebasestorage.app",
  messagingSenderId: "638113502106",
  appId: "1:638113502106:web:57a2706c95ccc7774aa023",
  measurementId: "G-N3CK6GVVJF"
};

// Initialize Firebase (싱글톤 패턴)
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Analytics는 클라이언트 사이드에서만 사용
export const initAnalytics = async () => {
  if (typeof window !== 'undefined' && await isSupported()) {
    return getAnalytics(app);
  }
  return null;
};
