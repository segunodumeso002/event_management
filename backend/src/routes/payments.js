import express from 'express';
import Stripe from 'stripe';
import { authenticate } from '../middleware/auth.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const router = express.Router();

// Process payment
router.post('/process', authenticate, async (req, res) => {
  try {
    const { paymentMethodId, eventId, amount } = req.body;
    const userId = req.user.id;

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount, // Amount in cents
      currency: 'usd',
      payment_method: paymentMethodId,
      confirm: true,
      return_url: `${process.env.CLIENT_URL}/events`,
    });

    if (paymentIntent.status === 'succeeded') {
      // Payment successful, you can save payment record to database here
      res.json({
        success: true,
        paymentIntent: paymentIntent,
        message: 'Payment processed successfully'
      });
    } else {
      res.status(400).json({
        success: false,
        error: 'Payment failed'
      });
    }
  } catch (error) {
    console.error('Payment processing error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;