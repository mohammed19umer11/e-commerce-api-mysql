import express from 'express';
import cors from 'cors';


import user_routes from './routes/user.js';
import product_routes from './routes/product.js';



async function startServer() {
        const app = express();
        app.use(express.json({extended: true}));
        app.use(express.urlencoded({extended: true}));
        app.use(cors());

        app.get('',(req,res)=>{
                res.send('Test');
        });
        app.use('/user',user_routes);
        app.use('/product',product_routes);
        const PORT = process.env.PORT || 9000;


        app.listen(PORT, ()=>console.log(`Server running on port ${PORT}`)); 
}

startServer();

