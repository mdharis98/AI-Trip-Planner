const express = require('express');
const axios = require('axios');
const Trip = require('../models/Trip');
const auth = require('../middleware/auth');

const router = express.Router();

// Generate trip
router.post('/generate', auth, async (req, res) => {
  try {
    const { city, days, budget, travelers } = req.body;

    // Validate input
    if (!city || !days || !budget) {
      return res.status(400).json({ message: 'Please provide city, days, and budget' });
    }

    console.log('Generating trip for:', { city, days, budget, travelers });

    let cityImage = '';
    let lat = null;
    let lon = null;
    let itinerary = [];
    
    // Try to get city coordinates
    try {
      const geocodeRes = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(city)}`,
        { headers: { 'User-Agent': 'AI-Travel-Planner' } }
      );
      
      if (geocodeRes.data && geocodeRes.data.length > 0) {
        lat = geocodeRes.data[0].lat;
        lon = geocodeRes.data[0].lon;
        console.log('Geocoded city:', { city, lat, lon });
      }
    } catch (geoError) {
      console.error('Geocoding error:', geoError.message);
    }

    // Try to get city image
    try {
      const cityImgRes = await axios.get(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(city)} city&per_page=1&client_id=${process.env.UNSPLASH_ACCESS_KEY}`
      );
      
      if (cityImgRes.data && cityImgRes.data.results && cityImgRes.data.results.length > 0) {
        cityImage = cityImgRes.data.results[0].urls.small;
      }
    } catch (imgError) {
      console.error('Unsplash error:', imgError.message);
    }

    // Try to get places from OpenTripMap if we have coordinates
    let places = [];
    if (lat && lon) {
      try {
        const placesRes = await axios.get(
          `https://api.opentripmap.com/0.1/en/places/radius?radius=10000&lon=${lon}&lat=${lat}&kinds=museums,parks,landmarks,interesting_places&format=json&apikey=${process.env.OPENTRIPMAP_API_KEY}`
        );
        
        if (placesRes.data && Array.isArray(placesRes.data)) {
          places = placesRes.data.filter(p => p.name && p.name.trim() !== '').slice(0, days * 4);
          console.log(`Found ${places.length} places from OpenTripMap`);
        }
      } catch (placesError) {
        console.error('OpenTripMap error:', placesError.message);
      }
    }

    // Generate itinerary with actual places or fallback data
    if (places.length > 0) {
      const activitiesPerDay = Math.ceil(places.length / days);
      for (let d = 1; d <= days; d++) {
        const start = (d - 1) * activitiesPerDay;
        const end = Math.min(d * activitiesPerDay, places.length);
        const dayActivities = places.slice(start, end).map(p => p.name);
        itinerary.push({ day: d, activities: dayActivities });
      }
    } else {
      // Fallback itinerary if API fails
      console.log('Using fallback itinerary data');
      for (let d = 1; d <= days; d++) {
        const fallbackActivities = [
          `Morning: Explore ${city} City Center`,
          `Afternoon: Visit local attractions in ${city}`,
          `Evening: Try local cuisine`,
          `Night: Enjoy ${city} nightlife`
        ];
        itinerary.push({ 
          day: d, 
          activities: fallbackActivities.slice(0, Math.min(4, Math.ceil(4 / days)))
        });
      }
    }

    // Generate hotels
    const budgetRanges = {
      'Cheap': { name: 'Budget Inn', price: '₹50-100', rating: 3.5 },
      'Moderate': { name: 'Comfort Hotel', price: '₹100-200', rating: 4.2 },
      'Luxury': { name: 'Luxury Resort', price: '₹200-500', rating: 4.8 }
    };

    const selectedBudget = budgetRanges[budget] || budgetRanges['Moderate'];
    
    const hotels = [
      { 
        name: `${selectedBudget.name} ${city}`, 
        address: `Downtown ${city}`, 
        priceRange: selectedBudget.price, 
        rating: selectedBudget.rating,
        image: ''
      },
      { 
        name: `${city} City Hotel`, 
        address: `City Center ${city}`, 
        priceRange: selectedBudget.price, 
        rating: selectedBudget.rating - 0.3,
        image: ''
      },
      { 
        name: `${city} Plaza`, 
        address: `${city} Tourist District`, 
        priceRange: selectedBudget.price, 
        rating: selectedBudget.rating - 0.1,
        image: ''
      }
    ];

    // Try to get hotel images
    for (let hotel of hotels) {
      try {
        const imgRes = await axios.get(
          `https://api.unsplash.com/search/photos?query=hotel room&per_page=1&client_id=${process.env.UNSPLASH_ACCESS_KEY}`
        );
        
        if (imgRes.data && imgRes.data.results && imgRes.data.results.length > 0) {
          hotel.image = imgRes.data.results[0].urls.small;
        }
      } catch (hotelImgError) {
        console.error('Hotel image error:', hotelImgError.message);
        // Use a placeholder or leave empty
      }
    }

    // Save trip
    const trip = new Trip({
      userId: req.userId,
      city,
      cityImage: cityImage || `https://source.unsplash.com/400x300/?${encodeURIComponent(city)},city`,
      days: parseInt(days),
      budget,
      travelers: parseInt(travelers) || 1,
      itinerary,
      hotels
    });
    
    await trip.save();
    console.log('Trip saved successfully:', trip._id);

    res.status(200).json({ 
      success: true, 
      _id: trip._id,
      ...trip.toObject() 
    });
  } catch (error) {
    console.error('Trip generation error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      success: false,
      message: 'Error generating trip. Please try again.',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Server error'
    });
  }
});

// Get user trips
router.get('/', auth, async (req, res) => {
  try {
    const trips = await Trip.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(trips);
  } catch (error) {
    console.error('Error fetching trips:', error);
    res.status(500).json({ message: 'Error fetching trips' });
  }
});

// Get trip by id
router.get('/:id', auth, async (req, res) => {
  try {
    const trip = await Trip.findOne({ _id: req.params.id, userId: req.userId });
    if (!trip) return res.status(404).json({ message: 'Trip not found' });
    res.json(trip);
  } catch (error) {
    console.error('Error fetching trip:', error);
    res.status(500).json({ message: 'Error fetching trip details' });
  }
});

module.exports = router;