import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/product.routes.js";
import saleRoutes from "./routes/sale.routes.js";
import analyticsRoutes from "./routes/analytics.routes.js";

dotenv.config();

connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: "*",
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/sales', saleRoutes);
app.use('/api/analytics', analyticsRoutes);

app.get('/', (req, res) => {
  res.send('Pet Pulse API is running...');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});