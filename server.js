const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Poslužiti statičke fajlove iz foldera "Public"
app.use(express.static(__dirname)); // Podesi root direktorijum na trenutni direktorij

// Ruta za Početnu stranicu
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'Pocetna.html')); // Putanja za Početnu
});

// Ruta za O nama stranicu
app.get('/onama', (req, res) => {
  res.sendFile(path.join(__dirname, 'O nama.html')); // Putanja za O nama
});

// Ruta za Ponude stranicu
app.get('/ponude', (req, res) => {
  res.sendFile(path.join(__dirname, 'Ponude.html')); // Putanja za Ponude
});

// Ruta za Volontiranje stranicu
app.get('/volontiranje', (req, res) => {
  res.sendFile(path.join(__dirname, 'Volontiranje.html')); // Putanja za Volontiranje
});

// Ruta za Putuj stranicu
app.get('/putuj', (req, res) => {
  res.sendFile(path.join(__dirname, 'Putuj.html')); // Putanja za Putuj
});

// Pokretanje servera
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});


