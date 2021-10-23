import bcrypt from 'bcrypt';
import mysql_db from '../db/sql-connection.js';

class User {
    constructor(username, email, password) {
        this.username = username;
        this.email = email;
        this.password = password;
    }

    save() {
        return new Promise((resolve, reject) => {
            mysql_db.connect((error) => {
                if(error) console.error(error);
                if(error) {
                    const error = new Error('Server Error');
                    error.status = 500;
                    return reject(error);
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
                    if(error.code==='ER_PARSE_ERROR'){
                        console.error('SQL QUERY ERROR : ' + error);
                        const query_error = new Error('Server Error');
                        query_error.status = 500;
                        return reject(query_error);
                    }
                    if(error.code==='ER_DUP_ENTRY'){
                        console.error('DUPLICATE ENTRY ERROR : ' + error);
                        const query_error = new Error('Username/Email Already Exist');
                        query_error.status = 400;
                        return reject(query_error);
                    }
                    else {
                        console.error('SQL ERROR : ' + error);
                        return reject(error);
                    }
                } else { 
                    console.log('SQL MESSAGE : INSERTED');
                    mysql_db.execute(`SELECT * FROM users WHERE _id = ${result.insertId}`, (error, user) => {
                        if (error) {
                            //can check if user not found | not found error code
                            console.log('SQL ERROR : GETTING USER AFTER INSERTING');
                            console.error(error);
                            return reject(error);
                        }
                        else {
                            console.log('SQL MESSAGE : USER RETURNED');
                            resolve(user[0]); //For testing the return 
                        }
                    })
                }

                mysql_db.close;
            });
        });
    };

    static loginWithCredentials(email_username, password) {
        return new Promise((resolve, reject) => {
            mysql_db.connect((error) => {
                if(error) console.error(error);
                if(error) {
                    const error = new Error('Server Error');
                    error.status = 500;
                    return reject(error);
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
                    //useful in error handler
                    // console.log(error.code); //ER_PARSE_ERROR -> QUERY
                    // console.log(error.sqlState); //42000
                    // console.log(error.errno); //1064
                    if(error.code==='ER_PARSE_ERROR') {
                        console.error('SQL QUERY ERROR : ' + error);
                        const query_error = new Error('Server Error');
                        query_error.status = 500;
                        return reject(query_error);
                    }
                    else {
                        console.error('SQL ERROR : ' + error);
                        return reject(error);
                    }
                } else {
                    if(result.length === 0) {
                         //can check if user not found | not found error code
                        console.log('SQL ERROR : FINDING USER');
                        const error = new Error('Wrong username/email or password');
                        error.status = 404;
                        return reject(error);
                    }
                    console.log('SQL MESSAGE : USERNAME/EMAIL MATCHED');
                    console.log(result);
                    if(bcrypt.compareSync(password, result[0].password)) {
                        console.log('SQL MESSAGE : USERNAME/EMAIL & PASSWORD MATCHED');
                        resolve({
                            _id : result[0]._id,
                            username : result[0].username,
                            email : result[0].email,
                            cart_id : result[0].cart_id
                        });
                    }
                    else {
                        console.error('SQL ERROR : PASSWORD NOT MATCHED');
                        const error = new Error('Wrong username/email or password');
                        error.status = 404;
                        return reject(error);
                    }
                }
                mysql_db.close;
            });
        })
    };
    
    static findByEmail(email) {
        return new Promise((resolve, reject) => {
            mysql_db.connect((error) => {
                if(error) console.error(error);
                if(error) {
                    const error = new Error('Server Error');
                    error.status = 500;
                    reject(error);
                };
            });
            const sql = `SELECT * FROM users WHERE email='${email}';`;
            mysql_db.execute(sql, (error, result) => {
                if (error) {
                    //can chekc if user not found | not found error code
                    if(error.code==='ER_PARSE_ERROR') {
                        console.error('SQL QUERY ERROR : ' + error);
                        const query_error = new Error('Server Error');
                        query_error.status = 500;
                        return reject(query_error);
                    }
                    else {
                        console.error('SQL ERROR : ' + error);
                        return reject(error);
                    }
                } else {
                    if(result.length === 0) {
                        //can check if user not found | not found error code
                       console.log('SQL ERROR : FINDING USER');
                       const error = new Error('Wrong email');
                       error.status = 404;
                       return reject(error);
                    }
                    console.log(result);
                    console.log('SQL MESSAGE : USER FOUND');
                    resolve({
                        _id : result[0]._id,
                        username : result[0].username,
                        email : result[0].email,
                        cart_id : result[0].cart_id
                    }); //Returns the user
                }
                mysql_db.close;
            });
            
        });
    };
    
    static findById(id) {
        return new Promise((resolve, reject) => {
            mysql_db.connect((error) => {
                if(error) console.error(error);
                if(error) {
                    const error = new Error('Server Error');
                    error.status = 500;
                    reject(error);
                };
            });
            const sql = `
            SELECT * FROM users WHERE _id=${id};`;
            mysql_db.execute(sql, (error, result) => {
                if (error) {
                    console.error('SQL ERROR : USER NOT FOUND');
                    //create new error
                    reject(error);
                } else {
                    console.log('SQL MESSAGE : USER FOUND');
                    resolve(result[0]); //Returns the user
                }
                mysql_db.close;
            });
            
        });
    };

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