import express from 'express';
import { addProduct } from '../controller/Products.js';
const router = express.Router();


router.post('/addProduct', addProduct); //Only available for admin
// router.post('/userLogin', logIn);


export default router;



