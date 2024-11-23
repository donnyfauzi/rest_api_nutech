const db = require('../config/database').db
const bcrypt = require('bcryptjs')
const moment = require('moment')

module.exports =
{
    registerUser: async function (req) {
        try {
            const hashedPassword = await bcrypt.hash(req.body.password, 8)

            const sqlData = {
                email       : req.body.email,
                password    : hashedPassword,
                first_name  : req.body.first_name,
                last_name   : req.body.last_name,
                created_at  : moment().format('YYYY-MM-DD HH:mm:ss'),
            };

            const sqlSyntax = `INSERT INTO users SET ?`

            return new Promise((resolve, reject) => {
                db.query(sqlSyntax, [sqlData], (err, result) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(result);
                })
            })

        } catch (error) {
            throw new Error("Eror saat proses registrasi")
        }
    },

    getEmail: function (email) {
        const sql = `SELECT * FROM users WHERE email = ?`

        return new Promise((resolve, reject) => {
            db.query(sql, [email], (err, results) => {
                if (err) {
                return reject(err);
                }
                resolve(results[0]); 
            })
        })
    },

    updateUsersModel: async (req, email) => {
        try {
            const { first_name, last_name, password } = req.body

            let updateData = {
                first_name: first_name,
                last_name: last_name,
                updated_at: moment().format('YYYY-MM-DD HH:mm:ss'),
            };

            if (password) {
                const hashedPassword = await bcrypt.hash(password, 8)
                updateData.password = hashedPassword;
            }

            const sqlSyntax = `UPDATE users SET ? WHERE email = ?`

            return new Promise((resolve, reject) => {
                db.query(sqlSyntax, [updateData, email], (err, result) => {
                if (err) {
                    return reject(err);  
                }
                resolve(result); 
                });
            })

        } catch (error) {
            throw new Error("Error saat update profil")
        }
    },
}




