import mysql_db from '../middleware/sql-connection.js';


function INSERT(username,email,password) {
    return new Promise((resolve, reject) => {
        mysql_db.connect((error) => {
            if(error) throw error;
            console.log(mysql_db.threadId);
        });
        const sql = 
        `   INSERT INTO users (username,email,password) 
            VALUES ('${username}','${email}','${password}');`;
        mysql_db.execute(sql, (error, result) => {
            if (error) {
                reject(error);
            } else { 
                console.log('INSERTED');
                console.log(result);
                mysql_db.query(`SELECT * FROM users WHERE _id = ${result.insertId}`, (error, user) => {
                    if (error) {
                        reject(error);
                    }
                    else {
                        console.log(user[0]);
                        resolve(user[0]);
                    }
                })
            }
        });
        mysql_db.close;
    });
};

function UPDATE(id,user) {
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
        mysql_db.query(sql, (error, result) => {
            if (error) {
                reject(error);
            } else {
                console.log('UPDATED');
                resolve(result);
            }
        });
        mysql_db.close;
    });
};

export default {
    INSERT,
    UPDATE,
}



//NEED TO PULL FROM GITHUB BECAUSE ENV FILE WAS DELETED