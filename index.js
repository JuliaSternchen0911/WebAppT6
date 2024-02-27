
// Überprüfen, ob ein Benutzer angemeldet ist
firebase.auth().onAuthStateChanged(user => {
    if (user) {
        document.getElementById('userDiv').innerHTML = `Angemeldet als ${user.email}`;
    } else {
        document.getElementById('userDiv').innerHTML = 'Nicht angemeldet';
    }
});
