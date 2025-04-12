const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Prikazuje fajlove iz foldera "public"
app.use(agencija.static('public'));

// Pokreće server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
