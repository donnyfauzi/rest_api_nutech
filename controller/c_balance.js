const { getBalance } = require('../model/m_balance')
const jwt = require('jsonwebtoken')
require('dotenv').config()

module.exports = {
    getUserBalance: async (req, res) => {
        try {
            const authHeader = req.headers.authorization

            if (!authHeader || !authHeader.startsWith("Bearer ")) {
                return res.status(401).json({
                    status: 108,
                    message: "Token tidak valid atau kadaluwarsa",
                    data: null,
                });
            }

            const token = authHeader.split(" ")[1]
            const secretKey = process.env.JWT_SECRET

            let decoded;
            try {
                decoded = jwt.verify(token, secretKey)
            } catch (error) {
                console.error("JWT Verification Error:", error.message)
                return res.status(401).json({
                    status: 108,
                    message: "Token tidak valid atau kadaluwarsa",
                    data: null,
                })
            }

            const email = decoded.data?.email

            if (!email) {
                return res.status(400).json({
                    status: 102,
                    message: "Email tidak ditemukan dalam token",
                    data: null,
                });
            }

            const balance = await getBalance(email)

            return res.status(200).json({
                status: 0,
                message: "Get Balance Berhasil",
                data: {
                    balance: balance,  
                },
            })
        } catch (error) {
            console.error("Error in getBalance:", error.message)
            return res.status(500).json({
                status: 500,
                message: "Internal Server Error",
                data: null,
            })
        }
    },
}
