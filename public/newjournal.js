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
            if (preview) {
                preview.src = e.target.result;
                preview.style.display = 'block';
            }
        };

        reader.readAsDataURL(input.files[0]);
    }
}

function saveJournal() {
    var journalText = document.getElementById('journal-text').value;
    var journalDate = document.getElementById('journal-date').value;
    var imageFile = document.getElementById('image-upload').files[0];

    if (imageFile) {
        uploadImage(imageFile).then((imageUrl) => {
            saveJournalEntry(journalText, journalDate, imageUrl);
        }).catch((error) => {
            console.error("Fehler beim Hochladen des Bildes: ", error);
            saveJournalEntry(journalText, journalDate);
        });
    } else {
        saveJournalEntry(journalText, journalDate);
    }
}

function uploadImage(imageFile) {
    return new Promise((resolve, reject) => {
        var storageRef = firebase.storage().ref('journalImages/' + imageFile.name);
        var uploadTask = storageRef.put(imageFile);

        uploadTask.on('state_changed', function (snapshot) {
        }, function (error) {
            reject(error);
        }, function () {
            uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
                resolve(downloadURL);
            });
        });
    });
}

function saveJournalEntry(text, date, imageUrl = null) {
    var db = firebase.firestore();
    db.collection("reiseplaner").add({
        text: text,
        date: date,
        imageUrl: imageUrl
    })
        .then(function (docRef) {
            console.log("Journal erfolgreich gespeichert mit ID: ", docRef.id);

        })
        .catch(function (error) {
            console.error("Fehler beim Speichern des Journals: ", error);
        });
}

function addLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        console.log("Geolocation wird von diesem Browser nicht unterstützt.");
    }
}

function showPosition(position) {
    console.log("Latitude: " + position.coords.latitude +
        " Longitude: " + position.coords.longitude);
}

function showError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            console.log("Benutzer hat den Zugriff auf Geolocation verweigert.");
            break;
        case error.POSITION_UNAVAILABLE:
            console.log("Standortinformationen sind nicht verfügbar.");
            break;
        case error.TIMEOUT:
            console.log("Die Anfrage zum Abrufen des Benutzerstandorts hat zu lange gedauert.");
            break;
        case error.UNKNOWN_ERROR:
            console.log("Ein unbekannter Fehler ist aufgetreten.");
            break;
    }
}