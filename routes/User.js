import express from 'express';
import { signUp, logIn } from '../controller/Users.js';
const router = express.Router();


router.post('/userSignUp', signUp);
router.post('/userLogin', logIn);


export default router;



