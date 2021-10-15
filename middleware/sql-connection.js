import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

const mysql_db = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
});

export default mysql_db;


//NEED TO PULL FROM GITHUB BECAUSE ENV FILE WAS DELETED