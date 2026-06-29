// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCqiRozVK_uDna4-gWmaYiqcKG9D24VHnE",
    authDomain: "peaky-online.firebaseapp.com",
    projectId: "peaky-online",
    storageBucket: "peaky-online.firebasestorage.app",
    messagingSenderId: "251069214985",
    appId: "1:251069214985:web:4be2804c3bbdc7516d63d8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export default auth;