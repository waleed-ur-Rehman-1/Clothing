import express from 'express';
import { createOrder, getUserOrders, getAllOrders, updateOrderStatus, getAnalytics } from '../controllers/orderController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, createOrder);
router.get('/myorders', protect, getUserOrders);
router.get('/admin/analytics', protect, admin, getAnalytics);
router.get('/admin/all', protect, admin, getAllOrders);
router.put('/admin/:id/status', protect, admin, updateOrderStatus);

export default router;