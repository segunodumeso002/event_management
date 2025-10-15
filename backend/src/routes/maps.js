import express from 'express';
import { Client } from '@googlemaps/google-maps-services-js';

const router = express.Router();
const client = new Client({});

// Geocode address to get coordinates
router.post('/geocode', async (req, res) => {
  try {
    const { address } = req.body;

    const response = await client.geocode({
      params: {
        address: address,
        key: process.env.GOOGLE_MAPS_API_KEY,
      },
    });

    if (response.data.results.length > 0) {
      const location = response.data.results[0].geometry.location;
      res.json({
        success: true,
        latitude: location.lat,
        longitude: location.lng,
        formatted_address: response.data.results[0].formatted_address
      });
    } else {
      res.status(404).json({
        success: false,
        error: 'Address not found'
      });
    }
  } catch (error) {
    console.error('Geocoding error:', error);
    res.status(500).json({
      success: false,
      error: 'Geocoding failed'
    });
  }
});

export default router;