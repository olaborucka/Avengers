require('dotenv').config(); 
const express = require('express');

const heroRoutes = require('./routes/heroes');
const incidentRoutes = require('./routes/incidents');
// 1. Dodany import
const statsRoutes = require('./routes/stats'); 

const app = express();

app.use(express.json());

app.use('/api/v1/heroes', heroRoutes);
app.use('/api/v1/incidents', incidentRoutes);
// 2. Dodana ścieżka MUSI BYĆ PRZED obsługą błędu 404!
app.use('/api/v1/stats', statsRoutes); 

// 3. Łapacz nieistniejących ścieżek (MUSI BYĆ NA SAMYM KOŃCU TRAS)
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint nie istnieje' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serwer superbohaterów działa na porcie ${PORT}`);
});