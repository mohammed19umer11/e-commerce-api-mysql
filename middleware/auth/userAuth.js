// session and redis authentication
export const isAuthenticated = async(req, res, next) => {
  try {
    if (!req.session || !req.session.user) {
      const error = new Error('Authentication Required');
      error.status = 401;
      throw error;
    }
    return next();
    
  } catch (error){
      return res.status(error.status).send(error.message)
  }
};

export const isAuthorized = async(req, res, next) => {
  try {
    // const token = req.headers.authorization.split(' ')[1];
    // jwt.verify(token, 'secret',(err, decoded) => {
    //     if(err) return next(new Error(err));
    // });
    if (req.session.user.id !== Number(req.params.id)) {
      const error = new Error('Not Authorized');
      error.status = 403;
      throw error;
    }
    return next();
  } catch (error) {
    return res.status(error.status).send(error.message)
  }
};