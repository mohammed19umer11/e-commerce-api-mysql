import mysql_db from '../db/sql-connection.js';

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
                if(error) throw error;
                console.log(mysql_db.threadId);
            });
            const sql = 
            `   INSERT INTO orders (user_id,cart_id,total_price, address) 
                VALUES (${this.user_id},${this.cart_id},${this.total_price},'${this.address}');`;
            mysql_db.execute(sql, (error, result) => {
                if (error) {
                    reject(error);
                } else { 
                    console.log('INSERTED');
                    console.log(result);
                    // returning the inserted order 
                    mysql_db.execute(`SELECT * FROM orders WHERE _id = ${result.insertId}`, (error, order) => {
                        if (error) {
                            reject(error);
                        }
                        else {
                            console.log(order[0]);
                            resolve(order[0]); //For testing the return 
                        }
                    })
                }

                mysql_db.close;
            });
        });
    };

    static findById(id) {
        return new Promise((resolve, reject) => {
            mysql_db.connect((error) => {
                if(error) throw error;
                console.log(mysql_db.threadId);
            });
            const sql = `
            SELECT * FROM orders WHERE _id=${id};`;
            mysql_db.execute(sql, (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    console.log('FOUND');
                    resolve(result[0]); //Returns the product
                }
                mysql_db.close;
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
