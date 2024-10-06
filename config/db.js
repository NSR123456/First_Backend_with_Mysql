const mysql = require('mysql2/promise')

const mySqlPool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '2hermione-granger',
    database: 'student_db'
})
module.exports = mySqlPool;