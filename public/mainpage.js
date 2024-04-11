//Mareike Haffelder
// Importe der notwendigen Firebase-Authentifizierungsfunktionen und die Firebase-Konfiguration
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, getDocs, where, query, doc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
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

const app = initializeApp(firebaseConfig);
const db = getFirestore(app); //Initialisierung Firestore-Datenbank
const auth = getAuth(app); //Initialisierung der Authentifizierung

// EventListener, um sicherzustellen, dass die DOM vollständig geladen ist
document.addEventListener('DOMContentLoaded', () => {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            // Nutzer ist angemeldet; lädt die Jounrals
            loadJournals(user.uid);
        } else {
            // Nutzer ist nicht angemeldet, gibt Fehlermeldung
            console.log("Nutzer ist nicht angemeldet.");
        }
    });
});

//Celine Haupenthal
// EventListener für das Suchfeld, um Journale basierend auf dem Suchtext zu filtern
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search');
    searchInput.addEventListener('input', () => {
        const searchText = searchInput.value.toLowerCase();
        loadJournals(auth.currentUser.uid, searchText);
    });
});

//Mareike Haffelder
// Funktion zum Laden der Journale aus Firestore, basierend auf Nutzer-ID und optional Suchtext
async function loadJournals(userId, searchText = '') {
    const journalContainer = document.getElementById('journal-container');
    journalContainer.innerHTML = ''; // Bereinigt den Container vor dem Laden neuer Einträge

    let q = query(collection(db, "reiseplaner"), where("userId", "==", userId)); // Abfrage, um nur Journale des angemeldeten Nutzers zu erhalten

    try {
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            const data = doc.data();

            // Überprüfung, ob Journaltitel Suchtext enthält, falls Suchtext vorhanden
            if (searchText && !data.title.toLowerCase().includes(searchText)) {
                return;
            }
            
             // Erstellung der Journal-Einträge
            const journalEntry = document.createElement('div');
            journalEntry.classList.add('journal-entry');

            // Hinzufügen eines Bildes, falls vorhanden
            if (data.imageUrl) {
                const image = document.createElement('img');
                image.src = data.imageUrl;
                journalEntry.appendChild(image);
            }

            // Hinzufügen des Titels
            const title = document.createElement('h3');
            title.textContent = data.title;
            journalEntry.appendChild(title);

            // Hinzufügen des Datums
            const date = document.createElement('p');
            date.textContent = new Date(data.date).toLocaleDateString();
            journalEntry.appendChild(date);

            // EventListener für das Klicken auf einen Journal-Eintrag & Weiterleitung zur Detail-Seite
            journalEntry.addEventListener('click', () => {
                window.location.href = `journalDetail.html?journalId=${doc.id}`; // `doc.id` ist die Firestore Dokument-ID
            });

            // Celine Haupenthal
            //Button zum Löschen eines Journal-Eintrags
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Löschen';
            deleteBtn.onclick = (event) => {
                event.stopPropagation(); // Verhindert, dass das Klick-Ereignis weitergeleitet wird
                deleteJournal(doc.id);
            };
            journalEntry.appendChild(deleteBtn);

            // Hinzufügen des Journal-Eintrags zum Container
            journalContainer.appendChild(journalEntry);
        });
    } catch (error) {
        console.error("Fehler beim Laden der Journals: ", error);
    }
}

//Celine Haupenthal
// Funktion zum Löschen eines Journal-Eintrags
async function deleteJournal(journalId) {
    // Bestätigungsanfrage vor dem Löschen
    if (!confirm("Sind Sie sicher, dass Sie dieses Journal löschen möchten?")) {
        return; 
    }
    try {
        await deleteDoc(doc(db, "reiseplaner", journalId)); //Löscht Journal aus Datenbank
        console.log("Journal erfolgreich gelöscht");
        loadJournals(auth.currentUser.uid); // Lädt die Journals neu, um die Ansicht zu aktualisieren
    } catch (error) {
        console.error("Fehler beim Löschen des Journals: ", error);
    }
}