import express from 'express';
import { addProduct } from '../../controller/product.js';
import { isSuperAdmin_HR } from '../../middleware/auth/adminAuth.js';
const router = express.Router();

router.use(isSuperAdmin_HR);
router.post('/addProduct', addProduct); //Only available for admin
// router.post('/userLogin', logIn);


export default router;



