const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  city: {
    type: String,
    required: true
  },
  cityImage: {
    type: String
  },
  days: {
    type: Number,
    required: true
  },
  budget: {
    type: String,
    required: true
  },
  travelers: {
    type: Number,
    required: true
  },
  itinerary: [{
    day: Number,
    activities: [String]
  }],
  hotels: [{
    name: String,
    address: String,
    priceRange: String,
    rating: Number,
    image: String
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Trip', tripSchema);