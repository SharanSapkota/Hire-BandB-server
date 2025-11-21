import 'dotenv/config';
import express, { Request, Response } from 'express';
import path from 'path';
import cors from 'cors';
import { createServer } from 'http';
import authRoutes from './routes/auth';
import bikeRoutes from './routes/bikes';
import userRoutes from './routes/users';
import bookingRoutes from './routes/bookings';
import notifRoutes from './routes/notifications';
import roleRoutes from './routes/roles';
import permRoutes from './routes/permissions';
import productRoutes from './routes/products';
import paymentRoutes from './routes/payments';
import fileUploadRoute from './routes/fileUpload';
import rentalRoutes from './routes/rentals';
import productAssetRoutes from './routes/productAssets';
// import userPaymentRoutes from './routes/userPayments';
import reviewRoutes from './routes/reviews';
import categoryRoutes from './routes/categories';
// import userDetailRoutes from './routes/userDetails';
import userPhoneRoutes from './routes/userPhones';
import userSecurityRoutes from './routes/userSecurity';
import identificationRoutes from './routes/identification';
import locationRoutes from './routes/locations';
import activityLogRoutes from './routes/activityLogs';
import permissionMappingRoutes from './routes/permissionMappings';
import userEmailRoutes from './routes/userEmails';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './swagger';
import { MEDIA_ROOT } from './middleware/upload';
import { initSocket } from './lib/socket';
import * as authController from './controllers/authController';
import stripeRoutes from './routes/stripe';
import { FRONTEND_URL } from './config/app.config';
import cookieParser from 'cookie-parser';

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: [
    'https://bike-hive-hub.lovable.app',
    'http://localhost:8080',        
    'https://gear-quest-hub.onrender.com', 
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Set-Cookie'],
}));

app.use('/media', express.static(MEDIA_ROOT));

// Email verification redirect route (GET request from email links)
app.get('/verify-email', authController.verifyEmailGet);

app.use('/api/auth', authRoutes);
app.use('/api/bikes', bikeRoutes);
app.use('/api/users', userRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/notifications', notifRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/permissions', permRoutes);
app.use('/api/products', productRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/rentals', rentalRoutes);
app.use('/api/product-assets', productAssetRoutes);
// app.use('/api/user-payments', userPaymentRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/categories', categoryRoutes);
// app.use('/api/user-details', userDetailRoutes);
app.use('/api/user-phones', userPhoneRoutes);
app.use('/api/user-security', userSecurityRoutes);
app.use('/api/identification', identificationRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/activity-logs', activityLogRoutes);
app.use('/api/permission-mappings', permissionMappingRoutes);
app.use('/api/user-emails', userEmailRoutes);
app.use('/api/file-upload', fileUploadRoute);
app.use('/api/stripe', stripeRoutes);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/', (req: Request, res: Response) => res.json({ ok: true }));

const port = process.env.PORT || 4000;
const server = createServer(app);
initSocket(server);

server.listen(Number(port), () => {
  console.log(`Server running on port ${port}`);
});

export default app;
