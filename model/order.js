import mysql_db from '../db/sql-connection.js';
import errorHandler from '../utils/errorHandler.js';

class Order {
    constructor(order) {
        this.user_id = order.userId;
        this.cart_id =  order.cartId;
        this.total_price = order.totalPrice;
        this.address = order.address; 
    }

    save() {
        return new Promise((resolve, reject) => {
            mysql_db.connect((error) => {
                if(error) return reject(errorHandler(error));
            });
            const sql = 
            `   INSERT INTO orders (user_id,cart_id,total_price, address) 
                VALUES (${this.user_id},${this.cart_id},${this.total_price},'${this.address}');`;
            mysql_db.execute(sql, (error, result) => {
                if (error) {
                    return reject(errorHandler(error));
                } else { 
                    mysql_db.execute(`SELECT * FROM orders WHERE _id = ${result.insertId}`, (error, order) => {
                        if (error) {
                            return reject(errorHandler(error));
                        }
                        else {
                            resolve(order[0]); //For testing the return 
                        }
                    });
                }
            });
        });
    };

    static find() {
        return new Promise((resolve, reject) => {
            mysql_db.connect((error) => {
                if(error) return reject(errorHandler(error));
            });
            const sql = `
            SELECT * FROM orders;`;
            mysql_db.execute(sql, (error, orders) => {
                if (error) {
                    return reject(errorHandler(error));
                } else {
                    if(orders.length === 0) {
                        const error = new Error('Orders Not Found');
                        error.status = 404;
                        return reject(error);
                    }
                    resolve(orders); //Returns the product
                };
            });
        });
    }; //Need to use Inner Join and Group by

    static findById(id) {
        return new Promise((resolve, reject) => {
            mysql_db.connect((error) => {
                if(error) return reject(errorHandler(error));
            });
            const sql = `
            SELECT * FROM orders WHERE _id=${id};`;
            mysql_db.execute(sql, (error, order) => {
                if (error) {
                    return reject(errorHandler(error));
                } else {
                    if(order.length === 0) {
                        const error = new Error('Order Not Found');
                        error.status = 404;
                        return reject(error);
                    }
                    resolve(order[0]); //Returns the product
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

export default Order;
