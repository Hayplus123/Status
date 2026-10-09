import { initializeApp } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-app.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-database.js";

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

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Password Logic
document.getElementById('login-btn').addEventListener('click', () => {
  const pwd = document.getElementById('password-input').value;
  if (pwd === "Hayden0401") {
    // Hide login, show admin panel
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('admin-section').style.display = 'block';
  } else {
    alert("Incorrect password. Access denied.");
  }
});

// Database Update Logic
document.getElementById('update-btn').addEventListener('click', () => {
  const newState = document.getElementById('state-input').value;
  const newMessage = document.getElementById('message-input').value;

  set(ref(db, 'systemInfo'), {
    state: newState,
    message: newMessage
  }).then(() => {
    alert("Status updated successfully!");
  });
});