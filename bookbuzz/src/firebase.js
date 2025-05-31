import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDLHi8YwRnxZhyGyTQ7xi4huvepFu9FelY",
  authDomain: "bookbuzz-b415f.firebaseapp.com",
  projectId: "bookbuzz-b415f",
  storageBucket: "bookbuzz-b415f.firebasestorage.app",
  messagingSenderId: "562971659792",
  appId: "1:562971659792:web:664476c386a4f40fe88495"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export { auth, googleProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword };