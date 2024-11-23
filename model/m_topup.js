const db = require('../config/database').db
const moment = require('moment')

module.exports = {
    topUpBalance: async function (email, amount) {
        try {
            const updatedAt = moment().format('YYYY-MM-DD HH:mm:ss');
            
            const query = `UPDATE users SET balance = balance + ?, updated_at = ? WHERE email = ?`
            
            return new Promise((resolve, reject) => {
                db.query(query, [amount, updatedAt, email], (err, result) => {
                    if (err) {
                        return reject(err);
                    }
                    if (result.affectedRows === 0) {
                        return reject(new Error("User tidak ditemukan"));
                    }
                    
                    const balanceQuery = `SELECT balance FROM users WHERE email = ?`
                    db.query(balanceQuery, [email], (err, rows) => {
                        if (err) {
                            return reject(new Error("Error mengambil saldo baru"))
                        }
                        resolve(rows[0].balance)
                    })
                })
            })
        } catch (error) {
            throw new Error("Error saat proses top-up balance")
        }
    },
}
