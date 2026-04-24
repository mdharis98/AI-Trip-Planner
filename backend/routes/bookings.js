const express = require('express');
const Booking = require('../models/Booking');
const auth = require('../middleware/auth');

const router = express.Router();

// Create booking
router.post('/create', auth, async (req, res) => {
  try {
    const booking = new Booking({
      userId: req.userId,
      ...req.body
    });
    await booking.save();
    res.json({ message: 'Booking confirmed. Please pay at the hotel.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user bookings
router.get('/user/:userId', auth, async (req, res) => {
  try {
    if (req.params.userId !== req.userId) return res.status(403).json({ message: 'Unauthorized' });
    const bookings = await Booking.find({ userId: req.userId });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;