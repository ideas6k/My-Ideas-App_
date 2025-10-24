import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Firebase configuration updated with your web app credentials
const firebaseConfig = {
  apiKey: "AIzaSyAUnCQFmL0PHhVPOpkUj9YUGc3RHBmWBpg",
  authDomain: "ideas-a9dea.firebaseapp.com",
  projectId: "ideas-a9dea",
  storageBucket: "ideas-a9dea.firebasestorage.app",
  messagingSenderId: "126723826835",
  appId: "1:126723826835:web:4c411b5a172a8c4f331966",
  measurementId: "G-BEJR2TGRWJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
