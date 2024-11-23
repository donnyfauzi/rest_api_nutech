const db = require('../config/database').db

module.exports =
{
    getBalance: async function (email) {
        return new Promise((resolve, reject) => {
            const query = `SELECT balance FROM users WHERE email = ?`

            db.query(query, [email], (err, result) => {
                if (err) {
                    return reject(err);
                }

                if (result.length === 0) {
                    return reject(new Error("User tidak ditemukan"))
                }

                resolve(result[0].balance);  // Mengembalikan saldo pengguna
            })
        })
    },
}
