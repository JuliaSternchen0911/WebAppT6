import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-analytics.js";

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
const analytics = getAnalytics(app);

export {firebaseConfig}; 