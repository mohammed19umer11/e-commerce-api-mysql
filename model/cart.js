import mysql_db from '../db/sql-connection.js';

class Cart {
    constructor(cart) {
        this.user_id = cart.userId;
    }

    save() {
        return new Promise((resolve, reject) => {
            mysql_db.connect((error) => {
                if(error) throw error;
                console.log(mysql_db.threadId);
            });
            const sql = 
            `   INSERT INTO carts (user_id) 
                VALUES (${this.user_id}');`;
            mysql_db.execute(sql, (error, result) => {
                if (error) {
                    reject(error);
                } else { 
                    console.log('INSERTED');
                    console.log(result);
                    // returning the inserted order 
                    mysql_db.execute(`SELECT * FROM cart WHERE _id = ${result.insertId}`, (error, cart) => {
                        if (error) {
                            reject(error);
                        }
                        else {
                            console.log(cart[0]);
                            resolve(cart[0]); //For testing the return 
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
            SELECT * FROM carts WHERE _id=${id};`;
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

export default Cart;