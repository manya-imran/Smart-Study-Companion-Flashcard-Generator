// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDVBT9q5Jb_ftgsltfa5C7I9P7f1RUtQKE",
  authDomain: "flashcard-saas-e28dc.firebaseapp.com",
  projectId: "flashcard-saas-e28dc",
  storageBucket: "flashcard-saas-e28dc.appspot.com",
  messagingSenderId: "34529445358",
  appId: "1:34529445358:web:2dccb90d70e96396a6baff",
  measurementId: "G-5REL6LMWBR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore (safe to run on both client and server)
const db = getFirestore(app);

// Initialize Analytics (client-side only)
let analytics;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  }).catch((error) => {
    console.error("Analytics initialization failed", error);
  });
}

export { db };

// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// import {getFirestore} from 'firebase/firestore';

// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyDVBT9q5Jb_ftgsltfa5C7I9P7f1RUtQKE",
//   authDomain: "flashcard-saas-e28dc.firebaseapp.com",
//   projectId: "flashcard-saas-e28dc",
//   storageBucket: "flashcard-saas-e28dc.appspot.com",
//   messagingSenderId: "34529445358",
//   appId: "1:34529445358:web:2dccb90d70e96396a6baff",
//   measurementId: "G-5REL6LMWBR"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
// const db = getFirestore(app)

// export {db}