const express = require('express');
const router = express.Router();
const statsRepository = require('../repository/statsrepository');

router.get('/', async (req, res) => {
    try {
        const stats = await statsRepository.getStats();
        res.status(200).json({ data: stats });
    } catch (err) {
        console.error(err);
        res.status(500).json({ type: '/errors/internal', status: 500, detail: 'Błąd serwera przy statystykach' });
    }
});

module.exports = router;