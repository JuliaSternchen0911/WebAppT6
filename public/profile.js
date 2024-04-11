//Julia Peters
// Importe der notwendigen Firebase-Authentifizierungsfunktionen und die Firebase-Konfiguration
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { firebaseConfig } from "./index.js";

const auth = getAuth(); //Initialisierung der Authentifizierung

// Überwachung des Authentifizierungszustandes
onAuthStateChanged(auth, user => {
    if (user) {
        // Benutzer ist angemeldet, zeigt die E-Mail-Adresse an
        const emailElement = document.getElementById("email");
        if (emailElement) {
            emailElement.textContent = `E-Mail: ${user.email}`;
        }
    } else {
        // Benutzer nicht angemeldet, leitet zur Login-Seite um
        window.location.href = "login.html";
    }
});
