const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// ✅ Routes Import (Shudhu ekbar kore declare korben)
const authRoutes = require('./routes/auth'); // Apnar notun auth file jeta amra banalam
const blogRoutes = require('./routes/blogRoutes');
const adminRoutes = require('./routes/adminRoutes'); 
const tourRoutes = require('./routes/tourRoutes');
const staffRoutes = require('./routes/staffRoutes');
const recruiterRoutes = require('./routes/recruiterRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const jobRoutes = require('./routes/jobRoutes');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Routes Registration (Clean & Unique)
app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/admin', adminRoutes); 
app.use('/api/tours', tourRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/recruiter', recruiterRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/jobs', jobRoutes);

// Static Folder for Images
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Simple Route for Testing
app.get('/', (req, res) => res.send('🚀 GAME ROUTES Backend is Running...'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🔥 Server started on port ${PORT}`));