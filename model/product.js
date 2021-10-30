import mysql_db from '../db/sql-connection.js';
import errorHandler from '../utils/errorHandler.js';

class Product {
    constructor({title, description, image = null, price, category, tags = null}) {
        this.title = title;
        this.description =  description;
        this.image = image;
        this.price = price; 
        this.category = category;
        this.tags = tags;
    }

    save() {
        return new Promise((resolve, reject) => {
            mysql_db.connect((error) => {
                if(error) return reject(errorHandler(error));
            });
            const sql = 
            `   INSERT INTO products (title,description,image,price,category,tags) 
                VALUES ('${this.title}','${this.description}','${this.image}',${this.price},${this.category},'${this.tags}');`;
            mysql_db.execute(sql, (error, result) => {
                if (error) {
                    return reject(errorHandler(error));
                } else { 
                    mysql_db.execute(`SELECT * FROM products WHERE _id = ${result.insertId}`, (error, product) => {
                        if (error) {
                            return reject(errorHandler(error));
                        }
                        else {
                            resolve(product[0]); //For testing the return 
                        }
                    })
                }
            });
        });
    };

    static find() {
        return new Promise((resolve, reject) => {
            mysql_db.connect((error) => {
                if(error) return reject(errorHandler(error));
            });
            const sql = `SELECT * FROM products;`;
            mysql_db.execute(sql, (error, products) => {
                if (error) {
                    return reject(errorHandler(error));
                } else {
                    if(products.length === 0) {
                        const error = new Error('Products Not Found');
                        error.status = 404;
                        return reject(error);
                    }
                    resolve(products); //Returns the product
                };
            });
        });
    };

    static findBytitle(title) {
        return new Promise((resolve, reject) => {
            mysql_db.connect((error) => {
                if(error) return reject(errorHandler(error));
            });
            const sql = `
            SELECT * FROM products WHERE title=${title};`;
            mysql_db.execute(sql, (error, product) => {
                if (error) {
                    return reject(errorHandler(error));
                } else {
                    if(product.length === 0) {
                        const error = new Error('Product Not Found');
                        error.status = 404;
                        return reject(error);
                    }
                    resolve(product[0]); //Returns the product
                }
            });
        });
    };

    static findById(id) {
        return new Promise((resolve, reject) => {
            mysql_db.connect((error) => {
                if(error) return reject(errorHandler(error));
            });
            const sql = `
            SELECT * FROM products WHERE _id=${id};`;
            mysql_db.execute(sql, (error, product) => {
                if (error) {
                    return reject(errorHandler(error));
                } else {
                    if(product.length === 0) {
                        const error = new Error('Product Not Found');
                        error.status = 404;
                        return reject(error);
                    }
                    resolve(product[0]); //Returns the product
                }
            });
        });
    };
    
    //methods below need to updated
    static findByIdandUpdate(id,product) {
        return new Promise((resolve, reject) => {
            mysql_db.connect((error) => {
                if(error) throw error;
                console.log(mysql_db.threadId);
            });
            const sql = `
            UPDATE products 
            SET 
                ${product.price? `price='${product.price}'`:''}
                ${product.tags? `tags='${product.tags}'`:''}
            WHERE _id=${id};`;
            mysql_db.execute(sql, (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    console.log('UPDATED');
                    resolve(result); //Need to be a message handler function in resolve
                }
            });
            mysql_db.close;
        });
    };

}


export default Product;