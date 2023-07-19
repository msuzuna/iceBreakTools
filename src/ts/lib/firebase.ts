// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAUEFVZy7KYZtj_vgUo1og54740oXkNMYs",
  authDomain: "icebreak-727fe.firebaseapp.com",
  databaseURL: "https://icebreak-727fe-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "icebreak-727fe",
  storageBucket: "icebreak-727fe.appspot.com",
  messagingSenderId: "1025318167864",
  appId: "1:1025318167864:web:c33e34d45a67054e9f4dcd"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db;
