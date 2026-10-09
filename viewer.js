import { initializeApp } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-app.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyAMTF5ki1AO3MaZomwaHf_z1FjwVgatnGA",
  authDomain: "status-3a1e9.firebaseapp.com",
  databaseURL: "https://status-3a1e9-default-rtdb.firebaseio.com",
  projectId: "status-3a1e9",
  storageBucket: "status-3a1e9.firebasestorage.app",
  messagingSenderId: "375005081938",
  appId: "1:375005081938:web:554b06a29f0fd75f3cca8b",
  measurementId: "G-807KT2CMLN"
};

// Initialize Firebase and the Database
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Target a test location in the database
const testRef = ref(db, 'system/test');

// Write a test message to your database
set(testRef, "Firebase connection successful!");

// Read that message and display it on the webpage
onValue(testRef, (snapshot) => {
  const data = snapshot.val();
  if (data) {
    document.getElementById('status-display').innerText = data;
  }
});