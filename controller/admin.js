import Admin from '../model/admin.js';

export const register = async (req, res) => {
    const {adminname, email, password, role} = req.body;
    try {
        const admin = new Admin(adminname, email, password, role);
        await admin.save()
        return res.status(201).send('Admin Added'); 
    } catch (error) {
        return res.status(error.status?error.status: 500).send(error.message);
    }
};

export const logIn = async (req,res) => {
    const {email_adminname, password} = req.body;
    try {
        const admin = await Admin.loginWithCredentials(email_adminname, password);
        //can store these in hash 
        req.session.admin = {
            id: admin._id,
            username: admin.adminname,
            email: admin.email,
            role: admin.role
        };
        return res.status(204).send('Login succesfull');
    } catch (error) {
        return res.status(error.status?error.status: 500).send(error.message);
    }
}
