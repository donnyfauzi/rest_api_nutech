const { getEmail } = require('../model/m_users')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
require('dotenv').config()

module.exports =
{
    login: async (req, res) => {
        const { email, password } = req.body;

        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                status: 102,
                message: "Paramter email tidak sesuai format",
                data: null,
            });
        }

        try {
            const user = await getEmail(email);

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({
                status: 103,
                message: "Email atau password salah.",
                data: null,
                });
            }

            // Generate token JWT
            const token = jwt.sign({
                data: {
                    id: user.id,
                    email: user.email,
                },
            },
                process.env.JWT_SECRET,
                { expiresIn: "24h" } 
            )

            return res.status(200).json({
                status: 0,
                message: "Login Sukses",
                data: {
                token,
                },
            })

        } catch (error) {
            console.error("Error saat login:", error);
            return res.status(500).json({
                status: 104,
                message: "Server eror.",
                data: null,
            });
        }
    },
}
