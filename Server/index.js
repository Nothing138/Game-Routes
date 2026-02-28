const express = require('express');
const cors = require('cors');
const path = require('path');
const http = require('http'); // Node built-in module
const { Server } = require('socket.io'); // Socket.io import
require('dotenv').config();

const app = express();

// --- HTTP Server Create (Socket er jonno dorkar) ---
const server = http.createServer(app);

// --- Socket.io Initializing ---
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173", // Tomar frontend URL
        methods: ["GET", "POST"]
    }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Routes Import
const authRoutes = require('./routes/auth');
const blogRoutes = require('./routes/blogRoutes');
const adminRoutes = require('./routes/adminRoutes'); 
const tourRoutes = require('./routes/tourRoutes');
const staffRoutes = require('./routes/staffRoutes');
const recruiterRoutes = require('./routes/recruiterRoutes');
const jobRoutes = require('./routes/jobRoutes');
const messageRoutes = require('./routes/messageRoutes');
const announcementRoutes = require('./routes/announcementRoutes'); 
const analyticsRoutes = require('./routes/analyticsRoutes');
const registrationRoutes = require('./routes/userregistrationroute');

// ✅ Routes Registration
app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/admin', adminRoutes); 
app.use('/api/tours', tourRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/recruiter', recruiterRoutes);
app.use('/api/admin/jobs', jobRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/announcements', announcementRoutes); 
app.use('/api/analytics', analyticsRoutes);
app.use('/api/verify', registrationRoutes);
app.use('/api/auth', authRoutes);

// Static Folder for Images
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));
app.use(express.static('public'));

// --- 🚀 Socket.io Logic Start ---
io.on('connection', (socket) => {
    console.log('User Connected:', socket.id);

    // Join Room: Ekhane sender ar receiver er ID diye ekta unique room hobe
    socket.on('join_chat', (data) => {
        socket.join(data.room);
        console.log(`User joined room: ${data.room}`);
    });

    // Send Message Event
    socket.on('send_message', (data) => {
        // data = { room, sender_id, receiver_id, message }
        io.to(data.room).emit('receive_message', data);
    });

    socket.on('disconnect', () => {
        console.log('User Disconnected', socket.id);
    });
});
// --- 🚀 Socket.io Logic End ---

// Simple Route for Testing
app.get('/', (req, res) => res.send('🚀 GAME ROUTES Backend with Socket.io is Running...'));

const PORT = process.env.PORT || 5000;

// ⚠️ MONEROBA: app.listen er poriborte server.listen hobe
server.listen(PORT, () => console.log(`🔥 Server started on port ${PORT}`));