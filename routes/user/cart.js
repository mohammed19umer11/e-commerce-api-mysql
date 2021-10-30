import express from 'express';
import { addToCart, getCart } from '../../controller/cart.js';
const router = express.Router();

router.get('', getCart);
router.post('/addProduct', addToCart); 


export default router;