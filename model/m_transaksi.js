const db = require('../config/database').db

module.exports = {
    getUserBalance: async (userId) => {
        try {
            const query = 'SELECT balance FROM users WHERE id = ?'
            return new Promise((resolve, reject) => {
                db.query(query, [userId], (err, result) => {
                    if (err) return reject(err);
                    resolve(result[0]?.balance || 0)
                })
            })
        } catch (error) {
            throw new Error('Error while fetching balance: ' + error.message)
        }
    },

    saveTransaction: async (userId, serviceCode, serviceName, totalAmount, invoiceNumber) => {
        try {
            const balanceQuery = 'SELECT balance FROM users WHERE id = ?'
            const [user] = await db.promise().query(balanceQuery, [userId])
            const balance = user[0]?.balance || 0;

            if (balance < totalAmount) {
                throw new Error('Insufficient balance')
            }

            await db.promise().beginTransaction()

            const transactionQuery = `
                INSERT INTO transactions 
                (user_id, service_code, service_name, total_amount, transaction_type, invoice_number) 
                VALUES (?, ?, ?, ?, ?, ?)`;
            await db.promise().query(transactionQuery, [userId, serviceCode, serviceName, totalAmount, 'PAYMENT', invoiceNumber])

            const balanceUpdateQuery = 'UPDATE users SET balance = balance - ? WHERE id = ?'
            await db.promise().query(balanceUpdateQuery, [totalAmount, userId])

            await db.promise().commit()

            const transactionData = {
                invoice_number: invoiceNumber,
                service_code: serviceCode,
                service_name: serviceName,
                transaction_type: 'PAYMENT',
                total_amount: totalAmount,
                created_on: new Date().toISOString(),
            };

            return transactionData
        } catch (error) {
            await db.promise().rollback()
            throw new Error('Error during transaction: ' + error.message)
        }
    },

    getAllTransactions: async () => {
        try {
            const [transactions] = await db.promise().query(`
                SELECT 
                    invoice_number, 
                    transaction_type, 
                    service_name AS description, 
                    total_amount, 
                    created_on
                FROM transactions
                ORDER BY created_on DESC
            `);
            return transactions;
        } catch (error) {
            throw new Error('Error fetching transactions: ' + error.message)
        }
    }


}
