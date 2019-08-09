const multer = require('multer');
const crypto = require('crypto');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads')
    },
    filename: (req, file, cb) => {
        crypto.pseudoRandomBytes(16, (err, raw) =>
            cb(null, raw.toString('hex') + path.extname(file.originalname)))
    }
})

const filter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(new Error('Unsupported file type'), false);
    }
}

module.exports = multer({
    storage: storage,
    limits: {
        fileSize: 5242880 // 5MB
    },
    fileFilter: filter
}).single('image');