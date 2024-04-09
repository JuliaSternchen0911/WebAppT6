function loadJournals() {
    var db = firebase.firestore();
    db.collection("reiseplaner").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {

            console.log(doc.id, " => ", doc.data());

        });
    });
}
