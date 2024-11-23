const { getAllBanners } = require('../model/m_banner')

module.exports =
{
     getBanners: async (req, res) => {
        try {
            const banners = await getAllBanners()

            return res.status(200).json({
                status: 0,
                message: 'Sukses',
                data: banners
            })
        } catch (error) {
            return res.status(401).json({
                status: 108,
                message: 'Token tidak tidak valid atau kadaluwarsa',
                data: null
            })
        }
    }
}