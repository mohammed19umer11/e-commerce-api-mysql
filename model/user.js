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

            this.password = this._hashPassword();

            const sql = 
            `   INSERT INTO users (username,email,password) 
                VALUES ('${this.username}','${this.email}','${this.password}');`;
            mysql_db.execute(sql, (error, result) => {
                if (error) {
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
                    console.log('UPDATED');
                    resolve(result); //Returns the user
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
                    reject(error);
                } else {
                    console.log('UPDATED');
                    resolve(result); //Need to be a message handler function in resolve
                }
            });
            mysql_db.close;
        });
    };

    _hashPassword() {
        return bcrypt.hashSync(this.password, bcrypt.genSaltSync(10));
    }
    
    _comparePassword(password, hash) {
        return bcrypt.compareSync(password, hash);
    }
}

export default User;