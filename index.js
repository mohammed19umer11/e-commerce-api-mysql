import express from 'express';  

import cors from 'cors';
import session from './middleware/session.js';

import user_routes from './routes/user.js';
import product_routes from './routes/product.js';



async function startServer() {
        const app = express();

        //if run behind proxy (nginx)
        //app.set('trust proxy', 1);

        app.use(express.json({extended: true}));
        app.use(express.urlencoded({extended: true}));
        app.use(cors());
        app.use(session);

        app.get('',(req,res)=>{
                res.send('Test');
        });
        app.use('/user',user_routes);
        app.use('/product',product_routes);

        const PORT = process.env.PORT || 9000;
        app.listen(PORT, ()=>console.log(`Server running on port ${PORT}`)); 
}

startServer();

