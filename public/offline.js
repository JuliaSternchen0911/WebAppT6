// Funktion zum Ausblenden des Ladebildschirms und Anzeigen der Hauptseite
function initializePage() {

// Überprüfung der Internetverbindung
    checkInternetConnection();

    // Verwende setTimeout, um eine Verzögerung zu erzeugen
    setTimeout(() => {
        document.getElementById('loading-screen').style.display = 'none';
        document.getElementById('main-content').style.display = 'block';
    }, 2000); // Verzögerung von 2000 Millisekunden (3 Sekunden)
}
// Überprüfen der Internetverbindung
function checkInternetConnection() {
    if (!navigator.onLine) {
        // Wenn keine Internetverbindung besteht, umleiten zur offline.html-Seite
        window.location.href = 'offline.html';
    }
}

// Ereignishandler für das Laden des Fensters hinzufügen
window.addEventListener('load', initializePage);

// Ereignishandler für das Ändern des Netzwerkstatus hinzufügen
window.addEventListener('online', checkInternetConnection);
window.addEventListener('offline', checkInternetConnection);

initializePage();
