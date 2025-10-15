
import 'dotenv/config'; // Ensure environment variables are loaded
import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());


import authRoutes from './routes/auth.js';
import eventRoutes from './routes/events.js';
import registrationRoutes from './routes/registrations.js';
import paymentRoutes from './routes/payments.js';
import mapsRoutes from './routes/maps.js';

app.get('/', (req, res) => {
  res.send('Event Management System API');
});

app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/maps', mapsRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
