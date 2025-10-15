import serverless from 'serverless-http';
import 'dotenv/config';
import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL || 'https://your-app.netlify.app',
  credentials: true
}));
app.use(express.json());

import authRoutes from './src/routes/auth.js';
import eventRoutes from './src/routes/events.js';
import registrationRoutes from './src/routes/registrations.js';
import paymentRoutes from './src/routes/payments.js';
import mapsRoutes from './src/routes/maps.js';

app.get('/', (req, res) => {
  res.json({ message: 'Event Management System API - Lambda' });
});

app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/maps', mapsRoutes);

export const handler = serverless(app);