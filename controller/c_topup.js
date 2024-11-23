const { topUpBalance } = require('../model/m_topup')
const jwt = require('jsonwebtoken')
require('dotenv').config()

module.exports = {
    prosesTopUp: async (req, res) => {
        try {
            const { amount } = req.body;
            const authHeader = req.headers.authorization;

            if (!authHeader || !authHeader.startsWith("Bearer ")) {
                return res.status(401).json({
                    status: 108,
                    message: "Token tidak valid atau kadaluwarsa",
                    data: null,
                });
            }

            const token = authHeader.split(" ")[1];
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
                });
            }

            // Ambil email dari payload token
            const email = decoded.data?.email

            if (!email) {
                return res.status(400).json({
                    status: 102,
                    message: "Email tidak ditemukan dalam token",
                    data: null,
                })
            }

            if (!amount || typeof amount !== 'number' || amount <= 0) {
                return res.status(400).json({
                    status: 102,
                    message: "Parameter amount hanya boleh angka dan tidak boleh lebih kecil dari 0",
                    data: null,
                });
            }

            const updatedBalance = await topUpBalance(email, amount)

            return res.status(200).json({
                status: 0,
                message: "Top Up Balance berhasil",
                data: {
                    balance: updatedBalance,  
                },
            })
        } catch (error) {
            console.error("Error in topUpBalance:", error.message)
            return res.status(500).json({
                status: 500,
                message: "Internal Server Error",
                data: null,
            })
        }
    },
}
