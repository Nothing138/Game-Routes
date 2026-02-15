const express = require('express');
const router = express.Router();
const { createBlog } = require('../controllers/blogController');
const upload = require('../middleware/uploadMiddleware');
const protect = require('../middleware/authMiddleware'); // Agge banano security guard

// 'protect' thakar karone login chara keu post korte parbe na
router.post('/', protect, upload.single('featured_image'), createBlog);

module.exports = router;