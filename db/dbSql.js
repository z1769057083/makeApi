const mysql = require('mysql')
const pool = mysql.createPool({
    host: '192.168.38.196', // 数据库地址
    user: 'root', // 数据库用户
    password: 'root', // 数据库密码
    database: 'ultrasf' // 选中数据库
})

// 执行sql脚本对数据库进行读写 
function query(sql) {
    return new Promise((resolve, reject) => {
        pool.getConnection(function(err, connection) {
            connection.query(sql, (error, results, fields) => {
                // 如果有错误就抛出
                if (error) {
                    reject(error)
                } else {
                    resolve(results)
                }
                // 结束会话
                connection.release();
            })
        })
    })
}

function update(sql, usql) {
    return new Promise((resolve, reject) => {
        pool.getConnection(function(err, connection) {
            connection.query(sql, usql, (error, results, fields) => {
                console.log(results)
                    // 如果有错误就抛出
                if (error) {
                    reject(error)
                } else {
                    resolve(results)
                }
                // 结束会话
                connection.release();
            })
        })
    })
}
module.exports = {
    query,
    update
}