const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const authRoutes = require('./routes/authRoutes');
const blogRoutes = require('./routes/blogRoutes');
const adminRoutes = require('./routes/adminRoutes'); // ✅ Added Admin Routes

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes Registration
app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/admin', adminRoutes); 

// Static Folder for Images
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Simple Route for Testing
app.get('/', (req, res) => res.send('🚀 GAME ROUTES Backend is Running...'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🔥 Server started on port ${PORT}`));