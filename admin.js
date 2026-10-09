import { initializeApp } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-app.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-database.js";

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

let maintenanceInterval = null;
let adminCountdownInterval = null; // Tracks the admin's live timer

// Password Login
document.getElementById('login-btn').addEventListener('click', () => {
  const pwd = document.getElementById('password-input').value;
  if (pwd === "Hayden0401") {
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('admin-section').style.display = 'block';
  } else {
    alert("Incorrect password.");
  }
});

// Show/Hide downtime box based on status dropdown
document.getElementById('state-input').addEventListener('change', (e) => {
  const downtimeBox = document.getElementById('downtime-box');
  if (e.target.value === "Down") {
    downtimeBox.style.display = 'block';
  } else {
    downtimeBox.style.display = 'none';
  }
});

// Update Button Logic
document.getElementById('update-btn').addEventListener('click', () => {
  const newState = document.getElementById('state-input').value;
  
  const customMsg = document.getElementById('custom-message-input').value.trim();
  const dropdownMsg = document.getElementById('message-input').value;
  const newMessage = customMsg !== "" ? customMsg : dropdownMsg;
  
  if (maintenanceInterval) clearInterval(maintenanceInterval);

  let payload = {
    state: newState,
    message: newMessage,
    targetTime: null
  };

  if (newState === "Down") {
    const minutes = parseInt(document.getElementById('minutes-input').value) || 15;
    const targetTime = Date.now() + (minutes * 60 * 1000);
    payload.targetTime = targetTime;

    set(ref(db, 'systemInfo'), payload);

    maintenanceInterval = setInterval(() => {
      const remainingMinutes = Math.max(0, Math.ceil((targetTime - Date.now()) / 60000));
      if (remainingMinutes <= 0) {
        clearInterval(maintenanceInterval);
      } else {
        set(ref(db, 'systemInfo'), {
          state: newState,
          message: newMessage,
          targetTime: targetTime
        });
      }
    }, 60000);

    alert("Maintenance mode activated! Timer synced.");
  } else {
    set(ref(db, 'systemInfo'), payload).then(() => {
      alert("Status updated successfully!");
    });
  }
});

// --- NEW: Live Viewer & Auto-Switcher Logic ---
const statusRef = ref(db, 'systemInfo');
onValue(statusRef, (snapshot) => {
  const data = snapshot.val();
  if (!data) return;

  const currentStateText = document.getElementById('current-state-text');
  const adminTimerDisplay = document.getElementById('admin-timer-display');
  
  currentStateText.innerText = `${data.state} (${data.message})`;
  adminTimerDisplay.innerText = "";

  if (adminCountdownInterval) clearInterval(adminCountdownInterval);

  if (data.state === "Down" && data.targetTime) {
    const updateAdminTimer = () => {
      const now = Date.now();
      const timeLeft = data.targetTime - now;

      if (timeLeft > 0) {
        // Normal visible countdown
        const minutes = Math.floor(timeLeft / 60000);
        const seconds = Math.floor((timeLeft % 60000) / 1000);
        adminTimerDisplay.innerText = `Time left: ${minutes}m ${seconds < 10 ? '0' : ''}${seconds}s`;
      } 
      else if (timeLeft <= 0 && timeLeft > -30000) {
        // Hidden 30-second countdown
        const hiddenSecondsLeft = Math.floor((30000 + timeLeft) / 1000);
        adminTimerDisplay.innerText = `Finished! Auto-switching to Issues in ${hiddenSecondsLeft}s...`;
      } 
      else if (timeLeft <= -30000) {
        // 30 seconds have passed. Trigger the auto-switch!
        clearInterval(adminCountdownInterval);
        adminTimerDisplay.innerText = "Switching to Issues...";
        
        // Automatically push the new state to Firebase
        set(ref(db, 'systemInfo'), {
          state: "Issues",
          message: "working on it", // Fallback message after downtime
          targetTime: null
        });
      }
    };

    updateAdminTimer();
    adminCountdownInterval = setInterval(updateAdminTimer, 1000);
  }
});