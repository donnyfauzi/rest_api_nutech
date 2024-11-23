const jwt = require('jsonwebtoken')
const { getUserBalance, saveTransaction, getAllTransactions } = require('../model/m_transaksi')
require('dotenv').config()

module.exports = {
    prosesTransaksi: async (req, res) => {
        try {
            const authHeader = req.headers['authorization']
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return res.status(401).json({
                    status: 108,
                    message: 'Token tidak valid atau kadaluwarsa',
                    data: null,
                });
            }

            const token = authHeader.split(' ')[1]
            let decoded

            try {
                decoded = jwt.verify(token, process.env.JWT_SECRET)
            } catch (error) {
                const message = error.name === 'TokenExpiredError' ? 'Token sudah kedaluwarsa' : 'Token tidak valid'
                return res.status(401).json({
                    status: 108,
                    message,
                    data: null,
                });
            }

            const userId = decoded.data.id

            const { serviceCode, serviceName, totalAmount } = req.body

            if (!serviceCode || !serviceName || !totalAmount || isNaN(totalAmount)) {
                return res.status(400).json({
                    status: 102,
                    message: 'Parameter transaksi tidak lengkap atau invalid',
                    data: null,
                });
            }

            const balance = await getUserBalance(userId)
            if (balance < totalAmount) {
                return res.status(400).json({
                    status: 102,
                    message: 'Saldo tidak mencukupi untuk transaksi ini',
                    data: null,
                });
            }

            const invoiceNumber = `INV${new Date().toISOString().slice(2, 10).replace(/-/g, '')}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`
            const transactionData = await saveTransaction(userId, serviceCode, serviceName, parseFloat(totalAmount), invoiceNumber)
            return res.status(200).json({
                status: 0,
                message: 'Transaksi berhasil',
                data: transactionData,
            });
        } catch (error) {
            console.error('Error in prosesTransaksi:', error.message)
            return res.status(500).json({
                status: 500,
                message: 'Terjadi kesalahan pada server',
                data: null,
            });
        }
    },

    getHistoryTransactions: async (req, res) => {
        try {
            const authHeader = req.headers.authorization

            if (!authHeader) {
                return res.status(401).json({
                    status: 401,
                    message: 'Unauthorized: No token provided',
                });
            }

            const token = authHeader.split(' ')[1]
            if (!token) {
                return res.status(401).json({
                    status: 401,
                    message: 'Unauthorized: Token missing',
                });
            }

            const secretKey = process.env.JWT_SECRET;

            jwt.verify(token, secretKey, (err, decoded) => {
                if (err) {
                    console.error('Token verification failed:', err)
                    return res.status(403).json({
                        status: 403,
                        message: 'Forbidden: Invalid token',
                    })
                }

                (async () => {
                    const transactions = await getAllTransactions()

                    res.json({
                        status: 0,
                        message: "Get History Berhasil",
                        data: {
                            records: transactions.map(transaction => ({
                                invoice_number: transaction.invoice_number,
                                transaction_type: transaction.transaction_type,
                                description: transaction.description,
                                total_amount: transaction.total_amount,
                                created_on: transaction.created_on,
                            }))
                        }
                    })
                })()
            })

        } catch (error) {
            console.error("Error in getHistoryTransactions:", error)

            return res.status(500).json({
                status: 500,
                message: "Error retrieving transaction history",
                data: null
            })
        }
    }
}
