import express from 'express';
import { getProducts, getProduct } from '../../controller/product.js';
const router = express.Router();

router.get('/:id', getProduct);
router.get('', getProducts);

export default router;



