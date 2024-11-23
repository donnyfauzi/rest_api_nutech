const { updateUsersModel } = require('../model/m_users')
const jwt = require('jsonwebtoken')
const path = require('path')
const fs = require('fs')
require('dotenv').config()


module.exports =
{
     updateUsers: async (req, res) => {
        try {
            const token = req.headers["authorization"]?.split(" ")[1]

            if (!token) {
                return res.status(403).json({
                    status: 108,
                    message: "Token tidak disertakan",
                    data: null
                })
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            const email = decoded.data.email

            // profile image dengan data dummy
            const profile_image = "https://yoururlapi.com/profile.jpg"

            const result = await updateUsersModel(req, email)

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    status: 109,
                    message: "User tidak ditemukan",
                    data: null,
                })
            }

            return res.status(200).json({
                status: 0,
                message: "Update Profile berhasil",
                data: {
                    email,
                    first_name: req.body.first_name,
                    last_name: req.body.last_name,
                    profile_image,
                },
            })
        } catch (error) {
            return res.status(500).json({
                status: 500,
                message: error.message || "Error update profil",
                data: null,
            })
        }
    },

    uploadProfileImage: async (req, res) => {
    try {
        const authHeader = req.headers['authorization'];

        // Verifikasi header authorization
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                status: 108,
                message: "Token tidak valid atau kadaluwarsa",
                data: null,
            });
        }

        const token = authHeader.split(' ')[1];

        // Verifikasi token JWT
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            return res.status(401).json({
                status: 108,
                message: "Token tidak valid atau kadaluwarsa",
                data: null,
            });
        }

        const email = decoded.data.email;

        // Simulasi dengan file dummy
        const dummyFilePath = 'C:\\Users\\DELL\\Desktop\\rest-api-test\\dummyFiles\\dummy-profile.jpg'; // Gunakan path absolut
        const fileName = `${email}-${Date.now()}${path.extname(dummyFilePath)}`;
        const uploadPath = path.join(__dirname, '../uploads', fileName);

        // Pastikan folder uploads ada
        if (!fs.existsSync(path.join(__dirname, '../uploads'))) {
            fs.mkdirSync(path.join(__dirname, '../uploads'));
        }

        // Menyalin file dummy ke folder uploads
        fs.copyFile(dummyFilePath, uploadPath, (err) => {
            if (err) {
                return res.status(500).json({
                    status: 500,
                    message: "Terjadi kesalahan saat menyalin file dummy",
                    data: null,
                });
            }

            // Hanya mengembalikan URL tanpa update database
            const updatedProfileImageUrl = `https://yoururlapi.com/uploads/${fileName}`;

            // Response berhasil
            return res.status(200).json({
                status: 0,
                message: "Update Profile Image berhasil",
                data: {
                    email: email,
                    first_name: "User Edited",
                    last_name: "Nutech Edited",
                    profile_image: updatedProfileImageUrl,
                },
            });
        });
    } catch (error) {
        console.error("Error in uploadProfileImage:", error.message);
        return res.status(500).json({
            status: 500,
            message: "Internal Server Error",
            data: null,
        });
    }
}
}