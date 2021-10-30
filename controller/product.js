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
        return res.status(204).send('Product added'); 
    } catch (error) {
        return res.status(error.status?error.status:500).send(error.message);
    }
};

export const getProducts = async (req, res) => {
    let products;
    try {
        if(req.query.search){
            products = await Product.findBytitle(req.query.search);
        }
        else {
            products = await Product.find();
        }
        return res.status(200).json(products); 
    } catch (error) {
        return res.status(error.status?error.status:500).send(error.message);
    }
};

export const getProduct = async (req, res) => {
    const {id} = req.params;
    try {
        const product = await Product.findById(Number(id));
        console.log(product);
        return res.status(200).json(product); 
    } catch (error) {
        return res.status(error.status?error.status:500).send(error.message);
    }
};



