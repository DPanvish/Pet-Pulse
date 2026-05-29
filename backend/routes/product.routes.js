import express from 'express';
import { createProduct, updateProduct, getLowStockProducts, deleteProduct, getProducts } from "../controllers/product.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { upload } from "../config/cloudinary.js";

const router = express.Router();

router.get('/', protect, getProducts);
router.post('/', protect, upload.single('images'), createProduct);
router.get('/low-stock', protect, getLowStockProducts);
router.put('/:id', protect, upload.single('images'), updateProduct);
router.delete('/:id', protect, deleteProduct);

export default router;