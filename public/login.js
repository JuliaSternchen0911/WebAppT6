// Julia Peters
// Importe der notwendigen Firebase-Authentifizierungsfunktionen und die Firebase-Konfiguration
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { firebaseConfig } from "./index.js";

const auth = getAuth(); //Initialisierung der Authentifizierung

const loginForm = document.getElementById("loginForm"); //Login-Formularelement holen
loginForm.addEventListener("submit", (e) => {
  e.preventDefault(); //Verhindert neuladen
  //extrahiert Email & Passwort aus Formular
  const email = loginForm.email.value;
  const password = loginForm.password.value;

  signInWithEmailAndPassword(auth, email, password) //Anmeldung mit Friebase-Authentifizierung
    .then((userCredential) => {
      console.log("Login successful:", userCredential.user);
      window.location.href = "mainpage.html"; //Weiterleitung zur Startseite
    })
    .catch((error) => {
      console.error("Login error:", error.message); //Anmeldefehler wird in Konsole angezeigt
    });
});