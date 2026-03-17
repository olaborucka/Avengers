const express = require('express');
const router = express.Router();
const heroController = require('../controller/herocontroller');


router.get('/', heroController.getAll);
router.post('/', heroController.create);

router.patch('/:id', heroController.update);
router.get('/:id/incidents', heroController.getIncidents);

module.exports = router;