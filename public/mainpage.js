// Importiere die benötigten Firebase-Module am Anfang der Datei
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, getDocs, where, query } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

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

// Initialisiere Firebase
const app = initializeApp(firebaseConfig);

// Hole die Firestore-Instanz
const db = getFirestore(app);
const auth = getAuth(app);

document.addEventListener('DOMContentLoaded', () => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // Nutzer ist angemeldet
        loadJournals(user.uid);
      } else {
        // Nutzer ist nicht angemeldet
        console.log("Nutzer ist nicht angemeldet.");
        // Optional: Umleiten zum Login oder eine Meldung anzeigen
      }
    });
  });

async function loadJournals(userId) {
    const journalContainer = document.getElementById('journal-container');
    journalContainer.innerHTML = ''; // Bereinigt den Container vor dem Laden neuer Einträge

    const q = query(collection(db, "reiseplaner"), where("userId", "==", userId));

    try {
      // Passt die Abfrage an, um nur Journals des angemeldeten Benutzers zu holen
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const journalEntry = document.createElement('div');
        journalEntry.classList.add('journal-entry');
  
        // Optional: Füge ein Bild hinzu, falls vorhanden
        if (data.imageUrl) {
          const image = document.createElement('img');
          image.src = data.imageUrl;
          journalEntry.appendChild(image);
        }
  
        // Fügt den Text hinzu
        const text = document.createElement('p');
        text.textContent = data.text;
        journalEntry.appendChild(text);
  
        // Fügt das Datum hinzu
        const date = document.createElement('p');
        date.textContent = new Date(data.date).toLocaleDateString();
        journalEntry.appendChild(date);
  
        journalContainer.appendChild(journalEntry);
      });
    } catch (error) {
      console.error("Fehler beim Laden der Journals: ", error);
    }
  }