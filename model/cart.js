import mysql_db from '../db/sql-connection.js';
import User from '../model/user.js';
import errorHandler from '../utils/errorHandler.js';
class Cart {
    // constructor(cart) {
    //     this.user_id = cart.userId;
    // }

    static find(cart_id, product_id) {
        return new Promise((resolve, reject) => {
            mysql_db.connect((error) => {
                if(error) return reject(errorHandler(error));
            });
            const sql = `
            SELECT * FROM cart_products WHERE cart_id=${cart_id} AND product_id=${product_id} LIMIT 1;`;
            mysql_db.execute(sql, (error, result) => {
                if (error) {
                    return reject(errorHandler(error));
                } else {
                    if(result.length === 0) {
                        return resolve(false);
                    }
                    return resolve(true); 
                }
            });
            
        });
    };

    static addProduct(user_id, product_id) {
        return new Promise(async (resolve, reject) => {
            mysql_db.connect((error) => {
                if(error) return reject(errorHandler(error));
            });
            const user = await User.findById(user_id);
            if(user.cart_id === null) {
                const sql = `INSERT INTO carts (user_id) VALUES (${user_id});`;
                mysql_db.execute(sql, (error, cart) => {
                    if (error) {
                        return reject(errorHandler(error));
                    } else {
                        const sql = `UPDATE users SET cart_id=${cart.insertId} WHERE _id=${user_id};`;
                        mysql_db.execute(sql, (error, user) => {
                            if (error) {
                                return reject(errorHandler(error));
                            } else {
                                const sql = `INSERT INTO cart_products (cart_id, product_id, qty) VALUES (${cart.insertId}, ${product_id}, 1);`;
                                mysql_db.execute(sql, (error, cart_product) => {
                                    if (error) {
                                        return reject(errorHandler(error));
                                    } else {
                                        return resolve(cart_product);
                                    }
                                });
                            }
                        });
                    }
                });
            }
            else {
                if(await Cart.find(user.cart_id, product_id)){
                    const sql = `
                    UPDATE cart_products 
                    SET qty = qty + 1 
                    WHERE cart_id = ${user.cart_id} AND product_id =  ${product_id};`;
                    mysql_db.execute(sql, (error, cart_product) => {
                        if (error) {
                            return reject(errorHandler(error));
                        } else {
                            return resolve(user.cart_id);
                        }
                    });
                }
                else {
                    const sql = `INSERT INTO cart_products (cart_id, product_id, qty) VALUES (${user.cart_id}, ${product_id}, 1);`;
                    mysql_db.execute(sql, (error, cart_product) => {
                        if (error) {
                            return reject(errorHandler(error));
                        } else {
                            return resolve(user.cart_id);
                        }
                    });
                }
            }
        });
    };

    static findById(id) {
        return new Promise((resolve, reject) => {
            mysql_db.connect((error) => {
                if(error) return reject(errorHandler(error));
            });
            const sql = `
            SELECT
	            cart_products.cart_id as _id,
                products._id as product_id,
                products.title, 
                products.description, 
                products.image, 
                products.price,
                cart_products.qty
            FROM cart_products
            INNER JOIN products ON cart_products.product_id = products._id
            WHERE cart_products.cart_id =${id};`;
            mysql_db.execute(sql, (error, cart) => {
                if (error) {
                    return reject(errorHandler(error));
                } else {
                    if(cart.length === 0) {
                        const error = new Error('Product Not Found');
                        error.status = 404;
                        return reject(error);
                    }
                    console.log(`CART : ${cart}`);
                    resolve(cart); //Returns the product
                }
            });
            
        });
    };

    
    
    // static findByIdandUpdate(id,product) {
    //     return new Promise((resolve, reject) => {
    //         mysql_db.connect((error) => {
    //             if(error) throw error;
    //             console.log(mysql_db.threadId);
    //         });
    //         const sql = `
    //         UPDATE products 
    //         SET 
    //             ${product.price? `price='${product.price}'`:''}
    //             ${product.tags? `tags='${product.tags}'`:''}
    //         WHERE _id=${id};`;
    //         mysql_db.execute(sql, (error, result) => {
    //             if (error) {
    //                 reject(error);
    //             } else {
    //                 console.log('UPDATED');
    //                 resolve(result); //Need to be a message handler function in resolve
    //             }
    //         });
    //         mysql_db.close;
    //     });
    // };

}

export default Cart;