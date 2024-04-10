// Importiere die benötigten Firebase-Module am Anfang der Datei
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

document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search');

    searchInput.addEventListener('input', () => {
        const searchText = searchInput.value.toLowerCase();
        loadJournals(auth.currentUser.uid, searchText);
    });
});


async function loadJournals(userId, searchText = '') {
    const journalContainer = document.getElementById('journal-container');
    journalContainer.innerHTML = ''; // Bereinigt den Container vor dem Laden neuer Einträge

    let q = query(collection(db, "reiseplaner"), where("userId", "==", userId));

    try {
        // Passt die Abfrage an, um nur Journals des angemeldeten Benutzers zu holen
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            const data = doc.data();

            if (searchText && !data.title.toLowerCase().includes(searchText)) {
                return; // Überspringt dieses Journal, wenn der Titel den Suchtext nicht enthält
            }

            const journalEntry = document.createElement('div');
            journalEntry.classList.add('journal-entry');

            // Optional: Füge ein Bild hinzu, falls vorhanden
            if (data.imageUrl) {
                const image = document.createElement('img');
                image.src = data.imageUrl;
                journalEntry.appendChild(image);
            }

            const title = document.createElement('h3');
            title.textContent = data.title; // Stellen Sie sicher, dass `data.title` existiert
            journalEntry.appendChild(title);

            // Fügt das Datum hinzu
            const date = document.createElement('p');
            date.textContent = new Date(data.date).toLocaleDateString();
            journalEntry.appendChild(date);

            journalEntry.addEventListener('click', () => {
                window.location.href = `journalDetail.html?journalId=${doc.id}`; // `doc.id` ist die Firestore Dokument-ID
            });

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Löschen';
            deleteBtn.classList.add('delete-btn'); // Für Stylingzwecke
            deleteBtn.onclick = (event) => {
                event.stopPropagation(); // Verhindert, dass das Klick-Ereignis weitergeleitet wird
                deleteJournal(doc.id);
            };
            journalEntry.appendChild(deleteBtn);

            journalContainer.appendChild(journalEntry);
        });
    } catch (error) {
        console.error("Fehler beim Laden der Journals: ", error);
    }
}

async function deleteJournal(journalId) {
    if (!confirm("Sind Sie sicher, dass Sie dieses Journal löschen möchten?")) {
        return; // Abbruch, wenn der Nutzer den Löschvorgang nicht bestätigt
    }

    try {
        await deleteDoc(doc(db, "reiseplaner", journalId));
        console.log("Journal erfolgreich gelöscht");
        loadJournals(auth.currentUser.uid); // Lädt die Journale neu, um die Ansicht zu aktualisieren
    } catch (error) {
        console.error("Fehler beim Löschen des Journals: ", error);
    }
}