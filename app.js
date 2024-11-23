const express       = require('express')
const app           = express()
const path          = require('path')
const fileUpload    = require('express-fileupload') 
const PORT          = process.env.PORT || 3000

const c_register    = require('./controller/c_register')
const c_login       = require('./controller/c_login')
const c_profile     = require('./controller/c_profile')
const c_update      = require('./controller/c_update')
const c_banner      = require('./controller/c_banner')
const c_services    = require('./controller/c_services')
const c_topup       = require('./controller/c_topup')
const c_balance     = require('./controller/c_balance')
const c_transaksi   = require('./controller/c_transaksi')

require('dotenv').config()

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(fileUpload())
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.get('/', (req, res) => {res.json({ message: 'Selamat datang di aplikasi ini ' })});
app.post('/register', c_register.register)
app.post('/login', c_login.login)
app.get('/profile', c_profile.getProfile)
app.put('/update-profile', c_update.updateUsers)
app.put('/image-profile', c_update.uploadProfileImage)
app.get('/banner', c_banner.getBanners)
app.get('/services', c_services.getServices)
app.post('/top-up', c_topup.prosesTopUp)
app.get('/get-balance', c_balance.getUserBalance)
app.post('/transaksi', c_transaksi.prosesTransaksi)
app.get('/get-transaksi', c_transaksi.getHistoryTransactions)

app.listen(PORT, () => {console.log(`Server running on http://localhost:${PORT}`)})