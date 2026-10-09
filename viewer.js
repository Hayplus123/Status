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

// Setup the . .. ... animation
const statusText = document.getElementById('status-text');
let dotCount = 0;
const loadingAnimation = setInterval(() => {
  dotCount = (dotCount + 1) % 4; // Cycles through 0, 1, 2, 3
  statusText.innerText = "Loading" + ".".repeat(dotCount);
}, 500); // Updates every half second

// Listen for changes to the status data
const statusRef = ref(db, 'systemInfo');
onValue(statusRef, (snapshot) => {
  const data = snapshot.val();
  if (data) {
    clearInterval(loadingAnimation); // Stop the dots once data arrives
    
    document.getElementById('status-text').innerText = data.state;
    document.getElementById('status-message').innerText = data.message;
    
    // Change background color based on status
    const container = document.getElementById('status-container');
    if (data.state === "Operational") container.style.backgroundColor = "#d4edda";
    else if (data.state === "Issues") container.style.backgroundColor = "#fff3cd";
    else container.style.backgroundColor = "#f8d7da";
  }
});