// Julia Peters
// Importe der notwendigen Firebase-Authentifizierungsfunktionen und die Firebase-Konfiguration
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { firebaseConfig } from "./index.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app); //Initialisierung der Authentifizierung
const db = getFirestore(app); //Initialisierung Firestore-Datenbank

const registrationForm = document.getElementById("registrationForm"); //Registrierung-Formularelement holen
registrationForm.addEventListener("submit", (e) => {
  e.preventDefault(); //Verhindert neuladen
  //extrahiert Email & Passwort aus Formular
  const email = registrationForm.email.value;
  const password = registrationForm.password.value;

  createUserWithEmailAndPassword(auth, email, password) //Registrierung mit Friebase
  .then(async (userCredential) => {
    const user = userCredential.user;
    console.log("Registration successful:", user);

    // Erstellt ein Benutzerprofil in Firestore mit der UID des Benutzers
    await setDoc(doc(db, "users", user.uid), {
      email: email,
    });

    window.location.href = "login.html";// Weiterleitung zur Login-Seite
  })
  .catch((error) => {
    console.error("Registration error:", error.message); //Registrierungsfehler wird in Konsole angezeigt
  });
});
