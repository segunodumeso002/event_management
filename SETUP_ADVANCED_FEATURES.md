# Advanced Features Setup Guide

## Overview
This guide will help you set up the advanced features for your Event Management System:
- 🗺️ Google Maps integration
- 📧 Email notifications
- 🏷️ Event categories
- 💳 Payment processing
- 🔍 Advanced search/filtering

## Prerequisites
1. Google Cloud Platform account
2. Stripe account
3. EmailJS account
4. Gmail account (for backend email service)

## Installation Steps

### 1. Install Dependencies

Run the batch file to install all required dependencies:
```bash
./install-dependencies.bat
```

Or manually install:

**Frontend:**
```bash
npm install @googlemaps/js-api-loader react-google-maps-api @stripe/stripe-js @stripe/react-stripe-js emailjs-com
```

**Backend:**
```bash
cd backend
npm install nodemailer stripe @googlemaps/google-maps-services-js
```

### 2. Google Maps Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the following APIs:
   - Maps JavaScript API
   - Geocoding API
   - Places API (optional)
4. Create credentials (API Key)
5. Restrict the API key to your domain

### 3. Stripe Setup

1. Create account at [Stripe](https://stripe.com/)
2. Get your publishable and secret keys from the dashboard
3. Set up webhooks (optional for advanced features)

### 4. EmailJS Setup

1. Create account at [EmailJS](https://www.emailjs.com/)
2. Create email service (Gmail recommended)
3. Create email templates:
   - Registration confirmation
   - Event reminder
   - Event cancellation
4. Get your User ID, Service ID, and Template IDs

### 5. Gmail App Password (Backend Email)

1. Enable 2-factor authentication on your Gmail account
2. Generate an app password for the application
3. Use this app password in your backend .env file

### 6. Environment Variables

**Frontend (.env):**
```env
VITE_API_URL=http://localhost:5001/api
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_here
VITE_EMAILJS_SERVICE_ID=your_emailjs_service_id
VITE_EMAILJS_TEMPLATE_REGISTRATION=your_registration_template_id
VITE_EMAILJS_TEMPLATE_REMINDER=your_reminder_template_id
VITE_EMAILJS_TEMPLATE_CANCELLATION=your_cancellation_template_id
VITE_EMAILJS_USER_ID=your_emailjs_user_id
```

**Backend (.env):**
```env
PORT=5001
DATABASE_URL=postgresql://username:password@localhost:5432/event_management
JWT_SECRET=your_jwt_secret_here

# Google Maps API
GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here

# Stripe Payment Processing
STRIPE_SECRET_KEY=your_stripe_secret_key_here
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_here

# Email Configuration
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Client URL for redirects
CLIENT_URL=http://localhost:5173
```

### 7. Database Updates

Run the updated SQL schema to add new columns and tables:

```sql
-- Add new columns to events table
ALTER TABLE events ADD COLUMN IF NOT EXISTS category VARCHAR(50) DEFAULT 'general';
ALTER TABLE events ADD COLUMN IF NOT EXISTS price DECIMAL(10,2) DEFAULT 0.00;
ALTER TABLE events ADD COLUMN IF NOT EXISTS latitude DECIMAL(10,8);
ALTER TABLE events ADD COLUMN IF NOT EXISTS longitude DECIMAL(11,8);

-- Add new columns to registrations table
ALTER TABLE registrations ADD COLUMN IF NOT EXISTS payment_status VARCHAR(20) DEFAULT 'pending';
ALTER TABLE registrations ADD COLUMN IF NOT EXISTS payment_id VARCHAR(255);
ALTER TABLE registrations ADD COLUMN IF NOT EXISTS amount_paid DECIMAL(10,2) DEFAULT 0.00;

-- Create new tables
-- (Run the full schema from db_schema.sql for new installations)
```

## Features Overview

### 🗺️ Google Maps Integration
- Interactive map view of events
- Geocoding for event locations
- Markers with event information
- Info windows with event details

### 📧 Email Notifications
- Registration confirmation emails
- Event reminder emails
- Event cancellation notifications
- HTML formatted emails

### 🏷️ Event Categories
- Predefined categories (Conference, Workshop, etc.)
- Category-based filtering
- Visual category indicators

### 💳 Payment Processing
- Stripe integration for paid events
- Secure payment processing
- Payment confirmation
- Free event registration

### 🔍 Advanced Search & Filtering
- Keyword search
- Category filtering
- Location-based search
- Date range filtering
- Price range filtering
- Multiple sorting options

## Usage

1. Start the backend server:
```bash
cd backend
npm run dev
```

2. Start the frontend development server:
```bash
npm run dev
```

3. Access the application at `http://localhost:5173`

## Testing

1. Create events with different categories and prices
2. Test the map view with events that have locations
3. Register for paid events to test payment processing
4. Check email notifications in your inbox
5. Use advanced search filters to find specific events

## Troubleshooting

### Google Maps not loading
- Check API key is correct
- Verify APIs are enabled in Google Cloud Console
- Check browser console for errors

### Payment processing fails
- Verify Stripe keys are correct
- Check Stripe dashboard for test transactions
- Ensure test mode is enabled for development

### Emails not sending
- Verify EmailJS configuration
- Check email templates are published
- Verify Gmail app password is correct

### Search not working
- Check database has events with proper data
- Verify category values match predefined options
- Check console for JavaScript errors

## Security Notes

- Never commit API keys to version control
- Use environment variables for all sensitive data
- Implement proper input validation
- Use HTTPS in production
- Regularly update dependencies

## Next Steps

Consider implementing:
- Event capacity limits
- Waitlist functionality
- Social media integration
- Calendar integration
- Mobile app
- Admin dashboard
- Analytics and reporting