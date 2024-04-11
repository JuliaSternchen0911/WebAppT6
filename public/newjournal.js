//Mareike Haffelder
// Importe der notwendigen Firebase-Authentifizierungsfunktionen und die Firebase-Konfiguration
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, addDoc, setDoc, doc } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";
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
const storage = getStorage(app); //Initialisierung Firebase-Storage

//Prüft Authentifizierungszustand
const auth = getAuth();
onAuthStateChanged(auth, (user) => {
  if (user) {
    // Benutzer ist angemeldet
    console.log("Angemeldet als:", user.uid);
  } else {
    // Benutzer ist nicht angemeldet
    console.log("Nicht angemeldet");
  }
});

// Event Listener für DOM-Elemente
document.addEventListener('DOMContentLoaded', function () {
    //für Bildvorschau
    document.getElementById('image-upload').addEventListener('change', function () {
        showImagePreview(this);
    });
    //für Speichern-Button
    document.getElementById('save-journal-btn').addEventListener('click', function () {
        saveJournal();
    });
    // für Standort hinzufügen Button
    document.getElementById('add-location-btn').addEventListener('click', function () {
        addLocation();
    });
});


// Bildvorschau Funktion
function showImagePreview(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();

        reader.onload = function (e) {
            const preview = document.getElementById('image-preview');
            preview.src = e.target.result;
            preview.style.display = 'block';
        };
        reader.readAsDataURL(input.files[0]);
    } else {
        document.getElementById('image-preview').style.display = 'none'; // Bildervorschau wird ausgebelendet, wenn kein Bild vorhanden
    }
}

// Funktion zum Speichern eines Journal-Eintrags
async function saveJournal() {
    const auth = getAuth();
    const user = auth.currentUser;

    // Überprüfen, ob ein Benutzer angemeldet ist
    if (!user) {
        alert("Bitte melden Sie sich an, um ein Journal zu speichern.");
        return;
    }

    //Werte aus Formular
    const userId = user.uid;
    var journalText = document.getElementById('journal-text').value;
    var journalTitle = document.getElementById('journal-title').value;
    var journalDate = document.getElementById('journal-date').value;
    var imageFile = document.getElementById('image-upload').files[0];
    
    
    // Überprüfung ob alle Felder ausgefüllt sind
    if (!journalText.trim() || !journalTitle || !journalDate ) {
        alert("Bitte fülle alle Felder aus.");
        return;
    }

    let imageUrl = null;
    if (imageFile) {
        imageUrl = await uploadImage(imageFile); //Aufruf der Bild-Hochladen Funktion
        await saveJournalEntry(userId, journalText, journalTitle, journalDate, imageUrl, currentLocation); //Speichert Journal-Eintrag
    } else {
        await saveJournalEntry(userId, null, journalText, journalTitle, journalDate, imageUrl, currentLocation); //Speichert Journal-Eintrag
    }
}

// Funktion zum Hochladen des Bildes in Firebase Storage
async function uploadImage(imageFile) {
    const storageRef = ref(storage, 'images/' + imageFile.name); //Speicherort
    const snapshot = await uploadBytes(storageRef, imageFile);
    const imageUrl = await getDownloadURL(snapshot.ref); // Holt die URL des hochgeladenen Bildes
    return getDownloadURL(snapshot.ref); //Rückgabe der URL
}

// Funktion zum Speichern der Journal-Eintragsdaten in der Firestore Datenbank
async function saveJournalEntry(userId, text, title, date, imageUrl, location) {
    const docRef = doc(collection(db, "reiseplaner")); //Datenbank
    await setDoc(docRef, {
        userId: userId,
        text: text,
        title: title,
        date: date,
        imageUrl: imageUrl,
        location: location
    });
    console.log("Journal erfolgreich gespeichert mit ID: ", docRef.id);
    alert("Journal erfolgreich gespeichert!");
}

//Julia Peters
// Funktion zum Hinzufügen des aktuellen Standorts
function addLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        console.log("Geolocation wird von diesem Browser nicht unterstützt.");
        alert("Geolocation wird von diesem Browser nicht unterstützt.");
    }
}
let currentLocation = null; // Globale Variable zum Speichern des aktuellen Standorts

// Funktion zur Verarbeitung der Standortinformation
function showPosition(position) {
    currentLocation = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
    };
    alert(`Standort hinzugefügt: Latitude: ${position.coords.latitude}, Longitude: ${position.coords.longitude}`);
}

// Fehlerbehandlung für Geolocation
function showError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            alert("Benutzer hat den Zugriff auf Geolocation verweigert.");
            break;
        case error.POSITION_UNAVAILABLE:
            alert("Standortinformationen sind nicht verfügbar.");
            break;
        case error.TIMEOUT:
            alert("Die Anfrage zum Abrufen des Benutzerstandorts hat zu lange gedauert.");
            break;
        case error.UNKNOWN_ERROR:
            alert("Ein unbekannter Fehler ist aufgetreten.");
            break;
    }
}