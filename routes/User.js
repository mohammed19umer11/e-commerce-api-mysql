import express from 'express';
import { signUp, logIn, getProfile } from '../controller/Users.js';
import { isAuthenticated } from '../middleware/auth/authentication.js';
const router = express.Router();


router.post('/signup', signUp);
router.post('/login', logIn);


// router.use(isAuthenticated);
router.get('/:id/profile', isAuthenticated, getProfile);


export default router;



