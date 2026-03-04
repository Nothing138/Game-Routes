const express = require('express');
const router = express.Router();
const db = require('../config/db');

// ১. ইউজারের প্রোফাইল থেকে ডিটেইলস অটো-ফিলের জন্য ডেটা আনা
// এটি ফ্রন্টএন্ডে useEffect এ কল করবেন যাতে ইউজারের নাম, পাসপোর্ট, ফোন আগে থেকেই ফিলাপ থাকে
router.get('/user-details/:userId', (req, res) => {
    const userId = req.params.userId;
    const sql = `
        SELECT 
            ud.first_name, ud.surname, ud.passport_number, ud.phone_number, ud.current_location as address,
            u.email 
        FROM user_details ud
        JOIN users u ON ud.user_id = u.id
        WHERE ud.user_id = ?`;
    
    db.query(sql, [userId], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.length > 0) {
            res.json(result[0]);
        } else {
            res.status(404).json({ message: "User details not found" });
        }
    });
});

// ২. ফ্লাইট বুকিং রিকোয়েস্ট সেভ করা
router.post('/flight-request', (req, res) => {
    const {
        user_id,
        full_name,
        age,
        email,
        contact_number,
        address,
        passport_number,
        departure_city,
        destination_city,
        travel_date,
        passenger_count,
        trip_type,
        policy_accepted
    } = req.body;

    // SQL query updated to include age and policy_accepted
    const sql = `INSERT INTO travel_bookings 
    (user_id, full_name, age, email, contact_number, address, passport_number, departure_city, destination_city, passenger_count, travel_date, trip_type, booking_type, status, policy_accepted) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'flight', 'requested', ?)`;

    const values = [
        user_id,
        full_name,
        age || null, // Age input column
        email,
        contact_number,
        address,
        passport_number,
        departure_city,
        destination_city,
        passenger_count || 1,
        travel_date,
        trip_type,
        policy_accepted ? 1 : 0 // Boolean to TinyInt conversion
    ];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error("Database Error:", err);
            return res.status(500).json({ success: false, message: "Database error occurred" });
        }
        res.json({ 
            success: true, 
            message: "Flight request submitted successfully!", 
            bookingId: result.insertId 
        });
    });
});

module.exports = router;