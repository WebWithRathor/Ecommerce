const multer = require('multer');
const crypto = require('crypto');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/images')
    },
    filename: function (req, file, cb) {
        const fs = crypto.randomBytes(16).toString('hex') + path.extname(file.originalname);
        cb(null, fs)
    }
})

const upload = multer({ storage: storage })
module.exports = upload;