const mysql = require('mysql')
const pool = mysql.createPool({
    host: '192.168.38.196',
    user: 'root',
    password: 'root',
    database: 'ultrasf'
})

function query(sql) {
    return new Promise((resolve, reject) => {
        pool.getConnection(function(err, connection) {
            connection.query(sql, (error, results, fields) => {
                if (error) {
                    reject(error)
                } else {
                    resolve(results)
                }
                connection.release();
            })
        })
    })
}
module.exports = {
    query
}