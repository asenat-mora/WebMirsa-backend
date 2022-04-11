const mysql = require('mysql2');
const {promisify} = require('util');
require('dotenv').config();

const conDetails = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
};

const pool = mysql.createPool(conDetails);

pool.getConnection((err, connection) => {
        if(err) {
            if(err.code === 'PROTOCOL_CONNECTION_LOST') {
                console.error('Database connection was closed.');
            }
            if(err.code === 'ER_CON_COUNT_ERROR') {
                console.error('Database has too many connections.');
            }
            if(err.code === 'ECONNREFUSED') {
                console.error('Database connection was refused.');
            }
        }
        if(connection) connection.release();
        console.log('DB is connected');
        return;
});

pool.getConnection = promisify(pool.getConnection);
pool.query = promisify(pool.query);

module.exports = pool;