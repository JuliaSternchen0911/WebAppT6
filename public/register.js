// register.js
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { firebaseConfig } from "./index.js";

const auth = getAuth();

const registrationForm = document.getElementById("registrationForm");
registrationForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = registrationForm.email.value;
  const password = registrationForm.password.value;

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      console.log("Registration successful:", userCredential.user);
      // Weiterleitung auf eine neue Seite oder Anzeige einer Erfolgsmeldung
      window.location.href = "login.html";
    })
    .catch((error) => {
      console.error("Registration error:", error.message);
      // Anzeige einer Fehlermeldung für den Benutzer
    });
});
