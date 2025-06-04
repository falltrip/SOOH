import { initializeApp } from 'firebase/app';
import { getAuth, signOut, onAuthStateChanged, sendPasswordResetEmail } from 'firebase/auth';
import { getFirestore, setDoc, doc } from 'firebase/firestore';
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage"; // ✨ 이 줄을 추가해주세요!

// Firebase configuration using Vite environment variables
// These variables are expected to be in your .env file
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app); // ✨ 이 줄을 추가해주세요!

export { app, auth, db, analytics, storage }; // ✨ 여기에 storage를 추가해주세요!

// Function to save user data to Firestore
export const saveUserDataToFirestore = async (userId, userData) => {
  try {
    await setDoc(doc(db, "users", userId), {
      uid: userId,
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      displayName: userData.displayName,
      createdAt: new Date(),
    });
    console.log("User data saved to Firestore for UID:", userId);
  } catch (error) {
    console.error("Error saving user data to Firestore:", error);
    throw error;
  }
};