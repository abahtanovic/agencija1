import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, orderBy, query, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-firestore.js";

// Firebase konfiguracija
const firebaseConfig = {
    apiKey: "AIzaSyBBZGkfUJJBPH4ioU4fuFpyxx7UQadU2gI",
    authDomain: "projekat-si-35055.firebaseapp.com",
    projectId: "projekat-si-35055",
    storageBucket: "projekat-si-35055.firebasestorage.app",
    messagingSenderId: "988684841406",
    appId: "1:988684841406:web:59d5bee03c63bb28c149ef",
    measurementId: "G-HWLP6GYQ9S"

};

// Inicijalizacija Firebase aplikacije
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Funkcija za prikazivanje sekcije za komentare nakon prijave
document.getElementById('volonterForma').addEventListener('submit', function (event) {
    event.preventDefault();

    // Sakrivanje forme i prikazivanje sekcije za komentare
    document.getElementById('volonterForma').style.display = 'none';
    document.getElementById('commentSection').style.display = 'block';
});

// Dodavanje komentara u Firestore
document.getElementById('submitCommentBtn').addEventListener('click', async function () {
    const commentText = document.getElementById('commentText').value.trim();

    if (commentText !== "") {
        try {
            // Pohrana komentara u Firestore
            await addDoc(collection(db, "comments"), {
                text: commentText,
                timestamp: serverTimestamp()
            });
            alert("Komentar je uspješno pohranjen!");
            loadComments(); // Ponovno učitaj komentare nakon dodavanja novog
            document.getElementById('commentText').value = ''; // Očisti textarea
        } catch (error) {
            console.error("Greška pri dodavanju komentara: ", error);
        }
    } else {
        alert("Molimo unesite komentar prije slanja.");
    }
});

// Funkcija za učitavanje svih komentara
async function loadComments() {
    const q = query(collection(db, "comments"), orderBy("timestamp", "desc"));
    const querySnapshot = await getDocs(q);

    const commentsList = document.getElementById('commentsList');
    commentsList.innerHTML = ''; // Očisti postojeće komentare

    querySnapshot.forEach((doc) => {
        const comment = doc.data().text;
        const commentDiv = document.createElement('div');
        commentDiv.classList.add('comment');
        commentDiv.textContent = comment;
        commentsList.appendChild(commentDiv);
    });
}

// Učitaj komentare odmah po učitavanju stranice
document.addEventListener('DOMContentLoaded', loadComments);
