@echo off
echo Installing frontend dependencies...
npm install @googlemaps/js-api-loader react-google-maps-api @stripe/stripe-js @stripe/react-stripe-js emailjs-com

echo Installing backend dependencies...
cd backend
npm install nodemailer stripe @googlemaps/google-maps-services-js

echo Dependencies installed successfully!
pause