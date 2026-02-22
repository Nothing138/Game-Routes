const express = require('express');
const router = express.Router();
const recruiterController = require('../controllers/recruiterController'); // Controller connect
const authMiddleware = require('../middleware/authMiddleware');

// Router ekhon controller er function gulo use korbe
router.get('/profile', authMiddleware, recruiterController.getProfile);
router.get('/message-stats', authMiddleware, recruiterController.getMessageStats);

module.exports = router;