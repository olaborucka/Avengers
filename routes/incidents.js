const express = require('express');
const router = express.Router();
const incidentController = require('../controllers/incidentController');

router.get('/', incidentController.getAll);
router.post('/', incidentController.create);
router.post('/:id/assign', incidentController.assign);
router.patch('/:id/resolve', incidentController.resolve);

module.exports = router;