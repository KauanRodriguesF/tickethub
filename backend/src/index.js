import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import eventRoutes from './routes/events.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (_, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

// Routes
app.use('/events', eventRoutes);

app.listen(PORT, () => {
  console.log(`TicketHub API running on port ${PORT}`);
});
