//Celine Haupenthal
// Funktion zur Initialisierung der Seite
function initializePage() {

    // Überprüfung der Internetverbindung
    checkInternetConnection();

    // erzeugt Verzögerung veim Anzeigen des Hauptinhalts
    setTimeout(() => {
        // Nach der Verzögerung wird der Ladebildschirm ausgeblendet und der Hauptinhalt angezeigt
        document.getElementById('loading-screen').style.display = 'none';
        document.getElementById('main-content').style.display = 'block';
    }, 2000); // Verzögerung von 2000 Millisekunden (2 Sekunden)
}

// Funktion zur Überprüfung der Internetverbindung
function checkInternetConnection() {
    if (!navigator.onLine) {
        // Wenn keine Internetverbindung besteht, umleiten zur offline.html-Seite
        window.location.href = 'offline.html';
    }
}

// Ereignishandler für das Laden des Fensters
window.addEventListener('load', initializePage);

// Ereignishandler für das Ändern des Netzwerkstatus 
window.addEventListener('online', checkInternetConnection); // Wird aufgerufen, wenn die Internetverbindung wiederhergestellt wird
window.addEventListener('offline', checkInternetConnection); // Wird aufgerufen, wenn die Internetverbindung verloren geht

initializePage(); // Direkter Aufruf der initializePage-Funktion, um die Initialisierung beim Script-Start zu triggern
