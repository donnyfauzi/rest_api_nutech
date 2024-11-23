const { registerUser } = require('../model/m_users')

module.exports =
{
    register: async (req, res) => {
        const { email, password, first_name, last_name } = req.body

        if (!email || !password || !first_name || !last_name) {
            return res.status(400).json({
                status: 101,
                message: "Semua parameter wajib diisi (email, password, first_name, last_name)",
                data: null,
            });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                status: 102,
                message: "Parameter email tidak sesuai format",
                data: null,
            });
        }

        try {
            await registerUser(req)

            return res.status(200).json({
                status: 0,
                message: "Registrasi berhasil silahkan login",
                data: null,
            })

        } catch (err) {
            console.error(err)

            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({
                    status: 102,
                    message: "Email sudah terdaftar",
                    data: null,
                });
            }

            return res.status(500).json({
                status: 104,
                message: "Terjadi kesalahan pada server",
                data: null,
            });
        }
    },
}
