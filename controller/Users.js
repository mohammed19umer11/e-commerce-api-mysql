import mysql_db from '../middleware/sql-connection.js';


function INSERT(username,email,password) {
    return new Promise((resolve, reject) => {
        mysql_db.connect((error) => {
            if(error) throw error;
            console.log(mysql_db.threadId);
        });
        
        mysql_db.query(`INSERT INTO users (username,email,password) VALUES ('${username}','${email}','${password}')`, (error, result) => {
            if (error) {
                reject(error);
            } else {
                console.log('INSERTED');
                resolve(result);
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
            ${user.email? `email=${user.email}`:''}
            ${user.password? `password=${user.password}`:''} 
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
