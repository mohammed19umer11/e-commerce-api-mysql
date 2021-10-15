import express from 'express';
import Users from '../controller/Users.js';

const router = express.Router();


router.post('/userSignUp', async (req, res) => {
    const {username, email, password} = req.body;
    await Users.INSERT(username,email,password);
    res.send('User created');
});



export default router;



//NEED TO PULL FROM GITHUB BECAUSE ENV FILE WAS DELETED