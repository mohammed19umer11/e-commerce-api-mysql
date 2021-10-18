import User from '../model/user.js';

export const signUp = async (req, res) => {
    const {username, email, password} = req.body;
    try {
        const user = new User(username, email, password);
        await user.save()
        return res.send('User created'); 
    } catch (error) {
        return res.status(400).send(error);
    }
};

export const logIn = async (req,res) => {
    const {email_username, password} = req.body;
    try {
        await User.loginWithCredentials(email_username, password);
        return res.send('User logged in');
    } catch (error) {
        return res.status(400).send(error);
    }
}


