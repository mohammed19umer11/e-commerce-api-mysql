import express from 'express';  

import cors from 'cors';
import session from './middleware/session.js';

import user_routes from './routes/user/user.js';
import errorHandler from './utils/errorHandler.js';
// import admin_routes from './routes/admin/admin.js';



async function startServer() {
        const app = express();

        //if run behind proxy (nginx)
        //app.set('trust proxy', 1);

        app.use(express.json({extended: true}));
        app.use(express.urlencoded({extended: true}));
        app.use(cors());
        app.use(session);    
        

        app.get('',(req,res)=>{
                res.send('Welcome To E-Commerce');
        });
        app.use('/user',user_routes);

        const PORT = process.env.PORT || 9000;
        app.listen(PORT, ()=>console.log(`Server running on port ${PORT}`)); 
}

startServer();

