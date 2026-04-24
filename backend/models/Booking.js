const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['hotel', 'train', 'bus', 'flight'],
    default: 'hotel'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  hotelName: {
    type: String,
    required: function requiredHotelName() {
      return this.type === 'hotel';
    }
  },
  trainName: {
    type: String,
    required: function requiredTrainName() {
      return this.type === 'train';
    }
  },
  fullName: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  from: {
    type: String,
    required: function requiredFrom() {
      return this.type === 'train' || this.type === 'bus' || this.type === 'flight';
    }
  },
  to: {
    type: String,
    required: function requiredTo() {
      return this.type === 'train' || this.type === 'bus' || this.type === 'flight';
    }
  },
  date: {
    type: Date,
    required: function requiredDate() {
      return this.type === 'train' || this.type === 'bus' || this.type === 'flight';
    }
  },
  passengers: {
    type: Number,
    required: function requiredPassengers() {
      return this.type === 'train' || this.type === 'bus' || this.type === 'flight';
    }
  },
  class: {
    type: String,
    required: function requiredClass() {
      return this.type === 'flight' || this.type === 'train';
    }
  },
  guests: {
    type: Number,
    required: function requiredGuests() {
      return this.type === 'hotel';
    }
  },
  checkIn: {
    type: Date,
    required: function requiredCheckIn() {
      return this.type === 'hotel';
    }
  },
  checkOut: {
    type: Date,
    required: function requiredCheckOut() {
      return this.type === 'hotel';
    }
  },
  paymentMethod: {
    type: String,
    default: 'Cash'
  },
  bookingDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Booking', bookingSchema);