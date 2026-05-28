import express from 'express';
import { getDashboardMetrics, getTopProducts } from '../controllers/analytics.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/dashboard', protect, getDashboardMetrics);
router.get('/top-products', protect, getTopProducts);

export default router;