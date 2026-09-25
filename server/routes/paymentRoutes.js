import express from 'express';
import { initiateEasypaisaPayment } from '../controllers/paymentController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/easypaisa', protect, initiateEasypaisaPayment);

export default router;