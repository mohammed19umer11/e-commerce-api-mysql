import express from 'express';
import { signUp, logIn, getProfile } from '../../controller/user.js';
import { isAuthenticated, isAuthorized } from '../../middleware/auth/userAuth.js';
const router = express.Router();

import cart_routes from './cart.js';
import product_routes from './product.js';
import order_routes from './order.js';


router.post('/signup', signUp);
router.post('/login', logIn);


router.use(isAuthenticated); //For now disable for all routes params were unable to access
router.get('/profile', getProfile);
router.use('/cart', cart_routes);
router.use('/products', product_routes);
router.use(order_routes);


export default router;



