import Cart from '../model/cart.js';

export const addToCart = async(req, res) => {
    const {product_id} = req.body;
    const {id} = req.session.user;
    try {
        const c_id =  await Cart.addProduct(id, product_id);
        req.session.user.cart_id = c_id;
        return res.status(201).json(c_id);
    } catch (error) {
        return res.status(error.status?error.status:500).send(error.message);
    }
};

export const getCart = async(req, res) => {
    const {cart_id} = req.session.user;
    try {
        const result =  await Cart.findById(cart_id);
        return res.status(201).json(result);
    } catch (error) {
        return res.status(error.status?error.status:500).send(error.message);
    }
};
