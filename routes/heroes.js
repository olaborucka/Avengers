const express = require('express');
const router = express.Router();
const heroController = require('../controllers/heroController');

router.get('/', heroController.getAll);
router.post('/', heroController.create);

module.exports = router;