import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import authRoutes from './routes/auth';
import bikeRoutes from './routes/bikes';
import userRoutes from './routes/users';
import bookingRoutes from './routes/bookings';
import notifRoutes from './routes/notifications';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/bikes', bikeRoutes);
app.use('/api/users', userRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/notifications', notifRoutes);

app.get('/', (req: Request, res: Response) => res.json({ ok: true }));

const port = process.env.PORT || 4000;
app.listen(Number(port), () => {
  console.log(`Server running on port ${port}`);
});

export default app;
