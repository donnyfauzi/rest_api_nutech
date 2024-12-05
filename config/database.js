const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

// Tambahkan log ketika koneksi berhasil:
pool.getConnection((err, connection) => {
    if (err) {
        console.error('Error connecting to the database:', err.message);
        return;
    }
    console.log('Database connected! Host:', process.env.DB_HOST, '| Database:', process.env.DB_NAME);
    connection.release(); 
});

module.exports = { db: pool.promise() };
