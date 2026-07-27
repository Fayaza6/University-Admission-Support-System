import { initializeApp }              from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getDatabase, ref, get }      from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

// ── Firebase config
const firebaseConfig = {
  apiKey:            "AIzaSyCtLmzt3a6LYxfnMTmX5BY9OPzIjiFFh64",
  authDomain:        "university-admission-support.firebaseapp.com",
  databaseURL:       "https://university-admission-support-default-rtdb.firebaseio.com",
  projectId:         "university-admission-support",
  storageBucket:     "university-admission-support.firebasestorage.app",
  messagingSenderId: "169709812924",
  appId:             "1:169709812924:web:9ea1229de028b7b52264b9",
};

const app  = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db   = getDatabase(app);


function fill(id, value) {
  const el = document.getElementById(id);
  if (el) {
    el.textContent = (value && value.toString().trim() !== '') ? value : '—';
  } else {
    console.warn('fill(): element not found —', id);
  }
}


function setAvatar(name) {
  const letter = (name && name.length > 0) ? name.charAt(0).toUpperCase() : '?';
  const avatarEl = document.getElementById('avatarInitial');
  if (avatarEl) avatarEl.textContent = letter;
  
  document.querySelectorAll('.nav-avatar').forEach(el => el.textContent = letter);
}


onAuthStateChanged(auth, async (user) => {

  if (!user) {
    console.log('Not logged in — redirecting to auth.html');
    window.location.href = 'auth.html';
    return;
  }

  
  fill('displayEmail', user.email);

  
  const dbPath = 'userForm/' + user.uid;

  try {
    const snapshot = await get(ref(db, dbPath));

    if (!snapshot.exists()) {
      console.log('No data found at', dbPath, '— has the user saved preferences yet?');
      fill('displayName', user.displayName || user.email || 'Student');
      setAvatar(user.displayName || user.email);
      return;
    }

    const d = snapshot.val();

    // Personal Info 
    fill('fullName',    d.fullName);
    fill('dob',         d.dob);
    fill('gender',      d.gender);
    fill('phoneNumber', d.phoneNumber);
    fill('emailId',     d.emailId || user.email);

    // SSC 
    fill('sscCategory', d.sscCategory);
    fill('sscGpa',      d.sscGpa);
    fill('sscRoll',     d.sscRoll);
    fill('sscReg',      d.sscReg);
    fill('sscYear',     d.sscYear);

    // ── HSC
    fill('hscCategory', d.hscCategory);
    fill('hscGpa',      d.hscGpa);
    fill('hscRoll',     d.hscRoll);
    fill('hscReg',      d.hscReg);
    fill('hscYear',     d.hscYear);

    // ── Admission Preference ─────────────────────────────────────────
    fill('admissionPref', d.admissionPref);

    // ── Profile image card header ────────────────────────────────────
    const displayName = d.fullName || user.displayName || user.email || 'Student';
    fill('displayName', displayName);
    setAvatar(displayName);

    console.log('Profile populated successfully.');

  } catch (err) {
    console.error('Firebase read error:', err.code, err.message);
  }

});