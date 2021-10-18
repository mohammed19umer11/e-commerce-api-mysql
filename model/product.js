import mysql_db from '../middleware/sql-connection.js';

class Product {
    constructor(product) {
        this.title = product.title;
        this.description =  product.description;
        this.image = product.image || null ;
        this.price = product.price; 
        this.category = product.category;
        this.tags = product.tags || null;
    }

    save() {
        return new Promise((resolve, reject) => {
            mysql_db.connect((error) => {
                if(error) throw error;
                console.log(mysql_db.threadId);
            });
            const sql = 
            `   INSERT INTO products (title,description,image,price,category,tags) 
                VALUES ('${this.title}','${this.description}','${this.image}',${this.price},${this.category},'${this.tags}');`;
            mysql_db.execute(sql, (error, result) => {
                if (error) {
                    reject(error);
                } else { 
                    console.log('INSERTED');
                    console.log(result);
                    // returning the inserted product 
                    mysql_db.execute(`SELECT * FROM products WHERE _id = ${result.insertId}`, (error, product) => {
                        if (error) {
                            reject(error);
                        }
                        else {
                            console.log(product[0]);
                            resolve(product[0]); //For testing the return 
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
            SELECT * FROM products WHERE _id=${id};`;
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