// register.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { firebaseConfig } from "./index.js";

// Initialisiere Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const registrationForm = document.getElementById("registrationForm");
registrationForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = registrationForm.email.value;
  const password = registrationForm.password.value;

  createUserWithEmailAndPassword(auth, email, password)
  .then(async (userCredential) => {
    const user = userCredential.user;
    console.log("Registration successful:", user);

    // Erstelle ein Benutzerprofil in Firestore mit der UID des Benutzers
    await setDoc(doc(db, "users", user.uid), {
      email: email,
      // Weitere Profildaten können hier hinzugefügt werden
    });

    // Weiterleitung auf eine neue Seite oder Anzeige einer Erfolgsmeldung
    window.location.href = "login.html";
  })
  .catch((error) => {
    console.error("Registration error:", error.message);
    // Anzeige einer Fehlermeldung für den Benutzer
  });

});
