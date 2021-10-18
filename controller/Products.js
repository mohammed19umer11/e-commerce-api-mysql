import Product from '../model/product.js';

export const addProduct = async (req, res) => {
    try {
        const product = new Product({
            title : req.body.title, 
            description : req.body.description,
            image : req.body.image, 
            price : req.body.price,
            category : req.body.category,
            tags: req.body.tags
        });
        await product.save()
        return res.send('Product added'); 
    } catch (error) {
        return res.status(400).send(error);
    }
};



