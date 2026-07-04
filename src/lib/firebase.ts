import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const authDomain = typeof window !== "undefined" 
  ? (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" 
      ? "hs-timetable.firebaseapp.com" 
      : window.location.hostname)
  : "hs-timetable.firebaseapp.com";

const firebaseConfig = {
  apiKey: "AIzaSyAY4C7F2n0RlqNVyXoIhzj9PfCV5iOM32E",
  authDomain: authDomain,
  projectId: "hs-timetable",
  storageBucket: "hs-timetable.firebasestorage.app",
  messagingSenderId: "1031381177482",
  appId: "1:1031381177482:web:55a44f222c0fddb2d0c973"
};

console.log("Firebase Env Check:", {
  apiKeyExists: !!firebaseConfig.apiKey,
  apiKeyLength: firebaseConfig.apiKey ? firebaseConfig.apiKey.length : 0,
  projectId: firebaseConfig.projectId
});

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
