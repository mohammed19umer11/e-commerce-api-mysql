import express from 'express';
import { createOrder, getOrders, getOrder } from '../../controller/order.js';
const router = express.Router();

router.get('/orders', getOrders);
router.get('/:id', getOrder);
router.post('/order', createOrder); 

export default router;