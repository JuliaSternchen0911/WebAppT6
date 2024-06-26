//Julia Peters & Mareike Haffelder
// Importe der notwendigen Firebase-Authentifizierungsfunktionen und die Firebase-Konfiguration
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCyk6aMP1U0WmVmQdDwb8DhwJKk2kszH8I",
    authDomain: "t6progressivewebapp.firebaseapp.com",
    databaseURL: "https://t6progressivewebapp-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "t6progressivewebapp",
    storageBucket: "t6progressivewebapp.appspot.com",
    messagingSenderId: "602714925402",
    appId: "1:602714925402:web:b3383d35f01da02026ab63",
    measurementId: "G-7NRERVS911"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app); //Initialisierung Firestore-Datenbank

// ruft Journal-ID aus der URL ab
const params = new URLSearchParams(window.location.search);
const journalId = params.get('journalId');

// Wenn Journal-ID vorhanden, wird das entsprechende Dokument aus Firestore abgerufen
if (journalId) {
    const docRef = doc(db, "reiseplaner", journalId); //Datenbank
    getDoc(docRef).then((doc) => {
      if (doc.exists()) {
        // Wenn das Dokument existiert, werden Daten im Detail-Container angezeigt
        const data = doc.data();
        const container = document.getElementById('journalDetailContainer');
        container.innerHTML = `
          <h1>${data.title}</h1>
          ${data.imageUrl ? `<img src="${data.imageUrl}" alt="Journal Bild" style="max-width: 100%; height: auto;">` : ''}
          <p><strong>${new Date(data.date).toLocaleDateString()}</strong></p>
          <p>${data.text}</p>
        `;
        // Wenn Standort vorhanden, wird ein Link zur Kartenansicht hinzugefügt
        if (data.location) {
            const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${data.location.latitude},${data.location.longitude}`;
            container.innerHTML += `<a href="${mapsUrl}" target="_blank">Auf Karte anzeigen</a>`;
        }
      } else {
        console.log("Kein Dokument gefunden!");
      }
    }).catch((error) => {
      console.error("Fehler beim Laden des Dokuments:", error); //Fehlermeldung in der Konsole
    });
  }
