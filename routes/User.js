import express from 'express';
import { signUp } from '../controller/Users.js';
const router = express.Router();


router.post('/userSignUp', signUp);



export default router;



