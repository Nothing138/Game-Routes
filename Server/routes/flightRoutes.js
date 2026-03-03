const express = require('express');
const router = express.Router();
const db = require('../config/db'); // আপনার ডাটাবেস কানেকশন পাথ অনুযায়ী পরিবর্তন করুন

// ১. ইউজারের প্রোফাইল থেকে ডিটেইলস অটো-ফিলের জন্য ডেটা আনা
router.get('/user-details/:userId', (req, res) => {
    const userId = req.params.userId;
    const sql = "SELECT * FROM user_details WHERE user_id = ?";
    
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

    const sql = `INSERT INTO travel_bookings 
    (user_id, full_name, email, contact_number, address, passport_number, departure_city, destination_city, passenger_count, travel_date, trip_type, booking_type, status) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'flight', 'requested')`;

    const values = [
        user_id,
        full_name,
        email,
        contact_number,
        address,
        passport_number,
        departure_city,
        destination_city,
        passenger_count,
        travel_date,
        trip_type
    ];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: "Database error" });
        }
        res.json({ success: true, message: "Flight request submitted successfully!", id: result.insertId });
    });
});

module.exports = router;