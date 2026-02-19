const express = require('express');
const router = express.Router();
const { createBlog } = require('../controllers/blogController');
const upload = require('../middleware/uploadMiddleware');
const protect = require('../middleware/authMiddleware');

// Eikhane logic holo: Agey login check (protect), tarpore file upload, tarpore database save
router.post('/', protect, upload.single('featured_image'), createBlog);

module.exports = router;