import express from 'express';
import { register, logIn } from '../../controller/admin.js';
import { isAuthenticated } from '../../middleware/auth/adminAuth.js';
const router = express.Router();


router.post('/login', logIn);

router.use(isAuthenticated);
router.post('/register', isSuperAdmin_HR, register);

// router.get('/:id/profile', isAuthorized, getProfile);



export default router;



