// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import {getAuth} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA4KnPs0_9D-5qFJo9x2aMKR1yH7trBcE8",
  authDomain: "trading-journal-d4ce1.firebaseapp.com",
  projectId: "trading-journal-d4ce1",
  storageBucket: "trading-journal-d4ce1.firebasestorage.app",
  messagingSenderId: "120401694819",
  appId: "1:120401694819:web:88475bfd3977a420e9a856",
  measurementId: "G-0BPEPPYFFP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
