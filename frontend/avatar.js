
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyCtLmzt3a6LYxfnMTmX5BY9OPzIjiFFh64",
  authDomain: "university-admission-support.firebaseapp.com",
  databaseURL: "https://university-admission-support-default-rtdb.firebaseio.com",
  projectId: "university-admission-support",
  storageBucket: "university-admission-support.firebasestorage.app",
  messagingSenderId: "169709812924",
  appId: "1:169709812924:web:9ea1229de028b7b52264b9",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

// Set avatar letter everywhere
function setAvatar(letter) {
  document.querySelectorAll(".nav-avatar").forEach(el => {
    el.textContent = letter;
  });

  const profileAvatar = document.getElementById("avatarInitial");
  if (profileAvatar) {
    profileAvatar.textContent = letter;
  }
}

// Get first letter
function getInitial(name) {
  if (!name || name.trim() === "") return "?";
  return name.trim().charAt(0).toUpperCase();
}

onAuthStateChanged(auth, async (user) => {

  if (!user) {
    setAvatar("?");
    return;
  }

  try {
    const snapshot = await get(ref(db, "userForm/" + user.uid));

    let name = "";

    if (snapshot.exists()) {
      const data = snapshot.val();
      name = data.fullName;
    }

    if (!name) {
      name = user.displayName || user.email || "?";
    }

    setAvatar(getInitial(name));

  } catch (error) {
    console.error("Avatar Error:", error);

    const fallback = user.displayName || user.email || "?";
    setAvatar(getInitial(fallback));
  }

});