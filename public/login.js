// login.js
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { firebaseConfig } from "./index.js";

const auth = getAuth();

const loginForm = document.getElementById("loginForm");
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = loginForm.email.value;
  const password = loginForm.password.value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      console.log("Login successful:", userCredential.user);
      // Weiterleitung auf eine neue Seite oder Anzeige einer Erfolgsmeldung
      window.location.href = "mainpage.html";
    })
    .catch((error) => {
      console.error("Login error:", error.message);
      // Anzeige einer Fehlermeldung für den Benutzer
    });
});