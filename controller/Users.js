import User from '../model/user.js';

export const signUp = async (req, res) => {
    const {username, email, password} = req.body;
    try {
        const user = new User(username, email, password);
        await user.save()
        return res.status(201).send('User created'); 
    } catch (error) {
        return res.status(error.status).send(error.message);
    }
};

export const logIn = async (req,res) => {
    const {email_username, password} = req.body;
    try {
        const user = await User.loginWithCredentials(email_username, password);
        //can store these in hash 
        req.session.user = {
            id: user._id,
            username: user.username,
            email: user.email,
            cart_id : user.cart_id
        };
        return res.status(204).send('Login succesfull');
    } catch (error) {
        return res.status(error.status).send(error.message);
    }
}

export const getProfile = async (req,res) => {
    const {email} = req.body;
    try {
        const user = await User.findByEmail(email);
        console.log(user);
        // req.session.user = user;
        // console.log(req.session.user);
        // console.log(req.session);
        return res.status(201).json(user);
    } catch (error) {
        return res.status(error.status).send(error.message);
    }
}


