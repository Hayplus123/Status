import { initializeApp } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyAMTF5ki1AO3MaZomwaHf_z1FjwVgatnGA",
  authDomain: "status-3a1e9.firebaseapp.com",
  databaseURL: "https://status-3a1e9-default-rtdb.firebaseio.com",
  projectId: "status-3a1e9",
  storageBucket: "status-3a1e9.firebasestorage.app",
  messagingSenderId: "375005081938",
  appId: "1:375005081938:web:554b06a29f0fd75f3cca8b"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Loading Animation (. .. ...)
const statusText = document.getElementById('status-text');
let dotCount = 0;
const loadingAnimation = setInterval(() => {
  dotCount = (dotCount + 1) % 4;
  statusText.innerText = "Loading" + ".".repeat(dotCount);
}, 500);

let countdownInterval = null;

const statusRef = ref(db, 'systemInfo');
onValue(statusRef, (snapshot) => {
  const data = snapshot.val();
  if (data) {
    clearInterval(loadingAnimation);
    if (countdownInterval) clearInterval(countdownInterval);

    const container = document.getElementById('status-container');
    const msgEl = document.getElementById('status-message');
    const timerEl = document.getElementById('timer-display');
    
    timerEl.innerText = ""; // Clear old timer

    if (data.state === "Operational") {
      document.body.style.backgroundColor = "#ffffff";
      container.style.backgroundColor = "#d4edda";
      container.style.borderColor = "#c3e6cb";
      statusText.innerText = "System Operational";
      msgEl.innerText = data.message || "All systems running normally.";
    } 
    else if (data.state === "Issues") {
      document.body.style.backgroundColor = "#fff9db";
      container.style.backgroundColor = "#fff3cd";
      container.style.borderColor = "#ffeeba"; // Yellow border screen
      statusText.innerText = "Minor Issues Detected";
      msgEl.innerText = data.message || "Experiencing degraded performance.";
    } 
    else if (data.state === "Down") {
      // Freeze screen and show lockdown error
      document.body.style.backgroundColor = "#ffdddd";
      container.style.backgroundColor = "#f8d7da";
      container.style.borderColor = "#f5c6cb"; // Red lockdown screen
      statusText.innerText = "SYSTEM DOWN";
      msgEl.innerText = "sorry, we are having a maitness break at the moment. " + (data.message ? "(" + data.message + ")" : "");

      // Live Countdown Timer logic
      if (data.targetTime) {
        const updateTimer = () => {
          const timeLeft = data.targetTime - Date.now();
          if (timeLeft <= 0) {
            timerEl.innerText = "Maintenance should conclude momentarily.";
            clearInterval(countdownInterval);
          } else {
            const minutes = Math.floor(timeLeft / 60000);
            const seconds = Math.floor((timeLeft % 60000) / 1000);
            timerEl.innerText = `Estimated time remaining: ${minutes}m ${seconds < 10 ? '0' : ''}${seconds}s`;
          }
        };
        updateTimer();
        countdownInterval = setInterval(updateTimer, 1000); // Ticks every second locally
      }
    }
  }
});