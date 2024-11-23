const db = require('../config/database').db

module.exports = 
{
    getAllBanners: async () => {
        try {
            const query = 'SELECT * FROM banners'

            return new Promise((resolve, reject) => {
                db.query(query, (err, result) => {
                    if (err) {
                        return reject(err)
                    }
                    resolve(result)
                });
            });
        } catch (error) {
            throw new Error('Error while fetching banners')
        }
    }

}