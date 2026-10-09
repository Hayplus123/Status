import { initializeApp } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-app.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-database.js";

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
  const newMessage = customMsg !== "" ? customMsg : dropdownMsg;
  const newState = document.getElementById('state-input').value;
  const newMessage = document.getElementById('message-input').value;
  
  // Clear any existing 1-minute updater interval
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

    // Push update to Firebase immediately
    set(ref(db, 'systemInfo'), payload);

    // Save credit optimization: Only update Firebase every 1 minute to sync remaining time
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
    }, 60000); // Runs every 60 seconds

    alert("Maintenance mode activated! Timer synced.");
  } else {
    set(ref(db, 'systemInfo'), payload).then(() => {
      alert("Status updated successfully!");
    });
  }
});