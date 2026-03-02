require('dotenv').config(); 
const express = require('express');

const heroRoutes = require('./routes/heroes');
const incidentRoutes = require('./routes/incidents');

const app = express();


app.use(express.json());


app.use('/api/v1/heroes', heroRoutes);
app.use('/api/v1/incidents', incidentRoutes);


app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint nie istnieje' });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serwer superbohaterów działa na porcie ${PORT}`);
});