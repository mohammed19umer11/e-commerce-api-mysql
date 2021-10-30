import bcrypt from 'bcrypt';
import mysql_db from '../middleware/sql-connection.js';
import errorHandler from '../utils/errorHandler.js';

class User {
    constructor(adminname, email, password, role = null) {
        this.adminname = adminname;
        this.email = email;
        this.password = password;
        this.role = role;
    }

    save() {
        return new Promise((resolve, reject) => {
            mysql_db.connect((error) => {
                if(error) return reject(errorHandler(error));
            });
            if (!this.adminname || !this.password || !this.email) {
                const error = new Error('Adminname, Email or Password missing');
                error.status = 400;
                return reject(error);
            }

            this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync(10));

            const sql = 
            `   INSERT INTO admins (adminname,email,password,role) 
                VALUES ('${this.adminname}','${this.email}','${this.password}', '${this.role}');`;
            mysql_db.execute(sql, (error, result) => {
                if (error) {
                    return reject(errorHandler(error));
                } else { 
                    mysql_db.execute(`SELECT * FROM admins WHERE _id = ${result.insertId}`, (error, admin) => {
                        if (error) {
                            return reject(errorHandler(error));
                        }
                        else {
                            resolve(admin[0]); //For testing the return 
                        }
                    });
                }
            });
        });
    };

    static loginWithCredentials(email_adminname, password) {
        return new Promise((resolve, reject) => {
            mysql_db.connect((error) => {
                if(error) return reject(errorHandler(error));
            });
            const sql = `SELECT * FROM admins WHERE email='${email_adminname}';`;
            mysql_db.execute(sql, (error, result) => {
                if (error) {
                    return reject(errorHandler(error));
                } else {
                    if(bcrypt.compareSync(password, result[0].password)) {
                        return resolve(result[0]);
                    }
                    else {
                        const error = new Error('Wrong adminname/email or password');
                        error.status = 404;
                        return reject(error);
                    }
                }
            });
        })
    };

    //methods below needs to be updated
    static findById(id) {
        return new Promise((resolve, reject) => {
            mysql_db.connect((error) => {
                if(error) throw error;
                console.log(mysql_db.threadId);
            });
            const sql = `
            SELECT * FROM admins WHERE _id=${id};`;
            mysql_db.execute(sql, (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    console.log('FOUND');
                    resolve(result[0]); //Returns the admin
                }
            });
            
        });
    };
    
    static findByIdandUpdate(id,{adminname}) {
        return new Promise((resolve, reject) => {
            mysql_db.connect((error) => {
                if(error) throw error;
                console.log(mysql_db.threadId);
            });
            const sql = `
            UPDATE admins
            SET 
                ${adminname? `adminname='${adminname}'`:''}
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
        });
    };

}

export default User;