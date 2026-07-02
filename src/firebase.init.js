// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDfD1qDn4uPbg1Iku_AaV5kyrnyJhSrl-o",
    authDomain: "click-pick-90f48.firebaseapp.com",
    projectId: "click-pick-90f48",
    storageBucket: "click-pick-90f48.firebasestorage.app",
    messagingSenderId: "896448568577",
    appId: "1:896448568577:web:3d8dbad5f7ce3e7de08f00"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export default auth;