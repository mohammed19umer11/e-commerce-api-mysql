import User from '../model/user.js';

export const signUp = async (req, res) => {
    const {username, email, password} = req.body;
    const user = new User(username, email, password);
    await user.save()
    res.send('User created'); //need to be send throught Message class 
};

export const logIn = async (req,res) => {
    
}


