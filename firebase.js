const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

document.getElementById('volonterForma').addEventListener('submit', function (event) {
    event.preventDefault();

    document.getElementById('volonterForma').style.display = 'none';
    document.getElementById('commentSection').style.display = 'block';
});

document.getElementById('submitCommentBtn').addEventListener('click', function () {
    const commentText = document.getElementById('commentText').value;

    // Pohrana komentara u Firestore
    db.collection('comments').add({
        text: commentText,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    }).then(() => {
        alert("Komentar je uspješno pohranjen!");
        loadComments(); // Reload the comments list
    }).catch((error) => {
        console.error("Error adding comment: ", error);
    });
});

function loadComments() {
    db.collection('comments').orderBy('timestamp', 'desc').get().then((querySnapshot) => {
        const commentsList = document.getElementById('commentsList');
        commentsList.innerHTML = ''; // Clear existing comments

        querySnapshot.forEach((doc) => {
            const comment = doc.data().text;
            const commentDiv = document.createElement('div');
            commentDiv.classList.add('comment');
            commentDiv.textContent = comment;
            commentsList.appendChild(commentDiv);
        });
    });
}

loadComments();

