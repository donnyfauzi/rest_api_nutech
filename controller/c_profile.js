const { getEmail } = require('../model/m_users')
const jwt = require('jsonwebtoken')
require('dotenv').config()

// Data dummy untuk gambar profil
const dummyProfileImages = {
    'user@nutech-integrasi.com': "https://yoururlapi.com/profile.jpeg",
}

module.exports = 
{
    getProfile: async (req, res) => {
        try {
            const authHeader = req.headers.authorization

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
                decoded = jwt.verify(token, secretKey);
            } catch (error) {
                console.error("JWT Verification Error:", error.message)
                return res.status(401).json({
                    status: 108,
                    message: "Token tidak valid atau kadaluwarsa",
                    data: null,
                });
            }

            const email = decoded.data?.email

            const userFromDb = await getEmail(email)

            if (!userFromDb) {
                return res.status(404).json({
                    status: 109,
                    message: "User tidak ditemukan",
                    data: null,
                });
            }

            const profileImage =
                dummyProfileImages[email] || "https://yoururlapi.com/default-profile.jpeg"

            const userProfile = {
                email: userFromDb.email,
                first_name: userFromDb.first_name,
                last_name: userFromDb.last_name,
                profile_image: profileImage,
            };

            return res.status(200).json({
                status: 0,
                message: "Sukses",
                data: userProfile,
            });
        } catch (error) {
            console.error("Error in getProfile:", error)
            return res.status(500).json({
                status: 500,
                message: "Internal Server Error",
                data: null,
            });
        }
    },  
}