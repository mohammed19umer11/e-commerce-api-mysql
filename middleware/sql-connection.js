import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

const mysql_db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Umer1234',
  database: 'e-commerce'
});

export default mysql_db;