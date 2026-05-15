import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBMtozUIk9ONN8LquT_tHkuG9F9-Y0RuhE",
  authDomain: "voting-komite.firebaseapp.com",
  projectId: "voting-komite",
  storageBucket: "voting-komite.firebasestorage.app",
  messagingSenderId: "607737013642",
  appId: "1:607737013642:web:1d389e88ee050072169473",
  measurementId: "G-PTPTJ0JJLK",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);