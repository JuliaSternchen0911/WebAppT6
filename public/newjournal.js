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
const db = getFirestore(app);
const storage = getStorage(app);

const auth = getAuth();
onAuthStateChanged(auth, (user) => {
  if (user) {
    // Benutzer ist angemeldet, Sie können hier die Benutzer-ID verwenden
    console.log("Angemeldet als:", user.uid);
  } else {
    // Benutzer ist nicht angemeldet
    console.log("Nicht angemeldet");
  }
});

document.addEventListener('DOMContentLoaded', function () {
    // Event Listener für die Bildvorschau
    document.getElementById('image-upload').addEventListener('change', function () {
        showImagePreview(this);
    });

    // Event Listener für den Speichern-Button
    document.getElementById('save-journal-btn').addEventListener('click', function () {
        saveJournal();
    });

    // Event Listener für den Standort hinzufügen Button
    document.getElementById('add-location-btn').addEventListener('click', function () {
        addLocation();
    });
});



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
        document.getElementById('image-preview').style.display = 'none'; // Bildervorschau ausblenden, wenn kein Bild ausgewählt ist
    }
}

async function saveJournal() {
    const auth = getAuth();
    const user = auth.currentUser;

    // Überprüfen, ob ein Benutzer angemeldet ist
    if (!user) {
        alert("Bitte melden Sie sich an, um ein Journal zu speichern.");
        return;
    }

    const userId = user.uid;
    var journalText = document.getElementById('journal-text').value; // Korrektur der ID
    var journalDate = document.getElementById('journal-date').value;
    var imageFile = document.getElementById('image-upload').files[0];
    
    
    // Einfache Validierung
    if (!journalText.trim() || !journalDate) {
        alert("Bitte fülle alle Felder aus.");
        return;
    }

    let imageUrl = null;
    if (imageFile) {
        imageUrl = await uploadImage(imageFile);
        await saveJournalEntry(journalText, journalDate, imageUrl, userId);
    } else {
        await saveJournalEntry(journalText, journalDate, null, userId);
    }
}

async function uploadImage(imageFile) {
    const storageRef = ref(storage, 'images/' + imageFile.name);
    const snapshot = await uploadBytes(storageRef, imageFile);
    const imageUrl = await getDownloadURL(snapshot.ref); // Hole die URL des hochgeladenen Bildes
    return getDownloadURL(snapshot.ref);
}


async function saveJournalEntry(text, date, imageUrl, userId) {
    // Hier generieren Sie eine neue Document-Referenz
    const docRef = doc(collection(db, "reiseplaner"));
    await setDoc(docRef, {
        text: text,
        date: date,
        imageUrl: imageUrl, // Speichere die URL des Bildes
        userId: userId
    });
    console.log("Journal erfolgreich gespeichert mit ID: ", docRef.id);
    alert("Journal erfolgreich gespeichert!");
}

function addLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        console.log("Geolocation wird von diesem Browser nicht unterstützt.");
        alert("Geolocation wird von diesem Browser nicht unterstützt.");
    }
}

function showPosition(position) {
    alert(`Standort hinzugefügt: Latitude: ${position.coords.latitude}, Longitude: ${position.coords.longitude}`);
}

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