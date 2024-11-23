const db = require('../config/database').db

module.exports =
{
    getAllServices: async () => {
    try {
            const query = 'SELECT * FROM services'
            
            return new Promise((resolve, reject) => {
                db.query(query, (err, result) => {
                    if (err) {
                        return reject(err)
                    }
                    resolve(result)
                });
            });
        } catch (error) {
            throw new Error('Error while fetching services: ' + error.message)
        }
    }
}