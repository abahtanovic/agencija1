import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.0.2/firebase-app.js';
import { getFirestore, collection, addDoc, updateDoc, doc, deleteDoc, getDocs } from 'https://www.gstatic.com/firebasejs/9.0.2/firebase-firestore.js';

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

// Funkcija za slanje podataka volontera u Firestore
async function sendVolunteerDataToFirestore(event) {
    event.preventDefault(); 

    const ime = document.getElementById("ime").value.trim();
    const prezime = document.getElementById("prezime").value.trim();
    const datum = document.getElementById("datum").value;
    const email = document.getElementById("email").value.trim();
    const broj = document.getElementById("broj").value.trim();

    if (!ime || !prezime || !datum || !email || !broj) {
        alert("Molimo vas da popunite sva polja!");
        return;
    }

    try {
        // Dodavanje podataka volontera u Firestore kolekciju 'volonteri'
        const docRef = await addDoc(collection(db, "volonteri"), {
            ime,
            prezime,
            datum,
            email,
            broj
        });

        alert("Podaci su uspješno poslani!");

        // Prikazivanje forme za komentar nakon slanja
        showCommentSection(docRef.id);

    } catch (error) {
        console.error("Greška pri slanju podataka: ", error);
    }
}

// Funkcija za prikazivanje sekcije za komentare
function showCommentSection(volunteerId) {
    document.getElementById("commentSection").style.display = "block"; // Prikazivanje sekcije za komentar
    const submitCommentBtn = document.getElementById("submitCommentBtn");
    submitCommentBtn.onclick = () => addComment(volunteerId);
    loadComments(volunteerId); // Učitavanje komentara za specifičnog volontera
}

// Funkcija za dodavanje komentara
async function addComment(volunteerId) {
    const commentText = document.getElementById("commentText").value.trim();
    if (!commentText) {
        alert("Molimo vas da unesete komentar.");
        return;
    }

    try {
        // Dodavanje komentara u Firestore kolekciju 'komentari'
        await addDoc(collection(db, "komentari"), {
            volunteerId,
            comment: commentText,
            timestamp: new Date(),
        });

        alert("Komentar je uspješno dodan!");
        document.getElementById("commentText").value = ""; // Čisti polje za unos komentara

        // Ažuriranje liste komentara
        loadComments(volunteerId);
    } catch (error) {
        console.error("Greška pri dodavanju komentara: ", error);
    }
}

// Funkcija za učitavanje svih komentara
async function loadComments(volunteerId) {
    const querySnapshot = await getDocs(collection(db, "komentari"));
    const commentsList = document.getElementById("commentsList");
    commentsList.innerHTML = ""; // Čisti prethodne komentare

    querySnapshot.forEach(doc => {
        const data = doc.data();
        if (data.volunteerId === volunteerId) {
            const commentDiv = document.createElement("div");
            commentDiv.classList.add("comment");
            commentDiv.innerHTML = `
                <p>${data.comment}</p>
                <button onclick="editComment('${doc.id}', '${volunteerId}')">Uredi</button>
                <button onclick="deleteComment('${doc.id}', '${volunteerId}')">Obriši</button>
            `;
            commentsList.appendChild(commentDiv);
        }
    });
}

// Funkcija za uređivanje komentara
window.editComment = async function (commentId, volunteerId) {
    const newCommentText = prompt("Unesite novi komentar:");
    if (newCommentText) {
        const commentRef = doc(db, "komentari", commentId);
        await updateDoc(commentRef, {
            comment: newCommentText,
            timestamp: new Date(),
        });
        alert("Komentar je uspješno ažuriran!");
        loadComments(volunteerId); // Ponovno učitavanje komentara za specifičnog volontera
    }
}

// Funkcija za brisanje komentara
window.deleteComment = async function (commentId, volunteerId) {
    const commentRef = doc(db, "komentari", commentId);
    await deleteDoc(commentRef);
    alert("Komentar je uspješno obrisan!");
    loadComments(volunteerId); // Ponovno učitavanje komentara za specifičnog volontera
}

// Event listener za formu volontera
document.getElementById("volonterForma").addEventListener("submit", sendVolunteerDataToFirestore);
