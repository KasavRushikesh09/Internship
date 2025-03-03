const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
});

const Connection =db.connect((err)=>{
    if(err){
        console.log("error to connect db");
    }
    else{
        console.log('db connected successfully');
    }
});

module.exports = db;