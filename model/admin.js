import bcrypt from 'bcrypt';
import mysql_db from '../middleware/sql-connection.js';

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
                if(error) throw error;
                console.log(mysql_db.threadId);
            });
            if (!this.adminname || !this.password || !this.email) {
                reject(new Error('Missing required fields'));
            }

            this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync(10));

            const sql = 
            `   INSERT INTO admins (adminname,email,password,role) 
                VALUES ('${this.adminname}','${this.email}','${this.password}', '${this.role}');`;
            mysql_db.execute(sql, (error, result) => {
                if (error) {
                    console.log(error);
                    reject(error);
                } else { 
                    console.log('INSERTED');
                    console.log(result);
                    // returning the admin inserted 
                    mysql_db.execute(`SELECT * FROM admins WHERE _id = ${result.insertId}`, (error, admin) => {
                        if (error) {
                            reject(error);
                        }
                        else {
                            console.log(admin[0]);
                            resolve(admin[0]); //For testing the return 
                        }
                    })
                }

                mysql_db.close;
            });
        });
    };

    static loginWithCredentials(email_adminname, password) {
        return new Promise((resolve, reject) => {
            mysql_db.connect((error) => {
                if(error) throw error;
                console.log(mysql_db.threadId);
            });
            const sql = `SELECT * FROM admins WHERE email='${email_adminname}';`;
            mysql_db.execute(sql, (error, result) => {
                if (error) {
                    console.log(error);
                    reject(error);
                } else {
                    console.log('Email_Adminname Matched');
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
            SELECT * FROM admins WHERE _id=${id};`;
            mysql_db.execute(sql, (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    console.log('FOUND');
                    resolve(result[0]); //Returns the admin
                }
                mysql_db.close;
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
            mysql_db.close;
        });
    };

}

export default User;