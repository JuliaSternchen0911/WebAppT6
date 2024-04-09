import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { firebaseConfig } from "./index.js";

const auth = getAuth();
onAuthStateChanged(auth, user => {
    if (user) {
        // Benutzer ist angemeldet, zeige die E-Mail-Adresse an
        const emailElement = document.getElementById("email");
        if (emailElement) {
            emailElement.textContent = `E-Mail: ${user.email}`;
        }
    } else {
        // Benutzer nicht angemeldet, leite zur Login-Seite um
        window.location.href = "login.html";
    }
});
