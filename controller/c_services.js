const { getAllServices } = require('../model/m_services')
const jwt = require('jsonwebtoken')
require('dotenv').config()

module.exports =
{
    getServices: async (req, res) => {
        try {
            const authHeader = req.headers.authorization;

            if (!authHeader || !authHeader.startsWith("Bearer ")) {
                return res.status(401).json({
                    status: 108,
                    message: "Token tidak valid atau kadaluwarsa",
                    data: null,
                })
            }

            const token = authHeader.split(" ")[1]
            const secretKey = process.env.JWT_SECRET

            let decoded
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

            const services = await getAllServices();

            return res.status(200).json({
                status: 0,
                message: "Sukses",
                data: services,
            })

        } catch (error) {
            console.error("Error in getServiceList:", error)
            return res.status(500).json({
                status: 500,
                message: "Internal Server Error",
                data: null,
            });
        }
    }
}