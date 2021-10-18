import bcrypt from 'bcrypt';
import mysql_db from '../middleware/sql-connection.js';

class User {
    constructor(username, email, password) {
        this.username = username;
        this.email = email;
        this.password = password;
    }

    save() {
        return new Promise((resolve, reject) => {
            mysql_db.connect((error) => {
                if(error) throw error;
                console.log(mysql_db.threadId);
            });
            if (!this.username || !this.password || !this.email) {
                reject(new Error('Missing required fields'));
            }

            this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync(10));

            const sql = 
            `   INSERT INTO users (username,email,password) 
                VALUES ('${this.username}','${this.email}','${this.password}');`;
            mysql_db.execute(sql, (error, result) => {
                if (error) {
                    console.log(error);
                    reject(error);
                } else { 
                    console.log('INSERTED');
                    console.log(result);
                    // returning the user inserted 
                    mysql_db.execute(`SELECT * FROM users WHERE _id = ${result.insertId}`, (error, user) => {
                        if (error) {
                            reject(error);
                        }
                        else {
                            console.log(user[0]);
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
                if(error) throw error;
                console.log(mysql_db.threadId);
            });
            const sql = `SELECT * FROM users WHERE email='${email_username}';`;
            mysql_db.execute(sql, (error, result) => {
                if (error) {
                    console.log(error);
                    reject(error);
                } else {
                    console.log('Email_Username Matched');
                    if(bcrypt.compareSync(password, result[0].password)) {
                        console.log('Password Matched');
                        resolve(result[0]);
                    }
                    else {
                        console.log('Password Does Not Matched');
                        reject(new Error('Password does not match'));
                    }
                }
                mysql_db.close;
            });
        })
    };
    static findById(id) {
        return new Promise((resolve, reject) => {
            mysql_db.connect((error) => {
                if(error) throw error;
                console.log(mysql_db.threadId);
            });
            const sql = `
            SELECT * FROM users WHERE _id=${id};`;
            mysql_db.execute(sql, (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    console.log('FOUND');
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
                ${user.email? `email='${user.email}'`:''}
                ${user.password? `password='${user.password}'`:''} 
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