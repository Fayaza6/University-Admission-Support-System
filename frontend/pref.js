

import { initializeApp }             from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getDatabase, ref, set, get } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

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


const val = (id) => {
  const el = document.getElementById(id);
  return el ? el.value.trim() : '';
};


function showMsg(text, success = false) {
  const box = document.getElementById('saveMsg');
  if (!box) return;
  box.textContent = text;
  box.style.display = 'block';
  box.style.padding = '12px 16px';
  box.style.borderRadius = '8px';
  box.style.fontWeight = '600';
  box.style.fontSize = '0.875rem';
  box.style.marginBottom = '16px';
  if (success) {
    box.style.background = '#dcfce7';
    box.style.color = '#15803d';
    box.style.border = '1px solid #86efac';
  } else {
    box.style.background = '#fee2e2';
    box.style.color = '#dc2626';
    box.style.border = '1px solid #fca5a5';
  }
  if (success) setTimeout(() => box.style.display = 'none', 4000);
}

function loadProfileStats() {
  const apps = JSON.parse(localStorage.getItem('myApplications')) || [];
  
  const totalApplied = apps.length;
  const upcomingExams = apps.filter(a => a.status === 'Exam Pending').length;
  const resultsOut = apps.filter(a => a.status === 'Result Out').length;
  const newCirculars = localStorage.getItem('newCircularsCount') || 0;

  document.getElementById('profStatApplied').textContent = totalApplied;
  document.getElementById('profStatExams').textContent = upcomingExams;
  document.getElementById('profStatResults').textContent = resultsOut;
  document.getElementById('profStatNew').textContent = newCirculars;
}

window.addEventListener('DOMContentLoaded', loadProfileStats);





onAuthStateChanged(auth, async (user) => {

  if (!user) {
    window.location.href = 'auth.html';
    return;
  }

  console.log('Logged in as:', user.uid);

 
  try {
    const snapshot = await get(ref(db, 'userForm/' + user.uid));
    if (snapshot.exists()) {
      const d = snapshot.val();
      const fields = [
        'fullName', 'dob', 'gender', 'emailId', 'phoneNumber',
        'sscCategory', 'sscGpa', 'sscRoll', 'sscReg', 'sscYear',
        'hscCategory', 'hscGpa', 'hscRoll', 'hscReg', 'hscYear',
        'admissionPref'
      ];
      fields.forEach(id => {
        const el = document.getElementById(id);
        if (el && d[id] !== undefined && d[id] !== '') {
          el.value = d[id];
        }
      });
      console.log('Existing preferences loaded.');
    } else {
      console.log('No saved preferences found yet.');
    }
  } catch (err) {
    console.error('Error loading preferences:', err);
  }

});


document.getElementById('preferenceForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  
  const user = auth.currentUser;
  if (!user) {
    showMsg('You must be logged in to save preferences.');
    return;
  }


  const fullNameValue = val('fullName');

  const data = {
    fullName:      fullNameValue,
    dob:           val('dob'),
    gender:        val('gender'),
    emailId:       val('emailId'),
    phoneNumber:   val('phoneNumber'),
    sscCategory:   val('sscCategory'),
    sscGpa:        val('sscGpa'),
    sscRoll:       val('sscRoll'),
    sscReg:        val('sscReg'),
    sscYear:       val('sscYear'),
    hscCategory:   val('hscCategory'),
    hscGpa:        val('hscGpa'),
    hscRoll:       val('hscRoll'),
    hscReg:        val('hscReg'),
    hscYear:       val('hscYear'),
    admissionPref: val('admissionPref'),
    updatedAt:     new Date().toISOString(),
  };

  try {
    
    await set(ref(db, 'userForm/' + user.uid), data);

    console.log('Saved successfully!');

    
    if (fullNameValue) {
      const initial = fullNameValue.trim().charAt(0).toUpperCase();
      localStorage.setItem('userInitial', initial);
      
      const navAvatar = document.getElementById('navAvatar');
      if (navAvatar) navAvatar.textContent = initial;
    }

  
    alert("Your preferences has been saved!");

  } catch (err) {
    console.error('Save failed:', err);
    

    alert("Save failed: " + err.message);
  }
});