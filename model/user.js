import bcrypt from 'bcrypt';
import mysql_db from '../db/sql-connection.js';
import errorHandler from '../utils/errorHandler.js';

class User {
    constructor(username, email, password) {
        this.username = username;
        this.email = email;
        this.password = password;
    }

    save() {
        return new Promise((resolve, reject) => {
            mysql_db.connect((error) => {
                if(error) {
                    return reject(errorHandler(error));
                };
            });
            if (!this.username || !this.email || !this.password) {
                const error = new Error('Username, Email or Password missing');
                error.status = 400;
                return reject(error);
            }

            this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync(10));

            const sql = 
            `   INSERT INTO users (username,email,password) 
                VALUES ('${this.username}','${this.email}','${this.password}');`;
            mysql_db.execute(sql, (error, result) => {
                if (error) {
                    return reject(errorHandler(error));
                } else { 
                    mysql_db.execute(`SELECT * FROM users WHERE _id = ${result.insertId}`, (error, user) => {
                        if (error) {
                            return reject(errorHandler(error));
                        }
                        else {
                            resolve(user[0]); //For testing the return 
                        }
                    })
                }
            });
        });
    };

    static loginWithCredentials(email_username, password) {
        return new Promise((resolve, reject) => {
            mysql_db.connect((error) => {
                if(error) {
                    return reject(errorHandler(error));
                };
            });
            if (!email_username || !password) {
                const error = new Error('Username/Email or Password missing');
                error.status = 400;
                return reject(error);
            }
            const sql = `SELECT * FROM users WHERE email='${email_username}';`;
            mysql_db.execute(sql, (error, result) => {
                if (error) {
                    return reject(errorHandler(error));
                } else {
                    if(result.length === 0) {
                        const error = new Error('Wrong username/email or password');
                        error.status = 404;
                        return reject(error);
                    }
                    if(bcrypt.compareSync(password, result[0].password)) {
                        resolve({
                            _id : result[0]._id,
                            username : result[0].username,
                            email : result[0].email,
                            cart_id : result[0].cart_id
                        });
                    }
                    else {
                        const error = new Error('Wrong username/email or password');
                        error.status = 404;
                        return reject(error);
                    }
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
            SELECT * FROM users;`;
            mysql_db.execute(sql, (error, users) => {
                if (error) {
                    return reject(errorHandler(error));
                } else {
                    if(users.length === 0) {
                        const error = new Error('Users Not Found');
                        error.status = 404;
                        return reject(error);
                    }
                    resolve(users); //Returns the product
                };
            });
        });
    };
    
    static findByEmail(email) {
        return new Promise((resolve, reject) => {
            mysql_db.connect((error) => {
                if(error) {
                    return reject(errorHandler(error));
                };
            });
            const sql = `SELECT * FROM users WHERE email='${email}';`;
            mysql_db.execute(sql, (error, user) => {
                if (error) {
                    return reject(errorHandler(error));
                } else {
                    if(user.length === 0) {
                       const error = new Error('User Not Found');
                       error.status = 404;
                       return reject(error);
                    }
                    resolve({
                        _id : user[0]._id,
                        username : user[0].username,
                        email : user[0].email,
                        cart_id : user[0].cart_id
                    }); //Returns the user
                }
            });
        });
    };
    
    static findById(id) {
        return new Promise((resolve, reject) => {
            mysql_db.connect((error) => {
                if(error) {
                    return reject(errorHandler(error));
                };
            });
            const sql = `
            SELECT * FROM users WHERE _id=${id};`;
            mysql_db.execute(sql, (error, user) => {
                if (error) {
                    return reject(errorHandler(error));
                } else {
                    if(user.length === 0) {
                       const error = new Error('User Not Found');
                       error.status = 404;
                       return reject(error);
                    }
                    resolve({
                        _id : user[0]._id,
                        username : user[0].username,
                        email : user[0].email,
                        cart_id : user[0].cart_id
                    }); //Returns the user
                }
            });
        });
    };

    //methods below need to updated
    static findByIdandUpdate(id,user) {
        return new Promise((resolve, reject) => {
            mysql_db.connect((error) => {
                if(error) throw error;
                console.log(mysql_db.threadId);
            });
            const sql = `
            UPDATE users 
            SET 
                ${user.username? `username='${user.username}'`:''}
            WHERE _id=${id};`;
            mysql_db.execute(sql, (error, result) => {
                if (error) {
                    console.log(error);
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

export default User;