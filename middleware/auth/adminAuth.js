export const isAuthenticated = async(req, res, next) => {
    try {
      if (!req.session || !req.session.admin) {
        const error = new Error('Authentication Required');
        error.status = 401;
        throw error;
      }
      return next();
      
    } catch (error){
        return res.status(error.status).send(error.message);
    }
};

export const isSuperAdmin = async(req,res,next) => {
    try {
        if (req.session.admin.role !== 'super admin') {
            const error = new Error('Not Authorized');
            error.status = 403;
            throw error;
        }
        return next();
    } catch (error) {
        return res.status(error.status).send(error.message);
    }
};

export const isSuperAdmin_HR = async(req,res,next) => {
    try {
        if(req.session.admin.role !== 'super admin' || req.session.admin.designation !== 'invnetory manager') {
            const error = new Error('Not Authorized');
            error.status = 403;
            throw error;
        }
    } catch (error) {
        return res.status(error.status).send(error.message);
    }
};

