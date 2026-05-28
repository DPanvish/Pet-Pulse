import express from 'express';
import { createProduct, updateProduct, getLowStockProducts, deleteProduct, getProducts } from "../controllers/product.controller.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get('/', protect, getProducts);
router.post('/', protect, createProduct);
router.get('/low-stock', protect, getLowStockProducts);
router.put('/:id', protect, updateProduct);
router.delete('/:id', protect, deleteProduct);

export default router;