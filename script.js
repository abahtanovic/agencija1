document.addEventListener("DOMContentLoaded", function() {
    // Dodavanje prikaza datuma i vremena
    function prikaziTrenutniDatumVrijeme() {
        const datumVrijemeElement = document.createElement('div');
        datumVrijemeElement.classList.add('datum-vrijeme');
        document.body.prepend(datumVrijemeElement);

        function azurirajDatumVrijeme() {
            const trenutnoVrijeme = new Date();
            const opcije = { 
                weekday: 'long', year: 'numeric', month: 'long', 
                day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' 
            };
            datumVrijemeElement.textContent = trenutnoVrijeme.toLocaleDateString('hr-HR', opcije) + ' ' + trenutnoVrijeme.toLocaleTimeString('hr-HR');
        }
        azurirajDatumVrijeme();
        setInterval(azurirajDatumVrijeme, 1000);
    }
    prikaziTrenutniDatumVrijeme();

    // Prikaz poruke dobrodošlice na početnoj stranici
    if (window.location.pathname.toLowerCase().includes('pocetna.html')) {
        alert("Dobrodošli, Dragi putniče! Uživajte u pregledu naše stranice.");
    }

    // Prikaz slučajnog citata
    function prikaziCitat() {
        const citati = [
            "Putovanja su jedini trošak koji vas čini bogatijima.",
            "Svijet je knjiga, a oni koji ne putuju čitaju samo jednu stranu.",
            "Putujte često; doživjeti svijet je najbolji način da upoznate sebe."
        ];
        const citatContainer = document.getElementById("citat-container");
        if (citatContainer) {
            citatContainer.innerHTML = `<div class="citat">${citati[Math.floor(Math.random() * citati.length)]}</div>`;
        }
    }
    prikaziCitat();

    // Filtriranje ponuda
    const filterButton = document.getElementById('filter-button');
    if (filterButton) {
        filterButton.addEventListener('click', function(event) {
            event.preventDefault();
            const maxPrice = document.getElementById('price-filter').value;
            const selectedDate = document.getElementById('date-filter').value.trim().toLowerCase();
            const rows = document.querySelectorAll('table.ponude tbody tr');
            
            rows.forEach(row => {
                const price = parseInt(row.children[2].textContent.replace('€', ''));
                const date = row.children[1].textContent.trim().toLowerCase();
                row.style.display = (!maxPrice || price <= parseInt(maxPrice)) && (!selectedDate || date.includes(selectedDate)) ? '' : 'none';
            });
        });
    }

    // Ocjenjivanje zvjezdicama
    document.querySelectorAll('.rating').forEach(rating => {
        rating.querySelectorAll('span').forEach((star, index) => {
            star.addEventListener('click', function() {
                rating.setAttribute('data-rate', index + 1);
                rating.querySelectorAll('span').forEach((s, i) => {
                    s.classList.toggle('selected', i < index + 1);
                });
            });
        });
    });
    document.getElementById('submitCommentBtn').addEventListener('click', function() {
        const commentText = document.getElementById('commentText').value;
    
        // Provjerite da li je komentar unesen
        if (commentText) {
            // Spremite komentar u Firestore
            db.collection('comments').add({
                comment: commentText,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            })
            .then(function() {
                alert('Komentar je uspješno poslan!');
                document.getElementById('commentText').value = ''; // Očistite tekstualno polje
                loadComments(); // Ponovno učitajte komentare
            })
            .catch(function(error) {
                console.error('Greška pri spremanju komentara: ', error);
            });
        } else {
            alert('Molimo vas da unesete komentar!');
        }
    });
    
    // Funkcija za učitavanje svih komentara
    function loadComments() {
        db.collection('comments').orderBy('timestamp', 'desc').get()
        .then(function(querySnapshot) {
            const commentsList = document.getElementById('commentsList');
            commentsList.innerHTML = ''; // Očistite prethodne komentare
            
            querySnapshot.forEach(function(doc) {
                const commentData = doc.data();
                const commentElement = document.createElement('div');
                commentElement.classList.add('comment');
                commentElement.textContent = commentData.comment;
                commentsList.appendChild(commentElement);
            });
        })
        .catch(function(error) {
            console.error('Greška pri učitavanju komentara: ', error);
        });
    }
    
    // Pozovite funkciju za učitavanje komentara kada se stranica učita
    window.onload = loadComments;
    
    // Nakon što se pošalje forma, prikazujte sekciju za komentare
    document.getElementById('volonterForma').addEventListener('submit', function(event) {
        event.preventDefault(); // Sprečite automatsko slanje forme
    
        // Prikazivanje sekcije za komentare
        document.getElementById('commentSection').style.display = 'block';
    });
    


    // Generisanje broja leta
    function generisiBrojLeta() {
        return Math.floor(Math.random() * 9000) + 1000;
    }

    // Validacija emaila
    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // Validacija broja telefona (najmanje 9 cifara)
    function validatePhoneNumber(number) {
        return /^\d{9,}$/.test(number);
    }

    // Validacija forme
    const form = document.getElementById('putnikForma');
    if (form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const ime = document.getElementById('ime').value.trim();
            const prezime = document.getElementById('prezime').value.trim();
            const godiste = parseInt(document.getElementById('godiste').value);
            const email = document.getElementById('email').value.trim();
            const broj = document.getElementById('broj').value.trim();
            const spol = document.getElementById('spol').value;
            const destinacija = document.getElementById('destinacija').value.trim();
            const pasos = document.getElementById('pasos').value.trim();
            
            if (!ime || !prezime || !godiste || !email || !broj || !spol || !destinacija || !pasos) {
                alert("Molimo vas da popunite sva polja!");
                return;
            }
            
            if (!validateEmail(email)) {
                alert("Unesite važeći email!");
                return;
            }
            
            if (!validatePhoneNumber(broj)) {
                alert("Unesite validan broj telefona (najmanje 9 cifara)!");
                return;
            }
            
            if (godiste < 1900 || godiste > new Date().getFullYear()) {
                alert("Unesite validnu godinu rođenja!");
                return;
            }
            
            const brojLeta = generisiBrojLeta();
            const brojLetaElement = document.getElementById("brojLeta");
            brojLetaElement.style.display = "block";
            brojLetaElement.innerHTML = `Vaš broj leta je: ${brojLeta}`;
            alert(`Podaci su uspješno poslani! Vaš broj leta je ${brojLeta}`);
            form.reset();
        });
    }
});

