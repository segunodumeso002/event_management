import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ? 
  loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY) : null;

const CheckoutForm = ({ event, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!stripe || !elements) return;
    
    setLoading(true);
    
    try {
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardElement),
      });

      if (error) {
        onError(error.message);
        setLoading(false);
        return;
      }

      // Process payment with backend
      const response = await fetch('/api/payments/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          paymentMethodId: paymentMethod.id,
          eventId: event.id,
          amount: event.price * 100 // Convert to cents
        })
      });

      const result = await response.json();
      
      if (result.success) {
        onSuccess(result);
      } else {
        onError(result.error);
      }
    } catch (error) {
      onError('Payment failed. Please try again.');
    }
    
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="payment-form">
      <div className="payment-details">
        <h3>Payment Details</h3>
        <div className="event-summary">
          <h4>{event.title}</h4>
          <p>Price: ${event.price}</p>
        </div>
      </div>
      
      <div className="card-element-container">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
            },
          }}
        />
      </div>
      
      <button 
        type="submit" 
        disabled={!stripe || loading}
        className="btn btn-primary payment-btn"
      >
        {loading ? 'Processing...' : `Pay $${event.price}`}
      </button>
    </form>
  );
};

const PaymentForm = ({ event, onSuccess, onError }) => {
  return (
    <Elements stripe={stripePromise}>
      <div className="payment-container glass-card">
        <CheckoutForm event={event} onSuccess={onSuccess} onError={onError} />
      </div>
    </Elements>
  );
};

export default PaymentForm;